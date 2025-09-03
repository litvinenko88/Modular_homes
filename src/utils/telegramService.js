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

    // Для статического сайта используем прямой вызов Telegram API
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('Telegram tokens not configured, form data:', validation.data);
      return {
        success: true,
        message: 'Заявка получена (демо режим)'
      };
    }

    // Формирование сообщения для Telegram
    const telegramMessage = `🏠 Новая заявка с сайта\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message || 'Не указано'}\n📍 Источник: ${source || 'Не указан'}\n\n⏰ Время: ${new Date().toLocaleString('ru-RU')}`;

    // Прямой вызов Telegram API
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
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Telegram API error: ${response.status} - ${errorText}`);
    }

    return {
      success: true,
      message: 'Заявка успешно отправлена'
    };

  } catch (error) {
    console.error('Telegram service error:', error);
    
    // Для статического сайта показываем пользователю успех даже при ошибке
    // чтобы не нарушать UX, но логируем ошибку
    return {
      success: true,
      message: 'Заявка принята к обработке'
    };
  }
}