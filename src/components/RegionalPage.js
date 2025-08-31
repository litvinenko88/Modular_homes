'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './layout/Header';
import HeroSection from './sections/HeroSection';
import { getContentByRegion } from '../data/content';
import { getRegionById } from '../data/regions';

export default function RegionalPage({ regionId }) {
  const router = useRouter();
  
  const content = getContentByRegion(regionId);
  const currentRegion = getRegionById(regionId);

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