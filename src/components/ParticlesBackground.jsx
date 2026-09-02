import { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function ParticlesBackground() {
  const { particlesEnabled } = useLanguage()
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!particlesEnabled) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Mouse tracker
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 130,
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Particle class
    const particleCount = Math.min(Math.floor((width * height) / 18000), 70)
    const particles = []

    const colors = [
      'rgba(56, 189, 248, ',  // sky 400
      'rgba(14, 165, 233, ',  // sky 500
      'rgba(2, 132, 199, ',   // sky 600
      'rgba(59, 130, 246, ',  // blue 500
      'rgba(99, 102, 241, ',  // indigo 500
    ]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        baseRadius: Math.random() * 2 + 1,
        radius: Math.random() * 2 + 1,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Natural drift
        p.x += p.vx
        p.y += p.vy

        // Screen boundary wrap
        if (p.x < 0) p.x = width
        else if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        else if (p.y > height) p.y = 0

        // Mouse repulsion
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius
          const angle = Math.atan2(dy, dx)
          p.x -= Math.cos(angle) * force * 3
          p.y -= Math.sin(angle) * force * 3
        }

        // Gentle radius pulse
        p.pulseVal += p.pulseSpeed
        const currentRadius = p.baseRadius + Math.sin(p.pulseVal) * 0.6

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(currentRadius, 0.6), 0, Math.PI * 2)
        ctx.fillStyle = `${p.colorPrefix}${p.alpha})`
        ctx.shadowBlur = 8
        ctx.shadowColor = `${p.colorPrefix}0.8)`
        ctx.fill()
        ctx.shadowBlur = 0

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const djx = p.x - p2.x
          const djy = p.y - p2.y
          const d = Math.sqrt(djx * djx + djy * djy)

          if (d < 110) {
            const lineAlpha = (1 - d / 110) * 0.18
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`
            ctx.lineWidth = 0.75
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particlesEnabled])

  if (!particlesEnabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
      aria-hidden="true"
    />
  )
}
