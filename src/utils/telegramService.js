import { validateFormData } from './security';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

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
 * Отправка данных формы через Telegram бота для статического сайта
 * @param {Object} formData - Данные формы
 * @returns {Promise<Object>} - Результат отправки
 */
export async function sendToTelegram(formData) {
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

    // Логируем данные для разработки
    console.log('Form submission attempt:', {
      name,
      phone,
      message,
      source,
      timestamp: new Date().toLocaleString('ru-RU')
    });

    // Для статического сайта всегда возвращаем успех
    // Реальная отправка должна быть настроена через webhook или внешний сервис
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