import { useState, useEffect } from 'react'
import styles from './DeliveryInstallation.module.css'

export default function DeliveryInstallation() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    const element = document.querySelector(`.${styles.deliveryInstallation}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      icon: "🏗️",
      title: "Подготовка участка",
      desc: "Заранее подготавливаем площадку и фундамент (обычно свайный)."
    },
    {
      icon: "🚛",
      title: "Доставка",
      desc: "Готовые модули аккуратно доставляются к участку упакованными на манипуляторе."
    },
    {
      icon: "🔧",
      title: "Монтаж",
      desc: "Собираем дом как конструктор за 1-2 дня с помощью профессиональной техники"
    },
    {
      icon: "⚡",
      title: "Подключение",
      desc: "Монтируем и подключаем все инженерные системы: электрику, отопление, водоснабжение, используя только высококачественные материалы."
    },
    {
      icon: "✨",
      title: "Чистота",
      desc: "После себя убираем весь строительный мусор."
    }
  ]

  return (
    <section className={styles.deliveryInstallation}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Аккуратная доставка и монтаж за 1-2 дня
            </h2>
            <p className={styles.subtitle}>
              Мы не просто производим модульные дома, мы берем на себя всю логистику и строительные работы на вашем участке.
            </p>
          </div>
          
          <div className={styles.stepsList}>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`${styles.stepItem} ${isVisible ? styles.stepVisible : ''}`}
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className={styles.stepIcon}>
                  <span className={styles.emoji}>{step.icon}</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.footer}>
            <p className={styles.footerText}>
              Вы просто выбираете проект — мы делаем всё остальное, включая монтаж на участке.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}