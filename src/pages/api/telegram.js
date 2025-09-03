// API endpoint для отправки в Telegram (скрыт от клиента)
const TELEGRAM_BOT_TOKEN = '8498114010:AAFcJmkf9AOaA2p6xUgaQ0edyNJPOIgY2DI';
const TELEGRAM_CHAT_ID = '682859146';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, message = '', source = '' } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const telegramMessage = `🏠 Новая заявка с сайта

👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${message || 'Не указано'}
📍 Источник: ${source || 'Не указан'}

⏰ Время: ${new Date().toLocaleString('ru-RU')}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    res.status(200).json({ success: true, message: 'Заявка отправлена' });
  } catch (error) {
    console.error('Telegram API error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}