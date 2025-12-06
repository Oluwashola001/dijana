'use client'

import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Sparkles, SpotLight, Html, Text, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing' 
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { Model as Tree } from '../src/components/canvas/Tree'
import { UI } from '../src/components/overlay/UI' 
import { WorkDetails } from '../src/components/overlay/WorkDetails'
import { Water } from 'three-stdlib'
import gsap from 'gsap'

extend({ Water })

// --- RESTORED: Original positions close to the tree ---
const worksData = [
  { 
    id: 0,
    title: "Roots & Blossoms", 
    year: "2014", 
    position: [0, -2.5, 0.8], // Close to tree
    image: "/works/fruit1.webp",
    link: "http://www.dijana-boskovic.com/en/disk.htm",
    description: "An extraordinary mixture of folk and classical music. How do a Sarabande of Johann Sebastian Bach and ancient Serbian-Macedonian folk songs come together? Arrangements by Dijana Bošković enhance time and space. Featuring: Dijana Bošković (flutes, bowls), Marina Djordjevic-Koch (alto flute), Georg Müller (bowls)." 
  },
  { 
    id: 1,
    title: "Songs Of Joy", 
    year: "2005", 
    position: [-1.2, -0.5, 1.0], 
    image: "/works/fruit2.webp",
    link: "http://www.dijana-boskovic.com/en/disk.htm",
    description: "Modern jazz with nice arrangement and sounds. 'I heard Dijana Bošković at a classical concert in the Gasteig in 1999... We did one rehearsal, and then went into the studio three weeks later.' Featuring Paulo Cardoso (bass/vocal), Dijana Bošković (flute), and full band." 
  },
  { 
    id: 2,
    title: "Mouse & Monsters", 
    year: "2010", 
    position: [1.5, 0.5, 0.5], 
    image: "/works/fruit3.webp",
    link: "http://www.dijana-boskovic.com/en/disk.htm",
    description: "Mini opera for children. What can Gil Gama's mouse do against mythological creatures such as the sphinx lion or the Minotaur? A whole lot of! Author: Rudolf Herfurtner, Music: Helga Pogachar, Musical direction: Dijana Bošković." 
  },
  { 
    id: 3,
    title: "Inanna", 
    year: "2003", 
    position: [-1.0, 1.8, 0.8], 
    image: "/works/fruit4.webp",
    link: "http://www.dijana-boskovic.com/en/disk.htm",
    description: "Listening cinema of the Sumerian census 'Inanna's Gang to the Underworld'. Text: Karoly Koller, Music: Helga Pogatschar. Featuring voices of Claudia Matussek, Bettina Koziol, Merit Ostermann. Flutes by Dijana Bošković." 
  },
  { 
    id: 4,
    title: "Encounters", 
    year: "2013", 
    position: [0.2, 3.0, 0.5], 
    image: "/works/fruit5.webp",
    link: "http://www.dijana-boskovic.com/en/disk.htm",
    description: "Chamber music. As flautist and artistic director of the Versus Vox Ensemble, Dijana Bošković presents her works. Classical and unusual instrumentations show a broad spectrum of musical ideas and sound combinations." 
  },
]

function CameraRig({ focusedWork, isDark }: { focusedWork: number | null, isDark: boolean }) {
  const { camera, controls } = useThree()
  
  useEffect(() => {
    // @ts-ignore
    if (!controls) return;

    if (focusedWork !== null) {
      const targetFruit = worksData[focusedWork]
      const fruitPos = new THREE.Vector3(...targetFruit.position as [number, number, number])
      // Zoom offset: Stay 3 units away
      const offset = new THREE.Vector3(0, 0, 3.0) 
      const cameraTargetPos = fruitPos.clone().add(offset)

      gsap.to(camera.position, {
        x: cameraTargetPos.x,
        y: cameraTargetPos.y,
        z: cameraTargetPos.z,
        duration: 1.5,
        ease: "power3.inOut"
      })

      // @ts-ignore
      if (controls.target) {
        // @ts-ignore
        gsap.to(controls.target, {
            x: fruitPos.x,
            y: fruitPos.y,
            z: fruitPos.z,
            duration: 1.5,
            ease: "power3.inOut"
        })
      }

    } else {
      gsap.to(camera.position, {
        x: 0,
        y: 1.5,
        z: 8.5,
        duration: 1.5,
        ease: "power3.inOut"
      })
      
      // @ts-ignore
      if (controls.target) {
          // @ts-ignore
          gsap.to(controls.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.5,
            ease: "power3.inOut"
          })
      }
    }
  }, [focusedWork, camera, controls])

  return null
}

