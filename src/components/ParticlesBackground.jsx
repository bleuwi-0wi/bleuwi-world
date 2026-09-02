import { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function ParticlesBackground() {
  const { particlesEnabled } = useLanguage()
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!particlesEnabled) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId = null
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let isPaused = false

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // Page visibility optimization: freeze animation when tab is in background
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true
      } else {
        isPaused = false
        animate()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Mouse tracker
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 120,
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    // Optimized particle count: 36 particles provides beautiful constellation without lag
    const particleCount = Math.min(Math.floor((width * height) / 32000), 38)
    const particles = []

    const colors = [
      'rgba(56, 189, 248, ',  // sky 400
      'rgba(14, 165, 233, ',  // sky 500
      'rgba(2, 132, 199, ',   // sky 600
      'rgba(99, 102, 241, ',  // indigo 500
    ]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseRadius: Math.random() * 1.8 + 1,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.006,
        pulseVal: Math.random() * Math.PI * 2,
      })
    }

    const maxDist = 110
    const maxDistSq = maxDist * maxDist

    const animate = () => {
      if (isPaused) return

      ctx.clearRect(0, 0, width, height)

      // 1. Draw connection lines in batched path
      ctx.lineWidth = 0.75
      const pLen = particles.length

      for (let i = 0; i < pLen; i++) {
        const p1 = particles[i]

        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dSq = dx * dx + dy * dy

          if (dSq < maxDistSq) {
            const dist = Math.sqrt(dSq)
            const lineAlpha = (1 - dist / maxDist) * 0.16
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`
            ctx.stroke()
          }
        }
      }

      // 2. Update and draw particles (without expensive canvas shadowBlur)
      for (let i = 0; i < pLen; i++) {
        const p = particles[i]

        // Drift
        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < 0) p.x = width
        else if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        else if (p.y > height) p.y = 0

        // Mouse repulsion
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const distSq = dx * dx + dy * dy
        const mouseRadSq = mouse.radius * mouse.radius

        if (distSq < mouseRadSq && distSq > 0) {
          const dist = Math.sqrt(distSq)
          const force = (mouse.radius - dist) / mouse.radius
          const angle = Math.atan2(dy, dx)
          p.x -= Math.cos(angle) * force * 2.5
          p.y -= Math.sin(angle) * force * 2.5
        }

        // Pulse
        p.pulseVal += p.pulseSpeed
        const currentRadius = p.baseRadius + Math.sin(p.pulseVal) * 0.5

        // Outer soft glow ring
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentRadius + 1.8, 0, Math.PI * 2)
        ctx.fillStyle = `${p.colorPrefix}${p.alpha * 0.25})`
        ctx.fill()

        // Inner crisp star particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(currentRadius, 0.7), 0, Math.PI * 2)
        ctx.fillStyle = `${p.colorPrefix}${p.alpha})`
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [particlesEnabled])

  if (!particlesEnabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-65"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-hidden="true"
    />
  )
}
