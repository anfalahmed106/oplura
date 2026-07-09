'use client';

import { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * GeodesicSphere
 * ---------------------------------------------------------------
 * A premium, hollow, wireframe sphere: metallic rods + glossy
 * spherical joints, lit with cyan / purple accents. Fully
 * procedural â€” no external assets, no Blender dependency.
 *
 * Geometry: a truncated-icosahedron (soccer-ball) topology, the
 * exact same construction used in the standalone HTML preview.
 * Every node has degree 3, which keeps the structure spaced-out
 * and uncluttered. It's a fixed topology (not subdivided further):
 *   nodes = 60
 *   rods  = 90
 *
 * Usage:
 *   <Canvas gl={{ alpha: true }} camera={{ position: [0, 0.5, 7.5], fov: 40 }}>
 *     <GeodesicSphere />
 *   </Canvas>
 */

// Oplura enterprise palette â€” matte graphite body with enterprise-blue
// "connection line" accents and a whisper of ice-cyan highlight. Satin
// metallic, not glossy: this is Space Gray aluminum, not glass or neon.
const DEFAULT_COLORS = {
  base: '#1F2937',   // Matte Graphite â€” main body (~80%)
  cyan: '#2563EB',   // Enterprise Blue â€” connection lines / active nodes
  blue: '#374151',   // Slate Gray â€” secondary faces
  purple: '#38BDF8', // Ice Cyan â€” small highlights / glow only
  rim: '#0F172A',    // Dark rim, matches the dark-section background
  fill: '#F8FAFC',   // Soft white specular fill
};

function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
}

