import { useState } from "react";
import styles from "./FAQ.module.css";

export default function FAQ() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openItems, setOpenItems] = useState({});

  const faqData = [
    {
      question: "Из каких материалов строятся ваши модульные дома?",
      answer:
        "Мы используем экологичные и проверенные материалы: каркас из строганной древесины камерной сушки, утеплитель Rockwool, обшивку из ГСП-плит, чтобы обеспечить комфорт в любых погодных условиях. Все материалы сертифицированы и безопасны для здоровья.",
    },
    {
      question: "Можно ли жить в таком доме зимой?",
      answer:
        "Да, наши дома рассчитаны на круглогодичное проживание. Многослойное утепление стен (150-200 мм) и кровли обеспечивает комфортную температуру даже при -30°C.",
    },
    {
      question: "Какой фундамент нужен для модульного дома?",
      answer:
        "Чаще всего мы используем свайно-винтовой фундамент — он надежный, не требует выравнивания участка и подходит для большинства типов грунта. Это позволяет сэкономить время и деньги.",
    },
    {
      question: "Входит ли внутренняя отделка в стоимость?",
      answer:
        "Да, все наши дома сдаются «под ключ». В базовую стоимость уже входит чистовая отделка, установка сантехники, электрика, отопление и даже бойлер в домах под ключ для круглогодичного проживания.",
    },
    {
      question: "Можно ли later достроить или перевезти дом?",
      answer:
        "Да, это одно из ключевых преимуществ модульной технологии. Дом можно разобрать, перевезти на новое место и собрать заново. Также возможна later достройка дополнительных модулей.",
    },
    {
      question: "Вы даете гарантию на дом?",
      answer:
        "Да, мы предоставляем официальную гарантию 5 лет на конструктив и отделку одного модуля. Все обязательства прописываются в договоре.",
    },
  ];

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const visibleItems = isExpanded ? faqData : faqData.slice(0, 3);

  return (
    <div className={styles.faq}>
      <div className={styles.header}>
        <h2 className={styles.title}>Что спрашивают клиенты</h2>
        <p className={styles.subtitle}>
          У вас остались сомнения или вопросы о наших быстровозводимых домах? Мы
          собрали самые популярные из них и дали подробные ответы. Если не нашли
          то, что искали — просто позвоните нам для индивидуального подхода.
        </p>
      </div>

      <div className={styles.faqList}>
        {faqData.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${
              openItems[index] ? styles.open : ""
            }`}>
            <button
              className={styles.question}
              onClick={() => toggleItem(index)}>
              <span>{item.question}</span>
              <span className={styles.icon}>
                {openItems[index] ? "−" : "+"}
              </span>
            </button>
            <div className={styles.answer}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}

        <div
          className={`${styles.hiddenItems} ${
            isExpanded ? styles.expanded : ""
          }`}>
          {faqData.slice(3).map((item, index) => {
            const actualIndex = index + 3;
            return (
              <div
                key={actualIndex}
                className={`${styles.faqItem} ${
                  openItems[actualIndex] ? styles.open : ""
                }`}>
                <button
                  className={styles.question}
                  onClick={() => toggleItem(actualIndex)}>
                  <span>{item.question}</span>
                  <span className={styles.icon}>
                    {openItems[actualIndex] ? "−" : "+"}
                  </span>
                </button>
                <div className={styles.answer}>
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "свернуть" : "развернуть"}
      </button>
    </div>
  );
}
