import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  
  // Lock the background canvas from scrolling when the modal is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && work && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            zIndex: 9999, overflowY: 'auto', padding: '16px' 
          }}
        >
          {/* BACKDROP: Delayed by 0.5s on enter, closes instantly on exit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1, 
              transition: { duration: 0.8, delay: 0.5 } 
            }}
            exit={{ 
              opacity: 0, 
              transition: { duration: 0.3, delay: 0 } 
            }}
            style={{ 
              position: 'fixed', inset: 0, backgroundColor: 'rgba(5, 5, 16, 0.85)', 
              backdropFilter: 'blur(16px)', zIndex: 0 
            }}
            onClick={onClose}
          />

          {/* CENTERING WRAPPER */}
          <div style={{ 
            display: 'flex', minHeight: '100%', alignItems: 'center', 
            justifyContent: 'center', position: 'relative', zIndex: 10, padding: '24px 0' 
          }}>
            
            {/* MODAL CARD: Delayed by 1.0s to sync with GSAP camera landing */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ 
                opacity: 1, y: 0, scale: 1, 
                transition: { duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] } 
              }}
              exit={{ 
                opacity: 0, y: 20, scale: 0.95, 
                transition: { duration: 0.3, delay: 0, ease: "easeIn" } 
              }}
              style={{ 
                width: '100%', maxWidth: '1000px', backgroundColor: '#0a0a0a', 
                borderRadius: '24px', overflow: 'hidden',
                display: 'flex', flexWrap: 'wrap', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                position: 'relative'
              }}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                style={{ 
                  position: 'absolute', top: '16px', right: '16px', zIndex: 20, 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', 
                  border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                ✕
              </button>

              {/* LEFT COLUMN: Image Area */}
              <div style={{ 
                flex: '1 1 350px', position: 'relative', minHeight: '350px', backgroundColor: '#000'
              }}>
                <img
                  src={work.image}
                  alt={work.title}
                  style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                    objectFit: 'cover', display: 'block' 
                  }}
                />
              </div>

              {/* RIGHT COLUMN: Typography & Content */}
              <div style={{ 
                flex: '1 1 400px', padding: '40px 32px', display: 'flex', 
                flexDirection: 'column', justifyContent: 'center' 
              }}>
                <span style={{ color: '#fbbf24', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px', display: 'block', fontWeight: 600 }}>
                  {work.year}
                </span>
                
                <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '24px', lineHeight: '1.1', fontFamily: 'serif' }}>
                  {work.title}
                </h2>
                
                <p style={{ color: '#9ca3af', lineHeight: '1.7', marginBottom: '40px', fontSize: '1.05rem', fontWeight: 300 }}>
                  {work.description}
                </p>
                
                <div>
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ 
                      display: 'inline-block', backgroundColor: 'white', color: 'black', 
                      padding: '16px 36px', borderRadius: '9999px', textDecoration: 'none', 
                      fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.2em', 
                      textTransform: 'uppercase' 
                    }}
                  >
                    Listen Now
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}