import { NextResponse, type NextRequest } from 'next/server';
import { crmService, generateBookingCode, INITIAL_BOOKINGS } from '@/services/crmService';

export async function GET() {
  try {
    const bookings = await crmService.getBookings();
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách tiệc từ CRM' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newBooking = await crmService.addBooking(body);
    return NextResponse.json({ success: true, data: newBooking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lưu tiệc vào CRM' },
      { status: 500 }
    );
  }
}
