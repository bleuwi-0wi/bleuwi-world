import { useEffect, useRef } from 'react'
import retroLoop from '../assets/bleuwi-retro-loop.mp4'

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
        aria-label="BLEUWI retro animation preview"
      >
        <source src={retroLoop} type="video/mp4" />
        Your browser does not support this video.
      </video>
      <div className="hero-video-overlay" aria-hidden="true" />
      <span className="hero-video-label">BLEUWI WORLD / PLAYING</span>
    </div>
  )
}
