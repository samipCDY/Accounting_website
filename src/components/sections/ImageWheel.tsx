"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  animate,
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

/** Auto-rotation: one full turn every 40s (radians per ms). */
const SPEED = (Math.PI * 2) / 40_000;
/** Fastest spin a flick can produce (radians per ms, ~1 turn/s). */
const MAX_VELOCITY = 0.006;
/** Momentum kept per ms after a flick. */
const FRICTION = 0.997;
/** How open the ring is; dragging up/down changes it (1 = default). */
const ELEVATION = { min: 0.3, max: 1.9, default: 1 };

const toneGradients: Record<Tone, string> = {
  brand: "from-brand-400 to-brand-700",
  orange: "from-accent-orange to-orange-600",
  coral: "from-accent-coral to-red-700",
  blue: "from-accent-blue to-blue-800",
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Tiles orbiting a tilted ellipse: back tiles shrink, fade and blur; front tiles come forward.
 * Drag left/right (mouse, touch, pen) to spin with momentum; drag up/down (mouse) to tilt;
 * arrow keys do the same. Auto-rotation follows the last spin direction and stops when
 * paused, off-screen, or for reduced-motion users (who can still rotate it manually).
 *
 * Reads `industries` directly: icon components are functions and can't be passed from a Server Component.
 */
export function ImageWheel() {
  const items = industries;
  const containerRef = useRef<HTMLDivElement>(null);
  const angle = useMotionValue(0);
  // Defaults keep the server-rendered ring sensible until the container is measured.
  const rx = useMotionValue(320);
  const ry = useMotionValue(110);
  const elevation = useMotionValue(ELEVATION.default);
  const ryEffective = useTransform([ry, elevation], ([r, e]: number[]) => r * e);

  const reduceMotion = useReducedMotion();
  const inView = useInView(containerRef, { margin: "100px" });
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Gesture state lives in refs so pointer moves don't re-render.
  const drag = useRef({ active: false, x: 0, y: 0, t: 0 });
  const velocity = useRef(0);
  const direction = useRef(1);

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
    if (drag.current.active || !inView) return;

    // Momentum from a flick, decaying until it drops to cruising speed.
    if (Math.abs(velocity.current) > SPEED) {
      angle.set(angle.get() + velocity.current * delta);
      velocity.current *= Math.pow(FRICTION, delta);
      return;
    }
    velocity.current = 0;
    if (!reduceMotion && !paused) angle.set(angle.get() + direction.current * SPEED * delta);
  });

  const springElevationBack = () =>
    animate(elevation, ELEVATION.default, { type: "spring", stiffness: 90, damping: 18 });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { active: true, x: e.clientX, y: e.clientY, t: e.timeStamp };
    velocity.current = 0;
    elevation.stop();
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = containerRef.current;
    if (!d.active || !el) return;

    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const dt = Math.max(1, e.timeStamp - d.t);

    // Dragging across ~80% of the width spins the ring once. Dragging right moves the front tile right.
    const dTheta = -(dx / el.clientWidth) * Math.PI * 2 * 1.25;
    angle.set(angle.get() + dTheta);
    velocity.current = clamp(0.6 * (dTheta / dt) + 0.4 * velocity.current, -MAX_VELOCITY, MAX_VELOCITY);

    // Up/down opens or flattens the ring (touch keeps vertical swipes for page scrolling).
    elevation.set(clamp(elevation.get() + (dy / el.clientHeight) * 1.6, ELEVATION.min, ELEVATION.max));

    drag.current = { active: true, x: e.clientX, y: e.clientY, t: e.timeStamp };
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    // Holding still before letting go means no flick.
    if (e.timeStamp - drag.current.t > 80) velocity.current = 0;
    if (velocity.current !== 0) direction.current = Math.sign(velocity.current);
    if (reduceMotion) velocity.current = 0;
    drag.current.active = false;
    setDragging(false);
    springElevationBack();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = (Math.PI * 2) / items.length;
    const spring = { type: "spring", stiffness: 140, damping: 22 } as const;
    switch (e.key) {
      case "ArrowLeft":
        direction.current = 1;
        animate(angle, angle.get() + step, spring);
        break;
      case "ArrowRight":
        direction.current = -1;
        animate(angle, angle.get() - step, spring);
        break;
      case "ArrowUp":
        animate(elevation, clamp(elevation.get() - 0.3, ELEVATION.min, ELEVATION.max), spring);
        break;
      case "ArrowDown":
        animate(elevation, clamp(elevation.get() + 0.3, ELEVATION.min, ELEVATION.max), spring);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        role="group"
        aria-label="Industries we serve. Drag or use the arrow keys to rotate."
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        style={{ touchAction: "pan-y" }}
        className={`relative h-[22rem] rounded-3xl select-none sm:h-[26rem] lg:h-[30rem] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div role="list" className="absolute inset-0 rotate-[-8deg]">
          {items.map((item, i) => (
            <WheelTile
              key={item.name}
              item={item}
              index={i}
              count={items.length}
              angle={angle}
              rx={rx}
              ry={ryEffective}
            />
          ))}
        </div>
      </div>

      {!reduceMotion && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play animation" : "Pause animation"}
          className="absolute top-0 right-0 z-[101] grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>
      )}

      <p className="mt-2 text-center text-xs text-white/50" aria-hidden="true">
        Drag to spin
      </p>
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
          <Image
            src={item.image}
            alt=""
            fill
            draggable={false}
            sizes="(min-width: 1024px) 192px, 160px"
            className="pointer-events-none object-cover"
          />
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
