import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { rig } from '../lib/rig'

/** Starfield that fades away during the surface descent. */
export function StarsWrap() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    const t = rig.surfaceT
    g.visible = t < 0.98
    const s = 1 - t * 0.4
    g.scale.setScalar(Math.max(s, 0.01))
  })

  return (
    <group ref={groupRef}>
      <Stars radius={70} depth={35} count={4500} factor={2.6} saturation={0} fade speed={0.4} />
    </group>
  )
}
