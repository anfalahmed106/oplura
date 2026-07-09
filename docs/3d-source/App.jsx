import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import GeodesicSphere from './GeodesicSphere';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'transparent' }}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.5, 7.5], fov: 40 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <GeodesicSphere
            radius={2}
            rotationSpeed={1}
            colors={{
              base: '#1F2937',   // Matte Graphite
              cyan: '#2563EB',   // Enterprise Blue
              blue: '#374151',   // Slate Gray
              purple: '#38BDF8', // Ice Cyan
              rim: '#0F172A',    // Dark rim
              fill: '#F8FAFC',   // Soft white specular
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
