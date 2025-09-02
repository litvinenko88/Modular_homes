/**
 * Утилиты для обеспечения безопасности приложения
 */

/**
 * Санитизация строки для предотвращения XSS атак
 * @param {string} input - Входная строка
 * @returns {string} - Очищенная строка
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>\"'&]/g, (match) => {
      const entityMap = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entityMap[match];
    });
};

/**
 * Валидация URL для предотвращения открытых редиректов
 * @param {string} url - URL для проверки
 * @returns {boolean} - true если URL безопасен
 */
export const isValidUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  
  try {
    const urlObj = new URL(url, window.location.origin);
    // Разрешаем только HTTP/HTTPS протоколы
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Безопасное логирование без пользовательских данных
 * @param {string} message - Сообщение для логирования
 * @param {string} level - Уровень логирования (info, warn, error)
 */
export const safeLog = (message, level = 'info') => {
  if (typeof message !== 'string') {
    return;
  }
  
  const sanitizedMessage = sanitizeString(message);
  
  if (process.env.NODE_ENV === 'development') {
    console[level](`[${new Date().toISOString()}] ${sanitizedMessage}`);
  }
};

/**
 * Валидация входных данных формы
 * @param {Object} data - Данные формы
 * @param {Object} schema - Схема валидации
 * @returns {Object} - Результат валидации
 */
export const validateFormData = (data, schema) => {
  const errors = {};
  const sanitizedData = {};
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    
    if (rules.required && (!value || value.trim() === '')) {
      errors[key] = 'Поле обязательно для заполнения';
      continue;
    }
    
    if (value) {
      let sanitizedValue = sanitizeString(value.toString());
      
      if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
        errors[key] = `Максимальная длина: ${rules.maxLength} символов`;
        continue;
      }
      
      if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
        errors[key] = rules.message || 'Неверный формат данных';
        continue;
      }
      
      sanitizedData[key] = sanitizedValue;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: sanitizedData
  };
};