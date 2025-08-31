'use client';

export default function ConstructorInterface({ initialData, onBack }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'var(--gray-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Конструктор домов</h2>
        <p>Интерфейс конструктора в разработке</p>
        <button 
          onClick={onBack}
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
          Назад
        </button>
      </div>
    </div>
  );
}