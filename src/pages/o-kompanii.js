import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Guarantees from '../components/Guarantees/Guarantees';
import ProductionProcess from '../components/ProductionProcess';

export default function OKompanii() {
  return (
    <Layout>
      <Head>
        <title>О компании Easy House - производитель модульных домов</title>
        <meta name="description" content="О компании Easy House. Производство модульных домов, наши преимущества, гарантии и процесс производства." />
        <meta name="keywords" content="о компании Easy House, производство модульных домов, преимущества, гарантии, качество строительства" />
        <link rel="canonical" href="https://your-domain.com/o-kompanii" />
        <meta property="og:title" content="О компании Easy House - производитель модульных домов" />
        <meta property="og:description" content="О компании Easy House. Производство модульных домов, наши преимущества, гарантии и процесс производства." />
        <meta property="og:url" content="https://your-domain.com/o-kompanii" />
        <meta property="og:type" content="website" />
      </Head>
      <main style={{ paddingTop: '80px' }}>
        <section style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: '20px',
              color: '#333'
            }}>
              О компании Easy House
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              textAlign: 'center', 
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}>
              Мы производим качественные модульные дома для комфортной жизни
            </p>
          </div>
        </section>
        <WhyChooseUs />
        <ProductionProcess />
        <Guarantees />
      </main>
    </Layout>
  );
}