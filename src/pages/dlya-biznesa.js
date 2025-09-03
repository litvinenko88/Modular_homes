import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

export default function DlyaBiznesa() {
  return (
    <Layout>
      <Head>
        <title>Для бизнеса - модульные дома | Easy House</title>
        <meta name="description" content="Модульные дома для бизнеса. Офисы, торговые павильоны, кафе и другие коммерческие решения." />
        <meta name="keywords" content="модульные дома для бизнеса, офисные модули, торговые павильоны, коммерческая недвижимость, быстровозводимые здания" />
        <link rel="canonical" href="https://house-modular.ru/dlya-biznesa" />
        <meta property="og:title" content="Для бизнеса - модульные дома | Easy House" />
        <meta property="og:description" content="Модульные дома для бизнеса. Офисы, торговые павильоны, кафе и другие коммерческие решения." />
        <meta property="og:url" content="https://house-modular.ru/dlya-biznesa" />
        <meta property="og:type" content="website" />
      </Head>
      <Breadcrumbs />
      <main style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Для бизнеса</h1>
        <p>Раздел в разработке</p>
      </main>
    </Layout>
  );
}