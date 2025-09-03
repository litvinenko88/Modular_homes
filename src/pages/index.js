import Layout from '../components/Layout/Layout'
import Hero from '../components/Hero/Hero'
import Features from '../components/Features/Features'
import Bestsellers from '../components/Bestsellers/Bestsellers'
import ProblemSolution from '../components/ProblemSolution/ProblemSolution'
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs'
import ProductionProcess from '../components/ProductionProcess/ProductionProcess'
import Guarantees from '../components/Guarantees/Guarantees'
import DeliveryInstallation from '../components/DeliveryInstallation/DeliveryInstallation'
import VideoReviews from '../components/VideoReviews/VideoReviews'
import FAQReviews from '../components/FAQReviews/FAQReviews'
import PhotoGallery from '../components/PhotoGallery/PhotoGallery'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Модульные дома под ключ от 855 000₽ | Easy House</title>
        <meta name="description" content="Модульные дома под ключ от производителя. Строительство за 30 дней, фиксированная цена, полный цикл работ. Заказать модульный дом в Архангельске." />
        <meta name="keywords" content="модульные дома, дома под ключ, строительство домов, модульное строительство, дома Архангельск" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://easyhouse29.ru/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Модульные дома под ключ от 855 000₽ | Easy House" />
        <meta property="og:description" content="Модульные дома под ключ от производителя. Строительство за 30 дней, фиксированная цена, полный цикл работ." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://easyhouse29.ru/" />
        <meta property="og:image" content="https://easyhouse29.ru/img/hero-bg.webp" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Модульные дома под ключ от 855 000₽ | Easy House" />
        <meta name="twitter:description" content="Модульные дома под ключ от производителя. Строительство за 30 дней, фиксированная цена, полный цикл работ." />
        <meta name="twitter:image" content="https://easyhouse29.ru/img/hero-bg.webp" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Easy House",
              "url": "https://easyhouse29.ru",
              "logo": "https://easyhouse29.ru/favicon-new.svg",
              "description": "Производитель модульных домов под ключ",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Архангельск",
                "addressCountry": "RU"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+7-900-000-00-00",
                "contactType": "customer service"
              }
            })
          }}
        />
      </Head>
      
      <Layout>
        <Hero />
        <Features />
        <Bestsellers />
        <ProblemSolution />
        <WhyChooseUs />
        <ProductionProcess />
        <Guarantees />
        <DeliveryInstallation />
        <VideoReviews />
        <FAQReviews />
        <PhotoGallery />
      </Layout>
    </>
  )
}