import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Firecracker({ position, color, delay = 0, type = 'rocket' }) {
  const rocketRef = useRef()
  const explosionRef = useRef()
  const trailRef = useRef()
  const isExploded = useRef(false)
  const explosionTime = useRef(0)
  
  const particleCount = 100
  const trailCount = 30
  
  // Create explosion particles
  const explosionParticles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = []
    const colors = new Float32Array(particleCount * 3)
    
    const baseColor = new THREE.Color(color)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      
      // Random velocities in all directions
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const speed = Math.random() * 0.15 + 0.05
      
      velocities.push({
        x: Math.sin(theta) * Math.cos(phi) * speed,
        y: Math.sin(theta) * Math.sin(phi) * speed,
        z: Math.cos(theta) * speed
      })
      
      // Color variation
      const colorVariation = new THREE.Color(color)
      colorVariation.offsetHSL(Math.random() * 0.1 - 0.05, 0, Math.random() * 0.2 - 0.1)
      colors[i * 3] = colorVariation.r
      colors[i * 3 + 1] = colorVariation.g
      colors[i * 3 + 2] = colorVariation.b
    }
    
    return { positions, velocities, colors }
  }, [color])
  
  // Create trail particles
  const trailParticles = useMemo(() => {
    const positions = new Float32Array(trailCount * 3)
    for (let i = 0; i < trailCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
    }
    return positions
  }, [])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + delay
    
    if (time < 0) return
    
    // Rocket phase
    if (!isExploded.current && rocketRef.current) {
      const rocketTime = time % 4
      
      if (rocketTime < 2) {
        // Rising
        rocketRef.current.position.y = position[1] + (rocketTime * 4)
        rocketRef.current.visible = true
        
        // Update trail
        if (trailRef.current) {
          const positions = trailRef.current.geometry.attributes.position.array
          for (let i = trailCount - 1; i > 0; i--) {
            positions[i * 3] = positions[(i - 1) * 3]
            positions[i * 3 + 1] = positions[(i - 1) * 3 + 1]
            positions[i * 3 + 2] = positions[(i - 1) * 3 + 2]
          }
          positions[0] = rocketRef.current.position.x
          positions[1] = rocketRef.current.position.y - 0.3
          positions[2] = rocketRef.current.position.z
          trailRef.current.geometry.attributes.position.needsUpdate = true
        }
      } else if (rocketTime >= 2 && rocketTime < 2.1) {
        // Explode
        isExploded.current = true
        explosionTime.current = time
        rocketRef.current.visible = false
        
        // Set explosion position
        if (explosionRef.current) {
          explosionRef.current.position.copy(rocketRef.current.position)
        }
      } else {
        // Reset for next cycle
        if (rocketTime > 3.5) {
          isExploded.current = false
          if (rocketRef.current) {
            rocketRef.current.position.y = position[1]
          }
        }
      }
    }
    
    // Explosion phase
    if (isExploded.current && explosionRef.current) {
      const explosionDuration = time - explosionTime.current
      
      if (explosionDuration < 2) {
        explosionRef.current.visible = true
        const positions = explosionRef.current.geometry.attributes.position.array
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          positions[i3] += explosionParticles.velocities[i].x
          positions[i3 + 1] += explosionParticles.velocities[i].y - 0.005 // gravity
          positions[i3 + 2] += explosionParticles.velocities[i].z
        }
        
        explosionRef.current.geometry.attributes.position.needsUpdate = true
        
        // Fade out
        const opacity = 1 - (explosionDuration / 2)
        explosionRef.current.material.opacity = Math.max(0, opacity)
        explosionRef.current.material.size = 0.15 * (1 + explosionDuration)
      } else {
        // Reset explosion
        explosionRef.current.visible = false
        const positions = explosionRef.current.geometry.attributes.position.array
        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] = 0
        }
      }
    }
  })
  
  return (
    <group position={position}>
      {/* Rocket */}
      <mesh ref={rocketRef}>
        <cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {/* Rocket trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trailCount}
            array={trailParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#ff6347"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Explosion particles */}
      <points ref={explosionRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={explosionParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={explosionParticles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          transparent
          opacity={1}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Explosion light */}
      <pointLight 
        position={[0, 8, 0]} 
        intensity={isExploded.current ? 5 : 0} 
        color={color}
        distance={10}
      />
    </group>
  )
}

export default Firecracker

