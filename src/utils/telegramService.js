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
 * Отправка данных формы через Telegram бота
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

    // Формирование сообщения для Telegram
    const telegramMessage = `
🏠 Новая заявка с сайта

👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${message || 'Не указано'}
📍 Источник: ${source || 'Не указан'}

⏰ Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
    `.trim();

    // Отправка в Telegram (только если токены настроены)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Telegram API error: ${response.status} ${errorData.description || ''}`);
      }

      return {
        success: true,
        message: 'Заявка успешно отправлена'
      };
    } else {
      // Если токены не настроены, просто логируем
      console.log('Telegram tokens not configured, form data:', validation.data);
      return {
        success: true,
        message: 'Заявка получена (демо режим)'
      };
    }

  } catch (error) {
    console.error('Telegram service error:', error);
    return {
      success: false,
      error: 'Failed to send message',
      message: 'Произошла ошибка при отправке заявки'
    };
  }
}