'use client';

import { useState, useEffect } from 'react';
import InitialSetupModal from '../InitialSetupModal/InitialSetupModal';
import ConstructorInterface from '../ConstructorInterface/ConstructorInterface';
import styles from './ModularConstructor.module.css';

function ModularConstructor() {
  const [showSetup, setShowSetup] = useState(true);
  const [constructorData, setConstructorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    const checkReady = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryDark = rootStyles.getPropertyValue('--primary-dark').trim();
      
      if (primaryDark && document.readyState === 'complete') {
        setIsLoading(false);
      } else {
        setTimeout(checkReady, 50);
      }
    };
    
    const timer = setTimeout(checkReady, 100);
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

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Загрузка конструктора...</p>
        </div>
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

export default ModularConstructor;