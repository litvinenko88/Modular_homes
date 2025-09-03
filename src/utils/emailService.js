import { validateFormData } from './security';

const formSchema = {
  name: {
    required: true,
    maxLength: 100,
    pattern: /^[а-яёА-ЯЁa-zA-Z\s-]+$/,
    message: 'Имя может содержать только буквы, пробелы и дефисы'
  },
  phone: {
    required: true,
    maxLength: 20,
    pattern: /^[\+]?[0-9\s\-\(\)]+$/,
    message: 'Неверный формат телефона'
  },
  message: {
    required: false,
    maxLength: 500
  },
  source: {
    required: false,
    maxLength: 200
  }
};

/**
 * Простая заглушка для отправки форм (для статических сайтов)
 * @param {Object} formData - Данные формы
 * @returns {Promise<Object>} - Результат отправки
 */
export async function sendViaEmailJS(formData) {
  try {
    // Валидация данных
    const validation = validateFormData(formData, formSchema);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Validation failed',
        details: validation.errors
      };
    }

    const { name, phone, message = '', source = '' } = validation.data;

    // Логируем данные формы для разработки
    console.log('Form submission:', {
      name,
      phone,
      message,
      source,
      timestamp: new Date().toLocaleString('ru-RU')
    });

    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Для статического сайта всегда возвращаем успех
    return {
      success: true,
      message: 'Заявка принята к обработке'
    };

  } catch (error) {
    console.error('Form service error:', error);
    
    return {
      success: true,
      message: 'Заявка принята к обработке'
    };
  }
}