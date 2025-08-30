'use client';

import { useState, useEffect } from 'react';
import { getContentByRegion } from '../data/content';

export function useRegion() {
  const [selectedRegion, setSelectedRegion] = useState('sk');
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Загружаем сохраненный регион из localStorage
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion) {
      setSelectedRegion(savedRegion);
    }
  }, []);

  useEffect(() => {
    // Обновляем контент при смене региона
    setContent(getContentByRegion(selectedRegion));
    
    // Сохраняем выбранный регион в localStorage
    localStorage.setItem('selectedRegion', selectedRegion);
  }, [selectedRegion]);

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
  };

  return {
    selectedRegion,
    content,
    handleRegionChange
  };
}