function WorksNodes({ isDark, setFocusedWork }: { isDark: boolean, setFocusedWork: (id: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null)

  const handleClick = (e: any, index: number) => {
    e.stopPropagation()
    setFocusedWork(index)
  }

  return (
    <group>
      {worksData.map((work, index) => (
        <group key={index} position={new THREE.Vector3(...work.position as [number, number, number])}>
          
          {/* TITLE LABEL - NOW CLICKABLE & SMALLER */}
          <Text
            position={[0, 0.35, 0]} // Close to fruit
            fontSize={0.15} // Small, elegant size
            color={isDark ? "#bde0ff" : "#002244"} 
            outlineWidth={0.02}
            outlineColor={isDark ? "#000000" : "#ffffff"}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            
            // CLICK LOGIC ADDED HERE
            onClick={(e) => handleClick(e, index)}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(index) }} 
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(null) }}
          >
            {work.title}
          </Text>

          {/* THE FRUIT SPHERE - ALSO CLICKABLE */}
          <mesh 
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(index) }} 
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(null) }}
            onClick={(e) => handleClick(e, index)}
          >
            <sphereGeometry args={[0.25, 32, 32]} /> {/* Moderate Size */}
            <meshStandardMaterial 
              color={isDark ? "#88ccff" : "#ffaa00"} 
              emissive={isDark ? "#88ccff" : "#ffaa00"}
              emissiveIntensity={hovered === index ? 3 : 1} 
              toneMapped={false}
            />
          </mesh>

          {/* HOVER YEAR LABEL */}
          <Html distanceFactor={10} center pointerEvents="none">
            <div 
              className={`
                transition-all duration-300 w-32 text-center
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
  const [isDark, setIsDark] = useState(true)
  const [focusedWork, setFocusedWork] = useState<number | null>(null)

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

      <WorkDetails 
        work={focusedWork !== null ? worksData[focusedWork] : null} 
        visible={focusedWork !== null}
        onClose={() => setFocusedWork(null)} 
      />

      <Canvas 
        gl={{ antialias: false }} 
        dpr={[1, 1.5]} 
        shadows 
      >
        <PerspectiveCamera makeDefault position={[0, 1.5, 8.5]} fov={45} />
        
        <CameraRig focusedWork={focusedWork} isDark={isDark} />

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
          
          <WorksNodes isDark={isDark} setFocusedWork={setFocusedWork} />

          <Sparkles count={200} scale={[10, 15, 10]} position={[0, 5, 0]} size={4} speed={0.4} opacity={0.6} color={colors.sparkles} />
          <Environment preset={isDark ? "night" : "sunset"} blur={1} background={false} /> 
        </Suspense>

        {/* @ts-ignore */}
        <EffectComposer disableNormalPass>
          {/* @ts-ignore */}
          <Bloom luminanceThreshold={isDark ? 0.5 : 0.9} mipmapBlur intensity={isDark ? 1.5 : 0.8} radius={0.5} />
        </EffectComposer>

        <OrbitControls 
           makeDefault 
           enableZoom={false} 
           enablePan={false}
           minPolarAngle={Math.PI / 2.2} 
           maxPolarAngle={Math.PI / 2}
           autoRotate={focusedWork === null} 
           autoRotateSpeed={0.2} 
           enabled={focusedWork === null}
        />
      </Canvas>
    </main>
  )
}