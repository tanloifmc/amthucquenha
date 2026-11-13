export interface SystemLookup {
  id?: number;
  group_code: string;
  value_code: string;
  label_vi: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

// Bộ dữ liệu nền tảng 50+ lookups chuẩn bị cho vận hành Quê Nhà (Seed & Offline fallback)
export const SEED_LOOKUPS: SystemLookup[] = [
  // 1. LOẠI TIỆC
  { group_code: 'EVENT_TYPE', value_code: 'YEAR_END_PARTY', label_vi: 'Tiệc tất niên / Tân niên', description: 'Tiệc cuối năm, chào năm mới của công ty, gia đình', sort_order: 10, is_active: true },
  { group_code: 'EVENT_TYPE', value_code: 'BIRTHDAY', label_vi: 'Sinh nhật / Thôi nôi', description: 'Tiệc mừng sinh nhật, kỷ niệm, thôi nôi cho bé', sort_order: 20, is_active: true },
  { group_code: 'EVENT_TYPE', value_code: 'WEDDING_ENGAGEMENT', label_vi: 'Cưới / Hỏi / Đính hôn', description: 'Tiệc báo hỷ, lễ đính hôn, đám cưới ấm cúng', sort_order: 30, is_active: true },
  { group_code: 'EVENT_TYPE', value_code: 'COMPANY_MEETING', label_vi: 'Hội nghị / Liên hoan công ty', description: 'Sự kiện doanh nghiệp, họp mặt đối tác, tổng kết quý', sort_order: 40, is_active: true },
  { group_code: 'EVENT_TYPE', value_code: 'VIP_PRIVATE', label_vi: 'Tiệc tiếp khách VIP kín', description: 'Tiệc riêng tư phục vụ lãnh đạo, khách hàng VIP', sort_order: 50, is_active: true },
  { group_code: 'EVENT_TYPE', value_code: 'FAMILY_GATHERING', label_vi: 'Họp mặt gia đình / Bạn bè', description: 'Bữa ăn sum họp ấm cúng gia đình, hội đồng hương', sort_order: 60, is_active: true },
  { group_code: 'EVENT_TYPE', value_code: 'OTHER', label_vi: 'Khác (ghi chú riêng)', description: 'Các sự kiện tiệc đặc thù khác', sort_order: 70, is_active: true },

  // 2. NGUỒN LEAD
  { group_code: 'LEAD_SOURCE', value_code: 'MKT_FACEBOOK_ADS', label_vi: 'Facebook Ads', description: 'Khách từ quảng cáo trả phí Facebook', sort_order: 10, is_active: true },
  { group_code: 'LEAD_SOURCE', value_code: 'MKT_TIKTOK', label_vi: 'TikTok (Marketing)', description: 'Khách từ kênh TikTok hoặc quảng cáo TikTok', sort_order: 20, is_active: true },
  { group_code: 'LEAD_SOURCE', value_code: 'MKT_CONTENT_ORGANIC', label_vi: 'Content hữu cơ (Marketing)', description: 'Khách liên hệ từ bài viết fanpage, reels, review tự nhiên', sort_order: 30, is_active: true },
  { group_code: 'LEAD_SOURCE', value_code: 'HOTLINE_DIRECT', label_vi: 'Gọi điện trực tiếp hotline', description: 'Khách gọi trực tiếp hotline chi nhánh', sort_order: 40, is_active: true },
  { group_code: 'LEAD_SOURCE', value_code: 'WALK_IN', label_vi: 'Khách vãng lai (Walk-in)', description: 'Khách tự vào nhà hàng dùng bữa hoặc hỏi đặt tiệc', sort_order: 50, is_active: true },
  { group_code: 'LEAD_SOURCE', value_code: 'CUSTOMER_REFERRAL', label_vi: 'Khách cũ / Người quen giới thiệu', description: 'Khách hàng thân thiết giới thiệu bạn bè', sort_order: 60, is_active: true },
  { group_code: 'LEAD_SOURCE', value_code: 'BGD_RELATION', label_vi: 'Quan hệ Ban Giám Đốc', description: 'Mối quan hệ ngoại giao, bạn hữu của Ban Giám Đốc', sort_order: 70, is_active: true },

  // 3. KÊNH TRUYỀN THÔNG
  { group_code: 'CHANNEL', value_code: 'FACEBOOK', label_vi: 'Facebook Fanpage', description: 'Trang Fanpage chính thức', sort_order: 10, is_active: true },
  { group_code: 'CHANNEL', value_code: 'TIKTOK', label_vi: 'TikTok Quê Nhà', description: 'Kênh video ngắn TikTok', sort_order: 20, is_active: true },
  { group_code: 'CHANNEL', value_code: 'YOUTUBE', label_vi: 'YouTube Official', description: 'Kênh video dài / Shorts YouTube', sort_order: 30, is_active: true },
  { group_code: 'CHANNEL', value_code: 'INSTAGRAM', label_vi: 'Instagram', description: 'Kênh hình ảnh món ăn Instagram', sort_order: 40, is_active: true },
  { group_code: 'CHANNEL', value_code: 'ZALO', label_vi: 'Zalo OA', description: 'Kênh tin nhắn Zalo OA', sort_order: 50, is_active: true },

  // 4. HÌNH THỨC THANH TOÁN
  { group_code: 'PAYMENT_METHOD', value_code: 'CASH', label_vi: 'Tiền mặt', description: 'Thu tiền mặt tại thu ngân', sort_order: 10, is_active: true },
  { group_code: 'PAYMENT_METHOD', value_code: 'BANK_TRANSFER', label_vi: 'Chuyển khoản ngân hàng', description: 'Khách chuyển khoản tài khoản công ty hoặc QR', sort_order: 20, is_active: true },
  { group_code: 'PAYMENT_METHOD', value_code: 'POS_CARD', label_vi: 'Quẹt thẻ POS', description: 'Thanh toán qua máy POS', sort_order: 30, is_active: true },
  { group_code: 'PAYMENT_METHOD', value_code: 'MOMO', label_vi: 'Ví điện tử MoMo', description: 'Thanh toán qua cổng hoặc QR MoMo', sort_order: 40, is_active: true },
  { group_code: 'PAYMENT_METHOD', value_code: 'OTHER', label_vi: 'Hình thức khác', description: 'Đối trừ công nợ, voucher hoặc hình thức khác', sort_order: 50, is_active: true },

  // 5. CA PHỤC VỤ
  { group_code: 'TIME_SLOT', value_code: 'LUNCH', label_vi: 'Ca Trưa (11:00 - 14:00)', description: 'Khung giờ ăn trưa', sort_order: 10, is_active: true },
  { group_code: 'TIME_SLOT', value_code: 'DINNER', label_vi: 'Ca Tối (17:30 - 22:00)', description: 'Khung giờ ăn tối, tiệc chính', sort_order: 20, is_active: true },
  { group_code: 'TIME_SLOT', value_code: 'ALL_DAY', label_vi: 'Cả ngày', description: 'Bao trọn ca hoặc sự kiện kéo dài', sort_order: 30, is_active: true },

  // 6. LOẠI BÀN PHÒNG
  { group_code: 'ROOM_TYPE', value_code: 'VIP_ROOM', label_vi: 'Phòng VIP riêng', description: 'Phòng máy lạnh khép kín, phục vụ riêng', sort_order: 10, is_active: true },
  { group_code: 'ROOM_TYPE', value_code: 'HALL_TABLE', label_vi: 'Bàn sảnh chung', description: 'Khu vực sảnh lớn nhà hàng', sort_order: 20, is_active: true },
  { group_code: 'ROOM_TYPE', value_code: 'OUTDOOR', label_vi: 'Ngoài trời / Sân vườn', description: 'Khu vực thoáng đãng sân vườn, hành lang', sort_order: 30, is_active: true },

  // 7. HÌNH DẠNG BÀN
  { group_code: 'TABLE_SHAPE', value_code: 'RECT', label_vi: 'Bàn chữ nhật', description: 'Bàn dài chữ nhật cho đoàn hoặc gia đình', sort_order: 10, is_active: true },
  { group_code: 'TABLE_SHAPE', value_code: 'CIRCLE', label_vi: 'Bàn tròn', description: 'Bàn tiệc tròn truyền thống (8 - 12 khách)', sort_order: 20, is_active: true },

  // 8. PIPELINE TIỆC
  { group_code: 'PIPELINE_STAGE', value_code: 'NEW', label_vi: 'Mới tiếp nhận', description: 'Lead mới đổ về, chưa phân bổ hoặc chưa tư vấn', sort_order: 10, is_active: true },
  { group_code: 'PIPELINE_STAGE', value_code: 'CONSULTING', label_vi: 'Đang tư vấn / Gửi thực đơn', description: 'Đang liên hệ tư vấn món, thực đơn', sort_order: 20, is_active: true },
  { group_code: 'PIPELINE_STAGE', value_code: 'QUOTED', label_vi: 'Đã báo giá / Chờ phản hồi', description: 'Đã gửi báo giá chi tiết và dự toán chi phí', sort_order: 30, is_active: true },
  { group_code: 'PIPELINE_STAGE', value_code: 'DEPOSITED', label_vi: 'Đã đặt cọc / Chốt tiệc', description: 'Khách đã cọc, giữ phòng và chốt menu', sort_order: 40, is_active: true },
  { group_code: 'PIPELINE_STAGE', value_code: 'COMPLETED', label_vi: 'Đã hoàn tất tiệc', description: 'Tiệc đã diễn ra, khách thanh toán toàn bộ', sort_order: 50, is_active: true },
  { group_code: 'PIPELINE_STAGE', value_code: 'LOST', label_vi: 'Không chốt được (Huỷ)', description: 'Khách huỷ hoặc đổi ý', sort_order: 60, is_active: true },

  // 9. TRẠNG THÁI TASK
  { group_code: 'TASK_STATUS', value_code: 'TODO', label_vi: 'Cần làm', description: 'Đầu việc mới giao, chưa thực hiện', sort_order: 10, is_active: true },
  { group_code: 'TASK_STATUS', value_code: 'IN_PROGRESS', label_vi: 'Đang thực hiện', description: 'Đang trong quá trình triển khai', sort_order: 20, is_active: true },
  { group_code: 'TASK_STATUS', value_code: 'IN_REVIEW', label_vi: 'Chờ duyệt kết quả', description: 'Đã có sản phẩm/bằng chứng, chờ quản lý duyệt', sort_order: 30, is_active: true },
  { group_code: 'TASK_STATUS', value_code: 'DONE', label_vi: 'Hoàn thành', description: 'Quản lý nghiệm thu và xác nhận đạt yêu cầu', sort_order: 40, is_active: true },
  { group_code: 'TASK_STATUS', value_code: 'CANCELLED', label_vi: 'Đã hủy', description: 'Đầu việc đã hủy bỏ', sort_order: 50, is_active: true },

  // 10. TRẠNG THÁI CONTENT
  { group_code: 'CONTENT_STATUS', value_code: 'DRAFT', label_vi: 'Bản nháp', description: 'Nội dung đang soạn thảo', sort_order: 10, is_active: true },
  { group_code: 'CONTENT_STATUS', value_code: 'PENDING_APPROVAL', label_vi: 'Chờ duyệt nội dung', description: 'Chờ Quản lý/BGĐ duyệt', sort_order: 20, is_active: true },
  { group_code: 'CONTENT_STATUS', value_code: 'APPROVED', label_vi: 'Đã duyệt', description: 'Sẵn sàng xuất bản', sort_order: 30, is_active: true },
  { group_code: 'CONTENT_STATUS', value_code: 'SCHEDULED', label_vi: 'Đã lên lịch xuất bản', description: 'Đã hẹn giờ đăng tự động', sort_order: 40, is_active: true },
  { group_code: 'CONTENT_STATUS', value_code: 'PUBLISHED', label_vi: 'Đã xuất bản thực tế', description: 'Bài đã online trên kênh', sort_order: 50, is_active: true },

  // 11. KHÓA PHÒNG / BÀN
  { group_code: 'LOCK_STATUS', value_code: 'HOLD', label_vi: 'Đang giữ chỗ tạm', description: 'Giữ chỗ 24h chờ cọc', sort_order: 10, is_active: true },
  { group_code: 'LOCK_STATUS', value_code: 'CONFIRMED', label_vi: 'Đã xác nhận (Đã cọc)', description: 'Khóa phòng chắc chắn cho ca tiệc', sort_order: 20, is_active: true },
  { group_code: 'LOCK_STATUS', value_code: 'SEATED', label_vi: 'Đang phục vụ / Đang ngồi', description: 'Khách đã có mặt và nhà hàng đang lên món', sort_order: 30, is_active: true },
  { group_code: 'LOCK_STATUS', value_code: 'RELEASED', label_vi: 'Đã trả bàn / Hoàn tất ca', description: 'Khách đã về, dọn dẹp sạch sẽ', sort_order: 40, is_active: true },

  // 12. CHIẾN DỊCH
  { group_code: 'CAMPAIGN_STATUS', value_code: 'PLANNING', label_vi: 'Lên kế hoạch', description: 'Chiến dịch đang lập kế hoạch', sort_order: 10, is_active: true },
  { group_code: 'CAMPAIGN_STATUS', value_code: 'ACTIVE', label_vi: 'Đang diễn ra', description: 'Chiến dịch đang chạy chính thức', sort_order: 20, is_active: true },
  { group_code: 'CAMPAIGN_STATUS', value_code: 'COMPLETED', label_vi: 'Đã kết thúc', description: 'Chiến dịch hoàn thành', sort_order: 30, is_active: true },
  { group_code: 'CAMPAIGN_STATUS', value_code: 'CANCELLED', label_vi: 'Đã hủy', description: 'Chiến dịch tạm dừng hoặc hủy bỏ', sort_order: 40, is_active: true },
];

// Bộ nhớ đệm Client-side cache để tránh query lặp
const lookupCache = new Map<string, { data: SystemLookup[]; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 phút

export async function getLookups(group_code: string): Promise<SystemLookup[]> {
  const cached = lookupCache.get(group_code);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    // Thử truy vấn từ API route hoặc Supabase client nếu có
    const res = await fetch(`/api/lookups?group=${encodeURIComponent(group_code)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        lookupCache.set(group_code, { data: json.data, timestamp: now });
        return json.data;
      }
    }
  } catch {
    // Nếu chạy server-side hoặc mạng gián đoạn, tự động rơi vào fallback an toàn
  }

  // Fallback từ SEED_LOOKUPS
  const fallback = SEED_LOOKUPS.filter(
    (item) => item.group_code === group_code && item.is_active
  ).sort((a, b) => a.sort_order - b.sort_order);

  lookupCache.set(group_code, { data: fallback, timestamp: now });
  return fallback;
}

export function getLookupLabel(group_code: string, value_code: string): string {
  const item = SEED_LOOKUPS.find(
    (l) => l.group_code === group_code && l.value_code === value_code
  );
  return item ? item.label_vi : value_code;
}

export function getAllGroups(): { code: string; name: string }[] {
  return [
    { code: 'EVENT_TYPE', name: 'Loại tiệc' },
    { code: 'LEAD_SOURCE', name: 'Nguồn Lead' },
    { code: 'CHANNEL', name: 'Kênh truyền thông' },
    { code: 'PAYMENT_METHOD', name: 'Hình thức thanh toán' },
    { code: 'TIME_SLOT', name: 'Ca phục vụ' },
    { code: 'ROOM_TYPE', name: 'Loại bàn / phòng' },
    { code: 'TABLE_SHAPE', name: 'Hình dạng bàn' },
    { code: 'PIPELINE_STAGE', name: 'Giai đoạn Pipeline Tiệc' },
    { code: 'TASK_STATUS', name: 'Trạng thái đầu việc' },
    { code: 'CONTENT_STATUS', name: 'Trạng thái bài đăng' },
    { code: 'LOCK_STATUS', name: 'Trạng thái khóa bàn phòng' },
    { code: 'CAMPAIGN_STATUS', name: 'Trạng thái chiến dịch' },
  ];
}
