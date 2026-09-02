import { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function CustomCursor() {
  const { customCursorEnabled } = useLanguage()
  const canvasRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    if (!customCursorEnabled) return

    // Don't activate on touch/coarse devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    document.body.classList.add('custom-cursor-active')

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const points = []
    const maxPoints = 22 // Optimized trail length
    let mouseX = -100
    let mouseY = -100
    let isMoving = false
    let idleTimer = null
    let animationFrameId = null
    let isRunning = false
    let isHovering = false

    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true
        animationFrameId = requestAnimationFrame(render)
      }
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Direct hardware-accelerated transform for tip
      if (tipRef.current) {
        tipRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
        if (tipRef.current.style.opacity !== '1') {
          tipRef.current.style.opacity = '1'
        }
      }

      points.push({ x: mouseX, y: mouseY })
      if (points.length > maxPoints) {
        points.shift()
      }

      isMoving = true
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        isMoving = false
      }, 50)

      // Fast single selector check instead of multiple sequential closest() lookups
      const target = e.target
      isHovering = Boolean(
        target &&
        target.closest &&
        target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer, .preview-link, .link-card')
      )

      startAnimation()
    }

    const handleMouseLeave = () => {
      if (tipRef.current) tipRef.current.style.opacity = '0'
      points.length = 0
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // When mouse is still, collapse trail smoothly
      if (!isMoving && points.length > 0) {
        points.shift()
      }

      const len = points.length
      if (len > 2) {
        // High-performance multi-pass trail (10x faster than canvas shadowBlur)
        // Pass 1: Neon Cyan Outer Glow
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        for (let i = 1; i < len; i++) {
          const p1 = points[i - 1]
          const p2 = points[i]
          const progress = i / len
          const alpha = progress * (isHovering ? 0.85 : 0.6)

          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.4})`
          ctx.lineWidth = isHovering ? (progress * 8 + 3) : (progress * 6 + 2)
          ctx.stroke()
        }

        // Pass 2: Sharp Bright Cyan Mid Line
        for (let i = 1; i < len; i++) {
          const p1 = points[i - 1]
          const p2 = points[i]
          const progress = i / len
          const alpha = progress * 0.95

          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`
          ctx.lineWidth = isHovering ? (progress * 3.5 + 1.2) : (progress * 2.5 + 0.8)
          ctx.stroke()
        }

        // Pass 3: Dark Obsidian Core Line
        for (let i = 1; i < len; i++) {
          const p1 = points[i - 1]
          const p2 = points[i]
          const progress = i / len

          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(3, 7, 18, ${progress * 0.9})`
          ctx.lineWidth = Math.max(progress * 1.5, 0.8)
          ctx.stroke()
        }
      }

      // Idle sleeping: Stop RAF when stationary & trail is cleared
      if (len === 0 && !isMoving) {
        isRunning = false
        return
      }

      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.body.classList.remove('custom-cursor-active')
      clearTimeout(idleTimer)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [customCursorEnabled])

  if (!customCursorEnabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* Hardware-accelerated Canvas for smooth glowing trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full pointer-events-none"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      />

      {/* Cursor Tip: Obsidian core with glowing cyan border */}
      <div
        ref={tipRef}
        className="fixed top-0 left-0 -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full transition-opacity duration-150 pointer-events-none opacity-0"
        style={{
          background: '#020617',
          border: '1.5px solid rgba(56, 189, 248, 0.95)',
          boxShadow: '0 0 10px rgba(56, 189, 248, 0.85), inset 0 0 3px rgba(14, 165, 233, 0.6)',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  )
}
