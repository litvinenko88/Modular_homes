'use client';

export default function AdvantagesSection({ content }) {
  return (
    <section style={{
      padding: '4rem 2rem',
      background: 'var(--white)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'var(--text-dark)'
        }}>
          {content.title}
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {content.items.map((item, index) => (
            <div
              key={index}
              style={{
                background: 'var(--light-gray)',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--primary-dark)'
              }}>
                {item.title}
              </h3>
              
              <p style={{
                fontSize: '1rem',
                color: 'var(--text-light)',
                lineHeight: '1.6'
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}