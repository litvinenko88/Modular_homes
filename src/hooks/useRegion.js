'use client';

import { useState, useEffect } from 'react';

const regions = [
  { full: 'Вся Россия', short: 'РФ' },
  { full: 'Ставропольский край', short: 'СК' },
  { full: 'Краснодарский край', short: 'КК' },
  { full: 'Республика КЧР', short: 'КЧР' },
  { full: 'Республика КБР', short: 'КБР' }
];

export function useRegion() {
  const [selectedRegion, setSelectedRegion] = useState('СК');

  useEffect(() => {
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion) {
      setSelectedRegion(savedRegion);
    }
  }, []);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    localStorage.setItem('selectedRegion', region);
  };

  return {
    selectedRegion,
    handleRegionChange,
    regions
  };
}