'use client';

import dynamic from 'next/dynamic';

const ModularConstructor = dynamic(() => import('../../components/constructor/ModularConstructor'), {
  ssr: false,
  loading: () => <div>Загрузка...</div>
});

export default function ConstructorPage() {
  return <ModularConstructor />;
}