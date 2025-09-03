import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import CompanyInfo from '../components/ContactsPage/CompanyInfo';
import TeamSection from '../components/ContactsPage/TeamSection';
import SocialLinks from '../components/ContactsPage/SocialLinks';
import MapSection from '../components/ContactsPage/MapSection';
import styles from './Kontakty.module.css';

export default function Kontakty() {
  return (
    <Layout>
      <Head>
        <title>Контакты Easy House - модульные дома</title>
        <meta name="description" content="Контакты компании Easy House. Телефон 8(996)417-90-01, адрес, время работы. Свяжитесь с нами для заказа модульного дома." />
        <meta name="keywords" content="контакты Easy House, телефон, адрес, связь, консультация, заказ модульного дома" />
        <link rel="canonical" href="https://your-domain.com/kontakty" />
        <meta property="og:title" content="Контакты Easy House - модульные дома" />
        <meta property="og:description" content="Контакты компании Easy House. Телефон 8(996)417-90-01, адрес, время работы. Свяжитесь с нами для заказа модульного дома." />
        <meta property="og:url" content="https://your-domain.com/kontakty" />
        <meta property="og:type" content="website" />
        <script src="https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU" async></script>
      </Head>

      <main className={styles.contactsPage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1 className={styles.title}>Контакты</h1>
              <p className={styles.subtitle}>
                Свяжитесь с нами любым удобным способом. Мы всегда готовы ответить на ваши вопросы
              </p>
            </div>
          </div>
        </section>

        {/* Contacts Section */}
        <section className={styles.contactsSection}>
          <div className={styles.container}>
            <div className={styles.contactsGrid}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>📞</div>
                <h3 className={styles.contactTitle}>Телефон</h3>
                <div className={styles.contactInfo}>
                  <p><a href="tel:89964179001">8 (996) 417-90-01</a></p>
                  <p>Звонки принимаем ежедневно</p>
                </div>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>✉️</div>
                <h3 className={styles.contactTitle}>Email</h3>
                <div className={styles.contactInfo}>
                  <p><a href="mailto:info@easyhouse.ru">info@easyhouse.ru</a></p>
                  <p>Ответим в течение часа</p>
                </div>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>📍</div>
                <h3 className={styles.contactTitle}>Адрес</h3>
                <div className={styles.contactInfo}>
                  <p>г. Ставрополь, ул. Севрюкова, 94</p>
                  <p>Производственная база</p>
                </div>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>💬</div>
                <h3 className={styles.contactTitle}>WhatsApp</h3>
                <div className={styles.contactInfo}>
                  <p><a href="https://wa.me/89964179001">8 (996) 417-90-01</a></p>
                  <p>Быстрые ответы в мессенджере</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Working Hours */}
        <section className={styles.workingHours}>
          <div className={styles.container}>
            <h2 className={styles.title} style={{color: '#333', marginBottom: '50px'}}>Режим работы</h2>
            <div className={styles.hoursGrid}>
              <div className={styles.hoursCard}>
                <h3 className={styles.hoursTitle}>Офис</h3>
                <div className={styles.hoursInfo}>
                  <p>Пн-Пт: 9:00 - 18:00</p>
                  <p>Сб: 10:00 - 16:00</p>
                  <p>Вс: выходной</p>
                </div>
              </div>

              <div className={styles.hoursCard}>
                <h3 className={styles.hoursTitle}>Производство</h3>
                <div className={styles.hoursInfo}>
                  <p>Пн-Пт: 8:00 - 17:00</p>
                  <p>Сб-Вс: выходные</p>
                  <p>Экскурсии по записи</p>
                </div>
              </div>

              <div className={styles.hoursCard}>
                <h3 className={styles.hoursTitle}>Консультации</h3>
                <div className={styles.hoursInfo}>
                  <p>Ежедневно: 8:00 - 22:00</p>
                  <p>Телефон и WhatsApp</p>
                  <p>Без выходных</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <TeamSection />

        {/* Social Links and Contact Buttons */}
        <SocialLinks />

        {/* Map Section */}
        <MapSection />

        {/* Company Info */}
        <CompanyInfo />
      </main>
    </Layout>
  );
}