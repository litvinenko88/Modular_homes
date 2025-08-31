'use client';

import { useState, useEffect } from 'react';
import styles from './AdvantagesSection.module.css';

export default function AdvantagesSection({ content }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('advantages-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="advantages-section"
      className={styles.section}
    >
      <div className={styles.backgroundDecor1} />
      <div className={styles.backgroundDecor2} />

      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.badge}>
            Преимущества
          </div>
          
          <h2 className={styles.title}>
            {content.title}
          </h2>
          
          <p className={styles.subtitle}>
            Почему тысячи клиентов выбирают наши решения
          </p>
        </div>
        
        <div className={styles.mainGrid}>
          <div className={`${styles.advantageCard} ${styles.left} ${isVisible ? styles.visible : ''}`}>
            <div className={`${styles.cardBackground} ${styles.gradient1}`} />
            
            <div className={styles.cardContent}>
              <div className={`${styles.cardIcon} ${styles.gradient1}`}>
                🚀
              </div>
              
              <h3 className={styles.cardTitle}>
                {content.items[0]?.title}
              </h3>
              
              <p className={styles.cardDescription}>
                {content.items[0]?.description}
              </p>
            </div>
          </div>

          <div className={`${styles.advantageCard} ${styles.right} ${isVisible ? styles.visible : ''}`}>
            <div className={`${styles.cardBackground} ${styles.gradient2}`} />
            
            <div className={styles.cardContent}>
              <div className={`${styles.cardIcon} ${styles.gradient2}`}>
                💰
              </div>
              
              <h3 className={styles.cardTitle}>
                {content.items[1]?.title}
              </h3>
              
              <p className={styles.cardDescription}>
                {content.items[1]?.description}
              </p>
            </div>
          </div>
        </div>

        <div className={`${styles.fullWidthCard} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.fullWidthBackground} />
          
          <div className={styles.fullWidthContent}>
            <div className={styles.fullWidthIcon}>
              ✓
            </div>
            
            <div className={styles.fullWidthText}>
              <h3 className={styles.fullWidthTitle}>
                {content.items[2]?.title}
              </h3>
              
              <p className={styles.fullWidthDescription}>
                {content.items[2]?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}