/**
 * crmService.ts
 * Quản lý CRM Khách Hàng 360° & Phễu Đặt Tiệc Kanban Lean
 */

export interface CustomerRecord {
  id: number;
  customer_code: string; // Mã định danh khách hàng dạng KH-[SĐT] (vd: KH-0903889912)
  phone: string;
  full_name: string;
  company_name?: string;
  email?: string;
  preferred_branch_id: number;
  preferred_branch_name: string;
  total_bookings: number;
  total_spent: number;
  tags: string[]; // VIP, DOANH_NGHIEP, KHACH_QUEN, SINH_NHAT
  dietary_and_notes: string; // Gu ẩm thực & Lưu ý VIP phục vụ
  created_at: string;
}

// Chuẩn hóa Mã Khách Hàng tự động theo Số Điện Thoại
export function formatCustomerCode(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned ? `KH-${cleaned}` : '';
}

// Lấy mã viết tắt chi nhánh chuẩn Quê Nhà (PNT: Phạm Ngọc Thạch, TT: Thành Thái, NTB: Nguyễn Thái Bình)
export function getBranchShortCode(branch: string | number | undefined): 'PNT' | 'TT' | 'NTB' {
  if (typeof branch === 'number') {
    if (branch === 2) return 'TT';
    if (branch === 3) return 'NTB';
    return 'PNT';
  }
  const str = String(branch || '').toUpperCase();
  if (str.includes('TT') || str.includes('THÀNH THÁI') || str.includes('THANH THAI') || str.includes('QN_TT')) return 'TT';
  if (str.includes('NTB') || str.includes('NGUYỄN THÁI BÌNH') || str.includes('NGUYEN THAI BINH') || str.includes('QN_NTB')) return 'NTB';
  return 'PNT';
}

