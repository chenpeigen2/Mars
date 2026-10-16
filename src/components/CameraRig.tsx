import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { MARS_RADIUS } from '../data/mars'
import { rig } from '../lib/rig'

const SPACE = new THREE.Color('#050208')
const SKY = new THREE.Color('#b0623f')
const DUSK_SKY = new THREE.Color('#3a1a28')

const ease = (t: number) => t * t * (3 - 2 * t)

/** Smooths rig values and positions the camera every frame. */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const scene = useThree((s) => s.scene)
  const fog = useMemo(() => new THREE.Fog('#050208', 1, 400), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const tmp2 = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const outTarget = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    scene.fog = fog
    scene.background = new THREE.Color('#050208')
  }, [scene, fog])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const k = (rate: number) => 1 - Math.exp(-rate * dt)
    rig.distance += (rig.targetDistance - rig.distance) * k(3.2)
    rig.camX += (rig.targetCamX - rig.camX) * k(2.5)
    rig.camY += (rig.targetCamY - rig.camY) * k(2.5)

    const t = ease(rig.surfaceT)
    const parX = rig.pointer.x * 0.16 * (1 - t)
    const parY = rig.pointer.y * 0.11 * (1 - t)

    // default orbit position
    tmp.set(rig.camX + parX, rig.camY + parY, rig.distance)
    // surface eye: standing on the site, looking out over the rim
    const R = MARS_RADIUS
    tmp2.set(0.0, 0.075, R + 0.075)
    camera.position.lerpVectors(tmp, tmp2, t)

    look.set(0, 0, 0)
    outTarget.set(0, -0.35, R + 0.075 + 4)
    look.lerpVectors(look, outTarget, t)
    camera.lookAt(look)
    camera.fov = 42 - t * 10
    camera.updateProjectionMatrix()

    // sky + fog
    const bg = scene.background as THREE.Color
    bg.copy(SPACE).lerp(SKY, t * 0.85)
    if (rig.dayMode === 'dusk' || rig.dayMode === 'night') bg.lerp(DUSK_SKY, t * 0.6)
    fog.color.copy(bg)
    fog.near = THREE.MathUtils.lerp(3, 0.6, t)
    fog.far = THREE.MathUtils.lerp(400, 7.5, t)
  })

  // mouse parallax
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      rig.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return null
}