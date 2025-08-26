export default function TestPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Тестовая страница</h1>
      <p>Эта страница создана для проверки автоматического деплоя.</p>
      
      <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
        <h3>✅ Статус деплоя</h3>
        <ul>
          <li>Next.js статический экспорт: работает</li>
          <li>GitHub Actions: настроен</li>
          <li>FTP деплой: готов к тестированию</li>
        </ul>
      </div>

      <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '8px' }}>
        <h3>⚙️ Настройки для хостинга</h3>
        <p>Не забудьте добавить в GitHub Secrets:</p>
        <ul>
          <li><code>FTP_SERVER</code> - адрес FTP сервера</li>
          <li><code>FTP_USERNAME</code> - логин FTP</li>
          <li><code>FTP_PASSWORD</code> - пароль FTP</li>
          <li><code>FTP_REMOTE_PATH</code> - путь на сервере (например: public_html)</li>
        </ul>
      </div>
    </main>
  )
}