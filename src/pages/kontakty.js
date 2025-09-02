import Head from 'next/head';
import Layout from '../components/Layout/Layout';

export default function Kontakty() {
  return (
    <Layout>
      <Head>
        <title>Контакты Easy House - модульные дома</title>
        <meta name="description" content="Контакты компании Easy House. Телефон, адрес, время работы. Свяжитесь с нами для заказа модульного дома." />
        <meta name="keywords" content="контакты Easy House, телефон, адрес, связь, консультация, заказ модульного дома" />
        <link rel="canonical" href="https://your-domain.com/kontakty" />
        <meta property="og:title" content="Контакты Easy House - модульные дома" />
        <meta property="og:description" content="Контакты компании Easy House. Телефон, адрес, время работы. Свяжитесь с нами для заказа модульного дома." />
        <meta property="og:url" content="https://your-domain.com/kontakty" />
        <meta property="og:type" content="website" />
      </Head>
      <main style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Контакты</h1>
        <p>Раздел в разработке</p>
      </main>
    </Layout>
  );
}