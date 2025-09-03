import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "./Bestsellers.module.css";
import { getBestsellersSchema } from "./bestsellers-schema";
import { safeLog } from "../../utils/security";

const housesData = [
  {
    id: 1,
    name: "Новый Архангельск",
    area: "15-20 м²",
    feature: "Базовая модель одного модуля",
    price: "от 855 000 руб",
    description:
      "Компактный и функциональный модульный дом для быстрого старта строительства модульных домов. Всё необходимое для комфорта уже внутри, включая экологически чистые материалы.",
    image: "/img/New_Arkhangelsk/1.jpg",
    imageWebp: "/img/New_Arkhangelsk/1.jpg",
    slug: "novyj-arkhangelsk",
  },
  {
    id: 2,
    name: "Архангельск с террасой",
    area: "15 м² + терраса",
    feature: "Модульный дом с открытой террасой",
    price: "от 1 075 000 руб",
    description:
      "Уютный дом с готовой террасой для отдыха на свежем воздухе. Идеальное место для утреннего кофе.",
    image: "/img/Arkhangelsk_terrace/1.jpg",
    imageWebp: "/img/Arkhangelsk_terrace/1.jpg",
    slug: "arkhangelsk-s-terrasoj",
  },
  {
    id: 3,
    name: "Угловой Архангельск",
    area: "30 м² (6x5)",
    feature:
      "Угловая планировка, идеально подходящая для негабаритных участков",
    price: "от 1 265 000 руб",
    description:
      "Нестандартная планировка и больше полезного пространства в модели дома обеспечивают отличный выбор для семьи. Максимум возможностей на вашем участке с нашими домами и банями под ключ.",
    image: "/img/Angular_Arkhangelsk/1.jpg",
    imageWebp: "/img/Angular_Arkhangelsk/1.jpg",
    slug: "uglovoj-arkhangelsk",
  },
  {
    id: 4,
    name: "Барн-хаус",
    area: "35-40 м²",
    feature: "Стиль Barnhouse",
    price: "от 930 000 руб",
    description:
      "Современный типовой каркасный дом в стиле барнхаус с высокими потолками. Для тех, кто ценит стиль, практичность и комфорт.",
    image: "/img/Barnhouse/1.jpg",
    imageWebp: "/img/Barnhouse/1.jpg",
    slug: "barnkhaus",
  },
  {
    id: 5,
    name: "Двухмодульная Двинея",
    area: "30-40 м²",
    feature: "Просторная планировка с возможностью использования винтовых свай",
    price: "от 1 430 000 руб",
    description:
      "Просторная планировка с чётким зонированием, идеально подходящая для загородного дома для круглогодичного проживания, даже в сложных погодных условиях. Внутренняя и внешняя отделка гармонично сочетаются. Комфорт для всей семьи в одном модульном решении.",
    image: "/img/Two_module_Lane/1.jpg",
    imageWebp: "/img/Two_module_Lane/1.jpg",
    slug: "dvukhmodulnaya-dvineya",
  },
  {
    id: 6,
    name: "Четырехмодульный Барн",
    area: "70-80 м²",
    feature: "Просторный дом для большой семьи",
    price: "от 3 130 000 руб",
    description:
      "Солидный дом с несколькими комнатами, доступный по выгодным ценам. Простор для жизни, работы и приёма гостей в модульных домах.",
    image: "/img/Four_Module_Barn/1.jpg",
    imageWebp: "/img/Four_Module_Barn/1.jpg",
    slug: "chetyrekhmodulnyj-barn",
  },
];

export default function Bestsellers() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && sectionRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Анимация появления карточек с задержкой
            housesData.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 150);
            });
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const handleCardClick = (slug) => {
    if (typeof window !== 'undefined' && slug) {
      safeLog(`Navigation to project: ${slug}`, 'info');
      router.push(`/catalog/${encodeURIComponent(slug)}`);
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getBestsellersSchema()),
          }}
        />
      </Head>

      <section
        ref={sectionRef}
        className={`${styles.bestsellers} ${isInView ? styles.inView : ""}`}
        itemScope
        itemType="https://schema.org/ItemList"
        aria-labelledby="bestsellers-title">
        <div className="container">
          <header className={styles.header}>
            <h2 id="bestsellers-title" className={styles.title} itemProp="name">
              Наши бестселлеры
            </h2>
            <p className={styles.subtitle}>
              Популярные модульные дома, которые выбирают наши клиенты
            </p>
          </header>

          <div
            className={styles.grid}
            role="list"
            aria-label="Список популярных модульных домов">
            {housesData.map((house, index) => (
              <article
                key={house.id}
                className={`${styles.card} ${
                  visibleCards.includes(index) ? styles.visible : ""
                }`}
                itemScope
                itemType="https://schema.org/Product"
                role="listitem"
                tabIndex="0"
                onClick={() => handleCardClick(house.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(house.slug);
                  }
                }}
                aria-label={`Модульный дом ${house.name}, площадь ${house.area}, цена ${house.price}`}>
                <div className={styles.imageContainer}>
                  <picture>
                    <source srcSet={house.imageWebp} type="image/webp" />
                    <img
                      src={house.image}
                      alt={`Модульный дом ${house.name} - ${house.feature}`}
                      className={styles.image}
                      loading="lazy"
                      itemProp="image"
                    />
                  </picture>
                  <div className={styles.imageOverlay} aria-hidden="true">
                    <span className={styles.viewMore}>Подробнее</span>
                  </div>
                </div>

                <div className={styles.content}>
                  <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle} itemProp="name">
                      {house.name}
                    </h3>
                    <div
                      className={styles.area}
                      aria-label={`Площадь дома: ${house.area}`}>
                      <span className={styles.areaIcon} aria-hidden="true">
                        📐
                      </span>
                      <span itemProp="floorSize">{house.area}</span>
                    </div>
                  </header>

                  <div className={styles.feature} itemProp="description">
                    <span className={styles.featureLabel}>Особенность:</span>
                    <span className={styles.featureText}>{house.feature}</span>
                  </div>

                  <div
                    className={styles.price}
                    itemProp="offers"
                    itemScope
                    itemType="https://schema.org/Offer">
                    <meta itemProp="priceCurrency" content="RUB" />
                    <meta
                      itemProp="availability"
                      content="https://schema.org/InStock"
                    />
                    <span className={styles.priceLabel}>Цена:</span>
                    <span className={styles.priceValue} itemProp="price">
                      {house.price}
                    </span>
                  </div>

                  <p className={styles.description}>{house.description}</p>

                  <button
                    className={styles.button}
                    type="button"
                    aria-label={`Подробнее о проекте дома ${house.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(house.slug);
                    }}>
                    <span>Подробнее о проекте</span>
                    <span className={styles.buttonIcon} aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          
          <div className={styles.catalogButtonContainer}>
            <button 
              className={styles.catalogButton} 
              type="button"
              onClick={() => router.push('/catalog')}
            >
              Смотреть весь каталог
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
