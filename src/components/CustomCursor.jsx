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
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const points = []
    const maxPoints = 26 // Trail length for smooth line
    let mouseX = -100
    let mouseY = -100
    let isMoving = false
    let idleTimer = null
    let animationFrameId
    let isHovering = false

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Update cursor tip position
      if (tipRef.current) {
        tipRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
        tipRef.current.style.opacity = '1'
      }

      // Add point to trail
      points.push({ x: mouseX, y: mouseY, time: Date.now() })
      if (points.length > maxPoints) {
        points.shift()
      }

      isMoving = true
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        isMoving = false
      }, 70)

      // Hover check for interactive elements
      const target = e.target
      const isInteractive = Boolean(
        target &&
        (target.closest('a') ||
         target.closest('button') ||
         target.closest('input') ||
         target.closest('textarea') ||
         target.closest('[role="button"]') ||
         target.closest('.cursor-pointer') ||
         target.closest('.preview-link') ||
         target.closest('.link-card'))
      )
      isHovering = isInteractive
    }

    const handleMouseLeave = () => {
      if (tipRef.current) tipRef.current.style.opacity = '0'
      points.length = 0
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // When stationary, gradually collapse trail so it doesn't linger
      if (!isMoving && points.length > 0) {
        points.shift()
      }

      if (points.length > 2) {
        // Draw the smooth glowing line trail following mouse movement
        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1]
          const p2 = points[i]

          const progress = i / points.length // 0 at tail, 1 at cursor head
          const lineWidth = isHovering ? (progress * 5 + 1.2) : (progress * 3.6 + 0.8)
          const alpha = Math.min(progress * 0.9, 0.95)

          // 1. Glowing outer line (neon cyan / sky blue glow)
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`
          ctx.lineWidth = lineWidth
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.shadowBlur = isHovering ? 14 : 9
          ctx.shadowColor = 'rgba(14, 165, 233, 0.85)'
          ctx.stroke()

          // 2. Inner dark blue & black core line
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(3, 7, 18, ${alpha * 0.95})`
          ctx.lineWidth = Math.max(lineWidth * 0.45, 0.9)
          ctx.shadowBlur = 0
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.body.classList.remove('custom-cursor-active')
      cancelAnimationFrame(animationFrameId)
    }
  }, [customCursorEnabled])

  if (!customCursorEnabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* HTML5 Canvas for smooth glowing line trailing */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full pointer-events-none"
      />

      {/* Cursor Tip: Black and Dark Blue core with smooth cyan outline */}
      <div
        ref={tipRef}
        className="fixed top-0 left-0 -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full transition-opacity duration-150 pointer-events-none opacity-0"
        style={{
          background: '#020617', // Obsidian dark black
          border: '1.5px solid rgba(56, 189, 248, 0.95)', // Glowing cyan outline
          boxShadow: '0 0 10px rgba(56, 189, 248, 0.85), inset 0 0 3px rgba(14, 165, 233, 0.6)',
        }}
      />
    </div>
  )
}
