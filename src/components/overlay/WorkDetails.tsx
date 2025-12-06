import React, { useEffect, useState } from 'react'

interface WorkDetailsProps {
  work: {
    title: string
    year: string
    description: string
    image: string
    link: string
  } | null
  onClose: () => void
  visible: boolean
}

export function WorkDetails({ work, onClose, visible }: WorkDetailsProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (visible) {
      setTimeout(() => setAnimate(true), 10)
    } else {
      setAnimate(false)
    }
  }, [visible])

  if (!work) return null

  return (
    <div 
      className={`
        fixed inset-0 z-[9999] w-screen h-screen overflow-y-auto
        transition-all duration-700 ease-[0.22,1,0.36,1]
        ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      
      {/* BACKGROUND IMAGE & OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img 
          src={work.image} 
          alt="background" 
          className={`
            w-full h-full object-cover transition-transform duration-[2s] ease-out
            ${animate ? 'scale-105 blur-md opacity-20' : 'scale-100 blur-none opacity-0'}
          `}
        />
        <div className="absolute inset-0 bg-[#010101]/95"></div>
      </div>

      {/* CLOSE BUTTON - Top Right - BRIGHT RED TO TEST */}
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 z-[10000] px-8 py-4 rounded-2xl bg-red-500 border-2 border-red-300 text-white text-base font-bold tracking-wider shadow-2xl hover:bg-red-600 hover:scale-110 transition-all duration-300"
      >
        ✕ CLOSE
      </button>

      {/* CONTENT CONTAINER - PUSHED DOWN WITH MOBILE PADDING */}
      <div className="relative z-10 w-full min-h-screen flex items-end justify-center pb-32 pt-40">
        <div className={`
          flex flex-col items-center text-center 
          px-6 md:px-20 
          py-20 md:py-0
          max-w-4xl
          transition-all duration-1000 delay-100 ease-out
          ${animate ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
        `}>
          
          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif text-white mb-10 leading-[0.9] tracking-tight drop-shadow-2xl">
            {work.title}
          </h1>

          {/* Description */}
          <div className="max-w-2xl mx-auto mb-16">
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light tracking-wide">
              {work.description}
            </p>
          </div>

          {/* Action Button */}
          <a 
            href={work.link} 
            target="_blank" 
            rel="noreferrer"
            className="group relative px-14 py-5 rounded-full overflow-hidden bg-white text-black transition-transform duration-300 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <span className="relative z-10 font-bold text-xs tracking-[0.3em] uppercase">Listen Now</span>
            <div className="absolute inset-0 bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
          </a>

        </div>
      </div>
    </div>
  )
}