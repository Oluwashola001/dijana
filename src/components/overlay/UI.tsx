import React from 'react'

interface UIProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

export function UI({ isDark, setIsDark }: UIProps) {
  return (
    <div className="absolute top-10 right-10 z-50">
      <button 
        onClick={() => setIsDark(!isDark)}
        className="bg-transparent border-none p-0 text-5xl cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none"
        title={isDark ? "Switch to Day" : "Switch to Night"}
      >
        {isDark ? "🌙" : "☀️"}
      </button>
    </div>
  )
}