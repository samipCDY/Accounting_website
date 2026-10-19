"use client";

import { useEffect } from "react";

/**
 * Marks the element whose id matches the URL hash with `data-highlighted="true"`.
 * CSS `:target` doesn't update on Next.js client-side navigation, so links like
 * /industries#healthcare from the homepage wheel need this to highlight their card.
 */
export function HashHighlight() {
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll("[data-highlighted]").forEach((el) => el.removeAttribute("data-highlighted"));
      const raw = window.location.hash.slice(1);
      let id = raw;
      try {
        id = decodeURIComponent(raw);
      } catch {
        // Malformed escape (e.g. /industries#%): use the fragment as-is instead of throwing.
      }
      if (id) document.getElementById(id)?.setAttribute("data-highlighted", "true");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return null;
}
