import React from 'react'
import Image from 'next/image'

interface WorkDetailsProps {
  work: {
    title: string
    year: string
    description: string
    image: string // <--- Added Image Field
    link: string  // <--- Added Link Field (for the "Listen" button)
  } | null
  onClose: () => void
  visible: boolean
}

export function WorkDetails({ work, onClose, visible }: WorkDetailsProps) {
  if (!work) return null

  return (
    <div 
      className={`
        fixed inset-0 z-[100] flex flex-col items-center justify-center
        transition-all duration-1000 ease-in-out px-4
        ${visible ? 'bg-black/95 opacity-100 pointer-events-auto' : 'bg-transparent opacity-0 pointer-events-none'}
      `}
    >
      {/* BACKGROUND CLICK TO CLOSE */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* CONTENT CARD */}
      <div className={`
        relative max-w-4xl w-full max-h-[90vh] overflow-y-auto 
        bg-[#111] border border-white/10 rounded-2xl shadow-2xl
        flex flex-col md:flex-row
        transform transition-all duration-1000 delay-300
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}>
        
        {/* LEFT SIDE: IMAGE */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-900">
           {/* We use standard img for simplicity with dynamic paths, or Next Image if static */}
           <img 
             src={work.image} 
             alt={work.title} 
             className="w-full h-full object-cover opacity-80"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent md:bg-gradient-to-r"></div>
        </div>

        {/* RIGHT SIDE: TEXT */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col text-left">
            <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-2">
              {work.year}
            </h2>
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-6">
              {work.title}
            </h1>
            
            <div className="w-12 h-1 bg-blue-500 mb-6"></div>
            
            <p className="text-gray-300 leading-relaxed mb-8 font-light text-lg">
              {work.description}
            </p>

            <div className="mt-auto flex gap-4">
              {/* LISTEN BUTTON */}
              <a 
                href={work.link} 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-blue-200 transition-colors"
              >
                Listen / View
              </a>

              {/* CLOSE BUTTON */}
              <button 
                onClick={onClose}
                className="px-6 py-3 border border-white/30 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
        </div>

      </div>
    </div>
  )
}