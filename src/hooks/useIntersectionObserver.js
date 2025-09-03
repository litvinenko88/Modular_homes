import { useEffect, useState } from 'react';

/**
 * Хук для безопасного использования IntersectionObserver
 * @param {React.RefObject} ref - Ссылка на элемент для наблюдения
 * @param {Object} options - Опции для IntersectionObserver
 * @returns {boolean} - Видим ли элемент
 */
export function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}