import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Flame() {
  const flameRef = useRef()
  const innerFlameRef = useRef()
  const glowRef = useRef()
  const particlesRef = useRef()
  
  // Create particles for smoke/sparkle effect
  const particlesCount = 50
  const particles = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    const velocities = []
    
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.5
      positions[i * 3 + 1] = Math.random() * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.05 + 0.02,
        z: (Math.random() - 0.5) * 0.02
      })
    }
    
    return { positions, velocities }
  }, [])
  
  // Animate flame
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Main flame animation
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(time * 5) * 0.1
      flameRef.current.scale.x = 1 + Math.sin(time * 4) * 0.05
      flameRef.current.scale.z = 1 + Math.sin(time * 4) * 0.05
      flameRef.current.position.x = Math.sin(time * 3) * 0.05
    }
    
    // Inner flame animation
    if (innerFlameRef.current) {
      innerFlameRef.current.scale.y = 1 + Math.sin(time * 6) * 0.15
      innerFlameRef.current.scale.x = 1 + Math.cos(time * 5) * 0.08
    }
    
    // Glow pulsing
    if (glowRef.current) {
      const glowIntensity = 0.8 + Math.sin(time * 4) * 0.2
      glowRef.current.material.opacity = glowIntensity
      glowRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1)
    }
    
    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3
        
        positions[i3] += particles.velocities[i].x
        positions[i3 + 1] += particles.velocities[i].y
        positions[i3 + 2] += particles.velocities[i].z
        
        // Reset particle if it goes too high
        if (positions[i3 + 1] > 4) {
          positions[i3] = (Math.random() - 0.5) * 0.3
          positions[i3 + 1] = 0
          positions[i3 + 2] = (Math.random() - 0.5) * 0.3
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <group position={[0, 1.0, 0]}>
      {/* Outer flame (orange/red) */}
      <mesh ref={flameRef} position={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial 
          color="#ff4500"
          emissive="#ff6347"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner flame (yellow/white) */}
      <mesh ref={innerFlameRef} position={[0, 0.4, 0]}>
        <coneGeometry args={[0.18, 0.7, 8]} />
        <meshStandardMaterial 
          color="#ffff00"
          emissive="#ffff00"
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
          color="#ff8c00"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Sparkle particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#ffd700"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          map={createCircleTexture()}
        />
      </points>
      
      {/* Additional point light for stronger glow */}
      <pointLight 
        position={[0, 0.5, 0]} 
        intensity={3} 
        color="#ff6b35"
        distance={8}
      />
    </group>
  )
}

// Create circular texture for round particles
function createCircleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 32, 32)
  
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

export default Flame

