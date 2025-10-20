import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function CameraAnimation() {
  const { camera } = useThree()
  const animationStarted = useRef(false)
  const startTime = useRef(0)
  const animationDuration = 3 // seconds
  
  // Initial and target camera positions
  const initialPosition = new THREE.Vector3(0, 1.5, 2)
  const targetPosition = new THREE.Vector3(0, 2, 12)
  
  useEffect(() => {
    // Set initial camera position (close to diya)
    camera.position.copy(initialPosition)
    camera.lookAt(0, 0.5, 0)
    startTime.current = Date.now()
    animationStarted.current = true
  }, [camera])
  
  useFrame(() => {
    if (animationStarted.current) {
      const elapsed = (Date.now() - startTime.current) / 1000
      const progress = Math.min(elapsed / animationDuration, 1)
      
      // Smooth easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3)
      
      // Interpolate camera position
      camera.position.lerpVectors(initialPosition, targetPosition, eased)
      camera.lookAt(0, 0.5, 0)
      
      // Stop animation after completion
      if (progress >= 1) {
        animationStarted.current = false
      }
    }
  })
  
  return null
}

export default CameraAnimation

