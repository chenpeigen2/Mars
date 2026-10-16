import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MARS_RADIUS } from '../data/locations'
import { rig } from '../lib/rig'

const COUNT = 420

/**
 * Scattered basalt boulders half-buried in the regolith.
 * Cheap near-field detail for the surface view — fog hides distant ones.
 */
export function Rocks() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, () => {
        // gaussian-ish random point on the sphere
        const v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
        if (v.lengthSq() < 1e-4) v.set(1, 0, 0)
        v.normalize()
        return { dir: v, scale: 0.004 + Math.random() * 0.012, rot: Math.random() * Math.PI * 2 }
      }),
    [],
  )

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    seeds.forEach((s, i) => {
      dummy.position.copy(s.dir).multiplyScalar(MARS_RADIUS + s.scale * 0.35)
      dummy.scale.setScalar(s.scale)
      dummy.rotation.set(s.rot, s.rot * 1.7, s.rot * 0.6)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [seeds])

  useFrame((_, dt) => {
    const mesh = meshRef.current
    const mat = matRef.current
    if (!mesh || !mat) return
    const target = rig.surfaceT > 0.55 ? 1 : 0
    mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 5, Math.min(dt, 0.05))
    mesh.visible = mat.opacity > 0.02
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} key={COUNT}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial ref={matRef} color="#3d1e14" roughness={1} metalness={0} transparent opacity={0} />
    </instancedMesh>
  )
}
