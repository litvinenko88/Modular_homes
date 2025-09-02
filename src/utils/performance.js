/**
 * Утилиты для оптимизации производительности
 */

/**
 * Debounce функция для оптимизации событий
 * @param {Function} func - Функция для выполнения
 * @param {number} wait - Задержка в миллисекундах
 * @param {boolean} immediate - Выполнить немедленно
 * @returns {Function} - Debounced функция
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle функция для ограничения частоты вызовов
 * @param {Function} func - Функция для выполнения
 * @param {number} limit - Лимит в миллисекундах
 * @returns {Function} - Throttled функция
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy loading для изображений
 * @param {HTMLImageElement} img - Элемент изображения
 * @param {string} src - Источник изображения
 */
export const lazyLoadImage = (img, src) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = src;
          image.classList.remove('lazy');
          observer.unobserve(image);
        }
      });
    });
    imageObserver.observe(img);
  } else {
    // Fallback для старых браузеров
    img.src = src;
  }
};

/**
 * Предзагрузка критических ресурсов
 * @param {string} href - URL ресурса
 * @param {string} as - Тип ресурса
 */
export const preloadResource = (href, as = 'script') => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
};

/**
 * Оптимизация анимаций с requestAnimationFrame
 * @param {Function} callback - Функция анимации
 */
export const optimizedAnimation = (callback) => {
  let ticking = false;
  
  return function(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

/**
 * Проверка поддержки WebP
 * @returns {Promise<boolean>} - Поддерживается ли WebP
 */
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Мониторинг производительности
 */
export const performanceMonitor = {
  mark: (name) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  },
  
  measure: (name, startMark, endMark) => {
    if ('performance' in window && 'measure' in performance) {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure ? measure.duration : 0;
    }
    return 0;
  },
  
  getMetrics: () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    }
    return {};
  }
};