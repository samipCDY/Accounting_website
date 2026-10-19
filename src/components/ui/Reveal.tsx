"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
};

/**
 * Fades content up when it scrolls into view — as a progressive enhancement only.
 * The server HTML is fully visible; after hydration, only elements still below the fold are
 * hidden and then revealed. If JavaScript or animation fails, content simply stays visible.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion || typeof IntersectionObserver === "undefined") return;
    // Already on screen at load: leave it alone (no flash, nothing to reveal).
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    let animation: ReturnType<typeof animate> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animation = animate(
          el,
          { opacity: 1, transform: "translateY(0px)" },
          { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        );
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      animation?.stop();
      // Never leave content hidden if this effect is torn down mid-way.
      el.style.opacity = "";
      el.style.transform = "";
    };
  }, [delay, reduceMotion]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
