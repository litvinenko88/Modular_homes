import { useState, useRef, useEffect } from 'react';
import styles from './VideoTestimonials.module.css';

const videoData = [
  { id: 1, video: '/video/otz1.mp4' },
  { id: 2, video: '/video/otz2.mp4' },
  { id: 3, video: '/video/otz3.mp4' },
  { id: 4, video: '/video/otz4.mp4' },
  { id: 5, video: '/video/otz5.mp4' },
  { id: 6, video: '/video/otz6.mp4' },
  { id: 7, video: '/video/otz7.mp4' },
  { id: 8, video: '/video/otz8.mp4', audio: '/audio/aud8.mp4' },
  { id: 9, video: '/video/otz9.mp4', audio: '/audio/aud9.mp4' },
  { id: 10, video: '/video/otz10.mp4', audio: '/audio/aud10.mp4' }
];

export default function VideoTestimonials() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const sectionRef = useRef(null);
  const videoRefs = useRef({});
  const audioRefs = useRef({});


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoData.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, index * 100);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlay = async (videoId) => {
    const video = videoRefs.current[videoId];
    const audio = audioRefs.current[videoId];
    
    if (playingVideo && playingVideo !== videoId) {
      const prevVideo = videoRefs.current[playingVideo];
      const prevAudio = audioRefs.current[playingVideo];
      prevVideo?.pause();
      prevAudio?.pause();
    }

    if (video) {
      try {
        await video.play();
        if (audio) {
          audio.currentTime = video.currentTime;
          await audio.play();
        }
        setPlayingVideo(videoId);
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }
  };

  const handleVideoPlay = (videoId) => {
    const audio = audioRefs.current[videoId];
    if (audio) {
      audio.currentTime = videoRefs.current[videoId].currentTime;
      audio.play().catch(error => {
        console.error('Audio playback failed:', error);
      });
    }
    setPlayingVideo(videoId);
  };

  const stopAudio = (videoId) => {
    const audio = audioRefs.current[videoId];
    audio?.pause();
    setPlayingVideo(null);
  };

  const handleVideoEnd = (videoId) => {
    stopAudio(videoId);
  };

  const handleVideoPause = (videoId) => {
    stopAudio(videoId);
  };

  return (
    <section ref={sectionRef} className={styles.videoTestimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Отзывы наших клиентов</h2>
          <p className={styles.subtitle}>
            Реальные истории людей, которые уже живут в наших модульных домах
          </p>
        </div>

        <div className={styles.grid}>
          {videoData.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.videoCard} ${
                visibleCards.includes(index) ? styles.visible : ''
              }`}
            >
              <div className={styles.videoWrapper}>
                <video
                  ref={el => videoRefs.current[item.id] = el}
                  className={styles.video}
                  onEnded={() => handleVideoEnd(item.id)}
                  onPlay={() => handleVideoPlay(item.id)}
                  onPause={() => handleVideoPause(item.id)}
                  controls
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  aria-label={`Видео отзыв клиента о модульном доме Easy House №${item.id}`}
                  title={`Отзыв клиента №${item.id}`}
                >
                  <source src={item.video} type="video/mp4" />
                  <track kind="captions" srcLang="ru" label="Русские субтитры" />
                </video>
                
                {item.audio && (
                  <audio
                    ref={el => audioRefs.current[item.id] = el}
                    preload="metadata"
                  >
                    <source src={item.audio} type="audio/mp4" />
                  </audio>
                )}

                {playingVideo !== item.id && (
                  <div 
                    className={styles.playOverlay}
                    onClick={() => handlePlay(item.id)}
                  >
                    <div className={styles.playButton}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>


            </div>
          ))}
        </div>
      </div>
    </section>
  );
}