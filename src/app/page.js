'use client';

import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ContactForm from '../components/ui/ContactForm';
import ModernAdvantagesSection from '../components/sections/ModernAdvantagesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ProcessSection from '../components/sections/ProcessSection';
import ModernFooter from '../components/layout/ModernFooter';
import { useRegion } from '../hooks/useRegion';

export default function Home() {
  const { selectedRegion, handleRegionChange } = useRegion();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)' }}>
      <Header 
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
      />
      
      {/* Hero секция */}
      <section className="hero-section" style={{
        position: 'relative',
        minHeight: '100vh',
        background: `
          radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(223, 104, 43, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, rgba(15, 15, 35, 0.85) 0%, rgba(26, 27, 46, 0.85) 25%, rgba(22, 33, 62, 0.85) 50%, rgba(15, 52, 96, 0.85) 75%, rgba(83, 52, 131, 0.85) 100%),
          url(/images/mod-glav.jpeg)
        `,
        backgroundSize: 'auto, auto, cover',
        backgroundPosition: 'center, center, center',
        color: 'var(--white)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Анимированные фоновые элементы */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '300px',
          height: '300px',
          background: 'linear-gradient(45deg, rgba(223, 104, 43, 0.1), rgba(83, 52, 131, 0.1))',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(15, 52, 96, 0.2), rgba(223, 104, 43, 0.1))',
          borderRadius: '30%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite reverse'
        }} />
        
        {/* Геометрические фигуры */}
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
          transform: 'rotate(45deg)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />

        <div className="container hero-container" style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4rem',
          width: '100%',
          minHeight: '80vh'
        }}>
          {/* Левая часть - контент */}
          <div className="hero-content" style={{
            flex: '1',
            maxWidth: '650px',
            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {/* Бейдж */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--accent-orange)',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              Инновационные решения 2025
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease-in-out infinite'
            }}>
              Модульные дома под ключ от{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent-orange), #ff8c42)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                655 000₽
              </span>
            </h1>
            
            <p style={{
              fontSize: '1.4rem',
              marginBottom: '3rem',
              opacity: 0.9,
              lineHeight: '1.6',
              color: '#b8bcc8'
            }}>
              Это не просто коробка с окнами — это полноценный дом
            </p>
            
            {/* Преимущества */}
            <div className="hero-stats" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.8rem',
              marginBottom: '3rem'
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
                  gap: '0.6rem',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.8rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'var(--accent-orange)',
                    borderRadius: '50%',
                    flexShrink: 0
                  }} />
                  {item}
                </div>
              ))}
            </div>
            
            {/* Кнопки */}
            <div className="hero-buttons" style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button className="modern-button" style={{
                background: 'linear-gradient(135deg, var(--accent-orange) 0%, #ff6b35 100%)',
                color: 'var(--white)',
                border: 'none',
                padding: '1.2rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 25px rgba(223, 104, 43, 0.3)',
                fontFamily: 'var(--font-primary)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 15px 35px rgba(223, 104, 43, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(223, 104, 43, 0.3)';
              }}>
                Рассчитать стоимость
              </button>
              
              <button style={{
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                padding: '1.2rem 2rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                fontFamily: 'var(--font-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}>
                Смотреть каталог
              </button>
            </div>
          </div>
          
          {/* Правая часть - форма */}
          <div className="hero-form" style={{
            flexShrink: 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
            }}>
              <ContactForm />
            </div>
          </div>
        </div>
        

      </section>
      
      {/* Секция преимуществ */}
      <ModernAdvantagesSection />
      
      {/* Секция отзывов */}
      <TestimonialsSection />
      
      {/* Секция процесса работы */}
      <ProcessSection />
      
      {/* Футер */}
      <ModernFooter />
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(2deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .modern-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .modern-button:hover::before {
          left: 100%;
        }
        
        @media (max-width: 1200px) {
          .hero-container {
            flex-direction: column !important;
            gap: 3rem !important;
            text-align: center !important;
          }
          
          .hero-content {
            max-width: 100% !important;
          }
          
          .hero-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .hero-buttons {
            justify-content: center !important;
            width: 100% !important;
          }
          
          .hero-buttons button {
            flex: 1 !important;
            min-width: 200px !important;
          }
          
          .hero-form {
            width: 100% !important;
          }
          
          .hero-form > div > div {
            max-width: none !important;
            width: 100% !important;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            min-height: 90vh !important;
            padding: 2rem 0 !important;
          }
          
          .hero-stats {
            grid-template-columns: 1fr !important;
            gap: 0.6rem !important;
          }
          
          .hero-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .hero-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
          

        }
        
        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 2rem !important;
          }
          
          .hero-content p {
            font-size: 1.1rem !important;
          }
          
          .hero-buttons button {
            padding: 1rem 2rem !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}