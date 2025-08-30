'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';

export default function HeroSection({ content }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1b23 0%, #2d2e3f 25%, #31323d 50%, #2a2b35 75%, #1f2028 100%)',
      color: 'var(--white)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(223, 104, 43, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(46, 103, 44, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 60% 20%, rgba(238, 232, 244, 0.05) 0%, transparent 50%)
        `,
        animation: 'pulse 8s ease-in-out infinite'
      }} />
      
      {/* Geometric shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(223, 104, 43, 0.1), rgba(46, 103, 44, 0.1))',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(135deg, rgba(238, 232, 244, 0.08), rgba(223, 104, 43, 0.08))',
        borderRadius: '30%',
        filter: 'blur(30px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 2,
        width: '100%'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          minHeight: '80vh'
        }}>
          {/* Left content */}
          <div style={{
            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s ease-out'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, var(--accent-orange), #ff8c42)',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Инновационные решения
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {content.title}
            </h1>
            
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '3rem',
              opacity: 0.9,
              lineHeight: '1.6',
              color: '#b8bcc8'
            }}>
              {content.subtitle}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <Button 
                size="large"
                onClick={() => window.location.href = '/constructor'}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-orange) 0%, #ff6b35 100%)',
                  border: 'none',
                  padding: '1rem 2.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  borderRadius: '50px',
                  boxShadow: '0 8px 25px rgba(223, 104, 43, 0.3)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(223, 104, 43, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(223, 104, 43, 0.3)';
                }}
              >
                {content.buttonText}
              </Button>
              
              <button style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}>
                Узнать больше
              </button>
            </div>
          </div>

          {/* Right visual */}
          <div style={{
            transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s ease-out 0.2s',
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              borderRadius: '30px',
              padding: '3rem',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--accent-orange), #ff8c42)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>30-60</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>дней строительства</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, var(--dark-green), #4a7c59)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>850k</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>от рублей</div>
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(238, 232, 244, 0.2), rgba(238, 232, 244, 0.1))',
                borderRadius: '15px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>100% Качество</div>
                <div style={{ fontSize: '1rem', opacity: 0.8 }}>Сертифицированные материалы</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @media (max-width: 1024px) {
          section > div > div {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center !important;
          }
        }
        
        @media (max-width: 768px) {
          section {
            min-height: 90vh !important;
            padding: 2rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}