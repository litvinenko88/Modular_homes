'use client';

import { useState, useEffect } from 'react';

export default function AdvantagesSection({ content }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('advantages-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const getGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];
    return gradients[index % gradients.length];
  };

  const getIconColor = (index) => {
    const colors = ['#667eea', '#f5576c', '#00f2fe'];
    return colors[index % colors.length];
  };

  return (
    <section 
      id="advantages-section"
      style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(223, 104, 43, 0.05) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(46, 103, 44, 0.05) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
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
            marginBottom: '1.5rem',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Преимущества
          </div>
          
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '800',
            color: 'var(--text-dark)',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            {content.title}
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-light)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Почему тысячи клиентов выбирают наши решения
          </p>
        </div>
        
        {/* Two main blocks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Left block - First advantage */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            borderRadius: '25px',
            padding: '3rem',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s ease-out 0.2s',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200px',
              height: '200px',
              background: getGradient(0),
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(40px)'
            }} />
            
            <div style={{
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: getGradient(0),
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                fontSize: '2rem'
              }}>
                🚀
              </div>
              
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'var(--primary-dark)'
              }}>
                {content.items[0]?.title}
              </h3>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-light)',
                lineHeight: '1.6'
              }}>
                {content.items[0]?.description}
              </p>
            </div>
          </div>

          {/* Right block - Second advantage */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            borderRadius: '25px',
            padding: '3rem',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s ease-out 0.4s',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200px',
              height: '200px',
              background: getGradient(1),
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(40px)'
            }} />
            
            <div style={{
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: getGradient(1),
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                fontSize: '2rem'
              }}>
                💰
              </div>
              
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'var(--primary-dark)'
              }}>
                {content.items[1]?.title}
              </h3>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-light)',
                lineHeight: '1.6'
              }}>
                {content.items[1]?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom block - Third advantage (full width) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          borderRadius: '25px',
          padding: '3rem',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s ease-out 0.6s',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: getGradient(2),
            borderRadius: '50%',
            opacity: 0.05,
            filter: 'blur(60px)'
          }} />
          
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: getGradient(2),
              borderRadius: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem'
            }}>
              ✓
            </div>
            
            <div style={{ textAlign: 'left', flex: 1, minWidth: '300px' }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'var(--primary-dark)'
              }}>
                {content.items[2]?.title}
              </h3>
              
              <p style={{
                fontSize: '1.2rem',
                color: 'var(--text-light)',
                lineHeight: '1.6'
              }}>
                {content.items[2]?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          section > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        
        @media (max-width: 768px) {
          section {
            padding: 4rem 1rem !important;
          }
          
          section > div > div:nth-child(2) > div,
          section > div > div:nth-child(3) {
            padding: 2rem !important;
          }
          
          section > div > div:nth-child(3) > div > div:nth-child(2) {
            flex-direction: column !important;
            text-align: center !important;
          }
          
          section > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2) {
            text-align: center !important;
            min-width: auto !important;
          }
        }
      `}</style>
    </section>
  );
}