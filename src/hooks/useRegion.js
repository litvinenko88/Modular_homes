'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getContentByRegion } from '../data/content';

export function useRegion(initialRegion = 'rf') {
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [content, setContent] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Определяем регион из URL
    const pathRegion = pathname === '/' ? 'rf' : pathname.slice(1);
    setSelectedRegion(pathRegion);
  }, [pathname]);

  useEffect(() => {
    // Обновляем контент при смене региона
    setContent(getContentByRegion(selectedRegion));
    
    // Сохраняем выбранный регион в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedRegion', selectedRegion);
    }
  }, [selectedRegion]);

  const handleRegionChange = (regionId) => {
    if (regionId === 'rf') {
      router.push('/');
    } else {
      router.push(`/${regionId}`);
    }
  };

  return {
    selectedRegion,
    content,
    handleRegionChange
  };
}