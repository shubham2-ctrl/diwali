import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function HotAirBalloon({ position, color, delay = 0, speed = 1 }) {
  const balloonRef = useRef()
  const flameRef = useRef()
  const particlesRef = useRef()
  
  const particleCount = 30
  
  // Create flame particles
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = []
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.2
      positions[i * 3 + 1] = Math.random() * 0.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: Math.random() * 0.03 + 0.02,
        z: (Math.random() - 0.5) * 0.01
      })
    }
    
    return { positions, velocities }
  }, [])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + delay
    
    // Balloon floating animation
    if (balloonRef.current) {
      balloonRef.current.position.y = Math.sin(time * 0.5 * speed) * 0.4 + 3 + (time * 0.12 * speed)
      balloonRef.current.position.x = Math.sin(time * 0.3 * speed) * 0.6 + position[0]
      balloonRef.current.position.z = Math.cos(time * 0.25 * speed) * 0.3 + position[2]
      balloonRef.current.rotation.z = Math.sin(time * 0.4 * speed) * 0.12
      
      // Reset position when too high
      if (balloonRef.current.position.y > 18) {
        balloonRef.current.position.y = -5
      }
    }
    
    // Flame flickering
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(time * 8) * 0.2
      flameRef.current.scale.x = 1 + Math.sin(time * 6) * 0.1
    }
    
    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        positions[i3] += particles.velocities[i].x
        positions[i3 + 1] += particles.velocities[i].y
        positions[i3 + 2] += particles.velocities[i].z
        
        // Reset particle
        if (positions[i3 + 1] > 1.5) {
          positions[i3] = (Math.random() - 0.5) * 0.2
          positions[i3 + 1] = 0
          positions[i3 + 2] = (Math.random() - 0.5) * 0.2
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <group ref={balloonRef} position={position}>
      {/* Balloon envelope - hot air balloon shape */}
      <mesh position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.4}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Balloon stripes/decorations */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh key={i} position={[0, 1, 0]} rotation={[0, angle, 0]}>
            <sphereGeometry args={[0.82, 32, 32, 0, Math.PI * 0.15, 0, Math.PI * 0.65]} />
            <meshStandardMaterial 
              color="#ffd700"
              roughness={0.3}
              metalness={0.5}
              emissive="#ffaa00"
              emissiveIntensity={0.4}
            />
          </mesh>
        )
      })}
      
      {/* Bottom of balloon (rounded) */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      
      {/* Basket */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.4, 8]} />
        <meshStandardMaterial 
          color="#8b4513"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Basket rim */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.27, 0.03, 8, 16]} />
        <meshStandardMaterial 
          color="#654321"
          roughness={0.7}
        />
      </mesh>
      
      {/* Ropes connecting basket to balloon */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4
        const x = Math.cos(angle) * 0.25
        const z = Math.sin(angle) * 0.25
        const topX = Math.cos(angle) * 0.5
        const topZ = Math.sin(angle) * 0.5
        return (
          <group key={`rope-${i}`}>
            <mesh 
              position={[(x + topX) / 2, 0.35, (z + topZ) / 2]}
              rotation={[0, -angle, Math.atan2(0.7, 0.25)]}
            >
              <cylinderGeometry args={[0.01, 0.01, 0.9, 4]} />
              <meshStandardMaterial color="#4a4a4a" />
            </mesh>
          </group>
        )
      })}
      
      {/* Flame under basket */}
      <group position={[0, 0.05, 0]}>
        <mesh ref={flameRef}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial 
            color="#ff6347"
            emissive="#ff4500"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Inner flame */}
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshStandardMaterial 
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={3}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Flame particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
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
        
        {/* Glow */}
        <pointLight 
          position={[0, 0, 0]} 
          intensity={1.5} 
          color="#ff6347"
          distance={3}
        />
      </group>
    </group>
  )
}

// Create circular texture for particles
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

export default HotAirBalloon

