'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', margin: '0', color: '#f44336' }}>⚠️</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '1rem 0', color: '#666' }}>
        Произошла ошибка
      </h2>
      <p style={{ fontSize: '1rem', color: '#888', marginBottom: '2rem' }}>
        Что-то пошло не так. Попробуйте обновить страницу или вернуться на главную.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            background: 'linear-gradient(135deg, #2e672c 0%, #4caf50 100%)',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🔄 Попробовать снова
        </button>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            background: '#666',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          🏠 На главную
        </a>
      </div>
    </div>
  );
}