// Chuyển đổi ngày (YYYY-MM-DD hoặc ISO string) sang chuỗi ddmmyyyy chuẩn
export function formatDateToDDMMYYYY(dateStr?: string): string {
  if (!dateStr) {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}${m}${y}`;
  }
  // Nếu đã ở dạng ddmmyyyy thì giữ nguyên
  const clean = dateStr.replace(/\D/g, '');
  if (clean.length === 8 && !dateStr.includes('-')) {
    return clean;
  }
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${d}${m}${y}`;
  }
  const now = new Date();
  return `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
}

// Sinh mã tiệc chuẩn hóa: [Mã chi nhánh]-[ddmmyyyy]-[001]
// Giúp nhân viên nhìn vào là biết ngay Chi nhánh, Ngày tiệc và Số thứ tự trong ngày, search ra tức thì
export function generateBookingCode(
  branch: string | number | undefined,
  bookingDate?: string,
  existingBookings: BookingRecord[] = INITIAL_BOOKINGS
): string {
  const branchCode = getBranchShortCode(branch);
  const dateCode = formatDateToDDMMYYYY(bookingDate);
  const prefix = `${branchCode}-${dateCode}-`;

  // Đếm số lượng tiệc đã có cùng prefix trong ngày tại chi nhánh đó
  const matchedCount = existingBookings.filter((b) => b.booking_code && b.booking_code.startsWith(prefix)).length;
  const seq = String(matchedCount + 1).padStart(3, '0');
  return `${prefix}${seq}`;
}

export interface BookingRecord {
  id: number;
  booking_code: string;
  customer_id: number;
  customer_code?: string;
  customer_name: string;
  customer_phone: string;
  company_name?: string;
  branch_id: number;
  branch_name: string;
  event_type: string; // TIEC_TAT_NIEN, TIEC_SINH_NHAT, TIEP_KHACH_VIP, TIEC_CONG_TY
  event_type_label: string;
  booking_date: string; // YYYY-MM-DD
  time_slot: 'LUNCH' | 'DINNER' | 'FULL_DAY';
  guest_count: number;
  room_name: string;
  table_room_id: number;
  estimated_budget: number;
  total_deposited: number;
  stage: 'NEW' | 'QUOTED' | 'DEPOSITED' | 'COMPLETED' | 'CANCELLED';
  sales_rep_name: string;
  special_requests?: string;
  cancel_reason?: string;
  created_at: string;
}

export interface DepositRecord {
  id: number;
  booking_id: number;
  amount: number;
  deposit_stage: 'COC_1_GIU_CHO' | 'COC_2_THUC_DON';
  payment_method: 'CHUYEN_KHOAN' | 'TIEN_MAT' | 'QUET_THE_POS';
  receipt_image_url: string;
  note?: string;
  created_by: string;
  created_at: string;
}

// DỮ LIỆU MẪU CHUẨN THỰC CHIẾN CHO QUÊ NHÀ
export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 1,
    customer_code: 'KH-0903889912',
    phone: '0903 889 912',
    full_name: 'Nguyễn Thanh Tùng',
    company_name: 'Tập đoàn Xây dựng An Phong',
    email: 'tung.nguyen@anphong.vn',
    preferred_branch_id: 1,
    preferred_branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    total_bookings: 8,
    total_spent: 185000000,
    tags: ['VIP', 'DOANH_NGHIEP', 'KHACH_QUEN'],
    dietary_and_notes: 'Thích ngồi phòng VIP 01 view sân trước. Thích ăn Heo mẹt đồng quê giòn da, Cá lăng nướng than hoa. Hay tiếp đối tác Nhật, cần chuẩn bị ly uống vang riêng và đá sạch.',
    created_at: '2025-06-12',
  },
  {
    id: 2,
    customer_code: 'KH-0918334556',
    phone: '0918 334 556',
    full_name: 'Trần Thị Mai Lan',
    company_name: 'Công ty Dược Phẩm Eco Green',
    email: 'lan.tran@ecogreen.com.vn',
    preferred_branch_id: 2,
    preferred_branch_name: 'Quê Nhà - Thành Thái',
    total_bookings: 5,
    total_spent: 120000000,
    tags: ['VIP', 'DOANH_NGHIEP'],
    dietary_and_notes: 'Tiệc công ty thường đặt 30-50 khách tại Phòng VIP Trúc Xanh. Ăn thanh đạm, yêu cầu lẩu cua đồng không bỏ hành sống, nước dùng nêm nhạt ít bột ngọt.',
    created_at: '2025-08-20',
  },
  {
    id: 3,
    customer_code: 'KH-0988776543',
    phone: '0988 776 543',
    full_name: 'Lê Hoàng Long',
    company_name: 'Bất Động Sản Khang Điền',
    email: 'long.lh@khangdien.com.vn',
    preferred_branch_id: 3,
    preferred_branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    total_bookings: 3,
    total_spent: 68000000,
    tags: ['KHACH_QUEN'],
    dietary_and_notes: 'Thích gà ta hấp lá chúc chặt dày miếng. Đoàn hay uống bia thủ công, cần nhân viên rót bia liên tục.',
    created_at: '2026-01-15',
  },
  {
    id: 4,
    customer_code: 'KH-0937112233',
    phone: '0937 112 233',
    full_name: 'Phạm Minh Đức',
    company_name: 'Ngân hàng Vietcombank CN Tân Định',
    email: 'duc.pm@vietcombank.com.vn',
    preferred_branch_id: 2,
    preferred_branch_name: 'Quê Nhà - Thành Thái',
    total_bookings: 4,
    total_spent: 92000000,
    tags: ['DOANH_NGHIEP', 'VIP'],
    dietary_and_notes: 'Khách VIP của chi nhánh. Thích niêu cá bống kho nghệ, cơm cháy kho quẹt. Yêu cầu phòng máy lạnh bật lạnh sâu trước 15 phút khi khách tới.',
    created_at: '2026-02-10',
  },
];

const globalForCrm = globalThis as unknown as {
  quenha_bookings?: BookingRecord[];
};

export const INITIAL_BOOKINGS: BookingRecord[] =
  globalForCrm.quenha_bookings || [
  {
    id: 1,
    booking_code: 'PNT-20112026-001',
    customer_id: 1,
    customer_code: 'KH-0903889912',
    customer_name: 'Nguyễn Thanh Tùng',
    customer_phone: '0903 889 912',
    company_name: 'Tập đoàn Xây dựng An Phong',
    branch_id: 1,
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    event_type: 'TIEC_TAT_NIEN',
    event_type_label: 'Tiệc Tất Niên Công Ty',
    booking_date: '2026-11-20',
    time_slot: 'DINNER',
    guest_count: 35,
    room_name: 'VIP Sen Vàng (Ghép Phòng 1+2)',
    table_room_id: 1,
    estimated_budget: 28000000,
    total_deposited: 10000000,
    stage: 'DEPOSITED',
    sales_rep_name: 'Đoàn Văn Hậu (Sales Tiệc)',
    special_requests: 'Set menu 6 món signature, hoa tươi trang trí bàn tiệc, tặng 1 thùng bia tươi.',
    created_at: '2026-11-10',
  },
  {
    id: 2,
    booking_code: 'TT-16112026-001',
    customer_id: 2,
    customer_code: 'KH-0918334556',
    customer_name: 'Trần Thị Mai Lan',
    customer_phone: '0918 334 556',
    company_name: 'Công ty Dược Phẩm Eco Green',
    branch_id: 2,
    branch_name: 'Quê Nhà - Thành Thái',
    event_type: 'TIEP_KHACH_VIP',
    event_type_label: 'Tiếp Khách Đối Tác VIP',
    booking_date: '2026-11-16',
    time_slot: 'LUNCH',
    guest_count: 12,
    room_name: 'VIP Trúc Xanh 01',
    table_room_id: 5,
    estimated_budget: 15000000,
    total_deposited: 0,
    stage: 'QUOTED',
    sales_rep_name: 'Võ Thị Bích (Sales Tiệc)',
    special_requests: 'Cần gửi bảng báo giá 3 set menu kèm ảnh phòng VIP trước 15:00 hôm nay.',
    created_at: '2026-11-12',
  },
  {
    id: 3,
    booking_code: 'NTB-18112026-001',
    customer_id: 3,
    customer_code: 'KH-0988776543',
    customer_name: 'Lê Hoàng Long',
    customer_phone: '0988 776 543',
    company_name: 'Bất Động Sản Khang Điền',
    branch_id: 3,
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    event_type: 'TIEC_SINH_NHAT',
    event_type_label: 'Tiệc Sinh Nhật Gia Đình',
    booking_date: '2026-11-18',
    time_slot: 'DINNER',
    guest_count: 18,
    room_name: 'VIP Trúc Mai',
    table_room_id: 9,
    estimated_budget: 12000000,
    total_deposited: 0,
    stage: 'NEW',
    sales_rep_name: 'Đoàn Văn Hậu (Sales Tiệc)',
    special_requests: 'Khách hỏi gói trang trí bong bóng cho bé 5 tuổi, cần tư vấn thực đơn trẻ em.',
    created_at: '2026-11-13',
  },
  {
    id: 4,
    booking_code: 'TT-08112026-001',
    customer_id: 4,
    customer_code: 'KH-0937112233',
    customer_name: 'Phạm Minh Đức',
    customer_phone: '0937 112 233',
    company_name: 'Ngân hàng Vietcombank CN Tân Định',
    branch_id: 2,
    branch_name: 'Quê Nhà - Thành Thái',
    event_type: 'TIEC_CONG_TY',
    event_type_label: 'Tiệc Tổng Kết Quý IV',
    booking_date: '2026-11-08',
    time_slot: 'DINNER',
    guest_count: 45,
    room_name: 'Sảnh Trúc Vàng',
    table_room_id: 14,
    estimated_budget: 42000000,
    total_deposited: 42000000,
    stage: 'COMPLETED',
    sales_rep_name: 'Võ Thị Bích (Sales Tiệc)',
    special_requests: 'Tiệc đã diễn ra thành công tốt đẹp, khách khen món cá lăng nướng rất ngon.',
    created_at: '2026-11-01',
  },
];

if (!globalForCrm.quenha_bookings) {
  globalForCrm.quenha_bookings = INITIAL_BOOKINGS;
}

export const INITIAL_DEPOSITS: DepositRecord[] = [
  {
    id: 1,
    booking_id: 1,
    amount: 10000000,
    deposit_stage: 'COC_1_GIU_CHO',
    payment_method: 'CHUYEN_KHOAN',
    receipt_image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    note: 'VCB UNC số 984214 - Cọc giữ phòng VIP Sen Vàng ngày 20/11 (Mã tiệc PNT-20112026-001)',
    created_by: 'Đoàn Văn Hậu',
    created_at: '2026-11-11 10:15',
  },
];

export const crmService = {
  // Lấy danh sách khách hàng
  async getCustomers(): Promise<CustomerRecord[]> {
    return INITIAL_CUSTOMERS;
  },

  // Lấy danh sách tiệc
  async getBookings(): Promise<BookingRecord[]> {
    return globalForCrm.quenha_bookings || INITIAL_BOOKINGS;
  },

  // Lấy lịch sử cọc của tiệc
  async getDepositsByBookingId(bookingId: number): Promise<DepositRecord[]> {
    return INITIAL_DEPOSITS.filter((d) => d.booking_id === bookingId);
  },

  // Thêm đơn đặt tiệc mới (từ Landing Page online hoặc Sales)
  async addBooking(booking: Partial<BookingRecord>): Promise<BookingRecord> {
    const list = globalForCrm.quenha_bookings || INITIAL_BOOKINGS;
    const newId = Date.now();
    const branchTarget = booking.branch_id || booking.branch_name || 'PNT';
    const dateTarget = booking.booking_date || new Date().toISOString().split('T')[0];
    const generatedCode = booking.booking_code || generateBookingCode(branchTarget, dateTarget, list);

    const newBooking: BookingRecord = {
      id: newId,
      booking_code: generatedCode,
      customer_id: booking.customer_id || newId,
      customer_code: booking.customer_code || formatCustomerCode(booking.customer_phone || ''),
      customer_name: booking.customer_name || 'Khách Đặt Online',
      customer_phone: booking.customer_phone || '',
      company_name: booking.company_name || '',
      branch_id: booking.branch_id || 1,
      branch_name: booking.branch_name || 'Quê Nhà - Phạm Ngọc Thạch',
      event_type: booking.event_type || 'TIEC_THAN_MAT',
      event_type_label: booking.event_type_label || 'Tiệc Thân Mật',
      booking_date: dateTarget,
      time_slot: booking.time_slot || 'DINNER',
      guest_count: booking.guest_count || 10,
      room_name: booking.room_name || 'Chưa gán phòng (Chờ Quê Nhà xếp phòng)',
      table_room_id: booking.table_room_id || 0,
      estimated_budget: booking.estimated_budget || 0,
      total_deposited: booking.total_deposited || 0,
      stage: booking.stage || 'NEW',
      sales_rep_name: booking.sales_rep_name || 'Tiếp Nhận Online',
      special_requests: booking.special_requests || '',
      created_at: new Date().toISOString().split('T')[0],
    };
    list.unshift(newBooking);
    return newBooking;
  },
};
