/**
 * financeService.ts
 * Tầng nghiệp vụ xử lý Đối Soát Doanh Thu MISA 3 Chốt Chặn & Thống Kê Dashboard BGĐ
 */

export interface MisaRowRecord {
  id: number;
  voucher_no: string;           // Số chứng từ / Mã HĐ (vd: HD-PNT-202611-089)
  voucher_date: string;         // Ngày hóa đơn (YYYY-MM-DD)
  branch_code: string;          // Mã chi nhánh (QN_PNT, QN_TT, QN_NTB)
  branch_name: string;          // Tên chi nhánh
  customer_name: string;        // Tên khách hàng trên hóa đơn MISA
  customer_phone?: string;      // SĐT khách hàng
  crm_booking_code?: string;    // Mã tiệc tương ứng trên CRM (nếu khớp)
  total_revenue: number;        // Tổng doanh thu quyết toán tiệc
  misa_deposited: number;       // Tiền cọc đã hạch toán trên MISA
  crm_deposited: number;        // Tiền cọc ghi nhận trên CRM (qua UNC)
  status: 'MATCHED' | 'DEPOSIT_MISMATCH' | 'ORPHAN_MISA' | 'ORPHAN_CRM';
  discrepancy_amount: number;   // Số tiền chênh lệch (nếu có)
  note: string;                 // Diễn giải đối soát
}

export interface ReconciliationBatch {
  id: number;
  batch_code: string;
  file_name: string;
  file_hash_md5: string;
  period_month: string;
  uploaded_at: string;
  uploaded_by: string;
  total_rows: number;
  matched_count: number;
  deposit_mismatch_count: number;
  orphan_count: number;
  total_revenue_misa: number;
  total_deposited_misa: number;
  total_deposited_crm: number;
  batch_status: 'STAGING' | 'CONFIRMED' | 'REJECTED';
}

export interface BranchPerformance {
  branch_id: number;
  branch_code: string;
  branch_name: string;
  address: string;
  total_bookings: number;
  total_revenue: number;
  total_deposit_held: number;
  vip_room_occupancy_rate: number; // Tỷ lệ lấp đầy phòng VIP (%)
  vip_room_count: number;
  available_room_count: number;
}

export interface MarketingROIMetrics {
  total_mkt_spend: number;
  revenue_from_mkt: number;
  roas: number;                  // Return on Ad Spend (lần)
  total_leads: number;
  converted_bookings: number;
  conversion_rate: number;       // %
  channels: {
    channel_name: string;
    spend: number;
    revenue: number;
    leads: number;
    roas: number;
  }[];
}

export interface UrgentAlert {
  id: string;
  type: 'DEPOSIT_DUE_48H' | 'UNCONTACTED_LEAD_24H' | 'MISA_ORPHAN_ALERT';
  severity: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  title: string;
  description: string;
  deadline: string;
  branch_name: string;
  action_label: string;
  action_href: string;
}

