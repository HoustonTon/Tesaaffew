const TELEGRAM_BOT_TOKEN = '7991340625:AAHY8Mie5OE4NCpqxPxV24ivpq8j0NpkKFY'
const TELEGRAM_CHAT_ID = '1234567890' // Замените это значение на chat_id, который вы получите из URL выше

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

    if (!response.ok) {
      throw new Error('Failed to send Telegram notification')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    throw error
  }
}
