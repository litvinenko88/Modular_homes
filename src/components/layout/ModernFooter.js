'use client';

import { useState } from 'react';

export default function ModernFooter() {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const socialLinks = [
    { name: 'Telegram', icon: '📱', url: '#', color: '#0088cc' },
    { name: 'WhatsApp', icon: '💬', url: '#', color: '#25d366' },
    { name: 'VK', icon: '🔵', url: '#', color: '#4680c2' },
    { name: 'Instagram', icon: '📷', url: '#', color: '#e4405f' }
  ];

  const quickLinks = [
    { name: 'О компании', url: '#' },
    { name: 'Каталог домов', url: '#' },
    { name: 'Конструктор', url: '/constructor' },
    { name: 'Отзывы', url: '#' },
    { name: 'Контакты', url: '#' }
  ];

  const services = [
    { name: 'Модульные дома', url: '#' },
    { name: 'Проектирование', url: '#' },
    { name: 'Строительство', url: '#' },
    { name: 'Гарантийное обслуживание', url: '#' },
    { name: 'Консультации', url: '#' }
  ];

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a1b2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Декоративные элементы */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(223, 104, 43, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      {/* Основной контент */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '4rem 2rem 2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* О компании */}
          <div>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, var(--accent-orange), #ff8c42)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ModularHomes
            </div>
            
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '2rem',
              opacity: 0.9,
              color: '#b8bcc8'
            }}>
              Современные модульные дома с инновационными технологиями. 
              Быстро, качественно, надежно.
            </p>
            
            {/* Социальные сети */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    background: hoveredSocial === index 
                      ? `linear-gradient(135deg, ${social.color}, ${social.color}dd)`
                      : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    fontSize: '1.5rem',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredSocial === index ? 'translateY(-3px) scale(1.1)' : 'translateY(0)',
                    boxShadow: hoveredSocial === index 
                      ? `0 10px 25px ${social.color}40`
                      : '0 5px 15px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Быстрые ссылки
            </h3>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {quickLinks.map((link, index) => (
                <li key={index} style={{ marginBottom: '0.8rem' }}>
                  <a
                    href={link.url}
                    style={{
                      color: '#b8bcc8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--accent-orange)';
                      e.target.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#b8bcc8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Услуги */}
          <div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Наши услуги
            </h3>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {services.map((service, index) => (
                <li key={index} style={{ marginBottom: '0.8rem' }}>
                  <a
                    href={service.url}
                    style={{
                      color: '#b8bcc8',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--accent-orange)';
                      e.target.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#b8bcc8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Контакты
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                marginBottom: '0.8rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, var(--accent-orange), #ff8c42)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  📞
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>
                    +7 (800) 555-0199
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#b8bcc8' }}>
                    Бесплатный звонок
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                marginBottom: '0.8rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  ✉️
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>
                    info@easyhouse.ru
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#b8bcc8' }}>
                    Электронная почта
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA кнопка */}
            <button style={{
              background: 'linear-gradient(135deg, var(--accent-orange) 0%, #ff6b35 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 1.5rem',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 25px rgba(223, 104, 43, 0.3)',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 12px 30px rgba(223, 104, 43, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(223, 104, 43, 0.3)';
            }}>
              Получить консультацию
            </button>
          </div>
        </div>

        {/* Разделитель */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          margin: '2rem 0'
        }} />

        {/* Нижняя часть */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#b8bcc8'
          }}>
            © 2024 ModularHomes. Все права защищены.
          </div>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <a
              href="#"
              style={{
                color: '#b8bcc8',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'}
              onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              style={{
                color: '#b8bcc8',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'}
              onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
            >
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          footer > div {
            padding: 3rem 1rem 2rem !important;
          }
          
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          footer > div > div:last-child {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          
          footer > div > div:last-child > div:last-child {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          footer > div > div:first-child > div:first-child > div:last-child {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}