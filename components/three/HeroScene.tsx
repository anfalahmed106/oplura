"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import GeodesicSphere, { type QualityTier } from "./GeodesicSphere";
import { HeroSceneFallback } from "./HeroSceneFallback";

const QUALITY_ORDER: QualityTier[] = ["low", "medium", "high"];

/** True genuine blockers: assistive-tech preference, very low RAM, or no WebGL2. */
function hasHardConstraint() {
  if (typeof window === "undefined") return true;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof memory === "number" && memory <= 4;

  return reducedMotion || lowMemory || !supportsWebGL2();
}

/**
 * A cheap, synchronous probe using a throwaway canvas. Some browsers/WebViews
 * (older Android system WebViews, some in-app browsers) either lack WebGL2 or
 * silently fail to construct a context — this catches that upfront instead of
 * letting the real Canvas hang or render a blank frame.
 */
function supportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    const ok = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

/** Used only to pick a sensible *starting* tier — PerformanceMonitor corrects it from there. */
function initialTierGuess(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const isSmall = window.matchMedia("(max-width: 767px)").matches;
  return isTouch || isSmall ? "low" : "medium";
}

/** Fires once, the first time a real frame is actually rendered by the GPU. */
function FirstFrameAck({ onFirstFrame }: { onFirstFrame: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      onFirstFrame();
    }
  });
  return null;
}

export default function HeroScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const rendererRef = useRef<RootState["gl"] | null>(null);
  const canvasCleanupRef = useRef<(() => void) | null>(null);

  const [blocked, setBlocked] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [mountFailed, setMountFailed] = useState(false);
  const [firstFrameRendered, setFirstFrameRendered] = useState(false);

  const [tier, setTier] = useState<QualityTier>("medium");
  const [dprFactor, setDprFactor] = useState(0.5); // 0..1, smoothed by PerformanceMonitor

  const [inViewport, setInViewport] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  // One-time capability check + starting quality guess.
  useEffect(() => {
    setBlocked(hasHardConstraint());
    setTier(initialTierGuess());
  }, []);

  // Watchdog: if we never get a real rendered frame within a few seconds,
  // something is wrong on this device/browser (stuck shader compile, driver
  // issue, etc.) — drop to the static fallback instead of leaving a blank hero.
  useEffect(() => {
    if (blocked) return;
    const timer = setTimeout(() => {
      if (!firstFrameRendered) setMountFailed(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, [blocked, firstFrameRendered]);

  // Pause rendering entirely when the hero scrolls off-screen or the tab is
  // backgrounded — avoids the sustained GPU load that causes lag/thermal
  // throttling on phones and battery/fan spin on laptops.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) setInViewport(entry.isIntersecting);
    }, {
      threshold: 0.01,
    });
    io.observe(el);

    const handleVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    return () => {
      canvasCleanupRef.current?.();
      rendererRef.current?.dispose();
      rendererRef.current = null;
      canvasCleanupRef.current = null;
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
    };
  }

  function handlePointerLeave() {
    pointer.current = { x: 0, y: 0 };
  }

  function handleCreated(state: RootState) {
    rendererRef.current = state.gl;

    const canvas = state.gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    const handleRestored = () => setContextLost(false);

    canvas.addEventListener("webglcontextlost", handleLost, false);
    canvas.addEventListener("webglcontextrestored", handleRestored, false);
    canvasCleanupRef.current = () => {
      canvas.removeEventListener("webglcontextlost", handleLost, false);
      canvas.removeEventListener("webglcontextrestored", handleRestored, false);
    };
  }

  const handleIncline = useCallback(() => {
    setTier((current) => {
      const idx = QUALITY_ORDER.indexOf(current);
      return QUALITY_ORDER[Math.min(idx + 1, QUALITY_ORDER.length - 1)]!;
    });
  }, []);

  const handleDecline = useCallback(() => {
    setTier((current) => {
      const idx = QUALITY_ORDER.indexOf(current);
      return QUALITY_ORDER[Math.max(idx - 1, 0)]!;
    });
  }, []);

  const handlePerfChange = useCallback((api: { factor: number }) => {
    setDprFactor(api.factor);
  }, []);

  // dpr scales continuously with measured headroom (1x - 1.5x); tier (segment
  // counts / light count) steps discretely with hysteresis so geometry isn't
  // rebuilt on every small fluctuation.
  const dpr = useMemo(() => 1 + dprFactor * 0.5, [dprFactor]);
  const isLowTier = tier === "low";

  if (blocked || contextLost || mountFailed) {
    return <HeroSceneFallback />;
  }

  const frameloop = inViewport && tabVisible ? "always" : "never";

  return (
    <div
      ref={wrapperRef}
      style={{ width: "100%", height: "100%" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        frameloop={frameloop}
        gl={{
          alpha: true,
          antialias: !isLowTier,
          premultipliedAlpha: false,
          stencil: false,
          powerPreference: "default",
        }}
        camera={{ position: [0, 0.5, 7.5], fov: 40 }}
        style={{ background: "transparent" }}
        dpr={dpr}
        onCreated={handleCreated}
      >
        <PerformanceMonitor
          onIncline={handleIncline}
          onDecline={handleDecline}
          onChange={handlePerfChange}
          flipflops={3}
        />
        <Suspense fallback={null}>
          <FirstFrameAck onFirstFrame={() => setFirstFrameRendered(true)} />
          <GeodesicSphere
            radius={2}
            rotationSpeed={1}
            pointer={pointer}
            quality={tier}
            colors={{
              base: "#1F2937",
              cyan: "#2563EB",
              blue: "#374151",
              purple: "#38BDF8",
              rim: "#0F172A",
              fill: "#F8FAFC",
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
