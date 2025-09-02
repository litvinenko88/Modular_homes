import { useState, useEffect } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={styles.hero} role="banner" aria-label="Главная секция с информацией о модульных домах">
      <div className={styles.animatedBackground}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
        <div className={styles.pulseRing}></div>
        <div className={styles.pulseRing}></div>
      </div>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.leftSection}>
            <h1 className={styles.title} itemScope itemType="https://schema.org/Product">
              <span className={styles.titleMain} itemProp="name">Модульные дома </span>
              <span className={styles.titleSub}>под ключ от </span>
              <span className={styles.price} itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="price" content="855000" />
                <meta itemProp="priceCurrency" content="RUB" />
                <meta itemProp="availability" content="https://schema.org/InStock" />
                855 000₽
              </span>
            </h1>
            
            <p className={styles.subtitle} itemProp="description">
              Это не просто коробка с окнами — это полноценный дом
            </p>
            
            <ul className={styles.advantages} role="list" aria-label="Преимущества модульных домов">
              <li className={styles.advantage}>
                <div className={styles.advantageIcon} role="img" aria-label="Иконка дома">🏠</div>
                <span className={styles.advantageText}>Заезжайте через 30 дней</span>
              </li>
              <li className={styles.advantage}>
                <div className={styles.advantageIcon} role="img" aria-label="Иконка инструментов">🔧</div>
                <span className={styles.advantageText}>Полный цикл «под ключ»</span>
              </li>
              <li className={styles.advantage}>
                <div className={styles.advantageIcon} role="img" aria-label="Иконка денег">💰</div>
                <span className={styles.advantageText}>Фиксированная цена</span>
              </li>
              <li className={styles.advantage}>
                <div className={styles.advantageIcon} role="img" aria-label="Иконка молнии">⚡</div>
                <span className={styles.advantageText}>Скорость и прозрачность</span>
              </li>
            </ul>
            
            <div className={styles.buttons} role="group" aria-label="Действия">
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" aria-label="Рассчитать стоимость модульного дома">
                Рассчитать стоимость
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" aria-label="Посмотреть каталог модульных домов">
                Посмотреть каталог
              </button>
            </div>
          </div>
          
          <div className={styles.rightSection}>
            <div className={styles.videoContainer}>
              <video 
                className={styles.video}
                autoPlay 
                muted 
                loop 
                playsInline
                aria-label="Демонстрационное видео модульных домов Easy House"
                title="Модульные дома Easy House - строительство под ключ"
              >
                <source src="/video/glav2308.mp4" type="video/mp4" />
                <track kind="captions" srcLang="ru" label="Русские субтитры" />
                Ваш браузер не поддерживает видео. Посмотрите наши модульные дома на фотографиях в каталоге.
              </video>
              <div className={styles.videoOverlay} aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}