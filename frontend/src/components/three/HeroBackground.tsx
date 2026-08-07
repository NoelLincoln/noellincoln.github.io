"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import type { Points as ThreePoints } from "three";

/**
 * Ambient WebGL particle field that sits *behind* the hero content.
 *
 * Design constraints (why it looks the way it does):
 * - Decorative only: `pointer-events-none` + `aria-hidden`, so it never steals
 *   clicks from the hero buttons and is skipped by screen readers.
 * - Legible: a left-to-right scrim keeps the section colour opaque behind the
 *   text column and fades to transparent on the right — particles read against
 *   the illustration, never against the copy.
 * - LCP-safe: the hero heading stays the largest paintable element; this is a
 *   transparent background layer, lazy-loaded client-only via next/dynamic and
 *   only mounted on ≥md screens (see Hero.tsx).
 * - Motion-safe: when the OS requests reduced motion we render the field ONCE
 *   (frameloop="demand", no per-frame work) instead of animating it.
 * - Theme-aware: point colour/size/opacity track the active theme.
 * - Fail-safe: if the browser can't create a WebGL context (GPU disabled, old
 *   hardware, some VMs) we render nothing rather than crash — see `detectWebGL`
 *   and `CanvasErrorBoundary` below.
 */

const COUNT = 1200;
const RADIUS = 1.4;

/**
 * True only if this browser can actually create a WebGL context. Guards against
 * environments where WebGL is disabled — three.js throws when it can't get a
 * context, and an unhandled throw would take down the whole page.
 */
function detectWebGL(): boolean {
  if (typeof window === "undefined" || !window.WebGLRenderingContext) return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    // Free the probe context immediately so we don't hold a GPU slot.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Backstop: if the canvas throws at runtime, drop it instead of crashing. */
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Uniformly scatter `count` points inside a sphere of `radius`. */
function makePositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // cube-root keeps the distribution even by volume rather than clumping at the centre
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const sinPhi = Math.sin(phi);
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function ParticleField({
  color,
  size,
  opacity,
  animate,
  pointer,
}: {
  color: string;
  size: number;
  opacity: number;
  animate: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<ThreePoints>(null);
  const positions = useMemo(() => makePositions(COUNT, RADIUS), []);

  useFrame((state, delta) => {
    if (!animate || !ref.current) return;
    // Slow, hypnotic auto-rotation — deliberately gentle.
    ref.current.rotation.x -= delta / 22;
    ref.current.rotation.y -= delta / 30;
    // Subtle parallax: ease the camera toward the pointer, then re-centre its aim.
    const p = pointer.current;
    state.camera.position.x += (p.x * 0.35 - state.camera.position.x) * 0.03;
    state.camera.position.y += (-p.y * 0.35 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
      />
    </Points>
  );
}

export default function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const pointer = useRef({ x: 0, y: 0 });
  // Null until checked on the client; false disables the canvas entirely.
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  const animate = !prefersReducedMotion;
  const isDark = resolvedTheme === "dark";
  // Deeper, larger, more opaque in light mode (the warm-grey bg washes out
  // thin points); softer and lighter in dark mode so it never overpowers text.
  const color = isDark ? "#a5b4fc" : "#4f46e5";
  const size = isDark ? 0.02 : 0.026;
  const opacity = isDark ? 0.85 : 0.95;

  // Probe WebGL support once on the client.
  useEffect(() => {
    setWebglOk(detectWebGL());
  }, []);

  // Track the pointer at the window level so the canvas itself can stay
  // `pointer-events-none` (never intercepting hero clicks).
  useEffect(() => {
    if (!animate) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animate]);

  // No canvas until we've confirmed WebGL works (avoids the context-creation
  // throw on GPU-disabled browsers).
  if (!webglOk) return null;

  // Confine the canvas to the right side (behind the illustration) and fade its
  // left edge with an alpha mask, so it never overlaps — or dims — the text
  // column. A mask (not a colour scrim) means no theme-specific artifacts.
  const maskFade = "linear-gradient(to right, transparent, black 30%)";

  return (
    <div
      aria-hidden
      className="absolute inset-y-0 right-0 w-[60%] pointer-events-none"
      style={{ maskImage: maskFade, WebkitMaskImage: maskFade }}
    >
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 2.2], fov: 55 }}
          dpr={[1, 2]}
          gl={{ antialias: false, alpha: true }}
          frameloop={animate ? "always" : "demand"}
        >
          <ParticleField
            color={color}
            size={size}
            opacity={opacity}
            animate={animate}
            pointer={pointer}
          />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
