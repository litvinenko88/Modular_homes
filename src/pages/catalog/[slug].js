import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout/Layout';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ContactForm from '../../components/ContactForm';
import styles from '../projects/ProjectDetail.module.css';

const projectsData = {
  'novyj-arkhangelsk': {
    name: 'Новый Архангельск',
    images: ['/img/New_Arkhangelsk/1.jpg', '/img/New_Arkhangelsk/2.webp', '/img/New_Arkhangelsk/3.webp', '/img/New_Arkhangelsk/4.webp'],
    blueprints: ['/img/New_Arkhangelsk/5h.webp'],
    specs: {
      ceiling: '2,0 - 2,2 м',
      wallThickness: '176 мм',
      wallInsulation: '100 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '15 кв/м', dimensions: '6*2,5м', price: 855000 },
      { area: '17,5 кв/м', dimensions: '7*2,5м', price: 990000 },
      { area: '20 кв/м', dimensions: '8*2,5м', price: 1080000 }
    ]
  },
  'arkhangelsk-s-terrasoj': {
    name: 'Архангельск с террасой',
    images: ['/img/Arkhangelsk_terrace/1.jpg', '/img/Arkhangelsk_terrace/2.webp', '/img/Arkhangelsk_terrace/3.webp', '/img/Arkhangelsk_terrace/4.webp'],
    blueprints: ['/img/Arkhangelsk_terrace/5h.webp'],
    specs: {
      ceiling: '2,0 - 2,2 м',
      wallThickness: '176 мм',
      wallInsulation: '100 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '15 кв/м + терраса из лиственницы', dimensions: '', price: 1075000 },
      { area: '17,5 кв/м + терраса из лиственницы', dimensions: '', price: 1258000 },
      { area: '20 кв/м + терраса из лиственницы', dimensions: '', price: 1325000 }
    ]
  },
  'uglovoj-arkhangelsk': {
    name: 'Угловой Архангельск',
    images: ['/img/Angular_Arkhangelsk/1.jpg', '/img/Angular_Arkhangelsk/2.webp', '/img/Angular_Arkhangelsk/3.webp', '/img/Angular_Arkhangelsk/4.webp'],
    blueprints: ['/img/Angular_Arkhangelsk/5h.webp'],
    specs: {
      ceiling: '2,0 - 2,2 м',
      wallThickness: '176 мм',
      wallInsulation: '100 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '21,5 кв/м', dimensions: '6*5м', price: 1265000 },
      { area: '24 кв/м', dimensions: '7*5м', price: 1381000 },
      { area: '28,5 кв/м', dimensions: '', price: 1577000 }
    ]
  },
  'barnkhaus': {
    name: 'Барн-Хаус',
    images: ['/img/Barnhouse/1.jpg', '/img/Barnhouse/2.webp', '/img/Barnhouse/3.webp', '/img/Barnhouse/4.webp'],
    blueprints: ['/img/Barnhouse/5h.webp'],
    specs: {
      ceiling: '2,1 - 2,45 м',
      wallThickness: '176 мм',
      wallInsulation: '100 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '15 кв/м', dimensions: '', price: 891000 },
      { area: '17,5 кв/м', dimensions: '', price: 1010000 },
      { area: '20 кв/м', dimensions: '', price: 1110000 }
    ]
  },
  'dvukhmodulnaya-dvineya': {
    name: 'Двухмодульная Двинея',
    images: ['/img/Two_module_Lane/1.jpg', '/img/Two_module_Lane/2.webp', '/img/Two_module_Lane/3.webp', '/img/Two_module_Lane/4.webp'],
    blueprints: ['/img/Two_module_Lane/5h.webp'],
    specs: {
      ceiling: '2,1 - 2,3 м',
      wallThickness: '176 мм',
      wallInsulation: '100 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '30 кв/м', dimensions: '6*5м', price: 1430000 },
      { area: '35 кв/м', dimensions: '7*5м', price: 1630000 },
      { area: '40 кв/м', dimensions: '8*5м', price: 1830000 }
    ]
  },
  'chetyrekhmodulnyj-barn': {
    name: 'Четырехмодульный Барн',
    images: ['/img/Four_Module_Barn/1.jpg', '/img/Four_Module_Barn/2.webp', '/img/Four_Module_Barn/3.webp', '/img/Four_Module_Barn/4.webp'],
    blueprints: ['/img/Four_Module_Barn/5h.webp'],
    specs: {
      ceiling: '2,1 - 2,45 м',
      wallThickness: '226 мм',
      wallInsulation: '150 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '70 кв/м', dimensions: '7*10м', price: 3130000 },
      { area: '80 кв/м', dimensions: '8*10м', price: 3620000 }
    ]
  },
  'novyj-s-paluboj': {
    name: 'Новый',
    images: ['/img/New_House_with_Deck _and_Pergola/1.jpg', '/img/New_House_with_Deck _and_Pergola/2.webp', '/img/New_House_with_Deck _and_Pergola/3.webp', '/img/New_House_with_Deck _and_Pergola/4.webp'],
    blueprints: ['/img/New_House_with_Deck _and_Pergola/5h.webp'],
    specs: {
      ceiling: '2,2 - 2,4 м',
      wallThickness: '176 мм',
      wallInsulation: '100 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '6*2,5 с палубой и перголой', dimensions: '', price: 1062500 },
      { area: '7*2,5 с палубой и перголой', dimensions: '', price: 1235500 },
      { area: '8*2,5 с палубой и перголой', dimensions: '', price: 1323000 }
    ]
  },
  'barn-s-terrasoj': {
    name: 'Барн с террасой',
    images: ['/img/Barn_with_terrace/1.jpg', '/img/Barn_with_terrace/2.webp', '/img/Barn_with_terrace/3.webp', '/img/Barn_with_terrace/4.webp'],
    blueprints: ['/img/Barn_with_terrace/5h.webp'],
    specs: {
      ceiling: '2,1 - 2,45 м',
      wallThickness: '226 мм',
      wallInsulation: '150 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '30 кв/м', dimensions: '6*5м', price: 1731000 },
      { area: '35 кв/м', dimensions: '7*5м', price: 1935000 },
      { area: '40 кв/м', dimensions: '8*5м', price: 2125000 }
    ]
  },
  'barn': {
    name: 'Барн',
    images: ['/img/Barn_House/1.jpg', '/img/Barn_House/2.webp', '/img/Barn_House/3.webp', '/img/Barn_House/4.webp'],
    blueprints: ['/img/Barn_House/5h.webp'],
    specs: {
      ceiling: '2,1 - 2,45 м',
      wallThickness: '226 мм',
      wallInsulation: '150 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '30 кв/м', dimensions: '6*5м', price: 1490000 },
      { area: '35 кв/м', dimensions: '7*5м', price: 1690000 },
      { area: '40 кв/м', dimensions: '8*5м', price: 1890000 }
    ]
  },
  'trekhmodulnyj-barn': {
    name: 'Трехмодульный Барн',
    images: ['/img/Three_Module_Barn/1.jpg', '/img/Three_Module_Barn/2.webp', '/img/Three_Module_Barn/3.webp', '/img/Three_Module_Barn/4.webp'],
    blueprints: ['/img/Three_Module_Barn/5h.webp'],
    specs: {
      ceiling: '2,1 - 2,45 м',
      wallThickness: '226 мм',
      wallInsulation: '150 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '52,5 кв/м', dimensions: '7*7,5м', price: 2420000 },
      { area: '60 кв/м', dimensions: '8*7,5м', price: 2880000 }
    ]
  },
  'uglovoj-arkhangelsk-s-terrasoj': {
    name: 'Угловой Архангельск с террасой',
    images: ['/img/Arkhangelsk_corner_with_terrace/1.jpg', '/img/Arkhangelsk_corner_with_terrace/2.webp', '/img/Arkhangelsk_corner_with_terrace/3.webp', '/img/Arkhangelsk_corner_with_terrace/4.webp'],
    blueprints: ['/img/Arkhangelsk_corner_with_terrace/5h.webp'],
    specs: {
      ceiling: '2,0 - 2,2 м',
      wallThickness: '176 мм',
      wallInsulation: '100 мм',
      partitionThickness: '121 мм',
      partitionInsulation: '50 мм'
    },
    equipment: [
      'Фундамент',
      'Каркас: строганная древесина камерной сушки',
      'Наружная отделка: имитация бруса, профлист',
      'Крыша: односкатная, мягкая кровля',
      'Электрика: светильники, розетки, выключатели, автомат',
      'Стены, потолок: сосна (комната отдыха, санузел)',
      'Пол: OSB+линолеум/OSB+подготовка под ламинат, кварцвинил',
      'Окна: ПВХ',
      'Двери: входная - ПВХ, межкомнатные - МДФ',
      'Отопительные конвекторы',
      'Бойлер',
      'С/У: унитаз, раковина, ванна'
    ],
    sizes: [
      { area: '21,5 кв/м', dimensions: '6*5м', price: 1345500 },
      { area: '24 кв/м', dimensions: '7*5м', price: 1461500 },
      { area: '28,5 кв/м', dimensions: '8*5м', price: 1657000 }
    ]
  }
};

