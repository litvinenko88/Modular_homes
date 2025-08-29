export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0', color: '#31323d' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '1rem 0', color: '#666' }}>
        Страница не найдена
      </h2>
      <p style={{ fontSize: '1rem', color: '#888', marginBottom: '2rem' }}>
        Запрашиваемая страница не существует или была перемещена.
      </p>
      <a 
        href="/"
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #2e672c 0%, #4caf50 100%)',
          color: 'white',
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
      >
        🏠 Вернуться на главную
      </a>
    </div>
  );
}