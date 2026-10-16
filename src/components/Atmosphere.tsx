import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MARS_RADIUS } from '../data/mars'
import { rig } from '../lib/rig'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(uColor, 1.0) * intensity * uOpacity;
  }
`

/** Additive fresnel rim — Mars' thin dusty halo. Fades during surface descent. */
export function Atmosphere() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#ff5a2a') },
      uOpacity: { value: 1 },
    }),
    [],
  )

  useFrame((_, dt) => {
    const mat = matRef.current
    if (!mat) return
    const target = rig.atmosphere ? 1 - rig.surfaceT : 0
    uniforms.uOpacity.value = THREE.MathUtils.damp(uniforms.uOpacity.value, target, 5, Math.min(dt, 0.05))
  })

  return (
    <mesh scale={MARS_RADIUS * 1.22}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
