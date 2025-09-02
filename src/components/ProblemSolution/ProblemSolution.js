import { useState, useEffect } from 'react';
import styles from './ProblemSolution.module.css';

const ProblemSolution = () => {
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

    const element = document.getElementById('problem-solution');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="problem-solution" className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Строительство дома - это сложно? <span className={styles.accent}>Мы решили проблему</span>
        </h2>
        
        <div className={styles.comparison}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Обычная стройка</h3>
            <div className={styles.list}>
              <div className={styles.item}>Стройка затягивается на месяцы</div>
              <div className={styles.item}>Цена растет в процессе</div>
              <div className={styles.item}>Много подрядчиков</div>
              <div className={styles.item}>Непрозрачное качество</div>
            </div>
          </div>
          
          <div className={styles.vs}>VS</div>
          
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Модульные дома</h3>
            <div className={styles.list}>
              <div className={styles.item}>Сборка за 1-2 дня</div>
              <div className={styles.item}>Фиксированная стоимость</div>
              <div className={styles.item}>Один исполнитель</div>
              <div className={styles.item}>Фото/видео отчеты</div>
            </div>
          </div>
        </div>

        <div className={styles.cta}>
          <p className={styles.subtitle}>Хватит переживать, начните жить</p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;