import { Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { rig } from '../lib/rig'

/** Shared soft radial texture for glow sprites (fake bloom — works on every GPU). */
let glowTex: THREE.Texture | null = null
export function getGlowTexture(): THREE.Texture {
  if (glowTex) return glowTex
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255, 210, 160, 0.9)')
  g.addColorStop(0.3, 'rgba(255, 160, 90, 0.35)')
  g.addColorStop(1, 'rgba(255, 140, 70, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  glowTex = new THREE.CanvasTexture(canvas)
  glowTex.colorSpace = THREE.SRGBColorSpace
  return glowTex
}

/** Twinkling starfield — fades into daylight on the surface, stays at night. */
export function StarField() {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    const g = ref.current
    if (!g) return
    const night = rig.dayMode === 'night'
    g.visible = !(rig.surfaceT > 0.8 && !night)
    g.scale.setScalar(Math.max(0.01, 1 - rig.surfaceT * (night ? 0.2 : 0.45)))
  })
  return (
    <group ref={ref}>
      <Stars radius={80} depth={40} count={6000} factor={2.8} saturation={0} fade speed={0.35} />
    </group>
  )
}

/** Occasional shooting star streaking across the sky. */
export function ShootingStars() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const state = useRef({ timer: 3, life: -1, dir: new THREE.Vector3() })

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const s = state.current
    const mesh = meshRef.current
    const mat = matRef.current
    if (!mesh || !mat) return

    if (s.life < 0) {
      s.timer -= dt
      mat.opacity = 0
      if (s.timer <= 0) {
        // spawn on an upper hemisphere shell
        const a = Math.random() * Math.PI * 2
        const y = 6 + Math.random() * 14
        mesh.position.set(Math.cos(a) * 22, y, Math.sin(a) * 22)
        s.dir.set(-Math.sin(a), -0.25 - Math.random() * 0.3, Math.cos(a)).normalize()
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), s.dir)
        s.life = 0
      }
      return
    }

    s.life += dt
    const DUR = 1.15
    mesh.position.addScaledVector(s.dir, 26 * dt)
    mat.opacity = Math.sin(Math.PI * Math.min(s.life / DUR, 1)) * 0.9
    if (s.life >= DUR) {
      s.life = -1
      s.timer = 4 + Math.random() * 9
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.4, 0.018]} />
      <meshBasicMaterial ref={matRef} color="#cfe4ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

/** Sparse drifting dust motes between camera and planet — adds depth. */
export function DustParticles() {
  const groupRef = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const n = 260
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 2.4 + Math.random() * 7
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi)
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.011
      groupRef.current.rotation.x += dt * 0.004
      // dust reads as "snow" on the ground — hide it there
      groupRef.current.visible = rig.surfaceT < 0.3
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        {/* soft round sprite so motes render as glowing dust, not squares */}
        <pointsMaterial
          map={getGlowTexture()}
          size={0.016}
          color="#ff9a60"
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
