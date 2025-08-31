'use client';

import { useState, useEffect } from 'react';

export function useRegion() {
  const [selectedRegion, setSelectedRegion] = useState('СК');

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedRegion', region);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedRegion');
      if (saved) {
        setSelectedRegion(saved);
      }
    }
  }, []);

  return {
    selectedRegion,
    handleRegionChange
  };
}