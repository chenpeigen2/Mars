import { Html } from '@react-three/drei'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { COPY, LOCATIONS, MARS_RADIUS, latLonToNormal } from '../data/locations'
import { rig } from '../lib/rig'
import { useApp } from '../lib/store'
import { getGlowTexture } from './Sky'

const Z = new THREE.Vector3(0, 0, 1)

function Marker({ index }: { index: number }) {
  const loc = LOCATIONS[index]
  const lang = useApp((s) => s.lang)
  const current = useApp((s) => s.index === index)
  const select = useApp((s) => s.select)
  const copy = COPY[lang][loc.id]

  const dotRef = useRef<THREE.Mesh>(null)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)
  const sonarMat = useRef<THREE.MeshBasicMaterial>(null)
  const sonarRef = useRef<THREE.Mesh>(null)
  const htmlRef = useRef<HTMLDivElement>(null)
  const hovered = useRef(false)
  const scaleCur = useRef(1)

  const { pos, quat } = useMemo(() => {
    const n = latLonToNormal(loc.lat, loc.lon)
    return {
      pos: n.clone().multiplyScalar(MARS_RADIUS + 0.006),
      quat: new THREE.Quaternion().setFromUnitVectors(Z, n),
    }
  }, [loc])

  useFrame(({ clock, camera }, dt) => {
    const t = clock.elapsedTime
    const pulse = 0.5 + 0.5 * Math.sin(t * (current ? 3.6 : 2.1))
    if (ringMat.current) ringMat.current.opacity = current || hovered.current ? 0.5 + pulse * 0.5 : 0.3
    // eased scale toward hover/current state
    const target = hovered.current ? 1.9 : current ? 1.5 : 1
    scaleCur.current = THREE.MathUtils.damp(scaleCur.current, target, 8, Math.min(dt, 0.05))
    if (dotRef.current) dotRef.current.scale.setScalar(scaleCur.current)
    if (glowMat.current) glowMat.current.opacity = current ? 0.55 + pulse * 0.3 : hovered.current ? 0.5 : 0.28
    if (sonarRef.current && sonarMat.current) {
      const cycle = ((t * 0.5) % 1 + 1) % 1
      sonarRef.current.scale.setScalar(1 + cycle * 4.5)
      sonarMat.current.opacity = current ? (1 - cycle) * 0.55 : 0
    }
    if (htmlRef.current) {
      const facing = pos.clone().normalize().dot(camera.position.clone().normalize())
      htmlRef.current.style.opacity = facing > 0.15 ? '' : '0'
    }
  })

  const pick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    // ignore clicks on the far side of the planet (ray passes through the globe)
    const facing = pos.clone().normalize().dot(e.camera.position.clone().normalize())
    if (facing < 0) return
    select(index)
  }
  const pickLabel = () => {
    if (htmlRef.current && htmlRef.current.style.opacity === '0') return
    select(index)
  }
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hovered.current = true
    document.body.style.cursor = 'pointer'
  }
  const glowMat = useRef<THREE.SpriteMaterial>(null)
  const out = () => {
    hovered.current = false
    document.body.style.cursor = ''
  }

  return (
    <group position={pos} quaternion={quat}>
      <sprite scale={[0.16, 0.16, 1]}>
        <spriteMaterial ref={glowMat} map={getGlowTexture()} transparent depthWrite={false} blending={THREE.AdditiveBlending} color="#ff9a4d" />
      </sprite>
      <mesh ref={dotRef} onClick={pick} onPointerOver={over} onPointerOut={out}>
        <sphereGeometry args={[0.017, 16, 16]} />
        <meshBasicMaterial color={current ? '#ffd9a8' : hovered.current ? '#ffc088' : '#ff9a5e'} transparent opacity={current ? 1 : 0.9} />
      </mesh>
      <mesh onClick={pick} onPointerOver={over} onPointerOut={out}>
        <ringGeometry args={[0.03, 0.037, 40]} />
        <meshBasicMaterial ref={ringMat} color="#ffb454" transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={sonarRef}>
        <ringGeometry args={[0.045, 0.05, 48]} />
        <meshBasicMaterial ref={sonarMat} color="#ffcf9e" transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* generous invisible hit target around the marker */}
      <mesh onClick={pick} onPointerOver={over} onPointerOut={out}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
      </mesh>
      <Html center distanceFactor={5.4} zIndexRange={[20, 0]} className="marker-html">
        <div
          ref={htmlRef}
          className={`marker-label ${current ? 'current' : ''}`}
          onClick={pickLabel}
          onMouseEnter={() => (hovered.current = true)}
          onMouseLeave={() => (hovered.current = false)}
        >
          {copy.name}
        </div>
      </Html>
    </group>
  )
}

export function Markers() {
  const groupRef = useRef<THREE.Group>(null)

  // fade the whole marker layer out while on the surface
  useFrame(() => {
    if (groupRef.current) {
      const v = rig.surfaceT < 0.45
      if (groupRef.current.visible !== v) groupRef.current.visible = v
    }
  })

  return (
    <group ref={groupRef}>
      {LOCATIONS.map((_, i) => (
        <Marker key={LOCATIONS[i].id} index={i} />
      ))}
    </group>
  )
}
