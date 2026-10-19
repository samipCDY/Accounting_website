"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChevronsDown, ChevronsLeft, Receipt, ShieldCheck, UserRound, Wallet, type LucideIcon } from "lucide-react";

type TileProps = {
  color: string;
  heightClass: string;
  delay: number;
  chip: { label: string; icon: LucideIcon; iconBg: string };
  chipDelay: number;
};

/**
 * Decorative collage mirroring the template's staggered portrait tiles.
 * Replace the UserRound placeholders with team photos via next/image once available.
 */
export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md sm:max-w-lg">
      <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12">
        <div className="relative mt-14 sm:mt-20">
          <div className="absolute -inset-x-3 -top-6 bottom-10 -z-10 rounded-[2rem] bg-canvas" />
          <Tile
            color="bg-accent-orange"
            heightClass="h-64 sm:h-80 lg:h-[22rem]"
            delay={0.1}
            chip={{ label: "VAT & Income Tax", icon: Receipt, iconBg: "bg-accent-orange" }}
            chipDelay={0}
          />
          <ChevronsLeft className="absolute top-2/3 -right-7 size-5 text-muted/60 sm:-right-9" />
        </div>

        <div className="flex flex-col items-center">
          <Tile
            color="bg-accent-coral"
            heightClass="h-40 sm:h-48 lg:h-52"
            delay={0.2}
            chip={{ label: "Payroll & SSF", icon: Wallet, iconBg: "bg-accent-coral" }}
            chipDelay={1.2}
          />
          <ChevronsDown className="my-5 size-5 text-muted/60 sm:my-6" />
          <Tile
            color="bg-accent-blue"
            heightClass="h-48 sm:h-56 lg:h-64"
            delay={0.3}
            chip={{ label: "Audit & Assurance", icon: ShieldCheck, iconBg: "bg-accent-blue" }}
            chipDelay={2.4}
          />
        </div>
      </div>
    </div>
  );
}

function Tile({ color, heightClass, delay, chip, chipDelay }: TileProps) {
  const reduceMotion = useReducedMotion();
  const ChipIcon = chip.icon;

  return (
    // CSS entrance (not Motion) so the tiles still appear if JavaScript never runs.
    <div
      className="relative w-full animate-tile-in motion-reduce:animate-none"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`relative overflow-hidden rounded-[1.75rem] ${color} ${heightClass}`}>
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-white/15" />
        <UserRound
          strokeWidth={1.25}
          className="absolute -bottom-4 left-1/2 size-[85%] max-h-[90%] -translate-x-1/2 text-white/35"
        />
      </div>

      <motion.div
        className="absolute -bottom-5 left-2 flex max-w-[calc(100%+1rem)] items-center gap-2 rounded-full bg-white py-1.5 pr-3 pl-1.5 shadow-chip sm:left-3 sm:gap-2.5 sm:pr-4"
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 4, delay: chipDelay, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className={`grid size-7 shrink-0 place-items-center rounded-full text-white sm:size-9 ${chip.iconBg}`}>
          <ChipIcon className="size-3.5 sm:size-4" />
        </span>
        <span className="text-[11px] leading-tight font-medium text-ink sm:text-sm">{chip.label}</span>
      </motion.div>
    </div>
  );
}
