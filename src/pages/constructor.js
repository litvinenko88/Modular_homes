import { useState } from 'react';
import Head from "next/head";
import Layout from "../components/Layout/Layout";
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import ModularConstructor from "../components/ConstructorApp/constructor/ModularConstructor";

export default function Constructor() {
  const [showConstructor, setShowConstructor] = useState(false);

  if (showConstructor) {
    return (
      <>
        <Head>
          <title>3D Конструктор | Easy House</title>
        </Head>
        <ModularConstructor />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Конструктор модульных домов | Easy House</title>
        <meta
          name="description"
          content="Спроектируйте свой идеальный модульный дом с помощью нашего 3D конструктора"
        />
        <meta name="keywords" content="3D конструктор домов, проектирование модульных домов, создать проект дома, планировка дома онлайн" />
        <link rel="canonical" href="https://house-modular.ru/constructor" />
        <meta property="og:title" content="Конструктор модульных домов | Easy House" />
        <meta property="og:description" content="Спроектируйте свой идеальный модульный дом с помощью нашего 3D конструктора" />
        <meta property="og:url" content="https://house-modular.ru/constructor" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "3D Конструктор модульных домов",
            "description": "Спроектируйте свой идеальный модульный дом с помощью нашего 3D конструктора",
            "url": "https://house-modular.ru/constructor",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Главная",
                  "item": "https://house-modular.ru/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "3D Конструктор",
                  "item": "https://house-modular.ru/constructor"
                }
              ]
            }
          })}
        </script>
      </Head>

      <Layout>
        <Breadcrumbs />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Конструктор модульных домов</h1>
          <p>Спроектируйте свой идеальный дом с помощью 3D конструктора</p>
          <button 
            onClick={() => window.open('/constructor-app', '_blank')}
            style={{
              padding: '15px 30px',
              backgroundColor: '#df682b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Открыть конструктор
          </button>
        </div>
      </Layout>
    </>
  );
}