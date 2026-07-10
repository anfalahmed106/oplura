"use client";

import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, type GroupProps } from "@react-three/fiber";
import * as THREE from "three";

/**
 * GeodesicSphere
 * ---------------------------------------------------------------
 * A premium, hollow, wireframe sphere: metallic rods + glossy
 * spherical joints, lit with cyan / blue accents. Fully procedural
 * No external assets, no Blender dependency.
 *
 * Geometry: a truncated-icosahedron (soccer-ball) topology.
 * Every node has degree 3, which keeps the structure spaced-out
 * and uncluttered.
 *   nodes = 60
 *   rods  = 90
 *
 * Ported 1:1 from the standalone HTML preview / source .jsx supplied
 * for the Oplura hero; only the typing and file extension changed.
 */

export type GeodesicColors = {
  base: string;
  cyan: string;
  blue: string;
  purple: string;
  rim: string;
  fill: string;
};

// Oplura enterprise palette: matte graphite body with enterprise-blue
// "connection line" accents and a whisper of ice-cyan highlight.
const DEFAULT_COLORS: GeodesicColors = {
  base: "#1F2937", // Matte Graphite - main body (~80%)
  cyan: "#2563EB", // Enterprise Blue - connection lines / active nodes
  blue: "#374151", // Slate Gray - secondary faces
  purple: "#38BDF8", // Ice Cyan - small highlights / glow only
  rim: "#0F172A", // Dark rim
  fill: "#F8FAFC", // Soft white specular fill
};

type Vec3 = [number, number, number];
type Edge = [number, number];

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
}

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function addEdge(map: Map<string, Edge>, a: number, b: number) {
  const key = a < b ? `${a}_${b}` : `${b}_${a}`;
  if (!map.has(key)) map.set(key, [a, b]);
}

type EdgeRecord = { u: number; v: number; nearU: number; nearV: number };

/** Builds the truncated-icosahedron node/rod layout. */
function buildTruncatedIcosahedron(radius: number): { nodePositions: Vec3[]; edges: Edge[] } {
  const t = (1 + Math.sqrt(5)) / 2;
  const rawVerts: Vec3[] = (
    [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ] as Vec3[]
  ).map(normalize);

  const faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  const nodePositions: Vec3[] = [];
  const edgeData = new Map<string, EdgeRecord>();

  function ensureEdge(a: number, b: number): EdgeRecord {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    const existing = edgeData.get(key);
    if (existing) return existing;
    const u = Math.min(a, b);
    const v = Math.max(a, b);
    const pu = normalize(lerp3(rawVerts[u]!, rawVerts[v]!, 1 / 3));
    const pv = normalize(lerp3(rawVerts[u]!, rawVerts[v]!, 2 / 3));
    nodePositions.push(pu.map((c) => c * radius) as Vec3);
    const nearU = nodePositions.length - 1;
    nodePositions.push(pv.map((c) => c * radius) as Vec3);
    const nearV = nodePositions.length - 1;
    const data: EdgeRecord = { u, v, nearU, nearV };
    edgeData.set(key, data);
    return data;
  }

  function nearPointOf(vertex: number, other: number): number {
    const d = ensureEdge(vertex, other);
    return vertex === d.u ? d.nearU : d.nearV;
  }

  const edgeSet = new Map<string, Edge>();

  // hex-hex edges: one per original icosahedron edge (30 total)
  for (const [a, b, c] of faces) {
    ([[a, b], [b, c], [c, a]] as Edge[]).forEach(([x, y]) => {
      const d = ensureEdge(x, y);
      addEdge(edgeSet, d.nearU, d.nearV);
    });
  }

  // pentagon edges: 5-cycle around each original vertex (60 total)
  const vertexFacePairs = new Map<number, Edge[]>();
  for (const f of faces) {
    for (let i = 0; i < 3; i++) {
      const v = f[i]!;
      const b = f[(i + 1) % 3]!;
      const c = f[(i + 2) % 3]!;
      if (!vertexFacePairs.has(v)) vertexFacePairs.set(v, []);
      vertexFacePairs.get(v)!.push([b, c]);
    }
  }
  for (let v = 0; v < rawVerts.length; v++) {
    const pairs = vertexFacePairs.get(v)!;
    const nextMap = new Map<number, number>();
    pairs.forEach(([b, c]) => nextMap.set(b, c));
    const start = pairs[0]![0];
    const ring: number[] = [start];
    let current = start;
    for (let i = 1; i < pairs.length; i++) {
      current = nextMap.get(current)!;
      ring.push(current);
    }
    const penta = ring.map((n) => nearPointOf(v, n));
    for (let i = 0; i < penta.length; i++) {
      addEdge(edgeSet, penta[i]!, penta[(i + 1) % penta.length]!);
    }
  }

  return { nodePositions, edges: Array.from(edgeSet.values()) };
}

export type QualityTier = "low" | "medium" | "high";

type QualitySetting = { sphereSegments: number; cylinderSegments: number; lightTier: 1 | 2 | 3 };

