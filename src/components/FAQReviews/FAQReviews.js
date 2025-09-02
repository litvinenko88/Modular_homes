import { useState, useEffect } from 'react'
import FAQ from './FAQ/FAQ'
import Reviews from './Reviews/Reviews'
import styles from './FAQReviews.module.css'

export default function FAQReviews() {
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

    const element = document.querySelector(`.${styles.faqReviews}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.faqReviews}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.grid}>
            <div className={styles.faqSection}>
              <FAQ />
            </div>
            <div className={styles.reviewsSection}>
              <Reviews />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}