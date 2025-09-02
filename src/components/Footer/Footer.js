import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.querySelector(`.${styles.footer}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.grid}>
            <div className={styles.company}>
              <h3 className={styles.logo}>Easy House</h3>
              <p className={styles.description}>
                Строительство модульных домов под ключ за 30 дней. Качество,
                надежность и комфорт для вашей семьи.
              </p>
              <div className={styles.contacts}>
                <a href="tel:+79001234567" className={styles.phone}>
                  +7 (996) 417-90-01
                </a>
              </div>
            </div>

            <div className={styles.links}>
              <h4 className={styles.title}>Каталог</h4>
              <ul className={styles.linksList}>
                <li>
                  <Link href="/catalog">Для бизнеса </Link>
                </li>
                <li>
                  <Link href="/catalog/barnhouse">Барнхаус</Link>
                </li>
                <li>
                  <Link href="/catalog/arkhangelsk">А-фрейм</Link>
                </li>
                <li>
                  <Link href="/catalog/modern">С терассой </Link>
                </li>
                <li>
                  <Link href="/catalog/modern">Для проживания </Link>
                </li>
                <li>
                  <Link href="/catalog/modern">С баней </Link>
                </li>
                <li>
                  <Link href="/catalog/modern">Мини</Link>
                </li>
              </ul>
            </div>

            <div className={styles.links}>
              <h4 className={styles.title}>Регионы</h4>
              <ul className={styles.linksList}>
                <li>
                  <Link href="/">Вся Россия</Link>
                </li>
                <li>
                  <Link href="/services/construction">Ставропольский край</Link>
                </li>
                <li>
                  <Link href="/services/delivery">Краснодарский край</Link>
                </li>
                <li>
                  <Link href="/services/installation">Республика КЧР</Link>
                </li>
                <li>
                  <Link href="/services/warranty">Республика КБР</Link>
                </li>
              </ul>
            </div>

            <div className={styles.links}>
              <h4 className={styles.title}>Компания</h4>
              <ul className={styles.linksList}>
                <li>
                  <Link href="/about">О компании</Link>
                </li>
                <li>
                  <Link href="/portfolio">Выполненые проекты</Link>
                </li>
                <li>
                  <Link href="/reviews">Отзывы</Link>
                </li>
                <li>
                  <Link href="/contacts">Контакты</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.copyright}>
              © 2024 Easy House. Все права защищены.
            </div>
            <div className={styles.legal}>
              <Link href="/privacy">Политика конфиденциальности</Link>
              <Link href="/terms">Пользовательское соглашение</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
