'use client';

import { useState, useEffect } from 'react';

export default function ModernAdvantagesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('modern-advantages-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const advantages = [
    {
      icon: '🏠',
      title: 'Заезжайте и живите через 30 дней',
      description: 'Быстрое строительство модульных домов позволяет въехать в готовый дом уже через месяц.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    {
      icon: '🔑',
      title: 'Полный цикл «под ключ»',
      description: 'От проектирования до сдачи готового дома со всеми коммуникациями и отделкой.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f5576c'
    },
    {
      icon: '💰',
      title: 'Фиксированная цена',
      description: 'Стоимость не изменится в процессе строительства. Никаких скрытых доплат.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#00f2fe'
    },
    {
      icon: '⚡',
      title: 'Скорость и прозрачность',
      description: 'Открытый процесс строительства с контролем на каждом этапе и быстрой реализацией.',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      color: '#43e97b'
    }
  ];

  return (
    <section 
      id="modern-advantages-section"
      style={{
        padding: '8rem 2rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Фоновые декоративные элементы */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(223, 104, 43, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Заголовок секции */}
        <div style={{
          textAlign: 'center',
          marginBottom: '5rem',
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, rgba(223, 104, 43, 0.1), rgba(223, 104, 43, 0.05))',
            border: '1px solid rgba(223, 104, 43, 0.2)',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '2rem',
            color: 'var(--accent-orange)',
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
            Почему выбирают нас
          </div>
          
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            color: 'var(--text-dark)',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Преимущества модульных домов
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            color: 'var(--text-light)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Современные технологии и инновационный подход к строительству делают наши дома лучшим выбором для вашей семьи
          </p>
        </div>
        
        {/* Сетка преимуществ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {advantages.map((advantage, index) => (
            <div
              key={index}
              style={{
                background: hoveredCard === index 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
                backdropFilter: 'blur(20px)',
                border: hoveredCard === index 
                  ? `2px solid ${advantage.color}20`
                  : '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transform: isVisible 
                  ? (hoveredCard === index ? 'translateY(-10px) scale(1.02)' : 'translateY(0)')
                  : 'translateY(50px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${index * 0.1}s`,
                boxShadow: hoveredCard === index 
                  ? `0 25px 50px ${advantage.color}20`
                  : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Фоновый градиент */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200px',
                height: '200px',
                background: advantage.gradient,
                borderRadius: '50%',
                opacity: hoveredCard === index ? 0.15 : 0.08,
                filter: 'blur(40px)',
                transition: 'opacity 0.4s ease'
              }} />
              
              <div style={{
                position: 'relative',
                zIndex: 2
              }}>
                {/* Иконка */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: advantage.gradient,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                  transform: hoveredCard === index ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}>
                  {advantage.icon}
                </div>
                
                {/* Заголовок */}
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '0.8rem',
                  color: 'var(--text-dark)',
                  lineHeight: '1.3'
                }}>
                  {advantage.title}
                </h3>
                
                {/* Описание */}
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-light)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {advantage.description}
                </p>
                
                {/* Декоративная линия */}
                <div style={{
                  width: hoveredCard === index ? '40px' : '20px',
                  height: '2px',
                  background: advantage.gradient,
                  borderRadius: '1px',
                  marginTop: '1rem',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Призыв к действию */}
        <div style={{
          textAlign: 'center',
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '25px',
            padding: '3rem',
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              background: 'linear-gradient(135deg, var(--accent-orange), #ff8c42)',
              borderRadius: '50%',
              opacity: 0.05,
              filter: 'blur(60px)'
            }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'var(--text-dark)'
              }}>
                Готовы начать строительство?
              </h3>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-light)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Получите персональный расчет стоимости и сроков строительства вашего дома
              </p>
              
              <button style={{
                background: 'linear-gradient(135deg, var(--accent-orange) 0%, #ff6b35 100%)',
                color: 'white',
                border: 'none',
                padding: '1.2rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 25px rgba(223, 104, 43, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 15px 35px rgba(223, 104, 43, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(223, 104, 43, 0.3)';
              }}>
                Получить консультацию
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @media (max-width: 768px) {
          section {
            padding: 4rem 1rem !important;
          }
          
          section > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          
          section > div > div:nth-child(2) > div {
            padding: 2rem !important;
          }
          
          section > div > div:nth-child(3) > div {
            padding: 2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          section > div > div:nth-child(1) h2 {
            font-size: 2rem !important;
          }
          
          section > div > div:nth-child(1) p {
            font-size: 1.1rem !important;
          }
          
          section > div > div:nth-child(2) > div {
            padding: 1.5rem !important;
          }
          
          section > div > div:nth-child(3) > div {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}