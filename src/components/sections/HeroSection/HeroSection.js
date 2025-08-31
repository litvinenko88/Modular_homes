'use client';

import { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';

export default function HeroSection({ content }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.backgroundElements} />
      <div className={styles.shape1} />
      <div className={styles.shape2} />

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={`${styles.leftContent} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.badge}>
              Инновационные решения
            </div>
            
            <h1 className={styles.title}>
              {content.title}
            </h1>
            
            <p className={styles.subtitle}>
              {content.subtitle}
            </p>
            
            <div className={styles.buttons}>
              <button 
                className={styles.primaryButton}
                onClick={() => window.location.href = '/constructor'}
              >
                {content.buttonText}
              </button>
              
              <button className={styles.secondaryButton}>
                Узнать больше
              </button>
            </div>
          </div>

          <div className={`${styles.rightContent} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.visualCard}>
              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.orange}`}>
                  <div className={styles.statNumber}>30-60</div>
                  <div className={styles.statLabel}>дней строительства</div>
                </div>
                <div className={`${styles.statCard} ${styles.green}`}>
                  <div className={styles.statNumber}>850k</div>
                  <div className={styles.statLabel}>от рублей</div>
                </div>
              </div>
              
              <div className={styles.qualityCard}>
                <div className={styles.qualityTitle}>100% Качество</div>
                <div className={styles.qualitySubtitle}>Сертифицированные материалы</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}