import { useState, useEffect, useRef } from "react";
import styles from "./ProductionProcess.module.css";

const ProductionProcess = () => {
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  const steps = [
    {
      id: 1,
      title: "Проектирование",
      description:
        "Создаем цифровой 3D-макет и детальные чертежи каждой панели в программе CADwork.",
      icon: "📐",
    },
    {
      id: 2,
      title: "Раскрой и антисептирование",
      description:
        "Автомат раскраивает пиломатериал камерной сушки для одного модуля.",
      icon: "🔧",
    },
    {
      id: 3,
      title: "Сборка каркаса",
      description:
        "Роботизированная линия сбивает прочный каркас из двутавровых балок.",
      icon: "🏗️",
    },
    {
      id: 4,
      title: "Обшивка ГСП",
      description: "Каркас обшивается экологичной гипсостружечной плитой.",
      icon: "🛡️",
    },
    {
      id: 5,
      title: "Монтаж пароизоляции",
      description: "Укладывается пароизоляционная мембрана «Изоспан».",
      icon: "💨",
    },
    {
      id: 6,
      title: "Укладка утеплителя",
      description:
        "Плотно укладывается негорючий базальтовый утеплитель Rockwool.",
      icon: "🧱",
    },
    {
      id: 7,
      title: "Прокладка коммуникаций",
      description:
        "Монтируется электропроводка и планируются пути коммуникаций.",
      icon: "⚡",
    },
    {
      id: 8,
      title: "Маркировка и упаковка",
      description: "Каждая панель маркируется для быстрой сборки на участке.",
      icon: "📦",
    },
    {
      id: 9,
      title: "Контроль качества",
      description:
        "Инженер проверяет каждую панель на соответствие стандартам.",
      icon: "✅",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = parseInt(entry.target.dataset.stepId);
            setTimeout(() => {
              setVisibleSteps((prev) => new Set([...prev, stepId]));
            }, stepId * 100); // Задержка для каскадной анимации
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    stepsRef.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}></div>
          <h2 className={styles.title}>
            Немецкая точность и российская надежность
          </h2>
          <p className={styles.subtitle}>
            От чертежа до готового дома: технологический процесс мирового уровня
          </p>
          <p className={styles.description}>
            Наш заводской процесс исключает ошибки и гарантирует высочайшее
            качество каждого модульного дома. Мы используем немецкое
            оборудование Weinmann и отборные российские материалы для создания
            домов премиум-класса.
          </p>
        </div>

        <div className={styles.processGrid}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => (stepsRef.current[index] = el)}
              data-step-id={step.id}
              className={`${styles.processItem} ${
                visibleSteps.has(step.id) ? styles.visible : ""
              }`}>
              <div className={styles.stripe}>
                <div className={styles.content}>
                  <div className={styles.iconContainer}>
                    <span className={styles.stepNumber}>{step.id}</span>
                    <span className={styles.stepIcon}>{step.icon}</span>
                  </div>
                  <div className={styles.textContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.guarantee}>
            🏆 Этот технологический подход гарантирует, что ваш модульный дом
            будет теплым, тихим, энергоэффективным и готовым к комфортному
            проживанию сразу после сборки на участке.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductionProcess;
