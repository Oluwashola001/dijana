import React, { useState, useRef, useEffect } from 'react'

interface UIProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

export function UI({ isDark, setIsDark }: UIProps) {
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

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

  // A reusable premium glassmorphism style for both buttons
  const buttonStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)', // For Safari support
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    cursor: 'pointer',
    color: 'white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  }

  return (
    <>
      {/* Hidden Audio Player */}
      <audio ref={audioRef} src="/music.mp3" loop muted={isMuted} />

      {/* Fixed Controls Container on the Top Right */}
      <div style={{
        position: 'fixed',
        top: '30px',
        right: '30px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
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