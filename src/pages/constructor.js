import { useState } from 'react';
import Head from "next/head";
import Layout from "../components/Layout/Layout";
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
      </Head>

      <Layout>
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