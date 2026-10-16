import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Globe } from './Globe'
import { Lights, SunGlow } from './Lights'
import { Markers } from './Markers'
import { Rocks } from './Rocks'
import { DustParticles, ShootingStars, StarField } from './Sky'

export function Scene() {
  return (
    <div className="canvas-wrap">
      <Canvas dpr={[1, 2]} camera={{ fov: 42, near: 0.05, far: 400, position: [0, 3, 14] }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <CameraRig />
          <Lights />
          <SunGlow />
          <StarField />
          <ShootingStars />
          <DustParticles />
          <Globe />
          <Rocks />
          <Markers />
          <Atmosphere />
        </Suspense>
      </Canvas>
    </div>
  )
}
