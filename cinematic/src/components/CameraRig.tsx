import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { MARS_RADIUS, SURFACE } from '../data/locations'
import { rig } from '../lib/rig'
import { useApp } from '../lib/store'

const SPACE = new THREE.Color('#030108')
const SKY = new THREE.Color('#c07a52')
const SKY_DUSK = new THREE.Color('#472028')
const SKY_NIGHT = new THREE.Color('#0d0a18')

const ease = (t: number) => t * t * (3 - 2 * t)

/**
 * Spherical orbit camera with a descent-to-surface transition:
 * as radius drops past SURFACE.start the camera glides down to eye height,
 * the sky warms up, fog rolls in, and drag switches to look-around.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const scene = useThree((s) => s.scene)
  const fog = useMemo(() => new THREE.Fog('#030108', 1, 400), [])
  const orbit = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const eye = useMemo(() => new THREE.Vector3(), [])
  const tangent = useMemo(() => new THREE.Vector3(), [])
  const right = useMemo(() => new THREE.Vector3(), [])
  const lookDir = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    scene.fog = fog
    scene.background = new THREE.Color('#030108')
  }, [scene, fog])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)

    // --- inertia ---
    if (!rig.dragging && (Math.abs(rig.vTheta) > 1e-4 || Math.abs(rig.vPhi) > 1e-4)) {
      rig.theta += rig.vTheta * dt
      rig.phi = THREE.MathUtils.clamp(rig.phi + rig.vPhi * dt, 0.12, Math.PI - 0.12)
      const damp = Math.exp(-dt * 2.0)
      rig.vTheta *= damp
      rig.vPhi *= damp
    }

    // --- eased wheel zoom ---
    if (rig.radiusTarget !== null && !rig.dragging) {
      rig.radius = THREE.MathUtils.damp(rig.radius, rig.radiusTarget, 7, dt)
      if (Math.abs(rig.radius - rig.radiusTarget) < 0.005) {
        rig.radius = rig.radiusTarget
        rig.radiusTarget = null
      }
    }

    // --- surface transition ---
    const targetT = THREE.MathUtils.clamp((SURFACE.start - rig.radius) / (SURFACE.start - SURFACE.end), 0, 1)
    rig.surfaceT = THREE.MathUtils.damp(rig.surfaceT, targetT, 4.5, dt)
    const t = ease(rig.surfaceT)

    // notify React when crossing the surface boundary (buttons, cards)
    const onSurface = rig.surfaceT > 0.5
    if (onSurface !== useApp.getState().surface) useApp.getState().setSurface(onSurface)

    // --- auto-rotate only in orbit ---
    if (rig.autoRotate && !rig.dragging && rig.surfaceT < 0.3) {
      rig.theta += rig.autoSpeed * dt
    }

    // orbit position (also the descent direction)
    const sp = Math.sin(rig.phi)
    orbit.set(rig.radius * sp * Math.sin(rig.theta), rig.radius * Math.cos(rig.phi), rig.radius * sp * Math.cos(rig.theta))

    // surface eye + look direction
    dir.copy(orbit).normalize()
    eye.copy(dir).multiplyScalar(MARS_RADIUS + SURFACE.eyeHeight)
    // horizontal tangent (perpendicular to radial "up")
    tangent.set(0, 1, 0).cross(dir)
    if (tangent.lengthSq() < 1e-4) tangent.set(1, 0, 0)
    tangent.normalize().applyAxisAngle(dir, rig.surfYaw)
    right.copy(dir).cross(tangent).normalize() // camera-right on the ground
    lookDir
      .copy(tangent)
      .applyAxisAngle(right, THREE.MathUtils.clamp(rig.surfPitch, -0.45, 0.45))
      .normalize()

    camera.position.lerpVectors(orbit, eye, t)
    // look at planet center in orbit; at the surface look along the horizon
    look.set(0, 0, 0).addScaledVector(eye, t).addScaledVector(lookDir, 5 * t)
    camera.lookAt(look)
    camera.fov = 42 - t * 8
    camera.updateProjectionMatrix()

    // --- sky + fog ---
    const bg = scene.background as THREE.Color
    bg.copy(SPACE)
    if (rig.dayMode === 'day') bg.lerp(SKY, t * 0.85)
    else if (rig.dayMode === 'dusk') bg.lerp(SKY_DUSK, t * 0.85)
    else bg.lerp(SKY_NIGHT, t * 0.95)
    fog.color.copy(bg)
    fog.near = THREE.MathUtils.lerp(4, 0.35, t)
    fog.far = THREE.MathUtils.lerp(400, 7, t)
  })

  return null
}