// DỮ LIỆU MẪU ĐỐI SOÁT THỰC CHIẾN MISA SME
export const INITIAL_MISA_ROWS: MisaRowRecord[] = [
  // 1. Nhóm KHỚP 100% (Xanh lá)
  {
    id: 1,
    voucher_no: 'HD-PNT-202611-001',
    voucher_date: '2026-11-10',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    customer_name: 'Nguyễn Thanh Tùng',
    customer_phone: '0903889912',
    crm_booking_code: 'BK-202611-001',
    total_revenue: 28000000,
    misa_deposited: 10000000,
    crm_deposited: 10000000,
    status: 'MATCHED',
    discrepancy_amount: 0,
    note: 'Khớp 100% cả tiền cọc 10tr và mã tiệc BK-202611-001.',
  },
  {
    id: 2,
    voucher_no: 'HD-TT-202611-014',
    voucher_date: '2026-11-08',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    customer_name: 'Phạm Minh Đức',
    customer_phone: '0937112233',
    crm_booking_code: 'BK-202611-004',
    total_revenue: 42000000,
    misa_deposited: 42000000,
    crm_deposited: 42000000,
    status: 'MATCHED',
    discrepancy_amount: 0,
    note: 'Đã hoàn tất thanh toán quyết toán đầy đủ.',
  },
  {
    id: 3,
    voucher_no: 'HD-TT-202611-022',
    voucher_date: '2026-11-09',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    customer_name: 'Công ty Cổ Phần Xây Dựng Nam Long',
    customer_phone: '0912445566',
    crm_booking_code: 'BK-202611-008',
    total_revenue: 18500000,
    misa_deposited: 5000000,
    crm_deposited: 5000000,
    status: 'MATCHED',
    discrepancy_amount: 0,
    note: 'Khớp biên nhận cọc giữ chỗ 5.000.000 đ.',
  },

  // 2. Nhóm LỆCH TIỀN CỌC (Vàng - Cảnh báo kế toán kiểm tra UNC)
  {
    id: 4,
    voucher_no: 'HD-TT-202611-025',
    voucher_date: '2026-11-12',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    customer_name: 'Trần Thị Mai Lan',
    customer_phone: '0918334556',
    crm_booking_code: 'BK-202611-002',
    total_revenue: 15000000,
    misa_deposited: 3000000,
    crm_deposited: 5000000,
    status: 'DEPOSIT_MISMATCH',
    discrepancy_amount: -2000000,
    note: 'Cảnh báo lệch cọc: CRM ghi nhận cọc 5tr (có ảnh UNC), nhưng MISA mới chỉ ghi nhận 3tr. Cần kiểm tra lại sao kê ngân hàng.',
  },
  {
    id: 5,
    voucher_no: 'HD-NTB-202611-030',
    voucher_date: '2026-11-11',
    branch_code: 'QN_NTB',
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    customer_name: 'Lê Hoàng Long',
    customer_phone: '0988776543',
    crm_booking_code: 'BK-202611-003',
    total_revenue: 12000000,
    misa_deposited: 0,
    crm_deposited: 4000000,
    status: 'DEPOSIT_MISMATCH',
    discrepancy_amount: -4000000,
    note: 'CRM ghi nhận khách đã cọc 4tr qua chuyển khoản, nhưng thủ quỹ MISA chưa ghi nhận bút toán cọc này.',
  },

  // 3. Nhóm TIỆC NGOÀI LUỒNG / THẤT THOÁT (Đỏ - Khẩn cấp)
  {
    id: 6,
    voucher_no: 'HD-PNT-202611-099',
    voucher_date: '2026-11-12',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    customer_name: 'Đoàn Khách Vãng Lai VIP (Bàn Trúc Vàng)',
    customer_phone: '0908 999 111',
    crm_booking_code: undefined,
    total_revenue: 38500000,
    misa_deposited: 0,
    crm_deposited: 0,
    status: 'ORPHAN_MISA',
    discrepancy_amount: 38500000,
    note: 'NGHI VẤN NGOÀI LUỒNG: Hóa đơn MISA 38.5 triệu phòng VIP Trúc Vàng nhưng không có dữ liệu đặt tiệc trên CRM!',
  },
];

// Lịch sử Đợt Đối Soát MISA
export const INITIAL_BATCH: ReconciliationBatch = {
  id: 1,
  batch_code: 'BATCH-202611-01',
  file_name: 'MISA_SME_SaoKeDoanhThu_20261112.xlsx',
  file_hash_md5: 'e4d909c290d0fb1ca068ffaddf22cbd0',
  period_month: '2026-11-01',
  uploaded_at: '2026-11-13 09:30',
  uploaded_by: 'Nguyễn Thị Bích (Kế Toán Trưởng)',
  total_rows: 6,
  matched_count: 3,
  deposit_mismatch_count: 2,
  orphan_count: 1,
  total_revenue_misa: 154000000,
  total_deposited_misa: 60000000,
  total_deposited_crm: 66000000,
  batch_status: 'STAGING',
};

// Hiệu quả 3 Chi nhánh chính thức của Ẩm Thực Quê Nhà
export const BRANCH_PERFORMANCES: BranchPerformance[] = [
  {
    branch_id: 1,
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch (Q3)',
    address: '28 Phạm Ngọc Thạch, P. Võ Thị Sáu, Q.3, TP.HCM',
    total_bookings: 18,
    total_revenue: 485000000,
    total_deposit_held: 142000000,
    vip_room_occupancy_rate: 86.5,
    vip_room_count: 8,
    available_room_count: 1,
  },
  {
    branch_id: 2,
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái (Q10)',
    address: '01 Thành Thái, P.14, Q.10, TP.HCM',
    total_bookings: 11,
    total_revenue: 295000000,
    total_deposit_held: 75000000,
    vip_room_occupancy_rate: 77.5,
    vip_room_count: 5,
    available_room_count: 1,
  },
  {
    branch_id: 3,
    branch_code: 'QN_NTB',
    branch_name: 'Quê Nhà - Nguyễn Thái Bình (Tân Bình)',
    address: '52A Nguyễn Thái Bình, P.4, Q. Tân Bình, TP.HCM',
    total_bookings: 9,
    total_revenue: 235000000,
    total_deposit_held: 58000000,
    vip_room_occupancy_rate: 74.0,
    vip_room_count: 5,
    available_room_count: 2,
  },
];

