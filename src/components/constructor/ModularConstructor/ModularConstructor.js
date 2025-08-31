'use client';

import { useState, useEffect } from 'react';
import EnhancedFloorPlanning from '../steps/EnhancedFloorPlanning';
import styles from './ModularConstructor.module.css';

function ModularConstructor() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    modules: [{ id: 1, x: 0, y: 0, width: 12, height: 8 }],
    walls: [],
    rooms: [],
    openings: []
  });

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  const updateData = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
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

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5' }}>
      <EnhancedFloorPlanning 
        data={data}
        updateData={updateData}
        onNext={() => console.log('Next step')}
        onPrev={() => window.history.back()}
      />
    </div>
  );
}

export default ModularConstructor;