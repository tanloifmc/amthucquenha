/**
 * Telegram Notification Service for Ẩm Thực Quê Nhà
 * Tự động gửi thông báo đặt tiệc tức thì đến Tổng Quản Lý và Lễ tân theo từng chi nhánh.
 */

export interface TelegramBookingPayload {
  bookingId?: string | number;
  customerName: string;
  customerPhone: string;
  customerCode?: string;
  branchCode: 'QN_PNT' | 'QN_TT' | 'QN_NTB' | string;
  branchName: string;
  bookingDate: string;
  timeSlot: 'LUNCH' | 'DINNER' | string;
  exactTime?: string;
  guestCount: number;
  tableCount?: number;
  eventType: string;
  areaPreference?: string;
  estimatedAmount?: number;
  menuNotes?: string;
  specialRequests?: string;
}

export async function sendTelegramBookingNotification(payload: TelegramBookingPayload): Promise<{
  success: boolean;
  message?: string;
  simulated?: boolean;
}> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // Bản đồ Chat ID theo từng chi nhánh
  const chatIdsByBranch: Record<string, string | undefined> = {
    QN_PNT: process.env.TELEGRAM_CHAT_ID_PNT,
    QN_TT: process.env.TELEGRAM_CHAT_ID_TT,
    QN_NTB: process.env.TELEGRAM_CHAT_ID_NTB,
  };

  const hqChatId = process.env.TELEGRAM_CHAT_ID_HQ;
  const targetChatId = chatIdsByBranch[payload.branchCode] || hqChatId;

  const phoneClean = payload.customerPhone.replace(/\D/g, '');
  const customerCode = payload.customerCode || `KH-${phoneClean}`;
  const timeSlotLabel = payload.timeSlot === 'LUNCH' ? 'Ca Trưa (10:30 - 14:00)' : 'Ca Tối (17:00 - 22:00)';
  const formattedAmount = payload.estimatedAmount
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload.estimatedAmount)
    : 'Chưa chốt thực đơn';

  // Nội dung tin nhắn định dạng HTML chuyên nghiệp
  const messageHtml = `
🔔 <b>[ẨM THỰC QUÊ NHÀ — TIỆC MỚI ONLINE]</b>
━━━━━━━━━━━━━━━━━━━━
📍 <b>Chi nhánh:</b> ${payload.branchName} (${payload.branchCode})
👤 <b>Thực khách:</b> <b>${payload.customerName}</b>
📞 <b>Điện thoại:</b> <code>${payload.customerPhone}</code> (Mã: <code>${customerCode}</code>)
📅 <b>Ngày tiệc:</b> <b>${payload.bookingDate}</b> — ${timeSlotLabel} ${payload.exactTime ? `(${payload.exactTime})` : ''}
👥 <b>Quy mô:</b> <b>${payload.guestCount} khách</b> ${payload.tableCount ? `(~${payload.tableCount} bàn)` : ''}
🏷️ <b>Loại tiệc:</b> ${payload.eventType}
🏡 <b>Khu vực mong muốn:</b> ${payload.areaPreference || 'Tùy chọn phù hợp'}
💰 <b>Dự toán ước tính:</b> ${formattedAmount}
${payload.menuNotes ? `🍲 <b>Món đã chọn:</b>\n<i>${payload.menuNotes}</i>\n` : ''}
${payload.specialRequests ? `📝 <b>Yêu cầu đặc biệt:</b>\n<i>${payload.specialRequests}</i>\n` : ''}
━━━━━━━━━━━━━━━━━━━━
⚡ <b>LƯU Ý VẬN HÀNH:</b>
Tổng Quản Lý và Lễ tân chi nhánh vui lòng bấm số gọi lại xác nhận thực đơn và giữ phòng cho khách trong <b>vòng 5 phút</b>!
`;

  // Nếu chưa cấu hình Telegram Bot Token -> Ghi nhận log mô phỏng an toàn
  if (!botToken || botToken.trim() === '') {
    console.log('----------------------------------------------------');
    console.log('[TELEGRAM SIMULATION] Bot Token chưa cấu hình trong .env.local');
    console.log(`[TARGET CHAT]: ${targetChatId || 'CHƯA CẤU HÌNH'}`);
    console.log('[PAYLOAD]:', payload);
    console.log('----------------------------------------------------');
    return {
      success: true,
      simulated: true,
      message: 'Đã tạo thông báo đặt tiệc (Mô phỏng do chưa điền TELEGRAM_BOT_TOKEN)',
    };
  }

  // Nếu có Token thật nhưng chưa có Chat ID
  if (!targetChatId) {
    console.warn(`[TELEGRAM WARNING] Chưa cấu hình Chat ID cho chi nhánh ${payload.branchCode} hoặc HQ`);
    return {
      success: false,
      message: `Chưa cấu hình Chat ID Telegram cho chi nhánh ${payload.branchCode}`,
    };
  }

  try {
    const inlineKeyboard = {
      inline_keyboard: [
        [
          {
            text: `📞 Gọi Ngay: ${payload.customerPhone}`,
            url: `tel:${phoneClean}`,
          },
        ],
      ],
    };

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: messageHtml,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[TELEGRAM API ERROR]:', data);
      return { success: false, message: data.description || 'Lỗi gửi tin Telegram' };
    }

    return { success: true, message: 'Đã bắn tin Telegram thành công đến Tổng Quản Lý chi nhánh' };
  } catch (error: any) {
    console.error('[TELEGRAM EXCEPTION]:', error);
    return { success: false, message: error.message };
  }
}
