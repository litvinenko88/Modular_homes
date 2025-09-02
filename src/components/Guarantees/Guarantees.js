import { useEffect, useRef } from "react";
import styles from "./Guarantees.module.css";

const Guarantees = () => {
  const containerRef = useRef(null);

  const guarantees = [
    {
      id: 1,
      title: "Гарантия 5 лет на дом",
      description: "Мы несем ответственность за конструктив, отделку и инженерные системы. В случае любых вопросов — оперативно приедем и все исправим.",
      icon: "🛡️"
    },
    {
      id: 2,
      title: "Фиксированная цена в договоре",
      description: "Проект и цены модульного дома не изменится после подписания договора, а стоимость доставки будет указана заранее. Никаких скрытых платежей или доплат за «внезапно возникшие обстоятельства», независимо от погодных условий.",
      icon: "💰"
    },
    {
      id: 3,
      title: "Соблюдение сроков",
      description: "За каждый день просрочки, указанной в договоре, мы выплачиваем неустойку в размере 0,1% от стоимости работ.",
      icon: "⏰"
    },
    {
      id: 4,
      title: "Прозрачная отчетность",
      description: "Вы будете получать регулярные фото- и видеоотчеты о ходе производства и строительства вашего дома. Вы всегда в курсе, как идет работа.",
      icon: "📊"
    },
    {
      id: 5,
      title: "Честная документация",
      description: "Заключаем официальный договор, прописываем все этапы, спецификации и условия. Вы защищены юридически при покупке модульного дома от производителя.",
      icon: "📋"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = containerRef.current?.querySelectorAll(
      `.${styles.guaranteeItem}`
    );
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.guarantees}>
      <h2 style={{ textAlign: "center", padding: "20px", fontSize: "32px" }}>
        Ваша уверенность прописана в договоре
      </h2>
      <p style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 40px", color: "#4a5568", fontSize: "16px", lineHeight: "1.6" }}>
        Мы понимаем, что строительство дома - это важный и ответственный шаг. Поэтому наша работа на 100% прозрачна и защищена юридически
      </p>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.guaranteesGrid}>
          {guarantees.map((guarantee, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={guarantee.id}
                className={`${styles.guaranteeItem} ${
                  isEven ? styles.right : styles.left
                }`}>
                <div className={styles.stripe}>
                  <div className={styles.content}>
                    <div className={styles.iconContainer}>
                      <span className={styles.icon}>{guarantee.icon}</span>
                    </div>
                    <div className={styles.textContent}>
                      <h3 className={styles.title}>{guarantee.title}</h3>
                      <p className={styles.description}>{guarantee.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={styles.footer}>
          <p className={styles.footerText}>
            С нами вы можете быть спокойны: ваш модульный дом будет построен в срок, за оговоренную сумму и с гарантией качества, которая подтверждена документально.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Guarantees;