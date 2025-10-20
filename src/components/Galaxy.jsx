import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Galaxy() {
  const galaxyRef = useRef()
  const particles1Ref = useRef()
  const particles2Ref = useRef()
  const particles3Ref = useRef()
  
  const particleCount = 5000
  
  // Create galaxy particles with different colors and positions
  const galaxyParticles = useMemo(() => {
    const positions1 = new Float32Array(particleCount * 3)
    const positions2 = new Float32Array(particleCount * 3)
    const positions3 = new Float32Array(particleCount * 3)
    const colors1 = new Float32Array(particleCount * 3)
    const colors2 = new Float32Array(particleCount * 3)
    const colors3 = new Float32Array(particleCount * 3)
    
    // Color palettes for different particle groups
    const colorPalette1 = [
      new THREE.Color('#ff6b9d'), // Pink
      new THREE.Color('#c44569'), // Dark pink
      new THREE.Color('#ffa502'), // Orange
    ]
    
    const colorPalette2 = [
      new THREE.Color('#4834df'), // Purple
      new THREE.Color('#6c5ce7'), // Light purple
      new THREE.Color('#00d2d3'), // Cyan
    ]
    
    const colorPalette3 = [
      new THREE.Color('#ffd700'), // Gold
      new THREE.Color('#ff6348'), // Red-orange
      new THREE.Color('#ff4757'), // Red
    ]
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Spiral galaxy formation
      const radius = Math.random() * 50
      const spinAngle = radius * 0.5
      const branchAngle = ((i % 3) / 3) * Math.PI * 2
      
      // Particle set 1 - outer spiral
      const angle1 = branchAngle + spinAngle
      positions1[i3] = Math.cos(angle1) * radius + (Math.random() - 0.5) * 5
      positions1[i3 + 1] = (Math.random() - 0.5) * 10
      positions1[i3 + 2] = Math.sin(angle1) * radius + (Math.random() - 0.5) * 5
      
      const color1 = colorPalette1[i % colorPalette1.length]
      colors1[i3] = color1.r
      colors1[i3 + 1] = color1.g
      colors1[i3 + 2] = color1.b
      
      // Particle set 2 - middle spiral
      const angle2 = branchAngle + spinAngle * 0.7
      positions2[i3] = Math.cos(angle2) * radius * 0.8 + (Math.random() - 0.5) * 4
      positions2[i3 + 1] = (Math.random() - 0.5) * 8
      positions2[i3 + 2] = Math.sin(angle2) * radius * 0.8 + (Math.random() - 0.5) * 4
      
      const color2 = colorPalette2[i % colorPalette2.length]
      colors2[i3] = color2.r
      colors2[i3 + 1] = color2.g
      colors2[i3 + 2] = color2.b
      
      // Particle set 3 - inner core
      const angle3 = branchAngle + spinAngle * 1.3
      positions3[i3] = Math.cos(angle3) * radius * 0.6 + (Math.random() - 0.5) * 3
      positions3[i3 + 1] = (Math.random() - 0.5) * 6
      positions3[i3 + 2] = Math.sin(angle3) * radius * 0.6 + (Math.random() - 0.5) * 3
      
      const color3 = colorPalette3[i % colorPalette3.length]
      colors3[i3] = color3.r
      colors3[i3 + 1] = color3.g
      colors3[i3 + 2] = color3.b
    }
    
    return {
      positions1,
      positions2,
      positions3,
      colors1,
      colors2,
      colors3
    }
  }, [])
  
  // Animate galaxy rotation
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = time * 0.05
    }
    
    if (particles1Ref.current) {
      particles1Ref.current.rotation.y = time * 0.02
      particles1Ref.current.rotation.z = Math.sin(time * 0.1) * 0.1
    }
    
    if (particles2Ref.current) {
      particles2Ref.current.rotation.y = time * 0.03
      particles2Ref.current.rotation.z = Math.cos(time * 0.15) * 0.1
    }
    
    if (particles3Ref.current) {
      particles3Ref.current.rotation.y = time * 0.04
      particles3Ref.current.rotation.z = Math.sin(time * 0.12) * 0.1
    }
  })
  
  return (
    <group ref={galaxyRef} position={[0, 0, -30]}>
      {/* Particle system 1 - Outer spiral (Pink/Orange) */}
      <points ref={particles1Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={galaxyParticles.positions1}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={galaxyParticles.colors1}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          sizeAttenuation
          transparent
          opacity={0.8}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Particle system 2 - Middle spiral (Purple/Cyan) */}
      <points ref={particles2Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={galaxyParticles.positions2}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={galaxyParticles.colors2}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          sizeAttenuation
          transparent
          opacity={0.7}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Particle system 3 - Inner core (Gold/Red) */}
      <points ref={particles3Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={galaxyParticles.positions3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={galaxyParticles.colors3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          sizeAttenuation
          transparent
          opacity={0.9}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Additional ambient glow spheres */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 30 + Math.random() * 10
        return (
          <mesh key={i} position={[
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 20,
            Math.sin(angle) * radius
          ]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial
              color={['#ff6b9d', '#4834df', '#ffd700', '#00d2d3', '#ff6348', '#c44569'][i]}
              transparent
              opacity={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default Galaxy

