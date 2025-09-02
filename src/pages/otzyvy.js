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
      </Head>
      <main style={{ paddingTop: '80px' }}>
        <VideoTestimonials />
        <VideoReviews showAllVideos={true} />
        <FAQReviews />
      </main>
    </Layout>
  );
}