const QUALITY_SETTINGS: Record<QualityTier, QualitySetting> = {
  // lightTier 1 = ambient + directional + 1 accent point (3 lights)
  // lightTier 2 = + 1 more accent point (4 lights)
  // lightTier 3 = full original 6-light setup
  //
  // cylinderSegments used to be as low as 3-4 (a literal triangular/square
  // prism standing in for a "rod"), which is the main source of the visible
  // faceting/pixelation on rotation - each flat face catches specular light
  // differently frame to frame. Instance count (90 rods, 60 nodes) is fixed
  // and tiny, so raising segment counts is essentially free GPU-wise; it's
  // pure vertex count on a shared, instanced geometry, not per-instance cost.
  low: { sphereSegments: 14, cylinderSegments: 8, lightTier: 1 },
  medium: { sphereSegments: 18, cylinderSegments: 10, lightTier: 2 },
  high: { sphereSegments: 24, cylinderSegments: 12, lightTier: 3 },
};

/**
 * Adds a view-angle-dependent rim/fresnel glow to a standard material via a
 * shader patch. This is the standard technique for keeping a silhouette
 * readable against *any* background (light or dark) without hand-tuning
 * exact colors per background - edges facing away from the camera get a
 * thin bright highlight, which both:
 *  (a) fixes low-contrast readability in dark mode, and
 *  (b) visually "sharpens" edges, masking any residual softness from
 *      anti-aliasing/supersampling limits on lower-end devices.
 *
 * Implemented via onBeforeCompile rather than a fully custom shader so we
 * keep all of MeshStandardMaterial's existing PBR lighting or physically-
 * correct behavior and only add a thin additive term at the very end.
 */
function applyFresnelRim(
  material: THREE.MeshStandardMaterial,
  rimColor: THREE.Color,
  rimIntensity: number,
  rimPower: number,
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: rimColor };
    shader.uniforms.uRimIntensity = { value: rimIntensity };
    shader.uniforms.uRimPower = { value: rimPower };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform vec3 uRimColor;
         uniform float uRimIntensity;
         uniform float uRimPower;`,
      )
      .replace(
        "#include <dithering_fragment>",
        // vNormal isn't declared at all when the material uses flatShading
        // (three.js derives the face normal from screen-space derivatives
        // instead) - mirror that same branch here rather than assuming
        // vNormal exists, so this works on both the flat-shaded rods and
        // the smooth-shaded node spheres.
        `#ifdef FLAT_SHADED
           vec3 rimNormal = normalize( cross( dFdx( vViewPosition ), dFdy( vViewPosition ) ) );
         #else
           vec3 rimNormal = normalize( vNormal );
         #endif
         float rimFacing = 1.0 - saturate( dot( rimNormal, normalize( vViewPosition ) ) );
         float rimFresnel = pow( rimFacing, uRimPower );
         gl_FragColor.rgb += uRimColor * rimFresnel * uRimIntensity;
         #include <dithering_fragment>`,
      );
  };
  material.needsUpdate = true;
}

export interface GeodesicSphereProps extends Omit<GroupProps, "scale"> {
  radius?: number;
  scale?: number;
  rotationSpeed?: number;
  colors?: Partial<GeodesicColors>;
  nodeRadiusRatio?: number;
  rodRadiusRatio?: number;
  autoRotate?: boolean;
  /** Normalized (-1..1) pointer position, updated externally without re-renders. */
  pointer?: MutableRefObject<{ x: number; y: number }>;
  /** Render quality tier - driven by measured runtime performance, not a device guess. */
  quality?: QualityTier;
  /** Current site theme - brightens lighting and rim glow in dark mode for readability. */
  theme?: "light" | "dark";
}