export default function CatalogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [selectedSize, setSelectedSize] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [showBlueprints, setShowBlueprints] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // Sanitize slug to prevent XSS
  const sanitizedSlug = useMemo(() => {
    return typeof slug === 'string' ? slug.replace(/[^a-zA-Z0-9-_]/g, '') : '';
  }, [slug]);

  const project = projectsData[sanitizedSlug];

  useEffect(() => {
    if (project && project.sizes.length > 0) {
      setSelectedSize(0);
    }
  }, [project]);

  useEffect(() => {
    if (isContactFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isContactFormOpen]);

  useEffect(() => {
    window.closeContactFormCatalog = () => setIsContactFormOpen(false);
    return () => {
      delete window.closeContactFormCatalog;
    };
  }, []);

  if (!project) {
    return (
      <Layout>
        <Head>
          <title>Проект не найден | Easy House</title>
          <meta name="description" content="Запрашиваемый проект модульного дома не найден. Посмотрите наш каталог доступных проектов." />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Breadcrumbs />
        <main style={{ 
          padding: 'var(--spacing-3xl)', 
          textAlign: 'center', 
          color: 'var(--color-gray)',
          fontSize: 'var(--text-size-lg)',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            🚫 Проект не найден
          </h1>
          <p style={{ marginBottom: '2rem', maxWidth: '500px' }}>
            Извините, запрашиваемый проект модульного дома не найден. Пожалуйста, проверьте правильность ссылки или посмотрите наш каталог.
          </p>
          <a 
            href="/catalog" 
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            Перейти в каталог
          </a>
        </main>
      </Layout>
    );
  }

  const currentPrice = project?.sizes?.[selectedSize]?.price || 0;
  const displayImages = showBlueprints ? (project?.blueprints || []) : (project?.images || []);
  
  // Memoize formatted price to avoid recalculation
  const formattedPrice = useMemo(() => {
    return currentPrice.toLocaleString('ru-RU');
  }, [currentPrice]);

  return (
    <Layout>
      <Head>
        <title>{project.name} - модульный дом от {formattedPrice} руб | Easy House</title>
        <meta name="description" content={`Модульный дом ${project.name} от ${formattedPrice} руб. Подробные характеристики, фото, чертежи и комплектация. Строительство под ключ.`} />
        <meta name="keywords" content={`${project.name}, модульный дом, цена, характеристики, купить, строительство под ключ`} />
        <link rel="canonical" href={`https://your-domain.com/catalog/${sanitizedSlug}`} />
        <meta property="og:title" content={`${project.name} - модульный дом от ${formattedPrice} руб | Easy House`} />
        <meta property="og:description" content={`Модульный дом ${project.name} от ${formattedPrice} руб. Подробные характеристики, фото, чертежи и комплектация.`} />
        <meta property="og:url" content={`https://your-domain.com/catalog/${sanitizedSlug}`} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={`https://your-domain.com${project.images?.[0] || '/img/default-house.jpg'}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`Модульный дом ${project.name}`} />
        <meta property="product:price:amount" content={currentPrice} />
        <meta property="product:price:currency" content="RUB" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.name} - модульный дом от ${formattedPrice} руб`} />
        <meta name="twitter:description" content={`Модульный дом ${project.name} от ${formattedPrice} руб. Подробные характеристики, фото, чертежи и комплектация.`} />
        <meta name="twitter:image" content={`https://your-domain.com${project.images?.[0] || '/img/default-house.jpg'}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": project.name,
            "description": `Модульный дом ${project.name}. Площадь ${project.sizes?.[selectedSize]?.area || 'не указана'}. Подробные характеристики, фото и комплектация.`,
            "image": project.images?.map(img => `https://your-domain.com${img}`) || [],
            "brand": {
              "@type": "Brand",
              "name": "Easy House"
            },
            "category": "Модульные дома",
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Высота потолка",
                "value": project.specs?.ceiling || "не указано"
              },
              {
                "@type": "PropertyValue",
                "name": "Толщина стены",
                "value": project.specs?.wallThickness || "не указано"
              },
              {
                "@type": "PropertyValue",
                "name": "Утепление стены",
                "value": project.specs?.wallInsulation || "не указано"
              }
            ],
            "offers": {
              "@type": "Offer",
              "price": currentPrice,
              "priceCurrency": "RUB",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "seller": {
                "@type": "Organization",
                "name": "Easy House",
                "url": "https://your-domain.com"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "127",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>
      </Head>

      <Breadcrumbs />
      <main className={styles.container}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            {displayImages.length > 0 && (
              <img 
                src={displayImages[currentImage]} 
                alt={`Модульный дом ${project.name} - ${showBlueprints ? 'планировка' : 'фото'} ${currentImage + 1}. Площадь ${project.sizes?.[selectedSize]?.area || 'не указана'}, цена ${formattedPrice} руб`}
                width="600"
                height="400"
              />
            )}
          </div>
          <div className={styles.thumbnails}>
            {displayImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Модульный дом ${project.name} - миниатюра ${showBlueprints ? 'планировки' : 'фото'} ${index + 1}`}
                className={currentImage === index ? styles.active : ''}
                onClick={() => setCurrentImage(index)}
                width="150"
                height="100"
              />
            ))}
          </div>
          <div className={styles.viewToggle}>
            <button
              className={!showBlueprints ? styles.active : ''}
              onClick={() => { setShowBlueprints(false); setCurrentImage(0); }}
            >
              Фото
            </button>
            <button
              className={showBlueprints ? styles.active : ''}
              onClick={() => { setShowBlueprints(true); setCurrentImage(0); }}
            >
              Планировка
            </button>
          </div>
        </div>

        <div className={styles.info}>
          <header>
            <h1>{project.name}</h1>
          </header>
          
          <div className={styles.availability}>✓ В наличии</div>
          
          <div className={styles.price}>
            {formattedPrice} руб.
          </div>

          <div className={styles.sizeSelector}>
            <label>Размеры:</label>
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(Number(e.target.value))}
            >
              {project.sizes.map((size, index) => (
                <option key={index} value={index}>
                  {size.area} {size.dimensions}
                </option>
              ))}
            </select>
          </div>

          <button 
            className={styles.orderButton}
            onClick={() => setIsContactFormOpen(true)}
          >
            Заказать
          </button>

          <section className={styles.specs}>
            <h2>Технические параметры</h2>
            <dl>
              <dt>Высота потолка:</dt>
              <dd>{project.specs?.ceiling || 'не указано'}</dd>
              <dt>Толщина стены:</dt>
              <dd>{project.specs?.wallThickness || 'не указано'}</dd>
              <dt>Утепление стены:</dt>
              <dd>{project.specs?.wallInsulation || 'не указано'}</dd>
              <dt>Толщина перегородки:</dt>
              <dd>{project.specs?.partitionThickness || 'не указано'}</dd>
              <dt>Утепление перегородки:</dt>
              <dd>{project.specs?.partitionInsulation || 'не указано'}</dd>
            </dl>
          </section>

          <section className={styles.equipment}>
            <h3>Базовая комплектация</h3>
            <ul>
              {project.equipment?.map((item, index) => (
                <li key={index}>{item}</li>
              )) || []}
            </ul>
          </section>
        </div>
      </main>

      {/* Модальное окно с формой */}
      {isContactFormOpen && (
        <div 
          className={styles.modal} 
          onClick={() => setIsContactFormOpen(false)}
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalClose}
              onClick={() => setIsContactFormOpen(false)}
              aria-label="Закрыть форму"
            >
              ×
            </button>
            <ContactForm 
              title="Заказать дом"
              source={`каталог - ${project.name}`}
              productInfo={{
                name: project.name,
                size: project.sizes[selectedSize]?.area || '',
                dimensions: project.sizes[selectedSize]?.dimensions || '',
                price: project.sizes[selectedSize]?.price || 0
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}