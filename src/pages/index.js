import Head from "next/head";
import Layout from "../components/Layout/Layout";
import Hero from "../components/Hero/Hero";
import ProblemSolution from "../components/ProblemSolution";
import Bestsellers from "../components/Bestsellers";
import Features from "../components/Features";
import ProjectConstructor from "../components/ProjectConstructor";
import VirtualTour from "../components/VirtualTour";
import ProductionProcess from "../components/ProductionProcess";
import DeliveryInstallation from "../components/DeliveryInstallation";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import Guarantees from "../components/Guarantees/Guarantees";
import PhotoGallery from "../components/PhotoGallery/PhotoGallery";
import FAQReviews from "../components/FAQReviews/FAQReviews";
import VideoReviews from "../components/VideoReviews/VideoReviews";


export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Easy House",
    description:
      "Строительство модульных домов под ключ за 30 дней от 655 000 рублей",
    url: "https://house-modular.ru",
    logo: "https://house-modular.ru/favicon-house.ico",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "RU",
      availableLanguage: "Russian",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "RU",
      addressRegion: "Ставропольский край",
    },
    priceRange: "655000-2000000 RUB",
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 45.0428,
        longitude: 41.9734,
      },
      geoRadius: "500000",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Модульные дома",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Модульный дом под ключ",
            description:
              "Полноценный модульный дом с отделкой и коммуникациями",
          },
          price: "655000",
          priceCurrency: "RUB",
          availability: "https://schema.org/InStock",
          deliveryLeadTime: {
            "@type": "QuantitativeValue",
            value: 30,
            unitCode: "DAY",
          },
        },
      ],
    },
  };

  return (
    <>
      <Head>
        <title>
          Строительство модульных домов под ключ 🔑 за 30 дней | От 655 000₽ за
          дом
        </title>
        <meta
          name="description"
          content="Модульные дома от производителя под ключ за 30 дней 🔑| Строительство модульных домов для круглогодичного проживания с отделкой и коммуникациями | Доставка и гарантия | Собственное производство модульных домов"
        />
        <meta
          name="keywords"
          content="модульный дом под ключ, модульный дом цена, купить модульный дом, готовый модульный дом, производство модульных домов, модульный дом с отделкой, модульный дом с коммуникациями, строительство модульных домов, модульные дома Ставрополь, модульные дома Краснодар"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://house-modular.ru/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://house-modular.ru/" />
        <meta
          property="og:title"
          content="Строительство модульных домов под ключ за 30 дней | От 655 000₽"
        />
        <meta
          property="og:description"
          content="Модульные дома от производителя под ключ за 30 дней. Полноценный дом с отделкой и коммуникациями. Доставка и гарантия."
        />
        <meta
          property="og:image"
          content="https://house-modular.ru/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="Easy House" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://house-modular.ru/" />
        <meta
          property="twitter:title"
          content="Строительство модульных домов под ключ за 30 дней | От 655 000₽"
        />
        <meta
          property="twitter:description"
          content="Модульные дома от производителя под ключ за 30 дней. Полноценный дом с отделкой и коммуникациями."
        />
        <meta
          property="twitter:image"
          content="https://house-modular.ru/og-image.jpg"
        />

        {/* Additional SEO */}
        <meta name="geo.region" content="RU-STA" />
        <meta name="geo.placename" content="Ставропольский край" />
        <meta name="ICBM" content="45.0428, 41.9734" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Easy House" />
        <meta name="language" content="ru" />
        <link rel="alternate" hrefLang="ru" href="https://house-modular.ru/" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>

      <Layout>
        <Hero />
        <ProblemSolution />
        <Bestsellers />
        <Features />
        <VirtualTour />
        <ProductionProcess />
        <ProjectConstructor />
        <WhyChooseUs />
        <Guarantees />
        <PhotoGallery />
        <DeliveryInstallation />
        <FAQReviews />
        <VideoReviews />
      </Layout>
    </>
  );
}
