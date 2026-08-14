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
  isDark: boolean // Added the new prop here
}

export function WorkDetails({ work, onClose, visible, isDark }: WorkDetailsProps) {

  // Dynamic theme colors based on isDark state
  const theme = {
    backdrop: isDark ? 'rgba(5, 5, 16, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    cardBg: isDark ? '#0a0a0a' : '#ffffff',
    title: isDark ? 'white' : '#002244',
    text: isDark ? '#9ca3af' : '#4b5563', // gray-400 vs gray-600
    year: isDark ? '#fbbf24' : '#d97706', // amber-400 vs amber-600
    btnBg: isDark ? 'white' : '#002244',
    btnText: isDark ? 'black' : 'white',
    closeBg: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
    closeColor: isDark ? 'white' : '#002244',
    closeBorder: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
    shadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : '0 25px 50px -12px rgba(0, 34, 68, 0.15)',
  }

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
          {/* BACKDROP */}
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
              position: 'fixed', inset: 0, backgroundColor: theme.backdrop, 
              backdropFilter: 'blur(16px)', zIndex: 0,
              transition: 'background-color 0.5s ease'
            }}
            onClick={onClose}
          />

          {/* CENTERING WRAPPER */}
          <div style={{ 
            display: 'flex', minHeight: '100%', alignItems: 'center', 
            justifyContent: 'center', position: 'relative', zIndex: 10, padding: '24px 0' 
          }}>

            {/* MODAL CARD */}
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
                width: '100%', maxWidth: '1000px', backgroundColor: theme.cardBg, 
                borderRadius: '24px', overflow: 'hidden',
                display: 'flex', flexWrap: 'wrap', 
                boxShadow: theme.shadow,
                position: 'relative',
                transition: 'background-color 0.5s ease, box-shadow 0.5s ease'
              }}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                style={{ 
                  position: 'absolute', top: '16px', right: '16px', zIndex: 20, 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  backgroundColor: theme.closeBg, color: theme.closeColor, 
                  border: `1px solid ${theme.closeBorder}`, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                  transition: 'all 0.3s ease'
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
                <span style={{ 
                  color: theme.year, fontSize: '13px', letterSpacing: '0.2em', 
                  textTransform: 'uppercase', marginBottom: '16px', display: 'block', 
                  fontWeight: 600, transition: 'color 0.5s ease' 
                }}>
                  {work.year}
                </span>

                <h2 style={{ 
                  color: theme.title, fontSize: '2.5rem', marginBottom: '24px', 
                  lineHeight: '1.1', fontFamily: 'serif', transition: 'color 0.5s ease' 
                }}>
                  {work.title}
                </h2>

                <p style={{ 
                  color: theme.text, lineHeight: '1.7', marginBottom: '40px', 
                  fontSize: '1.05rem', fontWeight: 300, transition: 'color 0.5s ease' 
                }}>
                  {work.description}
                </p>

                <div>
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ 
                      display: 'inline-block', backgroundColor: theme.btnBg, color: theme.btnText, 
                      padding: '16px 36px', borderRadius: '9999px', textDecoration: 'none', 
                      fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.2em', 
                      textTransform: 'uppercase', transition: 'all 0.5s ease' 
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