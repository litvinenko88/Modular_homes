import { useState, useEffect, useRef } from 'react'
import styles from './VideoReviews.module.css'

export default function VideoReviews({ showAllVideos = false, showViewAllButton = false }) {
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [playingVideo, setPlayingVideo] = useState(null)
  const [isPlaying, setIsPlaying] = useState({})
  const [currentTime, setCurrentTime] = useState({})
  const [duration, setDuration] = useState({})
  const videoRefs = useRef([])
  const audioRefs = useRef([])

  const baseVideos = [
    { image: '/img/New_Arkhangelsk/1.jpg', title: 'Обзор дома Новый Архангельск' },
    { image: '/img/Arkhangelsk_terrace/1.jpg', title: 'Обзор дома с террасой' },
    { image: '/img/Barnhouse/1.jpg', title: 'Обзор барн-хауса' },
    { image: '/img/Two_module_Lane/1.jpg', title: 'Обзор двухмодульного дома' }
  ]

  const additionalVideos = [
    { image: '/img/Angular_Arkhangelsk/1.jpg', title: 'Обзор углового дома' },
    { image: '/img/Four_Module_Barn/1.jpg', title: 'Обзор четырехмодульного барна' },
    { image: '/img/Three_Module_Barn/1.jpg', title: 'Обзор трехмодульного барна' },
    { image: '/img/Barn_House/1.jpg', title: 'Обзор барн-хауса' }
  ]

  const items = showAllVideos ? [...baseVideos, ...additionalVideos] : baseVideos

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
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
  }, [isClient])

  const togglePlay = (index) => {
    const video = videoRefs.current[index]
    const audio = audioRefs.current[index]
    
    if (isPlaying[index]) {
      video?.pause()
      audio?.pause()
    } else {
      // Pause other videos
      Object.keys(isPlaying).forEach(key => {
        if (key !== String(index) && isPlaying[key]) {
          videoRefs.current[key]?.pause()
          audioRefs.current[key]?.pause()
        }
      })
      
      video?.play().catch(() => {
        // Video playback failed - handled silently
      })
      if (audio && videos[index].audio) {
        audio.currentTime = video.currentTime
        audio?.play().catch(() => {
          // Audio playback failed - handled silently
        })
      }
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
    if (video) {
      const seekTime = Math.max(0, Math.min(value, video.duration || 0))
      video.currentTime = seekTime
      if (audio && videos[index].audio) {
        audio.currentTime = seekTime
      }
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

  if (!isClient) {
    return (
      <section className={styles.videoReviews} aria-labelledby="video-reviews-title">
        <div className={styles.container}>
          <div className={styles.content}>
            <h2 id="video-reviews-title" className={styles.title}>
              Видеообзоры наших домов
            </h2>
            <p className={styles.description}>
              Убедитесь в качестве и продуманности каждой детали
            </p>
            <div className={styles.videoGrid}>
              {items.slice(0, 4).map((item, index) => (
                <div key={index} className={styles.videoItem}>
                  <div className={styles.videoContainer}>
                    <img 
                      src={item.image}
                      alt={item.title}
                      className={styles.video}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <div className={styles.imageOverlay}>
                      <span>📹 {item.title}</span>
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

  return (
    <section className={styles.videoReviews} aria-labelledby="video-reviews-title">
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
          <h2 id="video-reviews-title" className={styles.title}>
            Видеообзоры наших домов
          </h2>
          
          <p className={styles.description}>
            Убедитесь в качестве и продуманности каждой детали
          </p>
          
          <div className={styles.videoGrid}>
            {items.map((item, index) => (
              <div key={index} className={styles.videoItem}>
                <div className={styles.videoContainer}>
                  <img 
                    src={item.image}
                    alt={item.title}
                    className={styles.video}
                    aria-label={`Обзор модульного дома ${index + 1}`}
                    title={item.title}
                  />
                  
                  <div className={styles.imageOverlay}>
                    <div className={styles.overlayContent}>
                      <div className={styles.playIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <polygon points="8,5 19,12 8,19" fill="currentColor"/>
                        </svg>
                      </div>
                      <h3 className={styles.overlayTitle}>{item.title}</h3>
                      <p className={styles.overlayDescription}>Посмотрите наши реальные проекты</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {showViewAllButton && (
            <div className={styles.buttonContainer}>
              <a href="/otzyvy" className={styles.viewAllButton}>
                Смотреть все обзоры
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}