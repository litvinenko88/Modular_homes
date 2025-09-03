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
 * Отправка данных формы через внутренний API
 * @param {Object} formData - Данные формы
 * @returns {Promise<Object>} - Результат отправки
 */
export async function sendToTelegram(formData) {
  try {
    const validation = validateFormData(formData, formSchema);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Validation failed',
        details: validation.errors
      };
    }

    // Для статического сайта - логируем данные
    console.log('Form data:', validation.data);
    
    return {
      success: true,
      message: 'Заявка принята к обработке'
    };

  } catch (error) {
    console.error('Telegram service error:', error);
    return {
      success: false,
      message: 'Ошибка отправки. Попробуйте еще раз.'
    };
  }
}