'use client';

import Header from '../components/layout/Header';
import ContactForm from '../components/ui/ContactForm';
import { useRegion } from '../hooks/useRegion';

export default function Home() {
  const { selectedRegion, handleRegionChange } = useRegion();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header 
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
      />
      
      {/* Hero секция */}
      <section className="hero-section" style={{
        position: 'relative',
        height: '100vh',
        backgroundImage: 'url(/images/mod-glav.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Градиент оверлей */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%)'
        }} />
        
        {/* Контент */}
        <div className="container hero-container" style={{
          position: 'relative',
          zIndex: 2,
          color: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3rem',
          width: '100%',
          height: '100%'
        }}>
          {/* Левая часть - текст */}
          <div className="hero-content" style={{
            flex: '1',
            maxWidth: '600px'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-primary)'
            }}>
              Модульные дома под ключ от <span style={{ color: 'var(--accent-orange)' }}>655 000₽</span>
            </h1>
            
            <p style={{
              fontSize: '1.3rem',
              marginBottom: '3rem',
              opacity: 0.9,
              fontWeight: '400'
            }}>
              Это не просто коробка с окнами - это полноценный дом
            </p>
            
            {/* Преимущества */}
            <div className="hero-advantages" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              {[
                'Заезжайте и живите через 30 дней',
                'Полный цикл «под ключ»',
                'Фиксированная цена',
                'Скорость и прозрачность'
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.8rem'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--accent-orange)',
                    borderRadius: '50%',
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Кнопки */}
            <div className="hero-buttons" style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button style={{
                background: 'var(--accent-orange)',
                color: 'var(--white)',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(223, 104, 43, 0.4)',
                fontFamily: 'var(--font-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(223, 104, 43, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(223, 104, 43, 0.4)';
              }}>
                Рассчитать стоимость
              </button>
              
              <button style={{
                background: 'transparent',
                color: 'var(--white)',
                border: '2px solid var(--white)',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--white)';
                e.target.style.color = 'var(--text-dark)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--white)';
              }}>
                Каталог
              </button>
            </div>
          </div>
          
          {/* Правая часть - форма */}
          <div className="hero-form" style={{
            flexShrink: 0
          }}>
            <ContactForm />
          </div>
        </div>
      </section>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-advantages {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
          }
          
          .hero-advantages > div {
            width: 100% !important;
          }
          
          .hero-buttons {
            flex-direction: column !important;
          }
          
          .hero-buttons button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}