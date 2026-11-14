import { NextResponse, type NextRequest } from 'next/server';
import { sendTelegramBookingNotification } from '@/services/telegramService';
import { crmService } from '@/services/crmService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      branchCode,
      branchName,
      bookingDate,
      timeSlot,
      exactTime,
      guestCount,
      tableCount,
      eventType,
      areaPreference,
      estimatedAmount,
      menuNotes,
      specialRequests,
    } = body;

    // Validate bắt buộc
    if (!customerName || !customerPhone || !branchCode) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ Họ tên, Số điện thoại và Chi nhánh muốn đặt tiệc!' },
        { status: 400 }
      );
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ!' }, { status: 400 });
    }

    const customerCode = `KH-${cleanPhone}`;
    const generatedId = `BK-${Date.now().toString().slice(-6)}`;

    // 1. Tự động lưu hoặc đồng bộ vào CRM nội bộ (Module 5)
    try {
      await crmService.addBooking({
        booking_code: generatedId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_code: customerCode,
        branch_id: branchCode === 'QN_PNT' ? 1 : branchCode === 'QN_TT' ? 2 : 3,
        branch_name: branchName || (branchCode === 'QN_PNT' ? 'Phạm Ngọc Thạch' : branchCode === 'QN_TT' ? 'Thành Thái' : 'Nguyễn Thái Bình'),
        booking_date: bookingDate || new Date().toISOString().split('T')[0],
        time_slot: (timeSlot === 'LUNCH' ? 'LUNCH' : 'DINNER'),
        guest_count: Number(guestCount) || 10,
        event_type: eventType || 'TIEC_THAN_MAT',
        event_type_label: eventType || 'Tiệc Thân Mật',
        stage: 'NEW',
        estimated_budget: Number(estimatedAmount) || 0,
        special_requests: `Khu vực: ${areaPreference || 'Tùy chọn'}. ${menuNotes ? `Món đã chọn: ${menuNotes}.` : ''} ${specialRequests ? `Yêu cầu: ${specialRequests}` : ''}`,
      });
    } catch (crmErr) {
      console.warn('[CRM INGESTION WARNING]:', crmErr);
    }

    // 2. Kích hoạt thông báo tức thì qua Telegram cho Tổng Quản Lý và Lễ tân chi nhánh
    const telegramResult = await sendTelegramBookingNotification({
      bookingId: generatedId,
      customerName,
      customerPhone,
      customerCode,
      branchCode,
      branchName: branchName || (branchCode === 'QN_PNT' ? 'Phạm Ngọc Thạch (Q.3)' : branchCode === 'QN_TT' ? 'Thành Thái (Q.10)' : 'Nguyễn Thái Bình (Tân Bình)'),
      bookingDate: bookingDate || 'Hôm nay',
      timeSlot: timeSlot || 'DINNER',
      exactTime: exactTime || '',
      guestCount: Number(guestCount) || 10,
      tableCount: Number(tableCount) || 1,
      eventType: eventType || 'Tiệc Ẩm Thực Quê Nhà',
      areaPreference: areaPreference || 'Phòng VIP / Sân vườn',
      estimatedAmount: Number(estimatedAmount) || 0,
      menuNotes,
      specialRequests,
    });

    return NextResponse.json({
      success: true,
      bookingId: generatedId,
      customerCode,
      message: 'Tiếp nhận phiếu đặt tiệc thành công! Lễ tân chi nhánh sẽ liên hệ lại trong vòng 5 phút.',
      telegram: telegramResult,
    });
  } catch (error: any) {
    console.error('[PUBLIC BOOKING API ERROR]:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi tiếp nhận phiếu đặt tiệc. Vui lòng gọi trực tiếp hotline 0938 226 166.' },
      { status: 500 }
    );
  }
}