export default function GeodesicSphere({
  radius = 2,
  scale = 1,
  rotationSpeed = 1,
  colors = DEFAULT_COLORS,
  nodeRadiusRatio = 0.075,
  rodRadiusRatio = 0.032,
  autoRotate = true,
  pointer,
  quality = "medium",
  theme = "light",
  ...groupProps
}: GeodesicSphereProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMeshRef = useRef<THREE.InstancedMesh>(null);
  const rodMeshRef = useRef<THREE.InstancedMesh>(null);
  const rodMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const nodeMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const mergedColors: GeodesicColors = { ...DEFAULT_COLORS, ...colors };
  const { sphereSegments, cylinderSegments, lightTier } = QUALITY_SETTINGS[quality];

  const { nodePositions, edges } = useMemo(() => buildTruncatedIcosahedron(radius), [radius]);

  const nodeRadius = radius * nodeRadiusRatio;
  const rodRadius = radius * rodRadiusRatio;

  const isDark = theme === "dark";
  // Dark backgrounds swallow a lot of the model's contrast, so lights run
  // brighter in dark mode; the palette itself is unchanged either way.
  const lightBoost = isDark ? 1.4 : 1;
  const rimIntensity = isDark ? 0.85 : 0.32;
  const rimPower = 2.2;
  const rimColor = useMemo(
    () => new THREE.Color(isDark ? mergedColors.purple : mergedColors.cyan),
    [isDark, mergedColors.purple, mergedColors.cyan],
  );

  // Position all node instances once (geometry is static)
  useLayoutEffect(() => {
    if (!nodeMeshRef.current) return;
    const dummy = new THREE.Object3D();
    nodePositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      nodeMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    nodeMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [nodePositions]);

  // Orient + scale all rod instances once (geometry is static)
  useLayoutEffect(() => {
    if (!rodMeshRef.current) return;
    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3();
    const mid = new THREE.Vector3();
    const start = new THREE.Vector3();
    const end = new THREE.Vector3();

    edges.forEach(([a, b], i) => {
      const pa = nodePositions[a]!;
      const pb = nodePositions[b]!;
      start.set(pa[0], pa[1], pa[2]);
      end.set(pb[0], pb[1], pb[2]);
      mid.copy(start).add(end).multiplyScalar(0.5);
      dir.copy(end).sub(start);
      const length = dir.length();
      dir.normalize();

      dummy.position.copy(mid);
      dummy.quaternion.setFromUnitVectors(up, dir);
      dummy.scale.set(1, length, 1);
      dummy.updateMatrix();
      rodMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    rodMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [edges, nodePositions]);

  // Apply/refresh the fresnel rim whenever theme (or its derived color/
  // intensity) changes. Re-running onBeforeCompile + needsUpdate is cheap
  // and is the supported way to update a compiled shader patch at runtime.
  useLayoutEffect(() => {
    if (rodMaterialRef.current) {
      applyFresnelRim(rodMaterialRef.current, rimColor, rimIntensity, rimPower);
    }
    if (nodeMaterialRef.current) {
      applyFresnelRim(nodeMaterialRef.current, rimColor, rimIntensity, rimPower);
    }
  }, [rimColor, rimIntensity, rimPower]);

  // Slow, linear, single-axis auto-rotation, plus a gentle eased tilt toward
  // the cursor layered on top - subtle enough to feel alive without turning
  // into a gimmick. Falls back to pure auto-rotation when there's no pointer.
  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    if (autoRotate) {
      groupRef.current.rotation.y += delta * ((Math.PI * 2) / 24) * rotationSpeed; // 360deg / 24s
    }

    if (pointer) {
      const targetTiltX = pointer.current.y * 0.18;
      const targetTiltZ = -pointer.current.x * 0.18;
      const lerpFactor = 1 - Math.pow(0.001, delta);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetTiltX, lerpFactor);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetTiltZ, lerpFactor);
    }
  });

  return (
    <group ref={groupRef} scale={scale} {...groupProps}>
      {/* Soft studio lighting: satin graphite body, enterprise-blue and
          ice-cyan doing only a subtle highlight/glow, not a neon wash.
          Intensities scale with lightBoost so dark mode stays readable. */}
      <ambientLight intensity={0.55 * lightBoost} />
      <directionalLight position={[-3, 5, 6]} intensity={2.4 * lightBoost} color="#ffffff" />
      {lightTier >= 1 && (
        <pointLight
          position={[5, 3.5, 3]}
          intensity={5 * lightBoost}
          color={mergedColors.cyan}
          distance={19}
          decay={1.6}
        />
      )}
      {lightTier >= 2 && (
        <pointLight
          position={[4.5, 2.5, 4]}
          intensity={5 * lightBoost}
          color="#ffffff"
          distance={22}
          decay={1.6}
        />
      )}
      {lightTier >= 3 && (
        <>
          <pointLight
            position={[3.5, -1.5, 4.5]}
            intensity={2.5 * lightBoost}
            color={mergedColors.purple}
            distance={17}
            decay={1.6}
          />
          <pointLight
            position={[7.5, 0.5, 1.5]}
            intensity={3 * lightBoost}
            color={mergedColors.fill}
            distance={24}
            decay={1.4}
          />
          <pointLight
            position={[-5, -2, -4]}
            intensity={1.5 * lightBoost}
            color={mergedColors.rim}
            distance={16}
            decay={2}
          />
        </>
      )}

      <instancedMesh ref={rodMeshRef} args={[undefined, undefined, edges.length]}>
        <cylinderGeometry args={[rodRadius, rodRadius, 1, cylinderSegments, 1]} />
        <meshStandardMaterial
          ref={rodMaterialRef}
          color={mergedColors.base}
          metalness={0.25}
          roughness={0.55}
          flatShading
        />
      </instancedMesh>

      <instancedMesh ref={nodeMeshRef} args={[undefined, undefined, nodePositions.length]}>
        <sphereGeometry args={[nodeRadius, sphereSegments, sphereSegments]} />
        <meshStandardMaterial ref={nodeMaterialRef} color={mergedColors.base} metalness={0.28} roughness={0.5} />
      </instancedMesh>
    </group>
  );
}
