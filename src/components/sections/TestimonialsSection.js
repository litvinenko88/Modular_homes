'use client';

import { useState, useEffect } from 'react';

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('testimonials-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: 'Александр Петров',
      location: 'Москва',
      text: 'Невероятно быстро и качественно! За 45 дней получили готовый дом. Все работы выполнены на высшем уровне, материалы отличные. Рекомендую всем!',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Мария Сидорова',
      location: 'Санкт-Петербург',
      text: 'Долго выбирали подрядчика, остановились на этой компании и не пожалели. Дом теплый, уютный, все сделано с душой. Спасибо за профессионализм!',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Дмитрий Козлов',
      location: 'Краснодар',
      text: 'Отличное соотношение цены и качества. Дом построили точно в срок, никаких доплат не было. Живем уже полгода - все отлично работает!',
      rating: 5,
      avatar: '👨‍🔧'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Построенных домов', icon: '🏠' },
    { number: '98%', label: 'Довольных клиентов', icon: '😊' },
    { number: '30-60', label: 'Дней строительства', icon: '⚡' },
    { number: '10 лет', label: 'Гарантия качества', icon: '🛡️' }
  ];

  return (
    <section 
      id="testimonials-section"
      style={{
        padding: '8rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Декоративные элементы */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '30%',
        filter: 'blur(30px)',
        animation: 'float 6s ease-in-out infinite reverse'
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
          marginBottom: '4rem',
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '2rem',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'white',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            Отзывы клиентов
          </div>
          
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            color: 'white',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            Что говорят наши клиенты
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Более 1000 семей уже живут в наших домах и рекомендуют нас своим друзьям
          </p>
        </div>

        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${index * 0.1}s`,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-10px) scale(1.05)';
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '0.5rem',
                color: 'white'
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Отзывы */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '30px',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Текущий отзыв */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                {testimonials[activeTestimonial].avatar}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <span key={i} style={{ fontSize: '1.5rem', color: '#ffd700' }}>⭐</span>
                ))}
              </div>
              
              <blockquote style={{
                fontSize: '1.3rem',
                fontStyle: 'italic',
                color: 'white',
                lineHeight: '1.6',
                marginBottom: '2rem',
                maxWidth: '800px',
                margin: '0 auto 2rem'
              }}>
                "{testimonials[activeTestimonial].text}"
              </blockquote>
              
              <div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>
                  {testimonials[activeTestimonial].name}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  {testimonials[activeTestimonial].location}
                </div>
              </div>
            </div>
            
            {/* Индикаторы */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    background: index === activeTestimonial 
                      ? 'white' 
                      : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(2deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @media (max-width: 768px) {
          section {
            padding: 4rem 1rem !important;
          }
          
          section > div > div:nth-child(2) {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          
          section > div > div:nth-child(2) > div {
            padding: 1.5rem !important;
          }
          
          section > div > div:nth-child(3) {
            padding: 2rem !important;
          }
          
          section > div > div:nth-child(3) blockquote {
            font-size: 1.1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          section > div > div:nth-child(1) h2 {
            font-size: 2rem !important;
          }
          
          section > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          
          section > div > div:nth-child(3) {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}