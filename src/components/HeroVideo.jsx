import { useEffect, useRef } from 'react'
import bleuwiIntro from '../assets/bleuwi-intro.mp4'

export default function HeroVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="hero-video-frame">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="BLEUWI official intro video"
      >
        <source src={bleuwiIntro} type="video/mp4" />
        Your browser does not support this video.
      </video>
      <div className="hero-video-overlay" aria-hidden="true" />
      <span className="hero-video-label">BLEUWI WORLD / INTRO</span>
    </div>
  )
}
