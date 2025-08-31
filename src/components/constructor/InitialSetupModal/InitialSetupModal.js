'use client';

export default function InitialSetupModal({ onComplete }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'var(--primary-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--white)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Настройка конструктора</h2>
        <button 
          onClick={() => onComplete({})}
          style={{
            background: 'var(--accent-orange)',
            color: 'var(--white)',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Начать
        </button>
      </div>
    </div>
  );
}