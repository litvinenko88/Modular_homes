import { useState, useEffect } from 'react'
import styles from './VirtualTour.module.css'

export default function VirtualTour() {
  const [isVisible, setIsVisible] = useState(false)

  const handleTour65 = () => {
    window.open('https://portfolio3.3dpanorama.spb.ru/2024/07/fl', '_blank')
  }

  const handleTour87 = () => {
    window.open('https://portfolio3.3dpanorama.spb.ru/2024/03/fl/', '_blank')
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.querySelector(`.${styles.virtualTour}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.virtualTour} role="region" aria-label="Виртуальная экскурсия по модульным домам">
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
            Загляните в будущее прямо сейчас
          </h2>
          
          <p className={styles.description}>
            Хотите заранее оценить площади дома, где будет стоять диван или кровать одного модуля? 
            Воспользуйтесь нашей интерактивной 3D-экскурсией по выставочному образцу модульного дома. 
            Погуляйте по готовым проектам, изучите каждую деталь и представьте свою жизнь в новом доме — 
            еще до начала строительства.
          </p>
          
          <div className={styles.buttons} role="group" aria-label="Выбор виртуальной экскурсии">
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`} 
              type="button" 
              aria-label="Виртуальная экскурсия по дому 65 кв.м"
              onClick={handleTour65}
            >
              Дом на 65 кв/м
            </button>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`} 
              type="button" 
              aria-label="Виртуальная экскурсия по дому 87 кв.м"
              onClick={handleTour87}
            >
              Дом на 87 кв/м
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}