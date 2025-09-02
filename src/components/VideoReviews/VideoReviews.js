import { useState, useEffect, useRef } from 'react'
import styles from './VideoReviews.module.css'

export default function VideoReviews() {
  const [isVisible, setIsVisible] = useState(false)
  const [playingVideo, setPlayingVideo] = useState(null)
  const [isPlaying, setIsPlaying] = useState({})
  const [currentTime, setCurrentTime] = useState({})
  const [duration, setDuration] = useState({})
  const videoRefs = useRef([])
  const audioRefs = useRef([])

  const videos = [
    { video: '/video/1.mp4', audio: '/audio/1.1.mp4', title: 'Обзор дома 1' },
    { video: '/video/2.mp4', audio: '/audio/2.1.mp4', title: 'Обзор дома 2' },
    { video: '/video/3.mp4', audio: '/audio/3.1.mp4', title: 'Обзор дома 3' },
    { video: '/video/4.mp4', audio: '/audio/4.1.mp4', title: 'Обзор дома 4' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.querySelector(`.${styles.videoReviews}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const togglePlay = (index) => {
    const video = videoRefs.current[index]
    const audio = audioRefs.current[index]
    
    if (isPlaying[index]) {
      video?.pause()
      audio?.pause()
    } else {
      // Pause other videos
      Object.keys(isPlaying).forEach(key => {
        if (key != index && isPlaying[key]) {
          videoRefs.current[key]?.pause()
          audioRefs.current[key]?.pause()
        }
      })
      
      video?.play()
      audio?.play()
    }
  }

  const handleVideoPlay = (index) => {
    setIsPlaying(prev => ({ ...prev, [index]: true }))
    setPlayingVideo(index)
  }

  const handleVideoPause = (index) => {
    setIsPlaying(prev => ({ ...prev, [index]: false }))
    if (playingVideo === index) setPlayingVideo(null)
  }

  const handleTimeUpdate = (index) => {
    const video = videoRefs.current[index]
    if (video) {
      setCurrentTime(prev => ({ ...prev, [index]: video.currentTime }))
    }
  }

  const handleLoadedMetadata = (index) => {
    const video = videoRefs.current[index]
    if (video && video.duration) {
      setDuration(prev => ({ ...prev, [index]: video.duration }))
    }
  }

  const handleCanPlay = (index) => {
    const video = videoRefs.current[index]
    if (video && video.duration && !duration[index]) {
      setDuration(prev => ({ ...prev, [index]: video.duration }))
    }
  }

  const handleSeek = (index, value) => {
    const video = videoRefs.current[index]
    const audio = audioRefs.current[index]
    if (video && audio) {
      const seekTime = Math.max(0, Math.min(value, video.duration || 0))
      video.currentTime = seekTime
      audio.currentTime = seekTime
      setCurrentTime(prev => ({ ...prev, [index]: seekTime }))
    }
  }

  const handleProgressClick = (index, e) => {
    const video = videoRefs.current[index]
    if (!video) return
    
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const videoDuration = video.duration || 0
    
    if (videoDuration > 0) {
      const newTime = Math.max(0, Math.min((clickX / width) * videoDuration, videoDuration))
      handleSeek(index, newTime)
    }
  }

  const formatTime = (time) => {
    if (!time) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = (index) => {
    const videoContainer = videoRefs.current[index]?.parentElement
    if (!videoContainer) return

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <section className={styles.videoReviews}>
      <div className={styles.animatedBackground}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.pulseRing}></div>
      </div>
      
      <div className={styles.backgroundImage}></div>
      
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <h2 className={styles.title}>
            Видеообзоры наших домов
          </h2>
          
          <p className={styles.description}>
            Убедитесь в качестве и продуманности каждой детали
          </p>
          
          <div className={styles.videoGrid}>
            {videos.map((item, index) => (
              <div key={index} className={styles.videoItem}>
                <div className={styles.videoContainer}>
                  <video
                    ref={el => videoRefs.current[index] = el}
                    src={item.video}
                    muted
                    preload="metadata"
                    onPlay={() => handleVideoPlay(index)}
                    onPause={() => handleVideoPause(index)}
                    onTimeUpdate={() => handleTimeUpdate(index)}
                    onLoadedMetadata={() => handleLoadedMetadata(index)}
                    onCanPlay={() => handleCanPlay(index)}
                    onDurationChange={() => handleLoadedMetadata(index)}
                    className={styles.video}
                  />
                  <audio
                    ref={el => audioRefs.current[index] = el}
                    src={item.audio}
                    preload="metadata"
                  />
                  
                  {!isPlaying[index] && (
                    <div className={styles.centerPlayButton}>
                      <button 
                        className={styles.centerPlay}
                        onClick={() => togglePlay(index)}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <polygon points="8,5 19,12 8,19" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <div className={styles.customControls}>
                    <button 
                      className={styles.playButton}
                      onClick={() => togglePlay(index)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        {isPlaying[index] ? (
                          <>
                            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                          </>
                        ) : (
                          <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                        )}
                      </svg>
                    </button>
                    
                    <div className={styles.progressContainer}>
                      <div 
                        className={styles.progressTrack}
                        onClick={(e) => handleProgressClick(index, e)}
                      >
                        <div 
                          className={styles.progressFill}
                          style={{ 
                            width: `${videoRefs.current[index]?.duration ? ((currentTime[index] || 0) / videoRefs.current[index].duration) * 100 : 0}%` 
                          }}
                        />
                        <div 
                          className={styles.progressThumb}
                          style={{ 
                            left: `${videoRefs.current[index]?.duration ? ((currentTime[index] || 0) / videoRefs.current[index].duration) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.timeDisplay}>
                      {formatTime(currentTime[index])} / {formatTime(videoRefs.current[index]?.duration)}
                    </div>
                    
                    <button 
                      className={styles.fullscreenButton}
                      onClick={() => toggleFullscreen(index)}
                      title="Полный экран"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 14H5v5h5v-2H7v-3zM5 10h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}