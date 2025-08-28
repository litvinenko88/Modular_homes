export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏠 Модульные дома</h1>
      <p>Добро пожаловать на сайт модульных домов</p>
      <div style={{ background: '#f0f8ff', padding: '1rem', borderRadius: '8px', marginTop: '2rem' }}>
        <h2>✅ Next.js работает!</h2>
        <p>Сайт успешно собран с помощью Next.js и развернут на хостинге</p>
        <p>Время: 16:45 - Next.js восстановлен</p>
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a 
          href="/constructor" 
          style={{ 
            display: 'inline-block',
            background: '#4caf50', 
            color: 'white', 
            padding: '15px 30px', 
            textDecoration: 'none', 
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          🏗️ Открыть конструктор домов
        </a>
      </div>
    </main>
  )
}