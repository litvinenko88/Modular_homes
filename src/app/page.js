import InteractiveButton from '../components/InteractiveButton';

export default function Home() {
  return (
    <main style={{ 
      padding: '1rem', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          margin: '0 0 0.5rem 0', 
          color: '#31323d',
          fontWeight: '600'
        }}>🏠 Модульные дома</h1>
        <p style={{ 
          fontSize: '1rem', 
          color: '#666', 
          margin: '0'
        }}>Проектируйте дом своей мечты с помощью нашего конструктора</p>
      </div>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #f0f8ff 0%, #e8f4f8 100%)', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        marginBottom: '2rem',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ 
          fontSize: '1.2rem', 
          margin: '0 0 0.5rem 0', 
          color: '#2e672c',
          fontWeight: '500'
        }}>✅ Система готова к работе</h2>
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#555', 
          margin: '0 0 0.5rem 0'
        }}>Конструктор модульных домов успешно развернут</p>
        <p style={{ 
          fontSize: '0.8rem', 
          color: '#888', 
          margin: '0'
        }}>Технологии: Next.js, Canvas API, React</p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <InteractiveButton
          href="/constructor"
          style={{ 
            display: 'inline-block',
            background: 'linear-gradient(135deg, #2e672c 0%, #4caf50 100%)', 
            color: 'white', 
            padding: '12px 24px', 
            textDecoration: 'none', 
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(46, 103, 44, 0.3)',
            transition: 'all 0.2s ease',
            border: 'none'
          }}
        >
          🏗️ Открыть конструктор
        </InteractiveButton>
      </div>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ 
          fontSize: '1rem', 
          margin: '0 0 0.5rem 0', 
          color: '#31323d',
          fontWeight: '500'
        }}>🎯 Возможности конструктора:</h3>
        <ul style={{ 
          fontSize: '0.9rem', 
          color: '#666', 
          margin: '0',
          paddingLeft: '1.2rem'
        }}>
          <li>Интерактивное планирование участка и дома</li>
          <li>Размещение стен, окон и дверей</li>
          <li>Автоматический расчет площади и стоимости</li>
          <li>Адаптивный интерфейс для всех устройств</li>
        </ul>
      </div>
    </main>
  )
}