function lerp3(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function addEdge(map, a, b) {
  const key = a < b ? `${a}_${b}` : `${b}_${a}`;
  if (!map.has(key)) map.set(key, [a, b]);
}

/**
 * Builds the truncated-icosahedron node/rod layout â€” identical
 * construction to buildTruncatedIcosahedron() in the HTML preview.
 */
function buildTruncatedIcosahedron(radius) {
  const t = (1 + Math.sqrt(5)) / 2;
  const rawVerts = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(normalize);

  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  const nodePositions = [];
  const edgeData = new Map();

  function ensureEdge(a, b) {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    if (edgeData.has(key)) return edgeData.get(key);
    const u = Math.min(a, b), v = Math.max(a, b);
    const pu = normalize(lerp3(rawVerts[u], rawVerts[v], 1 / 3));
    const pv = normalize(lerp3(rawVerts[u], rawVerts[v], 2 / 3));
    nodePositions.push(pu.map((c) => c * radius));
    const nearU = nodePositions.length - 1;
    nodePositions.push(pv.map((c) => c * radius));
    const nearV = nodePositions.length - 1;
    const data = { u, v, nearU, nearV };
    edgeData.set(key, data);
    return data;
  }

  function nearPointOf(vertex, other) {
    const d = ensureEdge(vertex, other);
    return vertex === d.u ? d.nearU : d.nearV;
  }

  const edgeSet = new Map();

  // hex-hex edges: one per original icosahedron edge (30 total)
  for (const [a, b, c] of faces) {
    [[a, b], [b, c], [c, a]].forEach(([x, y]) => {
      const d = ensureEdge(x, y);
      addEdge(edgeSet, d.nearU, d.nearV);
    });
  }

  // pentagon edges: 5-cycle around each original vertex (60 total)
  const vertexFacePairs = new Map();
  for (const f of faces) {
    for (let i = 0; i < 3; i++) {
      const v = f[i], b = f[(i + 1) % 3], c = f[(i + 2) % 3];
      if (!vertexFacePairs.has(v)) vertexFacePairs.set(v, []);
      vertexFacePairs.get(v).push([b, c]);
    }
  }
  for (let v = 0; v < rawVerts.length; v++) {
    const pairs = vertexFacePairs.get(v);
    const nextMap = new Map();
    pairs.forEach(([b, c]) => nextMap.set(b, c));
    const start = pairs[0][0];
    const ring = [start];
    let current = start;
    for (let i = 1; i < pairs.length; i++) {
      current = nextMap.get(current);
      ring.push(current);
    }
    const penta = ring.map((n) => nearPointOf(v, n));
    for (let i = 0; i < penta.length; i++) {
      addEdge(edgeSet, penta[i], penta[(i + 1) % penta.length]);
    }
  }

  return { nodePositions, edges: Array.from(edgeSet.values()) };
}

export default function GeodesicSphere({
  radius = 2,
  scale = 1,
  rotationSpeed = 1,
  colors = DEFAULT_COLORS,
  nodeRadiusRatio = 0.075,
  rodRadiusRatio = 0.032,
  environmentPreset = 'city',
  autoRotate = true,
  ...groupProps
}) {
  const groupRef = useRef();
  const nodeMeshRef = useRef();
  const rodMeshRef = useRef();

  const mergedColors = { ...DEFAULT_COLORS, ...colors };

  const { nodePositions, edges } = useMemo(
    () => buildTruncatedIcosahedron(radius),
    [radius]
  );

  const nodeRadius = radius * nodeRadiusRatio;
  const rodRadius = radius * rodRadiusRatio;

  // Position all node instances once (geometry is static)
  useLayoutEffect(() => {
    if (!nodeMeshRef.current) return;
    const dummy = new THREE.Object3D();
    nodePositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      nodeMeshRef.current.setMatrixAt(i, dummy.matrix);
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
      start.set(...nodePositions[a]);
      end.set(...nodePositions[b]);
      mid.copy(start).add(end).multiplyScalar(0.5);
      dir.copy(end).sub(start);
      const length = dir.length();
      dir.normalize();

      dummy.position.copy(mid);
      dummy.quaternion.setFromUnitVectors(up, dir);
      dummy.scale.set(1, length, 1);
      dummy.updateMatrix();
      rodMeshRef.current.setMatrixAt(i, dummy.matrix);
    });
    rodMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [edges, nodePositions]);

  // Slow, linear, single-axis rotation â€” no easing, no bounce, no float
  // (spec: one full turn every 20â€“30s, smooth linear motion only)
  useFrame((state, delta) => {
    if (!autoRotate || !groupRef.current) return;
    groupRef.current.rotation.y += delta * (Math.PI * 2 / 24) * rotationSpeed; // 360Â° / 24s
  });

  return (
    <group ref={groupRef} scale={scale} {...groupProps}>
      <Environment preset={environmentPreset} />

      {/* Soft studio lighting â€” satin graphite body, enterprise-blue and
          ice-cyan doing only a subtle highlight/glow, not a neon wash */}
      <ambientLight intensity={0.35} />
      <pointLight position={[4.5, 2.5, 4]} intensity={5} color="#ffffff" distance={22} decay={1.6} />
      <pointLight position={[5, 3.5, 3]} intensity={5} color={mergedColors.cyan} distance={19} decay={1.6} />
      <pointLight position={[3.5, -1.5, 4.5]} intensity={2.5} color={mergedColors.purple} distance={17} decay={1.6} />
      {/* Soft white fill, spreads a gentle specular across the right side */}
      <pointLight position={[7.5, 0.5, 1.5]} intensity={3} color={mergedColors.fill} distance={24} decay={1.4} />
      <pointLight position={[-5, -2, -4]} intensity={1.5} color={mergedColors.rim} distance={16} decay={2} />

      <instancedMesh ref={rodMeshRef} args={[null, null, edges.length]}>
        <cylinderGeometry args={[rodRadius, rodRadius, 1, 4, 1]} />
        <meshPhysicalMaterial
          color={mergedColors.base}
          metalness={0.65}
          roughness={0.42}
          clearcoat={0.12}
          clearcoatRoughness={0.5}
          flatShading
          envMapIntensity={0.6}
        />
      </instancedMesh>

      <instancedMesh ref={nodeMeshRef} args={[null, null, nodePositions.length]}>
        <sphereGeometry args={[nodeRadius, 24, 24]} />
        <meshPhysicalMaterial
          color={mergedColors.base}
          metalness={0.7}
          roughness={0.35}
          clearcoat={0.18}
          clearcoatRoughness={0.4}
          envMapIntensity={0.7}
        />
      </instancedMesh>
    </group>
  );
}
