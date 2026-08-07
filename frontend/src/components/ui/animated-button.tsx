"use client";

import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "onDark";

// easeOutExpo-ish — snappy in, gentle settle.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DURATION = 0.35;

const base =
  "group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const skin: Record<Variant, string> = {
  primary: "bg-primary text-white",
  outline: "border border-primary text-primary",
  onDark:
    "bg-white text-primary hover:bg-indigo-50 dark:bg-[#4f46e5] dark:text-white dark:hover:bg-[#6366f1] transition-colors",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Render as an anchor. */
  href?: string;
  target?: string;
  rel?: string;
  /** Render as a button (when `href` is omitted). */
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * Shared CTA with three composed micro-interactions:
 * - label roll: the text slides up and a duplicate rolls in from below on hover
 * - arrow: nudges right and brightens
 * - magnetic: the whole control eases toward the cursor, then springs back
 *
 * Polymorphic: renders a real `<a>` when `href` is set, otherwise a `<button>`
 * (with `type`/`disabled`/`onClick`) — so links and form submits share one look.
 * Accessibility: the rolled duplicate + arrow are `aria-hidden` (label announced
 * once) and there's a visible focus ring. Under `prefers-reduced-motion` it
 * degrades to a plain control with a simple CSS hover.
 */
export default function AnimatedButton({
  children,
  variant = "primary",
  className,
  href,
  target,
  rel,
  type,
  disabled,
  onClick,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const classes = cn(base, skin[variant], className);

  // Reduced motion: plain, fully-accessible control with a simple CSS hover.
  if (prefersReducedMotion) {
    const hoverFallback =
      variant === "primary"
        ? "hover:opacity-90 transition-opacity"
        : variant === "outline"
          ? "hover:bg-primary hover:text-white transition-colors"
          : "";
    const plainInner = (
      <>
        {children}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </>
    );
    return href ? (
      <a href={href} target={target} rel={rel} className={cn(classes, hoverFallback)}>
        {plainInner}
      </a>
    ) : (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(classes, hoverFallback)}
      >
        {plainInner}
      </button>
    );
  }

  function handleMove(e: ReactPointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const onHoverWhite =
    variant === "outline" ? "transition-colors duration-300 group-hover:text-white" : "";

  const inner = (
    <>
      {/* Outline variant: indigo fill sweeps up on hover (text flips to white below) */}
      {variant === "outline" && (
        <motion.span
          aria-hidden
          className="absolute inset-0 bg-primary"
          variants={{ rest: { y: "101%" }, hover: { y: "0%" } }}
          transition={{ duration: DURATION, ease: EASE }}
        />
      )}

      {/* Label roll */}
      <span className={cn("relative block overflow-hidden", onHoverWhite)}>
        <motion.span
          className="block"
          variants={{ rest: { y: "0%" }, hover: { y: "-110%" } }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          {children}
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute inset-0 block"
          variants={{ rest: { y: "110%" }, hover: { y: "0%" } }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          {children}
        </motion.span>
      </span>

      {/* Arrow */}
      <motion.span
        aria-hidden
        className={cn("relative", onHoverWhite)}
        variants={{ rest: { x: -2, opacity: 0.55 }, hover: { x: 2, opacity: 1 } }}
        transition={{ duration: DURATION, ease: EASE }}
      >
        <ArrowRight className="h-4 w-4" />
      </motion.span>
    </>
  );

  const motionProps = {
    className: classes,
    style: { x: springX, y: springY },
    initial: "rest" as const,
    animate: "rest" as const,
    whileHover: "hover" as const,
    whileTap: { scale: 0.96 },
    onPointerMove: handleMove,
    onPointerLeave: reset,
  };

  return href ? (
    <motion.a ref={ref} href={href} target={target} rel={rel} {...motionProps}>
      {inner}
    </motion.a>
  ) : (
    <motion.button ref={ref} type={type} disabled={disabled} onClick={onClick} {...motionProps}>
      {inner}
    </motion.button>
  );
}
