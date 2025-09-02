import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import ProjectConstructor from '../components/ProjectConstructor';

export default function Konstruktor() {
  return (
    <Layout>
      <Head>
        <title>Конструктор модульных домов | Easy House</title>
        <meta name="description" content="Создайте свой уникальный модульный дом с помощью нашего конструктора. Выберите размер, планировку и комплектацию." />
      </Head>
      <ProjectConstructor />
    </Layout>
  );
}