export default function ConstructorLoading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#31323d',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: '#ffffff'
    }}>
      <div className="spinner"></div>
      <p style={{ 
        fontSize: '16px', 
        margin: '20px 0 0 0', 
        opacity: 0.9 
      }}>
        Загрузка конструктора...
      </p>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top: 4px solid #df682b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}