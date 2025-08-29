'use client';

import { useState, useEffect } from 'react';
import InitialSetupModal from './InitialSetupModal';
import ConstructorInterface from './ConstructorInterface';

export default function ModularConstructor() {
  const [showSetup, setShowSetup] = useState(true);
  const [constructorData, setConstructorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Добавляем стили для полноэкранного режима и управляем загрузкой
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    // Проверяем готовность DOM и стилей
    const checkReady = () => {
      // Проверяем, что CSS переменные доступны
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryDark = rootStyles.getPropertyValue('--primary-dark').trim();
      
      if (primaryDark && document.readyState === 'complete') {
        setIsLoading(false);
      } else {
        // Повторяем проверку через 50мс
        setTimeout(checkReady, 50);
      }
    };
    
    // Начинаем проверку через 100мс
    const timer = setTimeout(checkReady, 100);
    
    // Максимальное время ожидания - 2 секунды
    const maxTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      clearTimeout(timer);
      clearTimeout(maxTimer);
    };
  }, []);

  const handleSetupComplete = (data) => {
    setConstructorData(data);
    setShowSetup(false);
  };

  const handleBackToSetup = () => {
    setShowSetup(true);
  };

  // Показываем загрузку пока компонент не готов
  if (isLoading) {
    return (
      <div className="constructor-loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Загрузка конструктора...</p>
        </div>
        
        <style jsx>{`
          .constructor-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: var(--primary-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          
          .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            color: var(--white);
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top: 4px solid var(--accent-orange);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .loading-content p {
            font-size: 16px;
            margin: 0;
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  if (showSetup) {
    return <InitialSetupModal onComplete={handleSetupComplete} />;
  }

  return (
    <ConstructorInterface 
      initialData={constructorData}
      onBack={handleBackToSetup}
    />
  );
}