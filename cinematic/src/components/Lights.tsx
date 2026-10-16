import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { rig } from '../lib/rig'

/** Sun + ambient, driven by the rig's lighting presets. */
export function Lights() {
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const ambRef = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.intensity = rig.sunIntensity
      sunRef.current.color.copy(rig.sunColor)
    }
    if (ambRef.current) {
      ambRef.current.intensity = rig.ambientIntensity
      ambRef.current.color.copy(rig.ambientColor)
    }
  })

  return (
    <>
      {/* low cinematic sun */}
      <directionalLight ref={sunRef} position={[6, 1.2, 2.5]} intensity={1.25} />
      <ambientLight ref={ambRef} intensity={0.24} />
    </>
  )
}

/** Sun glow sprite far along the light direction. */
export function SunGlow() {
  const matRef = useRef<THREE.SpriteMaterial>(null)
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255, 240, 225, 1)')
    g.addColorStop(0.22, 'rgba(255, 190, 140, 0.5)')
    g.addColorStop(1, 'rgba(255, 150, 80, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame(() => {
    const mat = matRef.current
    if (!mat) return
    // push into HDR so the sun blooms
    mat.color.copy(rig.sunColor).multiplyScalar(1.8)
    mat.opacity = THREE.MathUtils.clamp(rig.sunIntensity / 1.25, 0.1, 1)
  })

  return (
    <sprite position={[44, 9, 18]} scale={[16, 16, 1]}>
      <spriteMaterial ref={matRef} map={texture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}
