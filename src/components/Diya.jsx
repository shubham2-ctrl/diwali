import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Diya() {
  const diyaRef = useRef()
  const decorationsRef = useRef()
  
  // Gentle idle animation
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (diyaRef.current) {
      diyaRef.current.position.y = Math.sin(time * 0.5) * 0.05
    }
    
    // Subtle rotation for decorative elements
    if (decorationsRef.current) {
      decorationsRef.current.rotation.y = time * 0.1
    }
  })
  
  // Create decorative flower pattern positions
  const flowerPositions = [0, 1, 2].map((i) => {
    const angle = (i / 3) * Math.PI * 2
    return {
      x: Math.cos(angle) * 1.35,
      z: Math.sin(angle) * 1.35,
      rotation: angle
    }
  })
  
  // Create circular decoration positions around the rim
  const rimDecorations = Array.from({ length: 32 }, (_, i) => {
    const angle = (i / 32) * Math.PI * 2
    return {
      x: Math.cos(angle) * 1.55,
      z: Math.sin(angle) * 1.55,
      angle
    }
  })
  
  return (
    <group ref={diyaRef} position={[0, 0, 0]}>
      {/* Main bowl body - rich maroon color */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[1.6, 1.3, 0.9, 64]} />
        <meshStandardMaterial 
          color="#6b1a1a"
          roughness={0.35}
          metalness={0.4}
          emissive="#4a0d0d"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Inner bowl - gradient effect */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.55, 1.25, 0.8, 64]} />
        <meshStandardMaterial 
          color="#8b2424"
          roughness={0.25}
          metalness={0.5}
          emissive="#5c1616"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Oil/ghee inside with reflection */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.1, 64]} />
        <meshStandardMaterial 
          color="#ffb347"
          roughness={0.05}
          metalness={0.95}
          emissive="#ff9500"
          emissiveIntensity={0.5}
          transparent
          opacity={0.95}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Top golden decorative rim - thicker and more prominent */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <torusGeometry args={[1.55, 0.15, 20, 64]} />
        <meshStandardMaterial 
          color="#ffcc00"
          roughness={0.15}
          metalness={0.95}
          emissive="#ffaa00"
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Inner decorative ring */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[1.35, 0.08, 16, 64]} />
        <meshStandardMaterial 
          color="#b8860b"
          roughness={0.2}
          metalness={0.9}
          emissive="#8b6914"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Middle golden band with patterns */}
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[1.4, 0.1, 16, 64]} />
        <meshStandardMaterial 
          color="#daa520"
          roughness={0.25}
          metalness={0.85}
          emissive="#b8860b"
          emissiveIntensity={0.35}
        />
      </mesh>
      
      {/* Bottom golden band */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[1.25, 0.1, 16, 64]} />
        <meshStandardMaterial 
          color="#cd9b1d"
          roughness={0.3}
          metalness={0.85}
          emissive="#b8860b"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Decorative gems around the upper rim */}
      {rimDecorations.map((pos, i) => {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d9de0', '#e15f89', '#bb6bd9']
        const color = colors[i % colors.length]
        return (
          <mesh key={`gem-${i}`} position={[pos.x, 0.6, pos.z]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial 
              color={color}
              roughness={0.1}
              metalness={0.95}
              emissive={color}
              emissiveIntensity={0.7}
            />
          </mesh>
        )
      })}
      
      {/* Rotating decorative elements */}
      <group ref={decorationsRef}>
        {/* Small golden spheres rotating */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const x = Math.cos(angle) * 1.7
          const z = Math.sin(angle) * 1.7
          return (
            <mesh key={`gold-sphere-${i}`} position={[x, 0.8, z]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial 
                color="#ffd700"
                roughness={0.15}
                metalness={0.95}
                emissive="#ffaa00"
                emissiveIntensity={0.8}
              />
            </mesh>
          )
        })}
      </group>
      
      {/* Large flower patterns on the bowl */}
      {flowerPositions.map((pos, i) => (
        <group key={`flower-${i}`} position={[pos.x, 0.35, pos.z]} rotation={[0, pos.rotation, 0]}>
          {/* Center of flower - more elaborate */}
          <mesh position={[0, 0, 0.67]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
            <meshStandardMaterial 
              color="#ffd700"
              roughness={0.15}
              metalness={0.95}
              emissive="#ffaa00"
              emissiveIntensity={0.8}
            />
          </mesh>
          
          {/* Inner decorative circle in center */}
          <mesh position={[0, 0, 0.7]}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
            <meshStandardMaterial 
              color="#ff6347"
              roughness={0.2}
              metalness={0.85}
              emissive="#ff4500"
              emissiveIntensity={0.6}
            />
          </mesh>
          
          {/* Large decorative petals */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((petalIndex) => {
            const petalAngle = (petalIndex / 8) * Math.PI * 2
            const px = Math.cos(petalAngle) * 0.25
            const py = Math.sin(petalAngle) * 0.25
            return (
              <group key={petalIndex}>
                {/* Main petal */}
                <mesh 
                  position={[px, py, 0.65]} 
                  rotation={[0, 0, petalAngle]}
                >
                  <capsuleGeometry args={[0.06, 0.18, 8, 16]} />
                  <meshStandardMaterial 
                    color="#ff6b35"
                    roughness={0.25}
                    metalness={0.75}
                    emissive="#ff4500"
                    emissiveIntensity={0.6}
                  />
                </mesh>
                {/* Petal tip accent */}
                <mesh 
                  position={[px * 1.5, py * 1.5, 0.65]} 
                  rotation={[0, 0, petalAngle]}
                >
                  <sphereGeometry args={[0.04, 12, 12]} />
                  <meshStandardMaterial 
                    color="#ffd700"
                    roughness={0.2}
                    metalness={0.9}
                    emissive="#ffaa00"
                    emissiveIntensity={0.7}
                  />
                </mesh>
              </group>
            )
          })}
          
          {/* Outer decorative circle */}
          <mesh position={[0, 0, 0.62]}>
            <torusGeometry args={[0.15, 0.025, 12, 32]} />
            <meshStandardMaterial 
              color="#b8860b"
              roughness={0.3}
              metalness={0.8}
              emissive="#8b6914"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
      
      {/* Additional decorative circles between main flowers */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2 + Math.PI / 3
        const x = Math.cos(angle) * 1.35
        const z = Math.sin(angle) * 1.35
        return (
          <group key={`decoration-${i}`} position={[x, 0.15, z]} rotation={[0, angle, 0]}>
            {/* Center medallion */}
            <mesh position={[0, 0, 0.67]}>
              <cylinderGeometry args={[0.14, 0.14, 0.05, 32]} />
              <meshStandardMaterial 
                color="#ff8c00"
                roughness={0.25}
                metalness={0.85}
                emissive="#ff6347"
                emissiveIntensity={0.6}
              />
            </mesh>
            {/* Small circles around medallion */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => {
              const smallAngle = (j / 8) * Math.PI * 2
              const sx = Math.cos(smallAngle) * 0.1
              const sy = Math.sin(smallAngle) * 0.1
              return (
                <mesh key={j} position={[sx, sy, 0.69]}>
                  <sphereGeometry args={[0.025, 12, 12]} />
                  <meshStandardMaterial 
                    color="#ffd700"
                    metalness={0.95}
                    roughness={0.15}
                    emissive="#ffaa00"
                    emissiveIntensity={0.7}
                  />
                </mesh>
              )
            })}
          </group>
        )
      })}
      
      {/* Decorative base pattern - ornate scalloped edge */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const x = Math.cos(angle) * 1.25
        const z = Math.sin(angle) * 1.25
        return (
          <mesh key={`scallop-${i}`} position={[x, -0.05, z]} rotation={[Math.PI / 2, 0, angle]}>
            <coneGeometry args={[0.1, 0.2, 16]} />
            <meshStandardMaterial 
              color="#daa520"
              roughness={0.25}
              metalness={0.85}
              emissive="#b8860b"
              emissiveIntensity={0.45}
            />
          </mesh>
        )
      })}
      
      {/* Pedestal base - more ornate */}
      <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
        <cylinderGeometry args={[1.1, 1.4, 0.5, 64]} />
        <meshStandardMaterial 
          color="#6b1a1a"
          roughness={0.35}
          metalness={0.4}
          emissive="#4a0d0d"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Pedestal decorative rings */}
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[1.15, 0.06, 16, 64]} />
        <meshStandardMaterial 
          color="#daa520"
          roughness={0.25}
          metalness={0.85}
          emissive="#b8860b"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Bottom base ring */}
      <mesh position={[0, -0.63, 0]}>
        <torusGeometry args={[1.35, 0.1, 16, 64]} />
        <meshStandardMaterial 
          color="#cd9b1d"
          roughness={0.25}
          metalness={0.9}
          emissive="#b8860b"
          emissiveIntensity={0.35}
        />
      </mesh>
      
      {/* Decorative patterns on pedestal */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const x = Math.cos(angle) * 1.2
        const z = Math.sin(angle) * 1.2
        return (
          <mesh key={`pedestal-dec-${i}`} position={[x, -0.4, z]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.08, 0.15, 0.04]} />
            <meshStandardMaterial 
              color="#ffd700"
              roughness={0.2}
              metalness={0.9}
              emissive="#ffaa00"
              emissiveIntensity={0.5}
            />
          </mesh>
        )
      })}
      
      {/* Ground shadow plate - rangoli style */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.0, 64]} />
        <meshStandardMaterial 
          color="#f5deb3"
          roughness={0.9}
          metalness={0.05}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Rangoli-style decoration on ground */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 1.6
        const z = Math.sin(angle) * 1.6
        return (
          <mesh key={`rangoli-${i}`} position={[x, -0.69, z]} rotation={[-Math.PI / 2, 0, angle]}>
            <circleGeometry args={[0.15, 16]} />
            <meshStandardMaterial 
              color={['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d9de0', '#e15f89', '#bb6bd9', '#ff8c42', '#ff6b9d'][i]}
              roughness={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        )
      })}
      
      {/* Wick holder */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.09, 0.07, 0.2, 16]} />
        <meshStandardMaterial 
          color="#2c1810"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Wick - braided texture */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 12]} />
        <meshStandardMaterial 
          color="#1a0f08"
          roughness={0.95}
        />
      </mesh>
      
      {/* Wick tip (burnt) */}
      <mesh position={[0, 1.13, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial 
          color="#0a0604"
          roughness={1}
          emissive="#ff4500"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

export default Diya
