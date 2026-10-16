import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { MARS_RADIUS, SURFACE_SITE, quatFacingSite } from '../data/mars'
import { rig } from '../lib/rig'
import marsTextureUrl from '../assets/mars_8k.jpg'

const Z_AXIS = new THREE.Vector3(0, 0, 1)
const Y_AXIS = new THREE.Vector3(0, 1, 0)

/**
 * The Mars globe: 8K texture, drag-to-rotate with inertia, auto-rotation,
 * and fly-to animation. The globe group's quaternion lives in rig.quat.
 */
export function Globe({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  const texture = useTexture(marsTextureUrl)
  const gl = useThree((s) => s.gl)
  const meshRef = useRef<THREE.Mesh>(null)

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  }, [texture, gl])

  // drag-to-rotate with inertia (native listeners; markers still get R3F clicks)
  useEffect(() => {
    const el = gl.domElement
    let last: [number, number] | null = null
    let lastT = 0
    let idleTimer: ReturnType<typeof setTimeout> | undefined

    const onDown = (e: PointerEvent) => {
      if (rig.surfaceT > 0.25) return
      rig.dragging = true
      rig.flyTarget = null
      rig.vel.set(0, 0, 0)
      rig.autoRotate = false
      last = [e.clientX, e.clientY]
      lastT = performance.now()
      el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!rig.dragging || !last) return
      const dx = e.clientX - last[0]
      const dy = e.clientY - last[1]
      last = [e.clientX, e.clientY]
      const now = performance.now()
      const dt = Math.max((now - lastT) / 1000, 1e-3)
      lastT = now

      const angle = Math.hypot(dx, dy) * 0.0052
      if (angle < 1e-6) return
      const axis = new THREE.Vector3(dy, dx, 0).normalize()
      const q = new THREE.Quaternion().setFromAxisAngle(axis, angle)
      rig.quat.premultiply(q).normalize()
      rig.vel.copy(axis).multiplyScalar(angle / dt)
    }
    const onUp = () => {
      if (!rig.dragging) return
      rig.dragging = false
      last = null
      el.style.cursor = 'grab'
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => (rig.autoRotate = true), 2600)
    }

    el.style.cursor = 'grab'
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      clearTimeout(idleTimer)
    }
  }, [gl])

  const surfaceQuat = useMemo(() => quatFacingSite(SURFACE_SITE.lat, SURFACE_SITE.lon), [])
  const qTmp = useMemo(() => new THREE.Quaternion(), [])
  const qDelta = useMemo(() => new THREE.Quaternion(), [])
  const axis = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const group = groupRef.current
    if (!group) return

    // fly-to animation
    if (rig.flyTarget) {
      const k = 1 - Math.exp(-2.8 * dt)
      rig.quat.slerp(rig.flyTarget, k)
      if (rig.quat.angleTo(rig.flyTarget) < 0.0015) {
        rig.quat.copy(rig.flyTarget)
        rig.flyTarget = null
      }
    }
    // surface descent locks the site under the camera
    if (rig.surfaceT > 0.005) {
      const k = 1 - Math.exp(-3.5 * rig.surfaceT * dt)
      rig.quat.slerp(surfaceQuat, k)
    }
    // inertia
    if (!rig.dragging && !rig.flyTarget && rig.vel.lengthSq() > 1e-6) {
      const angle = rig.vel.length() * dt
      axis.copy(rig.vel).normalize()
      qDelta.setFromAxisAngle(axis, angle)
      rig.quat.premultiply(qDelta).normalize()
      rig.vel.multiplyScalar(Math.exp(-dt * 2.1))
    }
    // gentle auto-rotation
    if (rig.autoRotate && !rig.dragging && !rig.flyTarget && rig.surfaceT < 0.3) {
      qTmp.setFromAxisAngle(Y_AXIS, rig.autoSpeed * dt)
      rig.quat.premultiply(qTmp).normalize()
    }

    group.quaternion.copy(rig.quat)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[MARS_RADIUS, 160, 160]} />
      <meshStandardMaterial map={texture} roughness={0.95} metalness={0} />
    </mesh>
  )
}
