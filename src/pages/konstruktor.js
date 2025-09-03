import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import ProjectConstructor from '../components/ProjectConstructor';

export default function Konstruktor() {
  return (
    <Layout>
      <Head>
        <title>Конструктор модульных домов | Easy House</title>
        <meta name="description" content="Создайте свой уникальный модульный дом с помощью нашего конструктора. Выберите размер, планировку и комплектацию." />
        <meta name="keywords" content="конструктор домов, создать проект дома, планировка модульного дома, индивидуальный проект, расчет стоимости" />
        <link rel="canonical" href="https://house-modular.ru/konstruktor" />
        <meta property="og:title" content="Конструктор модульных домов | Easy House" />
        <meta property="og:description" content="Создайте свой уникальный модульный дом с помощью нашего конструктора. Выберите размер, планировку и комплектацию." />
        <meta property="og:url" content="https://house-modular.ru/konstruktor" />
        <meta property="og:type" content="website" />
      </Head>
      <main>
        <h1 style={{ position: 'absolute', left: '-9999px', fontSize: '1px' }}>Конструктор модульных домов</h1>
        <ProjectConstructor />
      </main>
    </Layout>
  );
}