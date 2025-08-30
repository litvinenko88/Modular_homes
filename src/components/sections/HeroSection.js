'use client';

import Button from '../ui/Button';

export default function HeroSection({ content }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--primary-dark) 0%, #2a2b35 100%)',
      color: 'var(--white)',
      padding: '4rem 2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          lineHeight: '1.2'
        }}>
          {content.title}
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2.5rem',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 2.5rem auto'
        }}>
          {content.subtitle}
        </p>
        
        <Button 
          size="large"
          onClick={() => window.location.href = '/constructor'}
        >
          {content.buttonText}
        </Button>
      </div>
    </section>
  );
}