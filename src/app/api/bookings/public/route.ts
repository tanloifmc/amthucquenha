import { NextResponse, type NextRequest } from 'next/server';
import { sendTelegramBookingNotification } from '@/services/telegramService';
import { crmService, generateBookingCode, INITIAL_BOOKINGS } from '@/services/crmService';

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
      estimatedCost,
      menuNotes,
      setMenuName,
      specialRequests,
    } = body;

    // Chuẩn hóa mã chi nhánh (hỗ trợ cả branchCode và branch)
    const finalBranchCode =
      branchCode ||
      (body.branch?.includes('Thành Thái')
        ? 'QN_TT'
        : body.branch?.includes('Nguyễn Thái Bình')
        ? 'QN_NTB'
        : 'QN_PNT');

    const finalBranchName =
      branchName ||
      body.branch ||
      (finalBranchCode === 'QN_PNT'
        ? 'Phạm Ngọc Thạch (Q.3)'
        : finalBranchCode === 'QN_TT'
        ? 'Thành Thái (Q.10)'
        : 'Nguyễn Thái Bình (Tân Bình)');

    // Chuẩn hóa dự toán và mô tả thực đơn (hỗ trợ cả estimatedAmount lẫn estimatedCost)
    const finalEstimatedAmount = Number(estimatedAmount || estimatedCost || 0);
    const finalMenuNotes = menuNotes || setMenuName || '';

    // Validate bắt buộc
    if (!customerName || !customerPhone || !finalBranchCode) {
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
    const targetDate = bookingDate || new Date().toISOString().split('T')[0];
    const generatedId = generateBookingCode(finalBranchCode, targetDate, INITIAL_BOOKINGS);

    // 1. Tự động lưu hoặc đồng bộ vào CRM nội bộ (Module 5)
    let newRecord: any = null;
    try {
      newRecord = await crmService.addBooking({
        booking_code: generatedId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_code: customerCode,
        branch_id: finalBranchCode === 'QN_PNT' ? 1 : finalBranchCode === 'QN_TT' ? 2 : 3,
        branch_name: finalBranchName,
        booking_date: targetDate,
        time_slot: timeSlot === 'LUNCH' ? 'LUNCH' : 'DINNER',
        guest_count: Number(guestCount) || 10,
        event_type: eventType || 'TIEC_THAN_MAT',
        event_type_label: eventType || 'Tiệc Thân Mật',
        stage: 'NEW',
        estimated_budget: finalEstimatedAmount,
        special_requests: `Khu vực: ${areaPreference || 'Tùy chọn'}. ${finalMenuNotes ? `Thực đơn: ${finalMenuNotes}.` : ''} ${specialRequests ? `Yêu cầu: ${specialRequests}` : ''}`,
      });
    } catch (crmErr) {
      console.warn('[CRM INGESTION WARNING]:', crmErr);
    }

    // 2. Kích hoạt thông báo tức thì qua Telegram cho Chi nhánh Quê Nhà
    const telegramResult = await sendTelegramBookingNotification({
      bookingId: generatedId,
      customerName,
      customerPhone,
      customerCode,
      branchCode: finalBranchCode,
      branchName: finalBranchName,
      bookingDate: targetDate,
      timeSlot: timeSlot || 'DINNER',
      exactTime: exactTime || '',
      guestCount: Number(guestCount) || 10,
      tableCount: Number(tableCount) || 1,
      eventType: eventType || 'Tiệc Ẩm Thực Quê Nhà',
      areaPreference: areaPreference || 'Phòng VIP / Sân vườn',
      estimatedAmount: finalEstimatedAmount,
      menuNotes: finalMenuNotes,
      specialRequests,
    });

    return NextResponse.json({
      success: true,
      bookingId: generatedId,
      customerCode,
      message: 'Tiếp nhận phiếu đặt tiệc thành công! Quê Nhà sẽ trực tiếp liên hệ xác nhận trong vòng 5 phút.',
      data: newRecord || {
        id: Date.now(),
        booking_code: generatedId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_code: customerCode,
        branch_name: finalBranchName,
        stage: 'NEW',
        estimated_budget: finalEstimatedAmount,
      },
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
