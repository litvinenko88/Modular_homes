'use client';

import { useState, useEffect } from 'react';
import InitialSetupModal from './InitialSetupModal';
import ConstructorInterface from './ConstructorInterface';

export default function ModularConstructor() {
  const [showSetup, setShowSetup] = useState(true);
  const [constructorData, setConstructorData] = useState(null);

  // Добавляем стили для полноэкранного режима
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  const handleSetupComplete = (data) => {
    setConstructorData(data);
    setShowSetup(false);
  };

  const handleBackToSetup = () => {
    setShowSetup(true);
  };

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