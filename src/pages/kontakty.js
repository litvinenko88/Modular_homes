import Head from 'next/head';
import Layout from '../components/Layout/Layout';

export default function Kontakty() {
  return (
    <Layout>
      <Head>
        <title>Контакты Easy House - модульные дома</title>
        <meta name="description" content="Контакты компании Easy House. Телефон, адрес, время работы. Свяжитесь с нами для заказа модульного дома." />
      </Head>
      <main style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Контакты</h1>
        <p>Раздел в разработке</p>
      </main>
    </Layout>
  );
}