/*
Model Information:
* Loading: /models/scene.gltf
* Manually linking textures to ensure they load
*/

import * as THREE from 'three'
import React, { useLayoutEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'

export function Model(props: React.JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF('/models/scene.gltf')

  const leafTexture = useTexture('/models/textures/Buddleia_Shrub_Material_diffuse.png')
  const barkTexture = useTexture('/models/textures/Elder_Tree_Texture_diffuse.png')
  
  leafTexture.colorSpace = THREE.SRGBColorSpace
  leafTexture.flipY = false 
  barkTexture.colorSpace = THREE.SRGBColorSpace
  barkTexture.flipY = false

  useLayoutEffect(() => {
    scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh
        const material = mesh.material as THREE.MeshStandardMaterial

        // 1. LEAVES (Lighter/Brighter)
        if (material.name.includes('Buddleia')) {
            material.map = leafTexture 
            material.transparent = true
            material.alphaTest = 0.5 
            material.side = THREE.DoubleSide
            material.color = new THREE.Color('white') 
            material.roughness = 0.5
            material.needsUpdate = true
        }

        // 2. TRUNK (Back to Original)
        if (material.name.includes('Elder')) {
            material.map = barkTexture 
            material.roughness = 0.9
            
            // RESET TO WHITE: This removes the "Charcoal" tint and shows the original bark colors
            material.color = new THREE.Color('white') 
            
            material.needsUpdate = true
        }
      }
    })
  }, [scene, leafTexture, barkTexture])

  return (
    <primitive object={scene} scale={[1, 1, 1]} {...props} />
  )
}

useGLTF.preload('/models/scene.gltf')