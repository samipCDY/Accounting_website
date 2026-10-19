import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

/*
 * Spam protection that holds across Netlify serverless instances:
 *  - Signed form tokens (stateless HMAC): any instance can verify them, and the issue time
 *    can't be forged, so the minimum-fill-time check is reliable.
 *  - Rate limits stored in Netlify Blobs with compare-and-swap writes, shared by all
 *    instances. Outside Netlify (local dev) they fall back to in-memory counters.
 */

const MIN_FILL_TIME_MS = 3_000;
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

let devSecret: string | undefined;

function formSecret(): string {
  if (process.env.QUOTE_FORM_SECRET) return process.env.QUOTE_FORM_SECRET;
  // Derived (one-way) from the Resend key so no extra variable is required in production.
  if (process.env.RESEND_API_KEY) {
    return createHash("sha256").update(`quote-form:${process.env.RESEND_API_KEY}`).digest("hex");
  }
  // Local dev without env vars: per-process secret (fine for a single dev server).
  devSecret ??= randomBytes(32).toString("hex");
  return devSecret;
}

const sign = (payload: string) => createHmac("sha256", formSecret()).update(payload).digest("base64url");

export function issueFormToken(now = Date.now()): string {
  const payload = `${now}.${randomBytes(9).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export type TokenCheck = { ok: true } | { ok: false; reason: "invalid" | "expired" | "too-fast" };

export function verifyFormToken(token: unknown, now = Date.now()): TokenCheck {
  if (typeof token !== "string" || token.length > 200) return { ok: false, reason: "invalid" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid" };

  const [issuedAtRaw, nonce, signature] = parts;
  const expected = Buffer.from(sign(`${issuedAtRaw}.${nonce}`));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return { ok: false, reason: "invalid" };
  }

  const elapsed = now - Number(issuedAtRaw);
  if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed > TOKEN_TTL_MS) return { ok: false, reason: "expired" };
  if (elapsed < MIN_FILL_TIME_MS) return { ok: false, reason: "too-fast" };
  return { ok: true };
}

export type RateLimit = { max: number; windowMs: number };

/** Keyed hash so raw IPs and emails are never stored. */
export const rateLimitKey = (kind: string, value: string) =>
  `${kind}-${createHmac("sha256", formSecret()).update(value).digest("hex").slice(0, 40)}`;

const memoryHits = new Map<string, number[]>();
let blobsUnavailable = false;

function hitMemory(key: string, limit: RateLimit, now: number): boolean {
  const recent = (memoryHits.get(key) ?? []).filter((t) => now - t < limit.windowMs);
  const limited = recent.length >= limit.max;
  if (!limited) recent.push(now);
  memoryHits.set(key, recent);
  return limited;
}

/** Returns true if `key` is over its limit; otherwise records this hit. */
export async function isRateLimited(key: string, limit: RateLimit, now = Date.now()): Promise<boolean> {
  if (!blobsUnavailable) {
    try {
      return await hitShared(key, limit, now);
    } catch (err) {
      if (err instanceof Error && err.name === "MissingBlobsEnvironmentError") {
        blobsUnavailable = true; // Not running on Netlify (e.g. local dev).
      } else {
        console.error("[quote] Shared rate limit unavailable, using per-instance limit:", err);
      }
    }
  }
  return hitMemory(key, limit, now);
}

async function hitShared(key: string, limit: RateLimit, now: number): Promise<boolean> {
  const store = getStore({ name: "quote-rate-limits", consistency: "strong" });

  // Compare-and-swap so concurrent instances can't overwrite each other's hits.
  for (let attempt = 0; attempt < 4; attempt++) {
    const entry = await store.getWithMetadata(key, { type: "json" });
    const stored: unknown[] = Array.isArray(entry?.data) ? entry.data : [];
    const recent = stored.filter((t): t is number => typeof t === "number" && now - t < limit.windowMs);
    if (recent.length >= limit.max) return true;

    const next = [...recent, now];
    const result = entry?.etag
      ? await store.setJSON(key, next, { onlyIfMatch: entry.etag })
      : await store.setJSON(key, next, { onlyIfNew: true });
    if (result.modified) return false;
  }
  // Persistent write contention means a burst is hitting this key: treat as limited.
  return true;
}
