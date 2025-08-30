'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './layout/Header';
import HeroSection from './sections/HeroSection';
import AdvantagesSection from './sections/AdvantagesSection';
import InteractiveButton from './InteractiveButton';
import { getContentByRegion } from '../data/content';
import { getRegionById } from '../data/regions';

export default function RegionalPage({ regionId }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const content = getContentByRegion(regionId);
  const currentRegion = getRegionById(regionId);

  const handleConstructorClick = () => {
    setIsLoading(true);
    window.location.href = '/constructor';
  };

  const handleRegionChange = (newRegionId) => {
    if (newRegionId === 'rf') {
      router.push('/');
    } else {
      router.push(`/${newRegionId}`);
    }
  };

  useEffect(() => {
    // Сохраняем текущий регион в localStorage
    localStorage.setItem('selectedRegion', regionId);
  }, [regionId]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header 
        selectedRegion={regionId}
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