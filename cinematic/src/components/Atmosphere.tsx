import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MARS_RADIUS } from '../data/locations'
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
    float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
    gl_FragColor = vec4(uColor, 1.0) * intensity * uOpacity * 1.1;
  }
`

/** Additive fresnel rim — Mars' dusty halo, two tinted layers. */
export function Atmosphere() {
  const mesh1 = useRef<THREE.Mesh>(null)
  const mesh2 = useRef<THREE.Mesh>(null)
  const uniforms1 = useMemo(() => ({ uColor: { value: new THREE.Color('#ff5a2a') }, uOpacity: { value: 1 } }), [])
  const uniforms2 = useMemo(() => ({ uColor: { value: new THREE.Color('#ffc9a0') }, uOpacity: { value: 0.35 } }), [])

  useFrame((_, dt) => {
    const surfaceFade = 1 - rig.surfaceT
    const target = rig.atmosphere ? surfaceFade : 0
    const k = 1 - Math.exp(-5 * Math.min(dt, 0.05))
    uniforms1.uOpacity.value += (target - uniforms1.uOpacity.value) * k
    uniforms2.uOpacity.value += (target * 0.35 - uniforms2.uOpacity.value) * k
    // hard-hide on the ground so we never see the glow sphere from inside
    const vis = rig.surfaceT < 0.6
    if (mesh1.current) mesh1.current.visible = vis
    if (mesh2.current) mesh2.current.visible = vis
  })

  return (
    <>
      <mesh ref={mesh1} scale={MARS_RADIUS * 1.17}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh ref={mesh2} scale={MARS_RADIUS * 1.09}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
