import { Html } from '@react-three/drei'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MARS_RADIUS, latLonToNormal } from '../data/mars'

export interface MarkerItem {
  id: string
  name: string
  lat: number
  lon: number
}

const Z = new THREE.Vector3(0, 0, 1)

interface MarkerProps {
  item: MarkerItem
  color: string
  selected: boolean
  onSelect: (id: string) => void
  label?: boolean
}

function Marker({ item, color, selected, onSelect, label }: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)
  const dotMat = useRef<THREE.MeshBasicMaterial>(null)

  const { pos, quat } = useMemo(() => {
    const n = latLonToNormal(item.lat, item.lon)
    return {
      pos: n.clone().multiplyScalar(MARS_RADIUS + 0.006),
      quat: new THREE.Quaternion().setFromUnitVectors(Z, n),
    }
  }, [item])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4 + item.lon)
    if (ringMat.current) ringMat.current.opacity = selected ? 0.95 : 0.35 + pulse * 0.4
    if (dotMat.current) dotMat.current.opacity = selected ? 1 : 0.8
    if (groupRef.current) {
      const s = selected ? 1.45 : 1 + pulse * 0.18
      groupRef.current.scale.setScalar(s)
    }
  })

  const stop = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }

  return (
    <group position={pos} quaternion={quat}>
      <group ref={groupRef}>
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            onSelect(item.id)
          }}
          onPointerOver={stop}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <sphereGeometry args={[0.016, 16, 16]} />
          <meshBasicMaterial ref={dotMat} color={color} transparent />
        </mesh>
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            onSelect(item.id)
          }}
          onPointerOver={stop}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <ringGeometry args={[0.028, 0.035, 40]} />
          <meshBasicMaterial ref={ringMat} color={color} transparent side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
      {label && (
        <Html center distanceFactor={5.2} zIndexRange={[10, 0]} className="marker-html">
          <div className={`marker-label ${selected ? 'selected' : ''}`}>{item.name}</div>
        </Html>
      )}
    </group>
  )
}

interface MarkersProps {
  items: MarkerItem[]
  color: string
  selectedId: string | null
  onSelect: (id: string) => void
  labels?: boolean
}

export function Markers({ items, color, selectedId, onSelect, labels }: MarkersProps) {
  return (
    <>
      {items.map((item) => (
        <Marker key={item.id} item={item} color={color} selected={selectedId === item.id} onSelect={onSelect} label={labels} />
      ))}
    </>
  )
}