// Hiệu quả Marketing & ROAS
export const MARKETING_ROI_DATA: MarketingROIMetrics = {
  total_mkt_spend: 85000000,
  revenue_from_mkt: 642000000,
  roas: 7.55,
  total_leads: 145,
  converted_bookings: 38,
  conversion_rate: 26.2,
  channels: [
    {
      channel_name: 'Facebook Ads (Chiến dịch Tiệc Cuối Năm)',
      spend: 45000000,
      revenue: 360000000,
      leads: 78,
      roas: 8.0,
    },
    {
      channel_name: 'TikTok Video Ngắn (Món ngon Quê Nhà)',
      spend: 18000000,
      revenue: 145000000,
      leads: 42,
      roas: 8.05,
    },
    {
      channel_name: 'Google Search & Maps SEO',
      spend: 12000000,
      revenue: 92000000,
      leads: 15,
      roas: 7.66,
    },
    {
      channel_name: 'Hotline Trực Tiếp & Khách Giới Thiệu',
      spend: 10000000,
      revenue: 45000000,
      leads: 10,
      roas: 4.5,
    },
  ],
};

// Cảnh báo Nóng Vận Hành 48h
export const URGENT_ALERTS: UrgentAlert[] = [
  {
    id: 'ALT-01',
    type: 'DEPOSIT_DUE_48H',
    severity: 'HIGH',
    title: 'Tiệc sắp diễn ra trong 36h chưa thu đủ cọc đợt 2',
    description: 'Tiệc Công ty Dược Phẩm Eco Green (Chị Mai Lan) ngày 16/11 tại VIP Trúc Xanh - Thành Thái chưa nộp cọc chốt thực đơn.',
    deadline: 'Trước 17:00 Ngày 15/11',
    branch_name: 'Quê Nhà - Thành Thái',
    action_label: 'Gọi điện nhắc cọc',
    action_href: '/crm/bookings',
  },
  {
    id: 'ALT-02',
    type: 'MISA_ORPHAN_ALERT',
    severity: 'CRITICAL',
    title: 'Nghi vấn tiệc ngoài luồng chưa qua CRM',
    description: 'Hóa đơn MISA HD-PNT-202611-099 trị giá 38.500.000 đ tại Phạm Ngọc Thạch chưa có thông tin đặt tiệc trên CRM.',
    deadline: 'Cần giải trình trong ngày',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    action_label: 'Kiểm tra đối soát',
    action_href: '/finance/reconciliation',
  },
  {
    id: 'ALT-03',
    type: 'UNCONTACTED_LEAD_24H',
    severity: 'MEDIUM',
    title: 'Lead tiệc quá 24h chưa được tư vấn',
    description: 'Khách hàng anh Tuấn (0913.xxx.xxx) để lại thông tin đặt tiệc thôi nôi 30 khách tại Thành Thái chưa có sales gọi.',
    deadline: 'Quá hạn 6 giờ',
    branch_name: 'Quê Nhà - Thành Thái',
    action_label: 'Phân bổ nhân viên',
    action_href: '/crm/bookings',
  },
];

export const financeService = {
  // Lấy dữ liệu đối soát MISA
  async getReconciliationData() {
    return {
      batch: INITIAL_BATCH,
      rows: INITIAL_MISA_ROWS,
    };
  },

  // Xác nhận đối soát vào Báo Cáo Tài Chính chính thức
  async confirmBatch(batchId: number): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Đợt đối soát #${batchId} đã được duyệt chính thức vào Sổ Cái Tài Chính Quê Nhà!`,
    };
  },

  // Lấy toàn bộ số liệu Dashboard BGĐ
  async getDashboardExecutiveData() {
    return {
      summary: {
        total_monthly_revenue: 1015000000, // 485M (PNT) + 295M (TT) + 235M (NTB)
        revenue_growth_pct: 18.4,
        total_bookings_month: 38,          // 18 (PNT) + 11 (TT) + 9 (NTB)
        completed_bookings: 28,
        average_occupancy_rate: 79.3,      // (86.5 + 77.5 + 74.0) / 3
        total_deposit_held: 275000000,     // 130M (PNT) + 80M (TT) + 65M (NTB)
      },
      branches: BRANCH_PERFORMANCES,
      marketing: MARKETING_ROI_DATA,
      alerts: URGENT_ALERTS,
    };
  },
};
