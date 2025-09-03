import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import VideoTestimonials from '../components/VideoTestimonials';
import VideoReviews from '../components/VideoReviews/VideoReviews';
import FAQReviews from '../components/FAQReviews/FAQReviews';

export default function Otzyvy() {
  return (
    <Layout>
      <Head>
        <title>Отзывы клиентов о модульных домах | Easy House</title>
        <meta name="description" content="Отзывы наших клиентов о модульных домах Easy House. Видео отзывы и часто задаваемые вопросы." />
        <meta name="keywords" content="отзывы о модульных домах, видео отзывы, мнения клиентов, качество строительства, Easy House отзывы" />
        <link rel="canonical" href="https://your-domain.com/otzyvy" />
        <meta property="og:title" content="Отзывы клиентов о модульных домах | Easy House" />
        <meta property="og:description" content="Отзывы наших клиентов о модульных домах Easy House. Видео отзывы и часто задаваемые вопросы." />
        <meta property="og:url" content="https://your-domain.com/otzyvy" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://your-domain.com/img/reviews-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Отзывы клиентов о модульных домах Easy House" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Отзывы клиентов о модульных домах | Easy House" />
        <meta name="twitter:description" content="Отзывы наших клиентов о модульных домах Easy House. Видео отзывы и часто задаваемые вопросы." />
        <meta name="twitter:image" content="https://your-domain.com/img/reviews-preview.jpg" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Отзывы клиентов о модульных домах Easy House",
            "description": "Отзывы наших клиентов о модульных домах Easy House. Видео отзывы и часто задаваемые вопросы.",
            "url": "https://your-domain.com/otzyvy",
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Из каких материалов строятся ваши модульные дома?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Мы используем экологичные и проверенные материалы: каркас из строганной древесины камерной сушки, утеплитель Rockwool, обшивку из ГСП-плит."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Можно ли жить в таком доме зимой?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Да, наши дома рассчитаны на круглогодичное проживание. Многослойное утепление стен (150-200 мм) и кровли обеспечивает комфортную температуру даже при -30°C."
                  }
                }
              ]
            }
          })}
        </script>
      </Head>
      <Breadcrumbs />
      <main style={{ paddingTop: '80px' }}>
        <header style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#f8f9fa'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#333'
          }}>Отзывы клиентов о модульных домах Easy House</h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>Реальные истории наших клиентов, видео отзывы и ответы на популярные вопросы</p>
        </header>
        <VideoTestimonials />
        <VideoReviews showAllVideos={true} />
        <FAQReviews />
      </main>
    </Layout>
  );
}