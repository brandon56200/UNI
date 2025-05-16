'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Custom shader for soft shadow
const softShadowMaterial = {
  uniforms: {
    color: { value: new THREE.Color('#000000') },
    opacity: { value: 0.2 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float opacity;
    varying vec2 vUv;
    
    void main() {
      float dist = length(vUv - vec2(0.5));
      float alpha = smoothstep(0.5, 0.0, dist) * opacity;
      gl_FragColor = vec4(color, alpha);
    }
  `,
  transparent: true,
  depthWrite: false
}

// Easing functions
const easeOutExpo = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

const easeInOutExpo = (x: number): number => {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5 
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2
}

interface AbstractModelProps {
  isScrolling: boolean;
}

function AbstractModel({ isScrolling }: AbstractModelProps) {
  const modelRef = useRef<THREE.Group>(null)
  const shadowRef = useRef<THREE.Mesh>(null)
  const shadowMaterialRef = useRef<THREE.ShaderMaterial>(null)
  const scrollProgressRef = useRef<number>(0)
  const startTimeRef = useRef<number | null>(null)
  const animationDuration = 5.0 // Increased to 5 seconds
  
  // Load the abstract model
  const { scene } = useGLTF('/abstract1.glb')

  // Animate the model
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Handle animation start time
      if (isScrolling && startTimeRef.current === null) {
        startTimeRef.current = state.clock.elapsedTime
      } else if (!isScrolling) {
        startTimeRef.current = null
      }

      // Calculate animation progress
      let progress = 0
      if (startTimeRef.current !== null) {
        const elapsed = state.clock.elapsedTime - startTimeRef.current
        progress = Math.min(elapsed / animationDuration, 1)
        scrollProgressRef.current = easeOutExpo(progress)
      } else {
        scrollProgressRef.current = Math.max(0, scrollProgressRef.current - delta * 0.5)
      }

      // Rotate in place
      modelRef.current.rotation.y += delta * 0.5
      
      // Floating motion plus scroll animation
      const bobHeight = Math.sin(state.clock.elapsedTime * 1.5) * 0.05
      const scrollOffset = easeInOutExpo(scrollProgressRef.current) * 15
      modelRef.current.position.y = bobHeight + scrollOffset

      // Fade out model during scroll
      const modelOpacity = 1 - easeInOutExpo(scrollProgressRef.current)
      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh).material as THREE.Material;
          if (material) {
            (material as any).opacity = modelOpacity;
            material.transparent = true;
          }
        }
      })
      
      // Scale shadow based on height
      if (shadowRef.current && shadowMaterialRef.current) {
        // Direct relationship: lower model = larger shadow
        const shadowScale = (1 + (bobHeight * 2)) * (1 - scrollProgressRef.current * 0.5)
        shadowRef.current.scale.set(shadowScale, shadowScale, 1)
        
        // Adjust opacity based on height and scroll state
        const baseOpacity = 0.2
        const opacityVariation = 0.15
        const heightOpacity = baseOpacity + (opacityVariation * (1 - (bobHeight + 0.05) / 0.1))
        const scrollFade = 1 - easeInOutExpo(scrollProgressRef.current)
        shadowMaterialRef.current.uniforms.opacity.value = heightOpacity * scrollFade
      }
    }
  })

  // Make materials transparent on mount
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        const material = (child as THREE.Mesh).material as THREE.Material;
        if (material) {
          material.transparent = true;
        }
      }
    })
  }, [scene])

  return (
    <group position={[0, 0.5, 0]}>
      {/* Custom shadow */}
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 2]}>
        <planeGeometry args={[0.6, 0.6]} />
        <shaderMaterial ref={shadowMaterialRef} args={[softShadowMaterial]} />
      </mesh>
      
      {/* Rotation group */}
      <group ref={modelRef} position={[0, 0, 2]}>
        {/* Actual abstract model */}
        <primitive 
          object={scene} 
          scale={0.5}
        />
      </group>
    </group>
  )
}

interface AbstractCanvasProps {
  isScrolling?: boolean;
  onPrerender?: () => void;
}

export default function AbstractCanvas({ isScrolling = false, onPrerender }: AbstractCanvasProps) {
  // Call the onPrerender callback when the component is mounted
  useEffect(() => {
    // Signal that the component has been prerendered
    if (onPrerender) {
      onPrerender();
    }
  }, [onPrerender]);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1, 4.75], fov: 45 }}
        style={{ background: '#F5F5F5' }}
        onCreated={() => {
          // When the Canvas is created and ready, signal completion
          if (onPrerender) {
            onPrerender();
          }
        }}
      >
        {/* Main lighting */}
        <ambientLight intensity={0.2} />
        
        {/* Primary light source */}
        <directionalLight 
          position={[0, 5, 0]} 
          intensity={2} 
        />
        
        {/* Environment lighting for better reflections */}
        <Environment preset="city" />
        
        <AbstractModel isScrolling={isScrolling} />
      </Canvas>
    </div>
  )
} 