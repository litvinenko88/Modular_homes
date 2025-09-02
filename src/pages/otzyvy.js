import Head from 'next/head';
import Layout from '../components/Layout/Layout';
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
      </Head>
      <main style={{ paddingTop: '80px' }}>
        <h1 style={{ position: 'absolute', left: '-9999px', fontSize: '1px' }}>Отзывы клиентов о модульных домах Easy House</h1>
        <VideoTestimonials />
        <VideoReviews showAllVideos={true} />
        <FAQReviews />
      </main>
    </Layout>
  );
}