import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { CAM, MARS_RADIUS } from '../data/locations'
import { killFly, rig } from '../lib/rig'
import { useApp } from '../lib/store'
import marsTextureUrl from '../assets/mars_8k.jpg'
import marsBumpUrl from '../assets/mars_bump_1k.jpg'

/** The Mars globe + drag-to-orbit with inertia + wheel zoom (camera stays spherical). */
export function Globe() {
  const [texture, bump] = useTexture([marsTextureUrl, marsBumpUrl])
  const gl = useThree((s) => s.gl)

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  }, [texture, gl])

  useEffect(() => {
    const el = gl.domElement
    let last: [number, number] | null = null
    let lastT = 0
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    // multi-touch pinch state
    const pointers = new Map<number, [number, number]>()
    let pinchDist = 0
    const distOf = () => {
      const pts = [...pointers.values()]
      return Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1])
    }

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, [e.clientX, e.clientY])
      if (pointers.size === 2) {
        // pinch begins: cancel any in-flight rotation
        rig.dragging = false
        last = null
        pinchDist = distOf()
        killFly()
        return
      }
      rig.dragging = true
      rig.vTheta = 0
      rig.vPhi = 0
      useApp.getState().clear()
      killFly()
      last = [e.clientX, e.clientY]
      lastT = performance.now()
      el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, [e.clientX, e.clientY])

      // pinch-zoom (touch)
      if (pointers.size === 2) {
        const d = distOf()
        if (pinchDist > 0 && d > 0) {
          const scale = pinchDist / d // fingers apart → zoom in
          const target = THREE.MathUtils.clamp(rig.radius * scale, CAM.near, CAM.far)
          rig.radiusTarget = target
          rig.radius = THREE.MathUtils.damp(rig.radius, target, 10, 1 / 60)
        }
        pinchDist = d
        return
      }

      if (!rig.dragging || !last) return
      const dx = e.clientX - last[0]
      const dy = e.clientY - last[1]
      last = [e.clientX, e.clientY]
      const now = performance.now()
      const dt = Math.max((now - lastT) / 1000, 1e-3)
      lastT = now

      if (rig.surfaceT > 0.5) {
        // on the ground: drag looks around instead of orbiting
        rig.surfYaw -= dx * 0.0042
        rig.surfPitch = THREE.MathUtils.clamp(rig.surfPitch - dy * 0.003, -0.45, 0.45)
        return
      }
      const dTheta = -dx * 0.0052
      const dPhi = -dy * 0.0052
      rig.theta += dTheta
      rig.phi = THREE.MathUtils.clamp(rig.phi + dPhi, 0.12, Math.PI - 0.12)
      rig.vTheta = dTheta / dt
      rig.vPhi = dPhi / dt
    }
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId)
      if (pointers.size === 1) {
        // back to one finger: resume rotation from the remaining pointer
        const rest = [...pointers.values()][0]
        last = rest
        rig.dragging = true
        return
      }
      if (!rig.dragging) return
      rig.dragging = false
      last = null
      el.style.cursor = 'grab'
      clearTimeout(idleTimer)
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      useApp.getState().clear()
      killFly()
      rig.radiusTarget = THREE.MathUtils.clamp(rig.radius + e.deltaY * 0.0028, CAM.near, CAM.far)
    }

    const onContext = (e: Event) => e.preventDefault()

    el.style.cursor = 'grab'
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('contextmenu', onContext)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('contextmenu', onContext)
      clearTimeout(idleTimer)
    }
  }, [gl])

  return (
    <mesh>
      <sphereGeometry args={[MARS_RADIUS, 160, 160]} />
      <meshStandardMaterial map={texture} bumpMap={bump} bumpScale={0.6} roughness={0.95} metalness={0} />
    </mesh>
  )
}
