/**
 * Утилиты для обработки ошибок
 */

import { safeLog } from './security';

/**
 * Обработчик глобальных ошибок
 * @param {Error} error - Объект ошибки
 * @param {string} context - Контекст возникновения ошибки
 */
export const handleError = (error, context = 'Unknown') => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const sanitizedContext = typeof context === 'string' ? context : 'Unknown';
  
  safeLog(`Error in ${sanitizedContext}: ${errorMessage}`, 'error');
  
  // В продакшене не показываем детали ошибок пользователю
  if (process.env.NODE_ENV === 'production') {
    return 'Произошла ошибка. Пожалуйста, попробуйте позже.';
  }
  
  return errorMessage;
};

/**
 * Обработчик ошибок для асинхронных функций
 * @param {Function} fn - Асинхронная функция
 * @param {string} context - Контекст выполнения
 * @returns {Function} - Обернутая функция
 */
export const withErrorHandler = (fn, context) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  };
};

/**
 * Обработчик ошибок для React компонентов
 */
export class ErrorBoundary extends Error {
  constructor(message, componentName) {
    super(message);
    this.name = 'ComponentError';
    this.componentName = componentName;
  }
}

/**
 * Валидация и обработка ошибок форм
 * @param {Object} formData - Данные формы
 * @param {Function} validator - Функция валидации
 * @returns {Object} - Результат валидации
 */
export const validateWithErrorHandling = (formData, validator) => {
  try {
    return validator(formData);
  } catch (error) {
    handleError(error, 'Form validation');
    return {
      isValid: false,
      errors: { general: 'Ошибка валидации формы' },
      data: {}
    };
  }
};