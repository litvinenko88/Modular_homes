import { useState, useEffect, useRef } from 'react'
import styles from './Reviews.module.css'

export default function Reviews() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const reviews = [
    {
      name: "Анна и Михаил",
      location: "г. Краснодар",
      text: "Заказали дом «Барнхаус» 35 м² для дачи. Собрали за день. Качество на высоте: зимой тепло, летом прохладно, что делает дачный дом идеальным для комфортного проживания. Ни разу не пожалели о выборе одного модуля.",
      avatar: "/img/reviews/1.jpg"
    },
    {
      name: "Сергей",
      location: "Ростовская обл.",
      text: "Искал недорогой вариант для постоянного проживания и решил купить модульный дом. Остановился на «Новом Архангельске», так как это один из лучших проектов модульных домов для жизни. Цена фиксированная, приехали в срок, все сделали аккуратно. Живу уже год — нареканий нет.",
      avatar: "/img/reviews/2.jpg"
    },
    {
      name: "Ольга",
      location: "Ставропольский край",
      text: "Очень переживала, что будет холодно в одном модуле. Но даже в -25 дом держит температуру отлично! Счета за отопление минимальные. Спасибо за качественное утепление!",
      avatar: "/img/reviews/3.jpg"
    },
    {
      name: "Иван",
      location: "г. Волгоград",
      text: "Покупал дом под сдачу в аренду. Гости в восторге! Собрали быстро, без проблем с документами. Окупился уже за первый сезон, благодаря удобству и комфортом проживания в модульном доме.",
      avatar: "/img/reviews/4.jpg"
    },
    {
      name: "Екатерина",
      location: "Краснодарский край",
      text: "Нравится, что всё включено: от розеток до душевой кабины в домах для круглогодичного проживания под ключ. Не пришлось ничего докупать. Заехали и живем. Рекомендую! Мы производим каркасные дома с учетом всех пожеланий клиентов.",
      avatar: "/img/reviews/5.webp"
    },
    {
      name: "Дмитрий",
      location: "г. Астрахань",
      text: "Выбрал модульный дом из-за сроков строительства модульных домов. Не ошибся: от договора до заезда — ровно месяц. Качество сборки отличное, стены ровные, что позволяет дому справляться с любыми погодными условиями.",
      avatar: "/img/reviews/6.jpg"
    },
    {
      name: "Мария",
      location: "Подмосковье",
      text: "Брала дом для матери. Она в восторге: всё продумано, уютно и тепло. Спасибо за человеческое отношение и оперативность, особенно в сложных погодных условиях.",
      avatar: "/img/reviews/7.webp"
    },
    {
      name: "Алексей",
      location: "г. Сочи",
      text: "Переехал из квартиры в свой «Угловой Архангельск». Просторно, светло, своя терраса внутри дома. Мечта сбылась быстрее, чем думал, благодаря большому выбору проектов модульных домов, которые подходят для любых погодных условий.",
      avatar: "/img/reviews/8.webp"
    },
    {
      name: "Татьяна",
      location: "Волгоградская обл.",
      text: "Сомневались насчёт модульной технологии, но решились. Не зря! Многие выбирают купить модульный дом для комфортного проживания на участке. Дом тёплый, тихий, а главное — свой. Фундамент заложили за один день с минимизацией времени на строительство.",
      avatar: "/img/reviews/9.webp"
    },
    {
      name: "Виктор",
      location: "г. Кисловодск",
      text: "Заказал дом с умным домом. Всё работает исправно, приложение удобное. Строили зимой — это не помешало. Молодцы!",
      avatar: "/img/reviews/10.webp"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % reviews.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [reviews.length])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setCurrentSlide(prev => (prev + 1) % reviews.length)
      } else {
        setCurrentSlide(prev => (prev - 1 + reviews.length) % reviews.length)
      }
    }
  }

  return (
    <div className={styles.reviews}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Что говорят наши клиенты
        </h3>
        <p className={styles.subtitle}>
          Мы гордимся каждым реализованным проектом и благодарны нашим клиентам за доверие и честные отзывы. Вот что они рассказывают о своем опыте.
        </p>
      </div>

      <div 
        className={styles.slider}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={styles.slidesContainer}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {reviews.map((review, index) => (
            <div key={index} className={styles.slide}>
              <div className={styles.reviewCard}>
                <div className={styles.reviewText}>
                  "{review.text}"
                </div>
                <div className={styles.reviewAuthor}>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorAvatar}>
                      <img 
                        src={review.avatar} 
                        alt={`Фото клиента ${review.name} из ${review.location} - отзыв о модульном доме Easy House`}
                        width="60"
                        height="60"
                        onError={(e) => {
                          e.target.src = '/img/default-avatar.jpg';
                          e.target.alt = 'Аватар по умолчанию';
                        }}
                      />
                    </div>
                    <div className={styles.authorDetails}>
                      <div className={styles.authorName}>{review.name}</div>
                      <div className={styles.authorLocation}>{review.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === (currentSlide % reviews.length) ? styles.active : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Easy House",
            "review": reviews.slice(0, 5).map((review, index) => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": review.name
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "reviewBody": review.text,
              "datePublished": new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            }))
          })
        }}
      />
    </div>
  )
}