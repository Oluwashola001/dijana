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

        if (material.name.includes('Buddleia')) {
            material.map = leafTexture 
            material.transparent = true
            material.alphaTest = 0.5 
            material.side = THREE.DoubleSide
            material.color = new THREE.Color('#ffffff') 
            material.roughness = 0.5
            material.needsUpdate = true
        }

        if (material.name.includes('Elder')) {
            material.map = barkTexture 
            material.roughness = 0.9
            material.color = new THREE.Color('#ffffff')
            material.needsUpdate = true
        }
      }
    })
  }, [scene, leafTexture, barkTexture])

  return (
    // We add raycast={() => null} here? No, we add it to the primitive.
    // Actually, primitive passes props down, but let's be safe.
    // The easiest way to make the whole tree ignored is wrapping it or setting pointerEvents="none" on the container in the parent.
    // But since we are here, we can tell the scene graph to ignore raycasts.
    
    <primitive 
      object={scene} 
      scale={[1, 1, 1]} 
      {...props} 
      // THIS IS THE FIX:
      // This tells Three.js: "Don't check this object for clicks."
      // This allows the click to pass through leaves and hit the fruits inside.
      onPointerOver={null} 
      onPointerOut={null}
      onPointerMove={null}
      raycast={() => null} 
    />
  )
}

useGLTF.preload('/models/scene.gltf')