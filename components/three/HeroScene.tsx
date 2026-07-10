"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import GeodesicSphere, { type QualityTier } from "./GeodesicSphere";
import { HeroSceneFallback } from "./HeroSceneFallback";
import { useTheme } from "@/lib/theme";

const QUALITY_ORDER: QualityTier[] = ["low", "medium", "high"];

type WebGLSupport = { supported: boolean; version: 1 | 2 | null };

/**
 * Cheap, synchronous probe using a throwaway canvas.
 *
 * We accept EITHER WebGL2 or WebGL1. three.js / @react-three/fiber already
 * fall back to WebGL1 automatically when WebGL2 isn't available, so a probe
 * that only checks for WebGL2 rejects devices that would have rendered just
 * fine. We only treat a device as genuinely unsupported when NEITHER
 * context can be created (GPU disabled, ancient browser, some locked-down
 * in-app WebViews) — that's the one case three.js truly cannot recover from.
 */
function detectWebGLSupport(): WebGLSupport {
  try {
    const canvas = document.createElement("canvas");

    const gl2 = canvas.getContext("webgl2");
    if (gl2) {
      gl2.getExtension("WEBGL_lose_context")?.loseContext();
      return { supported: true, version: 2 };
    }

    const gl1 = (canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (gl1) {
      gl1.getExtension("WEBGL_lose_context")?.loseContext();
      return { supported: true, version: 1 };
    }

    return { supported: false, version: null };
  } catch {
    return { supported: false, version: null };
  }
}

/**
 * True hard blockers only: an explicit accessibility preference
 * (prefers-reduced-motion, always respected — this is a user choice, not a
 * guess) or a device that cannot create a WebGL context of any kind.
 *
 * Everything else — perceived "low" RAM, CPU core count, WebGL1 vs WebGL2 —
 * is deliberately NOT used to block rendering. Those signals are known to
 * be unreliable in isolation (browsers round/cap them for privacy, and
 * plenty of capable devices under-report), so we only ever use them below
 * to pick a conservative *starting* tier. PerformanceMonitor measures real
 * frame timing at runtime and corrects the tier from there — a wrong guess
 * costs a second of visual polish, never correctness.
 */
function hasHardConstraint(webgl: WebGLSupport): boolean {
  if (typeof window === "undefined") return true;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reducedMotion || !webgl.supported;
}

/** Used only to pick a sensible *starting* tier — PerformanceMonitor corrects it from there. */
function initialTierGuess(webgl: WebGLSupport): QualityTier {
  if (typeof window === "undefined") return "medium";

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const isSmall = window.matchMedia("(max-width: 767px)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;

  const looksConstrained =
    isTouch ||
    isSmall ||
    webgl.version === 1 ||
    (typeof memory === "number" && memory <= 4) ||
    (typeof cores === "number" && cores <= 4);

  return looksConstrained ? "low" : "medium";
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
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const rendererRef = useRef<RootState["gl"] | null>(null);
  const canvasCleanupRef = useRef<(() => void) | null>(null);

  const [blocked, setBlocked] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [mountFailed, setMountFailed] = useState(false);
  const [firstFrameRendered, setFirstFrameRendered] = useState(false);

  const [tier, setTier] = useState<QualityTier>("medium");
  const [tierLocked, setTierLocked] = useState(false);
  const [dprFactor, setDprFactor] = useState(0.5); // 0..1, smoothed by PerformanceMonitor

  const [inViewport, setInViewport] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  // One-time capability check + starting quality guess.
  useEffect(() => {
    const webgl = detectWebGLSupport();
    setBlocked(hasHardConstraint(webgl));
    setTier(initialTierGuess(webgl));
  }, []);

  // Watchdog: if we never get a real rendered frame within a generous window,
  // something is wrong on this device/browser (stuck shader compile, driver
  // issue, etc.) — drop to the static fallback instead of leaving a blank
  // hero. Window is intentionally generous since low-end devices can take
  // noticeably longer to compile shaders on first paint.
  useEffect(() => {
    if (blocked) return;
    const timer = setTimeout(() => {
      if (!firstFrameRendered) setMountFailed(true);
    }, 6000);
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
    if (tierLocked) return;
    setTier((current) => {
      const idx = QUALITY_ORDER.indexOf(current);
      return QUALITY_ORDER[Math.min(idx + 1, QUALITY_ORDER.length - 1)]!;
    });
  }, [tierLocked]);

  const handleDecline = useCallback(() => {
    if (tierLocked) return;
    setTier((current) => {
      const idx = QUALITY_ORDER.indexOf(current);
      return QUALITY_ORDER[Math.max(idx - 1, 0)]!;
    });
  }, [tierLocked]);

  // If the device keeps flip-flopping between tiers (PerformanceMonitor's
  // own signal that it can't find a stable operating point), stop chasing
  // it: settle permanently at "low" and lock further adjustments. A stable
  // low-quality scene beats a scene that never stops re-adjusting.
  const handleFallback = useCallback(() => {
    setTier("low");
    setTierLocked(true);
  }, []);

  const handlePerfChange = useCallback((api: { factor: number }) => {
    setDprFactor(api.factor);
  }, []);

  // dpr scales continuously with measured headroom within a per-tier range.
  // Native WebGL anti-aliasing is deliberately OFF (see gl config below) —
  // instead we lean on this supersampling to smooth edges, since that's the
  // approach that also fixes the fringing bug native MSAA can't fix here.
  const dpr = useMemo(() => {
    const [minDpr, maxDpr] =
      tier === "low" ? [1, 1.35] : tier === "medium" ? [1.25, 1.75] : [1.5, 2];
    return minDpr + dprFactor * (maxDpr - minDpr);
  }, [dprFactor, tier]);

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
          // Native MSAA resolves incorrectly against a transparent (alpha)
          // canvas in WebGL — it leaves faint dark fringes on every edge,
          // barely visible on a dark page background but clearly visible on
          // a light one (exactly the "pixelated in light mode" symptom).
          // Turning it off and relying on the dpr supersampling above
          // avoids that bug entirely instead of just hiding it.
          antialias: false,
          premultipliedAlpha: false,
          stencil: false,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 0.5, 7.5], fov: 40 }}
        style={{ background: "transparent" }}
        dpr={dpr}
        onCreated={handleCreated}
      >
        <PerformanceMonitor
          onIncline={handleIncline}
          onDecline={handleDecline}
          onFallback={handleFallback}
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
            theme={theme}
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
