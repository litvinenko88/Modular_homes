import { useEffect, useRef } from "react";
import styles from "./PhotoGallery.module.css";

const PhotoGallery = () => {
  const sliderRef = useRef(null);

  const photos = [
    "/img/photo_gallery/1.jpg",
    "/img/photo_gallery/2.jpg",
    "/img/photo_gallery/3.jpg",
    "/img/photo_gallery/4.jpg",
    "/img/photo_gallery/5.jpg",
    "/img/photo_gallery/6.jpg",
    "/img/photo_gallery/7.jpg",
    "/img/photo_gallery/8.jpg",
    "/img/photo_gallery/9.jpg",
    "/img/photo_gallery/10.jpg"
  ];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= slider.scrollWidth / 2) {
        scrollAmount = 0;
      }
      slider.scrollLeft = scrollAmount;
    };

    const interval = setInterval(scroll, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.section} aria-labelledby="gallery-title">
      <div className={styles.animatedBackground}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="gallery-title" className={styles.title}>
            Наши модульные дома в реальной жизни
          </h2>
          <p className={styles.subtitle}>
            Лучше один раз увидеть, чем сто раз услышать. Посмотрите, как выглядят готовые проекты наших клиентов
          </p>
        </div>

        <div className={styles.sliderContainer}>
          <div className={styles.slider} ref={sliderRef}>
            <div className={styles.slideTrack}>
              {[...photos, ...photos].map((photo, index) => (
                <div key={index} className={styles.slide}>
                  <img
                    src={photo}
                    alt={`Готовый модульный дом Easy House - фото ${(index % photos.length) + 1}`}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;