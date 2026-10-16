import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { rig } from '../lib/rig'

/** Sun + ambient lights, driven by the rig's day/dusk/night presets. */
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
      <directionalLight ref={sunRef} position={[5, 2.2, 4]} intensity={2.4} />
      <ambientLight ref={ambRef} intensity={0.35} />
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
    g.addColorStop(0, 'rgba(255, 244, 232, 1)')
    g.addColorStop(0.25, 'rgba(255, 200, 150, 0.55)')
    g.addColorStop(1, 'rgba(255, 160, 90, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame(() => {
    const mat = matRef.current
    if (!mat) return
    mat.color.copy(rig.sunColor)
    mat.opacity = THREE.MathUtils.clamp(rig.sunIntensity / 2.4, 0.08, 1)
  })

  return (
    <sprite position={[36, 16, 29]} scale={[14, 14, 1]}>
      <spriteMaterial ref={matRef} map={texture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}
