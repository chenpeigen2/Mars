import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { LANDMARKS, MISSIONS } from '../data/mars'
import { useApp } from '../lib/store'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Globe } from './Globe'
import { Lights, SunGlow } from './Lights'
import { Markers } from './Markers'
import { StarsWrap } from './StarsWrap'

export function Scene() {
  const groupRef = useRef<THREE.Group>(null)
  const selectedLandmark = useApp((s) => s.selectedLandmark)
  const selectedMission = useApp((s) => s.selectedMission)
  const section = useApp((s) => s.section)
  const selectLandmark = useApp((s) => s.selectLandmark)
  const selectMission = useApp((s) => s.selectMission)

  return (
    <div className="canvas-wrap">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 42, near: 0.05, far: 300, position: [0, 0, 4.8] }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <Lights />
          <SunGlow />
          <StarsWrap />
          <group
            ref={groupRef}
            onUpdate={(g) => {
              // sync any externally-mutated quaternion (SSR/StrictMode safety)
              g.quaternion.normalize()
            }}
          >
            <Globe groupRef={groupRef} />
            <Markers
              items={LANDMARKS.map((l) => ({ id: l.id, name: l.name, lat: l.lat, lon: l.lon }))}
              color="#ffb454"
              selectedId={selectedLandmark}
              onSelect={selectLandmark}
              labels={section === 'landmarks'}
            />
            <Markers
              items={MISSIONS.map((m) => ({ id: m.id, name: m.name, lat: m.lat, lon: m.lon }))}
              color="#4dd8ff"
              selectedId={selectedMission}
              onSelect={selectMission}
              labels={section === 'missions'}
            />
          </group>
          <Atmosphere />
        </Suspense>
      </Canvas>
    </div>
  )
}