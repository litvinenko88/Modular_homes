import Head from "next/head";
import Layout from "../components/Layout/Layout";
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import VideoReviews from "../components/VideoReviews/VideoReviews";
import styles from "./OKompanii.module.css";

export default function OKompanii() {
  return (
    <Layout>
      <Head>
        <title>О компании Easy House - производитель модульных домов</title>
        <meta
          name="description"
          content="О компании Easy House. Производство модульных домов, наши преимущества, гарантии и процесс производства."
        />
        <meta
          name="keywords"
          content="о компании Easy House, производство модульных домов, преимущества, гарантии, качество строительства"
        />
        <link rel="canonical" href="https://your-domain.com/o-kompanii" />
        <meta
          property="og:title"
          content="О компании Easy House - производитель модульных домов"
        />
        <meta
          property="og:description"
          content="О компании Easy House. Производство модульных домов, наши преимущества, гарантии и процесс производства."
        />
        <meta property="og:url" content="https://your-domain.com/o-kompanii" />
        <meta property="og:type" content="website" />
      </Head>
      <Breadcrumbs />
      <main className={styles.aboutPage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1 className={styles.title}>О компании Easy House</h1>
              <p className={styles.subtitle}>
                Мы производим качественные модульные дома для комфортной жизни
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className={styles.contentSection}>
          <div className={styles.container}>
            <div className={styles.contentGrid}>
              <div className={styles.textContent}>
                <p>
                  Наша компания уже более 7 лет создает современные и доступные
                  модульные дома для жизни для людей по всей России. Мы начали с
                  небольшой мастерской, а сегодня — это современное производство
                  с немецким оборудованием, которое позволяет выпускать до 12
                  домокомплектов в месяц.
                </p>
                <p>
                  Наш секрет успеха прост: мы не просто продаем дома, мы
                  предлагаем комплексное решение «под ключ». От проектирования и
                  производства до монтажа и отделки — все этапы мы контролируем
                  сами. Это позволяет гарантировать высочайшее качество,
                  соблюдать сроки и удерживать честные цены без посредников.
                </p>
                <p>
                  Мы используем только проверенные материалы: каркас из сухой
                  строганной древесины, экологичный утеплитель Rockwool,
                  пожаробезопасные ГСП-плиты. Каждый наш дом — это результат
                  точной работы инженеров и современных технологий.
                </p>
              </div>
              <div className={styles.videoContainer}>
                <video className={styles.video} controls preload="metadata">
                  <source src="/video/proizvodstvo.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.reviewsCallout}>
          <div className={styles.animatedBackground}>
            <div className={styles.particle}></div>
            <div className={styles.particle}></div>
            <div className={styles.particle}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.star}></div>
            <div className={styles.star}></div>
            <div className={styles.star}></div>
          </div>
          <div className={styles.container}>
            <div className={styles.calloutContent}>
              <h2 className={styles.calloutTitle}>
                Узнайте больше от наших клиентов
              </h2>
              <p className={styles.calloutText}>
                Посмотрите честные отзывы людей, которые уже живут в наших домах
              </p>
              
              <div className={styles.videoReviewsGrid}>
                <video className={styles.reviewVideo} controls preload="metadata">
                  <source src="/video/otz1.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
                <video className={styles.reviewVideo} controls preload="metadata">
                  <source src="/video/otz2.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
                <video className={styles.reviewVideo} controls preload="metadata">
                  <source src="/video/otz3.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
                <video className={styles.reviewVideo} controls preload="metadata">
                  <source src="/video/otz4.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              </div>
              
              <a href="/otzyvy" className={styles.calloutButton}>
                Смотреть все отзывы
              </a>
            </div>
          </div>
        </section>

        {/* Additional Content */}
        <section
          className={styles.contentSection}
          style={{ background: "white" }}>
          <div className={styles.container}>
            <div className={styles.textContent}>
              <p>
                Нас выбирают за выгодные цены на дома под ключ для
                круглогодичного проживания и строительство бань под ключ, что
                делает наши предложения отличным выбором.
              </p>
              <p>
                Опыт производителя модульных домов в создании качественных
                проектов. Более 800 успешно реализованных проектов, включая дома
                и бани под ключ, которые выдерживают любые погодные условия.
              </p>
              <p>
                Технологии, которые мы используем, позволяют изготавливать
                модульные дома в различных комплектациях. Собственное
                производство и немецкое оборудование Weinmann, что обеспечивает
                высокое качество в любых погодных условиях.
              </p>
              <p>
                Надежность и качество от производителя модульных домов одного
                модуля. Прозрачный договор и гарантия 5 лет на комплектацию
                домов.
              </p>
              <p>
                Скорость: строительство модульного дома зависит от выбранных
                вами опций. От заказа до заезда — 30 дней на строительство
                выставочных домов, чтобы вы могли увидеть качество нашей работы.
              </p>
              <p>
                Мы верим, что мечта о собственном доме должна быть доступной. И
                мы делаем всё, чтобы она стала реальностью для каждой семьи.
              </p>
            </div>
          </div>
        </section>

        {/* Video Reviews */}
        <VideoReviews showViewAllButton={true} />

        {/* Reviews Callout */}

        {/* Company Info */}
        <section className={styles.companyInfo}>
          <div className={styles.container}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Реквизиты компании</h3>
                <div className={styles.infoText}>
                  <p>
                    <strong>Название организации:</strong>
                    <br />
                    ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ БАЖАНОВ ВЛАДИМИР
                    АЛЕКСАНДРОВИЧ
                  </p>
                  <p>
                    <strong>ИНН:</strong> 263411519024
                  </p>
                  <p>
                    <strong>ОГРНИП:</strong> 322265100067452
                  </p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Юридический адрес</h3>
                <div className={styles.infoText}>
                  <p>
                    355013, РОССИЯ, СТАВРОПОЛЬСКИЙ КРАЙ, Г СТАВРОПОЛЬ, УЛ
                    СЕВРЮКОВА, Д 94
                  </p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Банковские реквизиты</h3>
                <div className={styles.infoText}>
                  <p>
                    <strong>Расчетный счет:</strong> 40802810400003407449
                  </p>
                  <p>
                    <strong>Банк:</strong> АО «ТБанк»
                  </p>
                  <p>
                    <strong>БИК:</strong> 044525974
                  </p>
                  <p>
                    <strong>Корр. счет:</strong> 30101810145250000974
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
