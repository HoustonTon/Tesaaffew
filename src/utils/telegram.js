const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

export async function sendTelegramNotification(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Telegram API Error:', data)
      throw new Error(data.description || 'Failed to send notification')
    }

    console.log('Notification sent successfully:', data)
    return data
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    throw error
  }
}

export async function testTelegramConnection() {
  const testMessage = `
🔔 Тестовое сообщение
⏰ Время: ${new Date().toLocaleString('ru-RU')}
✅ Бот успешно подключен!
  `.trim()

  return sendTelegramNotification(testMessage)
}
