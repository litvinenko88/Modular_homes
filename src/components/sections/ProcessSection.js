'use client';

import { useState, useEffect } from 'react';

export default function ProcessSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('process-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Консультация и планирование',
      description: 'Обсуждаем ваши потребности, выбираем проект, рассчитываем стоимость и сроки строительства',
      icon: '💬',
      duration: '1-2 дня',
      color: '#667eea'
    },
    {
      number: '02',
      title: 'Проектирование и согласование',
      description: 'Создаем индивидуальный проект, получаем все необходимые разрешения и согласования',
      icon: '📐',
      duration: '5-7 дней',
      color: '#f093fb'
    },
    {
      number: '03',
      title: 'Производство модулей',
      description: 'Изготавливаем модули на заводе с контролем качества на каждом этапе производства',
      icon: '🏭',
      duration: '15-20 дней',
      color: '#4facfe'
    },
    {
      number: '04',
      title: 'Подготовка участка',
      description: 'Подготавливаем фундамент, проводим коммуникации и готовим площадку для монтажа',
      icon: '🚧',
      duration: '7-10 дней',
      color: '#43e97b'
    },
    {
      number: '05',
      title: 'Монтаж и сборка',
      description: 'Доставляем модули на участок и собираем готовый дом с финишной отделкой',
      icon: '🏗️',
      duration: '3-5 дней',
      color: '#fa709a'
    },
    {
      number: '06',
      title: 'Сдача и гарантия',
      description: 'Проводим финальную проверку, сдаем дом и предоставляем гарантийное обслуживание',
      icon: '🔑',
      duration: '1 день',
      color: '#a8edea'
    }
  ];

  return (
    <section 
      id="process-section"
      style={{
        padding: '8rem 2rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f1f3f4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Декоративные элементы */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(240, 147, 251, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Заголовок */}
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
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.05))',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '2rem',
            color: '#667eea',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#667eea',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            Как мы работаем
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
            Процесс строительства
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            color: 'var(--text-light)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Прозрачный и понятный процесс от первой консультации до получения ключей от готового дома
          </p>
        </div>

        {/* Временная шкала */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          position: 'relative'
        }}>
          {/* Соединительная линия для десктопа */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, #667eea, #f093fb, #4facfe, #43e97b, #fa709a, #a8edea)',
            transform: 'translateY(-50%)',
            zIndex: 1,
            display: window.innerWidth > 768 ? 'block' : 'none'
          }} />
          
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                zIndex: 2,
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${index * 0.1}s`
              }}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(-1)}
            >
              {/* Карточка этапа */}
              <div style={{
                background: activeStep === index 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
                backdropFilter: 'blur(20px)',
                border: activeStep === index 
                  ? `2px solid ${step.color}40`
                  : '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '25px',
                padding: '2.5rem',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: activeStep === index ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
                boxShadow: activeStep === index 
                  ? `0 25px 50px ${step.color}20`
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Фоновый градиент */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  opacity: activeStep === index ? 1 : 0.5,
                  transition: 'opacity 0.4s ease'
                }} />
                
                {/* Номер этапа */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '50px',
                  height: '50px',
                  background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: 'white',
                  transform: activeStep === index ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}>
                  {step.number}
                </div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  {/* Иконка */}
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1.5rem',
                    transform: activeStep === index ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    {step.icon}
                  </div>
                  
                  {/* Заголовок */}
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: 'var(--text-dark)',
                    lineHeight: '1.3'
                  }}>
                    {step.title}
                  </h3>
                  
                  {/* Описание */}
                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--text-light)',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}>
                    {step.description}
                  </p>
                  
                  {/* Длительность */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: `${step.color}20`,
                    color: step.color,
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    ⏱️ {step.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Итоговая информация */}
        <div style={{
          marginTop: '5rem',
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
              background: 'linear-gradient(135deg, #667eea, #f093fb)',
              borderRadius: '50%',
              opacity: 0.05,
              filter: 'blur(60px)'
            }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                🎯
              </div>
              
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'var(--text-dark)'
              }}>
                Итого: 30-60 дней
              </h3>
              
              <p style={{
                fontSize: '1.2rem',
                color: 'var(--text-light)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                От первой консультации до получения ключей от готового дома
              </p>
              
              <button style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '1.2rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}>
                Начать строительство
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
          
          section > div > div:nth-child(2) > div:first-child {
            display: none !important;
          }
          
          section > div > div:nth-child(2) > div > div {
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
          
          section > div > div:nth-child(2) > div > div {
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