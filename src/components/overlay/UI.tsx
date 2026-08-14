import React, { useState, useRef, useEffect } from 'react'

interface UIProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

export function UI({ isDark, setIsDark }: UIProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Detect if the screen is mobile sized
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Start playing the muted audio as soon as the component loads
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Set a nice, comfortable background volume
      audioRef.current.play().catch(e => console.log("Browser waiting for user interaction:", e));
    }
  }, [])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      // If the browser blocked the initial muted autoplay, this forces it to play when unmuted
      if (audioRef.current.paused) {
        audioRef.current.play();
      }
    }
  }

  // Dynamic glassmorphism style based on screen size
  const buttonStyle: React.CSSProperties = {
    width: isMobile ? '45px' : '60px',      // Smaller on mobile
    height: isMobile ? '45px' : '60px',     // Smaller on mobile
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)', 
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '20px' : '28px',   // Smaller icon on mobile
    cursor: 'pointer',
    color: 'white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  }

  return (
    <>
      {/* Hidden Audio Player */}
      <audio ref={audioRef} src="/music.mp3" loop muted={isMuted} />

      {/* Fixed Controls Container */}
      <div style={{
        position: 'fixed',
        top: isMobile ? '20px' : '30px',    // Slightly tighter to the top edge on mobile
        right: isMobile ? '20px' : '30px',  // Slightly tighter to the right edge on mobile
        zIndex: 999,
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column', // Side-by-side on mobile, stacked on desktop
        gap: isMobile ? '12px' : '16px'             // Tighter spacing on mobile
      }}>
        
        {/* Day/Night Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          style={buttonStyle}
          title={isDark ? "Switch to Day" : "Switch to Night"}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'scale(1.1)'; 
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'scale(1)'; 
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
        >
          {isDark ? "🌙" : "☀️"}
        </button>

        {/* Music Mute/Unmute Toggle */}
        <button 
          onClick={toggleMute}
          style={buttonStyle}
          title={isMuted ? "Unmute Music" : "Mute Music"}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'scale(1.1)'; 
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'scale(1)'; 
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

      </div>
    </>
  )
}