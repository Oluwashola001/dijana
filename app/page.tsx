'use client'

import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, Environment, Sparkles, SpotLight, Html, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing' 
import { Suspense, useRef, useMemo, useState } from 'react'
import { Model as Tree } from '../src/components/canvas/Tree'
import { UI } from '../src/components/overlay/UI' 
import { Water } from 'three-stdlib'

extend({ Water })

const worksData = [
  { title: "Roots & Blossoms", year: "2014", position: [0, -2.5, 0.8] },   
  { title: "Songs Of Joy and Gratitude", year: "2005", position: [-1.2, -0.5, 1.0] },  
  { title: "Mouse and Monsters", year: "2010", position: [1.5, 0.5, 0.5] },    
  { title: "Inanna", year: "2003", position: [-1.0, 1.6, 0.8] },    
  { title: "Encounters", year: "2013", position: [0.2, 2.5, 0.5] },    
]

function WorksNodes({ isDark }: { isDark: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <group>
      {worksData.map((work, index) => (
        <group key={index} position={new THREE.Vector3(...work.position)}>
          
          {/* 1. THE FLOATING TITLE (Improved Visibility) */}
          <Text
            position={[0, 0.4, 0]} 
            fontSize={0.15} 
            // COLOR LOGIC: Light Blue in Dark Mode / Deep Navy in Day Mode
            color={isDark ? "#bde0ff" : "#002244"} 
            
            // OUTLINE LOGIC: Dark outline in Night / White outline in Day
            // This ensures it is ALWAYS visible against leaves or sky
            outlineWidth={0.02}
            outlineColor={isDark ? "#000000" : "#ffffff"}
            
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            {work.title}
          </Text>

          {/* 2. THE GLOWING ORB */}
          <mesh 
            onPointerOver={() => setHovered(index)} 
            onPointerOut={() => setHovered(null)}
            onClick={(e) => {
              e.stopPropagation() 
              window.open('http://www.dijana-boskovic.com/en/disk.htm', '_blank')
            }}
            className="cursor-pointer"
          >
            <sphereGeometry args={[0.2, 32, 32]} /> 
            <meshStandardMaterial 
              color={isDark ? "#88ccff" : "#ffaa00"} 
              emissive={isDark ? "#88ccff" : "#ffaa00"}
              emissiveIntensity={hovered === index ? 3 : 1} 
              toneMapped={false}
            />
            
            {/* 3. THE NUMBER */}
            <Text
              position={[0, 0, 0.21]} 
              fontSize={0.15}
              color={isDark ? "#000000" : "#ffffff"} 
              anchorX="center"
              anchorY="middle"
            >
              {index + 1}
            </Text>
          </mesh>

          {/* 4. THE HOVER CARD */}
          <Html distanceFactor={10} center>
            <div 
              className={`
                pointer-events-none transition-all duration-300 w-32 text-center
                ${hovered === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              <div className={`
                backdrop-blur-md border border-white/20 px-2 py-1 rounded shadow-xl mt-4
                ${isDark ? 'bg-black/80 text-blue-100' : 'bg-white/90 text-gray-900'}
              `}>
                <p className="text-xs font-bold">{work.year}</p>
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

function FlowingRiver({ isDark }: { isDark: boolean }) {
  const ref = useRef<any>(null)
  
  const waterNormals = useMemo(() => new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/waternormals.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  }), [])

  const geom = useMemo(() => new THREE.PlaneGeometry(100, 100), [])
  const config = useMemo(() => ({
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: isDark ? 0x000510 : 0x004a4a, 
    distortionScale: 3.7,
    fog: false,
  }), [waterNormals, isDark])

  useFrame((state, delta) => {
    if (ref.current && ref.current.material && ref.current.material.uniforms) {
        ref.current.material.uniforms['time'].value += delta * 0.5
    }
  })

  // @ts-ignore
  return <water ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]} args={[geom, config]} />
}

export default function Home() {
  const lightTarget = useRef(new THREE.Object3D())
  
  // CHANGED: Default is now TRUE (Dark Mode first)
  const [isDark, setIsDark] = useState(true)

  const colors = {
    bg: isDark ? "#050510" : "#aaccff",
    fog: isDark ? "#050510" : "#aaccff",
    ambient: isDark ? "#111122" : "#ffffff",
    light: isDark ? "#8899ff" : "#fff0dd",
    env: isDark ? "night" : "sunset",
    rayOpacity: isDark ? 0.2 : 0.6,
    sparkles: isDark ? "#8899ff" : "#fff0dd"
  }

  return (
    <main className="h-screen w-full relative bg-black">
      
      <UI isDark={isDark} setIsDark={setIsDark} />

      <Canvas 
        camera={{ position: [0, 1.5, 8.5], fov: 45 }}
        gl={{ antialias: false }} 
        dpr={[1, 1.5]} 
        shadows 
      >
        <color attach="background" args={[colors.bg]} />
        <fog attach="fog" args={[colors.fog, 5, 30]} />
        
        <ambientLight intensity={isDark ? 0.5 : 2.0} color={colors.ambient} /> 
        
        <group position={[0, -3, 0]}>
             <primitive object={lightTarget.current} />
        </group>

        <SpotLight
            position={[0, 15, 0]} 
            target={lightTarget.current} 
            angle={0.6} 
            attenuation={20} 
            anglePower={4} 
            intensity={isDark ? 100 : 300} 
            opacity={colors.rayOpacity} 
            color={colors.light} 
            castShadow
            volumetric 
            debug={false}
        />
        
        <pointLight position={[0, 5, 10]} intensity={isDark ? 2 : 10} color="#ffffff" />

        <Suspense fallback={null}>
          <Tree position={[0, -3, 0]} rotation={[0, 0.5, 0]} castShadow receiveShadow/>
          <FlowingRiver isDark={isDark} />
          
          <WorksNodes isDark={isDark} />

          <Sparkles count={200} scale={[10, 15, 10]} position={[0, 5, 0]} size={4} speed={0.4} opacity={0.6} color={colors.sparkles} />
          <Environment preset={isDark ? "night" : "sunset"} blur={1} background={false} /> 
        </Suspense>

        {/* @ts-ignore */}
        <EffectComposer disableNormalPass>
          {/* @ts-ignore */}
          <Bloom luminanceThreshold={isDark ? 0.5 : 0.9} mipmapBlur intensity={isDark ? 1.5 : 0.8} radius={0.5} />
        </EffectComposer>

        <OrbitControls 
           enableZoom={false} 
           enablePan={false}
           minPolarAngle={Math.PI / 2.2} 
           maxPolarAngle={Math.PI / 2}
           autoRotate 
           autoRotateSpeed={0.2} 
        />
      </Canvas>
    </main>
  )
}