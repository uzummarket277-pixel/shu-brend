import { Order } from './db.js';

export async function sendTelegramOrderNotification(order: Order): Promise<{ success: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token === 'YOUR_TELEGRAM_BOT_TOKEN' || chatId === 'YOUR_TELEGRAM_CHAT_ID') {
    console.warn(`[TELEGRAM NOTIFICATION] Bot tokeni yoki Chat ID kiritilmagan. Buyurtma #${order.order_number} faqat bazada saqlandi. (.env faylida TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni sozlang)`);
    return {
      success: false,
      error: "Telegram bot tokeni yoki Chat ID sozlanmagan (.env faylini tekshiring)"
    };
  }

  const itemsList = order.items
    .map((item, idx) => {
      const details = [
        item.size ? `O'lcham: ${item.size}` : '',
        item.color ? `Rang: ${item.color}` : ''
      ].filter(Boolean).join(', ');

      return `${idx + 1}. <b>${escapeHtml(item.name)}</b>\n   └ ${item.quantity} dona × ${item.price.toLocaleString('uz-UZ')} so'm ${details ? `(${details})` : ''}`;
    })
    .join('\n');

  const mapLinkText = order.map_link
    ? `\n📍 <b>Xarita havolasi:</b> <a href="${order.map_link}">${order.map_link}</a>`
    : '';

  const notesText = order.notes
    ? `\n📝 <b>Izoh:</b> <i>${escapeHtml(order.notes)}</i>`
    : '';

  const messageText = `🛍 <b>YANGI BUYURTMA QABUL QILINDI!</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔢 <b>Buyurtma №:</b> <code>#${order.order_number}</code>\n` +
    `👤 <b>Mijoz:</b> ${escapeHtml(order.customer_name)}\n` +
    `📞 <b>Telefon:</b> <a href="tel:${order.customer_phone}">${order.customer_phone}</a>\n` +
    `🏠 <b>Manzil:</b> ${escapeHtml(order.delivery_address)}${mapLinkText}${notesText}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 <b>Buyurtma tarkibi:</b>\n${itemsList}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 <b>JAMI SUMMA:</b> <b>${order.total_amount.toLocaleString('uz-UZ')} so'm</b>\n` +
    `🕒 <b>Vaqt:</b> ${new Date(order.created_at).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}\n` +
    `⚡️ <i>SHU BREND do'konidan xabar</i>`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });

    const resData: any = await response.json();
    if (resData.ok) {
      console.log(`[TELEGRAM NOTIFICATION] Buyurtma #${order.order_number} Telegram orqali muvaffaqiyatli yuborildi.`);
      return { success: true };
    } else {
      console.error(`[TELEGRAM ERROR] Telegram API xatosi #${order.order_number}:`, resData.description);
      return { success: false, error: resData.description };
    }
  } catch (error: any) {
    console.error(`[TELEGRAM NETWORK ERROR] Xabar yuborishda xatolik #${order.order_number}:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function sendTestTelegramMessage(): Promise<{ success: boolean; message: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token === 'YOUR_TELEGRAM_BOT_TOKEN' || chatId === 'YOUR_TELEGRAM_CHAT_ID') {
    return {
      success: false,
      message: "Telegram bot tokeni yoki Chat ID kiritilmagan. Iltimos .env faylida sozlang."
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔔 <b>SHU BREND Test Xabari</b>\n\nTelegram bot integratsiyasi muvaffaqiyatli ishlamoqda!\nYangi buyurtmalar ushbu chatga keladi.\nSana: ${new Date().toLocaleString('uz-UZ')}`,
        parse_mode: 'HTML'
      })
    });

    const data: any = await response.json();
    if (data.ok) {
      return { success: true, message: "Sinov xabari Telegram bot orqali muvaffaqiyatli yuborildi!" };
    } else {
      return { success: false, message: `Telegram xatosi: ${data.description}` };
    }
  } catch (err: any) {
    return { success: false, message: `Ulanish xatosi: ${err.message}` };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
