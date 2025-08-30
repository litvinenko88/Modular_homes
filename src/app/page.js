'use client';

import { useState } from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import AdvantagesSection from '../components/sections/AdvantagesSection';
import InteractiveButton from '../components/InteractiveButton';
import { useRegion } from '../hooks/useRegion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedRegion, content, handleRegionChange } = useRegion();

  const handleConstructorClick = () => {
    setIsLoading(true);
    window.location.href = '/constructor';
  };

  if (!content) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--light-gray)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--text-dark)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid var(--border-gray)',
            borderTop: '4px solid var(--accent-orange)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header 
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
      />
      
      <HeroSection content={content.hero} />
      
      <AdvantagesSection content={content.advantages} />

      {/* Конструктор */}
      <section style={{
        padding: '4rem 2rem',
        background: 'var(--light-purple)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: 'var(--text-dark)'
          }}>
            Интерактивный конструктор
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2rem',
            color: 'var(--text-light)',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Спроектируйте свой дом онлайн с помощью нашего удобного конструктора
          </p>
          
          <InteractiveButton
            onClick={handleConstructorClick}
            isLoading={isLoading}
            style={{
              background: 'var(--accent-orange)',
              color: 'var(--white)',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(223, 104, 43, 0.4)'
            }}
          >
            Открыть конструктор
          </InteractiveButton>
        </div>
      </section>

      {/* Контакты */}
      <section style={{
        padding: '3rem 2rem',
        background: 'var(--primary-dark)',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem'
          }}>
            Связь с нами
          </h3>
          
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '0.5rem'
          }}>
            Телефон: {content.contact.phone}
          </p>
          
          <p style={{
            fontSize: '1.1rem'
          }}>
            Email: {content.contact.email}
          </p>
        </div>
      </section>
    </div>
  );
}