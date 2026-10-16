import * as THREE from 'three'
import { gsap } from 'gsap'
import { CAM, sphericalFor, SURFACE } from '../data/locations'

export type DayMode = 'day' | 'dusk' | 'night'

/**
 * Mutable per-frame camera + light rig. The render loop reads it every frame;
 * GSAP tweens write straight into it. Spherical coords: theta azimuth,
 * phi polar (from +Y), radius distance.
 */
export interface Rig {
  theta: number
  phi: number
  radius: number
  /** when set, the render loop eases radius toward it (wheel zoom) */
  radiusTarget: number | null
  dragging: boolean
  autoRotate: boolean
  autoSpeed: number
  /** inertia: angular velocity rad/s */
  vTheta: number
  vPhi: number
  /** 0 = orbit view, 1 = standing on the surface */
  surfaceT: number
  /** look-around angles at the surface (rad) */
  surfYaw: number
  surfPitch: number
  // lighting
  dayMode: DayMode
  sunIntensity: number
  sunColor: THREE.Color
  ambientIntensity: number
  ambientColor: THREE.Color
  atmosphere: boolean
}

export const rig: Rig = {
  theta: 0.6,
  phi: 1.15,
  radius: 16, // deep-space intro start
  radiusTarget: null,
  dragging: false,
  autoRotate: false,
  autoSpeed: 0.04,
  vTheta: 0,
  vPhi: 0,
  surfaceT: 0,
  surfYaw: 0,
  surfPitch: -0.06,
  dayMode: 'dusk',
  sunIntensity: 1.25,
  sunColor: new THREE.Color('#ff6a35'),
  ambientIntensity: 0.24,
  ambientColor: new THREE.Color('#5a3644'),
  atmosphere: true,
}

let flyTimeline: gsap.core.Timeline | null = null

/** Google-Earth-style fly-to: pull back, swing around, descend. */
export function killFly() {
  flyTimeline?.kill()
  flyTimeline = null
  gsap.killTweensOf(rig, 'radius,theta,phi')
  rig.autoRotate = rig.surfaceT < 0.3
}

export function flyTo(lat: number, lon: number, dist: number, duration = 3.4) {
  killFly()
  rig.radiusTarget = null
  rig.vTheta = 0
  rig.vPhi = 0
  const wasAuto = rig.autoRotate
  rig.autoRotate = false

  let { theta: tTheta, phi: tPhi } = sphericalFor(lat, lon)
  // shortest azimuth path
  while (tTheta - rig.theta > Math.PI) tTheta -= Math.PI * 2
  while (tTheta - rig.theta < -Math.PI) tTheta += Math.PI * 2
  tPhi = THREE.MathUtils.clamp(tPhi, 0.28, Math.PI - 0.28)
  const tRadius = THREE.MathUtils.clamp(dist, CAM.near, CAM.far)
  const approachPhi = THREE.MathUtils.clamp(tPhi - 0.14, 0.28, Math.PI - 0.28)

  // choreography: pull back → swing around → descend → settle onto the site
  const up = Math.max(rig.radius, tRadius) + 1.9
  const tl = gsap.timeline({
    onComplete: () => {
      rig.autoRotate = wasAuto && rig.surfaceT < 0.3
    },
  })
  tl.to(rig, { radius: up, duration: duration * 0.35, ease: 'power2.in' }, 0)
  tl.to(rig, { theta: tTheta, phi: approachPhi, duration: duration * 0.75, ease: 'power2.inOut' }, duration * 0.12)
  tl.to(rig, { radius: tRadius, duration: duration * 0.55, ease: 'power3.inOut' }, duration * 0.45)
  tl.to(rig, { phi: tPhi, duration: duration * 0.45, ease: 'power2.out' }, duration * 0.55)
  flyTimeline = tl
}

/** cinematic dolly used right after the loader (no swing) */
export function introDolly(done?: () => void) {
  flyTimeline?.kill()
  gsap.to(rig, {
    radius: CAM.default,
    duration: 4.5,
    ease: 'power3.out',
    onComplete: done,
  })
}

export function resetView() {
  flyTimeline?.kill()
  rig.vTheta = 0
  rig.vPhi = 0
  const t = sphericalFor(18.65, 226.2)
  gsap.to(rig, {
    theta: t.theta,
    phi: THREE.MathUtils.clamp(t.phi, 0.28, Math.PI - 0.28),
    radius: CAM.default,
    duration: 2.2,
    ease: 'power3.inOut',
  })
}

export function zoomBy(delta: number) {
  flyTimeline?.kill()
  const target = THREE.MathUtils.clamp(rig.radius + delta, CAM.near, CAM.far)
  gsap.to(rig, { radius: target, duration: 0.8, ease: 'power2.out', overwrite: 'auto' })
}
