import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useControls, button, folder } from 'leva'
import Diya from './components/Diya'
import Flame from './components/Flame'
import Galaxy from './components/Galaxy'
import CameraAnimation from './components/CameraAnimation'
import HotAirBalloon from './components/HotAirBalloon'
import Firecracker from './components/Firecracker'
import './App.css'

function App() {
  const [diyas, setDiyas] = useState([{ id: 0, position: [0, 0, 0] }])
  const [showFirecrackers, setShowFirecrackers] = useState(true)
  const [showInstructions, setShowInstructions] = useState(true)
  
  // Scene controls
  const sceneSettings = useControls('🎆 Scene Controls', {
    '➕ Add Diya': button(() => {
      const newDiya = {
        id: Date.now(),
        position: [
          (Math.random() - 0.5) * 8,
          0,
          (Math.random() - 0.5) * 8
        ]
      }
      setDiyas([...diyas, newDiya])
    }),
    'Diya Count': {
      value: diyas.length,
      editable: false
    },
    '🔥 Reset Diyas': button(() => {
      setDiyas([{ id: 0, position: [0, 0, 0] }])
    }),
    'Show Firecrackers': {
      value: showFirecrackers,
      onChange: (v) => setShowFirecrackers(v)
    },
    'Firecracker Count': { value: 6, min: 0, max: 15, step: 1 }
  })
  
  // Balloon controls
  const balloon1 = useControls('🎈 Balloon 1', {
    position: { value: [-6, -3, -4], step: 0.5 },
    color: '#ff6b9d',
    speed: { value: 0.8, min: 0.5, max: 1.5, step: 0.1 }
  })
  
  const balloon2 = useControls('🎈 Balloon 2', {
    position: { value: [5, -4, -6], step: 0.5 },
    color: '#4834df',
    speed: { value: 1.0, min: 0.5, max: 1.5, step: 0.1 }
  })
  
  const balloon3 = useControls('🎈 Balloon 3', {
    position: { value: [-8, -5, -8], step: 0.5 },
    color: '#ffa502',
    speed: { value: 0.9, min: 0.5, max: 1.5, step: 0.1 }
  })
  
  const balloon4 = useControls('🎈 Balloon 4', {
    position: { value: [7, -2, -5], step: 0.5 },
    color: '#00d2d3',
    speed: { value: 1.1, min: 0.5, max: 1.5, step: 0.1 }
  })
  
  // Camera controls
  const cameraSettings = useControls('📷 Camera', {
    'Field of View': { value: 60, min: 30, max: 120, step: 5 },
    'Auto Rotate': false,
    'Rotation Speed': { value: 0.5, min: 0.1, max: 2, step: 0.1 }
  })
  
  // Lighting controls
  const lightingSettings = useControls('💡 Lighting', {
    'Ambient': { value: 0.3, min: 0, max: 1, step: 0.05 },
    'Flame': { value: 2.5, min: 0, max: 5, step: 0.1 },
    'Directional': { value: 0.5, min: 0, max: 2, step: 0.1 }
  })
  
  return (
    <div className="app-container">
      <div className="title">
        <h1>✨ Happy Diwali 2024 ✨</h1>
        <p className="subtitle">Wishing you joy, prosperity & light</p>
      </div>
      
      {/* Interactive Instructions */}
      {showInstructions && (
        <div className="instructions">
          <button 
            className="close-button" 
            onClick={() => setShowInstructions(false)}
            aria-label="Close instructions"
          >
            ✕
          </button>
          <div className="instructions-header">
            <span>🖱️ Interactive Controls</span>
          </div>
          <div className="instructions-content">
            <div className="control-item">
              <span className="icon">🖱️</span>
              <span>Drag to rotate</span>
            </div>
            <div className="control-item">
              <span className="icon">🔍</span>
              <span>Scroll to zoom</span>
            </div>
            <div className="control-item">
              <span className="icon">👆</span>
              <span>Right-click to pan</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Show Instructions Button (when hidden) */}
      {!showInstructions && (
        <button 
          className="show-instructions-button"
          onClick={() => setShowInstructions(true)}
          aria-label="Show instructions"
        >
          ❓
        </button>
      )}
      
      <Canvas
        camera={{ position: [0, 1.5, 2], fov: cameraSettings['Field of View'] }}
        shadows
      >
        {/* Camera animation on load */}
        <CameraAnimation />
        
        {/* Ambient light for overall illumination */}
        <ambientLight intensity={lightingSettings['Ambient']} />
        
        {/* Point light from the flame */}
        <pointLight 
          position={[0, 1.5, 0]} 
          intensity={lightingSettings['Flame']} 
          color="#ff6b35" 
          distance={12}
          castShadow
        />
        
        {/* Directional light for better visibility */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={lightingSettings['Directional']} 
          castShadow
        />
        
        {/* Moving galaxy background */}
        <Galaxy />
        
        {/* Hot air balloons - controllable */}
        <HotAirBalloon position={balloon1.position} color={balloon1.color} delay={0} speed={balloon1.speed} />
        <HotAirBalloon position={balloon2.position} color={balloon2.color} delay={1.2} speed={balloon2.speed} />
        <HotAirBalloon position={balloon3.position} color={balloon3.color} delay={2.5} speed={balloon3.speed} />
        <HotAirBalloon position={balloon4.position} color={balloon4.color} delay={1.5} speed={balloon4.speed} />
        <HotAirBalloon position={[-4, -6, -10]} color="#ff4757" delay={3} speed={0.85} />
        <HotAirBalloon position={[9, -3.5, -7]} color="#c44569" delay={0.8} speed={0.95} />
        <HotAirBalloon position={[-10, -4.5, -12]} color="#ffd700" delay={2} speed={0.88} />
        <HotAirBalloon position={[3, -5.5, -9]} color="#6bcf7f" delay={1.8} speed={0.92} />
        
        {/* Firecrackers */}
        {showFirecrackers && Array.from({ length: sceneSettings['Firecracker Count'] }, (_, i) => {
          const angle = (i / sceneSettings['Firecracker Count']) * Math.PI * 2
          const radius = 8 + Math.random() * 4
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const colors = ['#ff6b9d', '#4834df', '#ffa502', '#00d2d3', '#ff4757', '#ffd700']
          return (
            <Firecracker 
              key={i}
              position={[x, 0, z]} 
              color={colors[i % colors.length]}
              delay={i * 0.5}
            />
          )
        })}
        
        {/* Multiple Diyas */}
        {diyas.map((diya) => (
          <group key={diya.id} position={diya.position}>
            <Diya />
            <Flame />
          </group>
        ))}
        
        {/* Ground plane */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -1, 0]} 
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#4a3f5c" 
            roughness={0.7} 
            metalness={0.3}
            emissive="#2d1f3d"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Enhanced Orbit Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
          autoRotate={cameraSettings['Auto Rotate']}
          autoRotateSpeed={cameraSettings['Rotation Speed']}
          rotateSpeed={0.8}
          zoomSpeed={1.2}
          panSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      <div className="footer">
        <div className="wish-card">
          <p className="main-wish">May this Festival of Lights illuminate your path to success and happiness!</p>
          <p className="sub-wish">Wishing you and your loved ones a blessed & prosperous Diwali ✨</p>
        </div>
      </div>
    </div>
  )
}

export default App

