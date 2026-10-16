import * as THREE from 'three'
import { CAM, HOME_VIEW, quatFacingSite } from '../data/mars'

export type DayMode = 'day' | 'dusk' | 'night'

/**
 * Mutable per-frame rig. The render loop reads this every frame; GSAP tweens
 * and UI handlers write to it. Deliberately outside React — no re-renders.
 */
export interface Rig {
  // camera
  distance: number
  targetDistance: number
  camX: number
  camY: number
  targetCamX: number
  targetCamY: number
  // globe orientation
  quat: THREE.Quaternion
  flyTarget: THREE.Quaternion | null
  autoRotate: boolean
  autoSpeed: number
  dragging: boolean
  /** angular velocity for inertia, axis-angle vector (rad/s per axis) */
  vel: THREE.Vector3
  // surface descent transition
  surfaceT: number
  // lighting mode
  dayMode: DayMode
  // mouse parallax, normalized -1..1
  pointer: THREE.Vector2
  // lighting
  sunIntensity: number
  sunColor: THREE.Color
  ambientIntensity: number
  ambientColor: THREE.Color
  skyColor: THREE.Color
  // toggles
  atmosphere: boolean
  atmosphereOpacity: number
}

const homeQuat = quatFacingSite(HOME_VIEW.lat, HOME_VIEW.lon)

export const rig: Rig = {
  distance: CAM.home,
  targetDistance: CAM.home,
  camX: 0, camY: 0,
  targetCamX: 0, targetCamY: 0,
  quat: homeQuat.clone(),
  flyTarget: null,
  autoRotate: true,
  autoSpeed: 0.045,
  dragging: false,
  vel: new THREE.Vector3(),
  surfaceT: 0,
  dayMode: 'day',
  pointer: new THREE.Vector2(),
  sunIntensity: 2.4,
  sunColor: new THREE.Color('#fff4e8'),
  ambientIntensity: 0.35,
  ambientColor: new THREE.Color('#ffffff'),
  skyColor: new THREE.Color('#050208'),
  atmosphere: true,
  atmosphereOpacity: 1,
}

export const DAY_PRESETS: Record<DayMode, { sun: number; sunColor: string; amb: number; ambColor: string }> = {
  day: { sun: 2.4, sunColor: '#fff4e8', amb: 0.35, ambColor: '#ffffff' },
  dusk: { sun: 1.15, sunColor: '#ff6a35', amb: 0.22, ambColor: '#5a3644' },
  night: { sun: 0.06, sunColor: '#88aaff', amb: 0.14, ambColor: '#20304f' },
}

/** Fly the globe so `lat/lon` faces the camera, optionally dolly to `dist`. */
export function flyTo(lat: number, lon: number, dist?: number) {
  rig.flyTarget = quatFacingSite(lat, lon)
  rig.vel.set(0, 0, 0)
  if (dist !== undefined) rig.targetDistance = THREE.MathUtils.clamp(dist, CAM.min, CAM.max)
}

export function resetView() {
  rig.flyTarget = homeQuat.clone()
  rig.vel.set(0, 0, 0)
  rig.targetDistance = CAM.home
  rig.targetCamX = 0
  rig.targetCamY = 0
  rig.surfaceT = 0
  rig.autoRotate = true
}

export function zoomBy(delta: number) {
  rig.targetDistance = THREE.MathUtils.clamp(rig.targetDistance + delta, CAM.min, CAM.max)
  rig.flyTarget = null
}
