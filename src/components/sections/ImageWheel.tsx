"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Pause, Play } from "lucide-react";
import { industries, type Industry, type Tone } from "@/lib/site-config";

/** One full turn every 40s. */
const SPEED = (Math.PI * 2) / 40_000;

const toneGradients: Record<Tone, string> = {
  brand: "from-brand-400 to-brand-700",
  orange: "from-accent-orange to-orange-600",
  coral: "from-accent-coral to-red-700",
  blue: "from-accent-blue to-blue-800",
};

/**
 * Tiles orbiting a tilted ellipse: back tiles shrink, fade and blur; front tiles come forward.
 * Pauses on hover, when off-screen, via the pause button, and for reduced-motion users.
 */
// Reads `industries` directly: icon components are functions and can't be passed from a Server Component.
export function ImageWheel() {
  const items = industries;
  const containerRef = useRef<HTMLDivElement>(null);
  const angle = useMotionValue(0);
  // Defaults keep the server-rendered ring sensible until the container is measured.
  const rx = useMotionValue(320);
  const ry = useMotionValue(110);

  const reduceMotion = useReducedMotion();
  const inView = useInView(containerRef, { margin: "100px" });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const running = !reduceMotion && !paused && !hovered && inView;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      rx.set(width * 0.36);
      ry.set(height * 0.24);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rx, ry]);

  useAnimationFrame((_, delta) => {
    if (running) angle.set(angle.get() + delta * SPEED);
  });

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="list"
        aria-label="Industries we serve"
        className="relative h-[22rem] sm:h-[26rem] lg:h-[30rem]"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0 rotate-[-8deg]">
          {items.map((item, i) => (
            <WheelTile key={item.name} item={item} index={i} count={items.length} angle={angle} rx={rx} ry={ry} />
          ))}
        </div>
      </div>

      {!reduceMotion && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play animation" : "Pause animation"}
          className="absolute top-0 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

function WheelTile({
  item,
  index,
  count,
  angle,
  rx,
  ry,
}: {
  item: Industry;
  index: number;
  count: number;
  angle: MotionValue<number>;
  rx: MotionValue<number>;
  ry: MotionValue<number>;
}) {
  const offset = (index / count) * Math.PI * 2;
  const theta = useTransform(angle, (a) => a + offset);
  const x = useTransform([theta, rx], ([t, r]: number[]) => Math.cos(t) * r);
  const y = useTransform([theta, ry], ([t, r]: number[]) => Math.sin(t) * r);
  // 0 = back of the ring (top), 1 = front (bottom).
  const depth = useTransform(theta, (t) => (Math.sin(t) + 1) / 2);
  const scale = useTransform(depth, (d) => 0.6 + d * 0.4);
  const opacity = useTransform(depth, (d) => 0.45 + d * 0.55);
  const filter = useTransform(depth, (d) => `blur(${((1 - d) * 3).toFixed(2)}px)`);
  const zIndex = useTransform(depth, (d) => Math.round(d * 100));
  const Icon = item.icon;

  return (
    <motion.div
      role="listitem"
      style={{ x, y, scale, opacity, filter, zIndex }}
      className="absolute top-1/2 left-1/2 h-36 w-32 -translate-x-1/2 -translate-y-1/2 sm:h-44 sm:w-40 lg:h-52 lg:w-48"
    >
      <div
        className={`relative size-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br shadow-2xl shadow-black/40 ${toneGradients[item.tone]}`}
      >
        {item.image ? (
          <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 192px, 160px" className="object-cover" />
        ) : (
          <>
            <div aria-hidden="true" className="absolute -top-8 -right-8 size-28 rounded-full bg-white/15" />
            <div aria-hidden="true" className="absolute -bottom-10 -left-6 size-24 rounded-full bg-black/10" />
            <Icon aria-hidden="true" strokeWidth={1.5} className="absolute top-5 left-5 size-9 text-white sm:size-11" />
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4 pt-10">
          <span className="block text-sm leading-tight font-semibold text-white sm:text-base">{item.name}</span>
        </div>
      </div>
    </motion.div>
  );
}
