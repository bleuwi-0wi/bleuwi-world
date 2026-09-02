import retroLoop from '../assets/bleuwi-retro-loop.mp4'

export default function HeroVideo() {
  return (
    <div className="hero-video-frame">
      <video className="hero-video" autoPlay loop muted playsInline preload="metadata" aria-label="BLEUWI retro animation preview">
        <source src={retroLoop} type="video/mp4" />
        Your browser does not support this video.
      </video>
      <div className="hero-video-overlay" aria-hidden="true" />
      <span className="hero-video-label">BLEUWI WORLD / PLAYING</span>
    </div>
  )
}
