import React, { useState } from 'react'
import { useControls, button, folder } from 'leva'

function SceneControls({ 
  onAddDiya, 
  onBalloonPositionChange, 
  onFirecrackerToggle,
  balloonCount,
  diyaCount 
}) {
  
  // Main scene controls
  const sceneSettings = useControls('Scene Settings', {
    'Add New Diya': button(() => onAddDiya()),
    'Diya Count': {
      value: diyaCount,
      editable: false
    },
    'Show Firecrackers': {
      value: true,
      onChange: (v) => onFirecrackerToggle(v)
    },
    'Firecracker Count': {
      value: 6,
      min: 0,
      max: 20,
      step: 1
    }
  })
  
  // Balloon controls
  const balloonSettings = useControls('Hot Air Balloons', {
    'Balloon 1': folder({
      'Position X': { value: -6, min: -15, max: 15, step: 0.5 },
      'Position Y': { value: -3, min: -10, max: 5, step: 0.5 },
      'Position Z': { value: -4, min: -20, max: 0, step: 0.5 },
      'Color': '#ff6b9d'
    }),
    'Balloon 2': folder({
      'Position X': { value: 5, min: -15, max: 15, step: 0.5 },
      'Position Y': { value: -4, min: -10, max: 5, step: 0.5 },
      'Position Z': { value: -6, min: -20, max: 0, step: 0.5 },
      'Color': '#4834df'
    }),
    'Balloon 3': folder({
      'Position X': { value: -8, min: -15, max: 15, step: 0.5 },
      'Position Y': { value: -5, min: -10, max: 5, step: 0.5 },
      'Position Z': { value: -8, min: -20, max: 0, step: 0.5 },
      'Color': '#ffa502'
    }),
    'Balloon 4': folder({
      'Position X': { value: 7, min: -15, max: 15, step: 0.5 },
      'Position Y': { value: -2, min: -10, max: 5, step: 0.5 },
      'Position Z': { value: -5, min: -20, max: 0, step: 0.5 },
      'Color': '#00d2d3'
    })
  })
  
  // Camera controls
  const cameraSettings = useControls('Camera', {
    'Field of View': { value: 60, min: 30, max: 120, step: 5 },
    'Auto Rotate': false,
    'Rotation Speed': { value: 0.5, min: 0.1, max: 2, step: 0.1 }
  })
  
  // Lighting controls
  const lightingSettings = useControls('Lighting', {
    'Ambient Intensity': { value: 0.3, min: 0, max: 1, step: 0.1 },
    'Flame Intensity': { value: 2.5, min: 0, max: 5, step: 0.1 },
    'Directional Intensity': { value: 0.5, min: 0, max: 2, step: 0.1 }
  })
  
  return {
    sceneSettings,
    balloonSettings,
    cameraSettings,
    lightingSettings
  }
}

export default SceneControls

