/**
 * permissions.ts
 * Hệ thống Phân Quyền Đa Tầng (RBAC) Chuỗi Ẩm Thực Quê Nhà
 * Chuẩn hóa 6 Cấp Bậc (Level 1 -> 6), Danh mục Chức Danh F&B & Ma Trận 7 Module Nghiệp Vụ
 */

export type RoleLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface RoleDefinition {
  id: number;
  level: RoleLevel;
  code: string;
  name: string;
  title: string;
  scope_description: string;
  scope_type: 'ALL_BRANCHES' | 'ASSIGNED_BRANCHES';
  color: string;
  badge_class: string;
  summary: string;
  can_write: boolean;
  can_approve: boolean;
}

export interface JobTitleRecord {
  id: number;
  code: string;
  name: string;
  department_code: string;
  department_name: string;
  level: RoleLevel;
  role_code: string;
  description: string;
  is_active: boolean;
  branch_code?: 'HQ' | 'QN_PNT' | 'QN_TT' | 'QN_NTB' | 'ALL';
  branch_name?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  level: RoleLevel;
  role_code: string;
  role_name: string;
  job_title_code?: string;
  job_title_name?: string;
  department_code?: string;
  department_name?: string;
  branches: { id: number; code: string; name: string }[];
  is_all_branches: boolean;
  secondary_roles?: string[]; // Hỗ trợ nhân sự kiêm nhiệm nhiều vai trò (Multi-role)
  is_temporary_proxy?: boolean; // Cờ điều động hỗ trợ tạm thời giữa các chi nhánh
}

// 1. ĐỊNH NGHĨA 6 CẤP BẬC HIERARCHY
export const ROLE_HIERARCHY: RoleDefinition[] = [
  {
    id: 1,
    level: 1,
    code: 'HDTV',
    name: 'Hội Đồng Thành Viên',
    title: 'Hội Đồng Thành Viên / Chủ Đầu Tư',
    scope_description: 'Toàn hệ thống 3 chi nhánh',
    scope_type: 'ALL_BRANCHES',
    color: '#8B1D24',
    badge_class: 'bg-[#8B1D24] text-white',
    summary: 'Giám sát tối cao toàn chuỗi (Read-only toàn bộ báo cáo doanh thu, lãi lỗ, dòng tiền cọc, KPI). Không nhập liệu trực tiếp.',
    can_write: false,
    can_approve: true,
  },
  {
    id: 2,
    level: 2,
    code: 'SUPER_ADMIN',
    name: 'Super Admin',
    title: 'Quản Trị Hệ Thống / CTO',
    scope_description: 'Toàn hệ thống 3 chi nhánh',
    scope_type: 'ALL_BRANCHES',
    color: '#2B6CB0',
    badge_class: 'bg-blue-700 text-white',
    summary: 'Toàn quyền cấu hình kỹ thuật, phân quyền người dùng, quản trị phòng ban/chức danh, API keys AI và nhật ký hệ thống.',
    can_write: true,
    can_approve: true,
  },
  {
    id: 3,
    level: 3,
    code: 'DEPARTMENT_HEAD',
    name: 'Trưởng Phòng HQ',
    title: 'Trưởng Phòng Văn Phòng Điều Hành (HQ)',
    scope_description: 'Toàn hệ thống theo chuyên môn phòng ban',
    scope_type: 'ALL_BRANCHES',
    color: '#2A7238',
    badge_class: 'bg-emerald-700 text-white',
    summary: 'Toàn quyền trong phạm vi phòng ban mình phụ trách trên toàn chuỗi (TP MKT quản lý M2-M4; Kế toán trưởng quản lý M7 và sổ cái MISA).',
    can_write: true,
    can_approve: true,
  },
  {
    id: 4,
    level: 4,
    code: 'GENERAL_MANAGER',
    name: 'Tổng Quản Lý Chi Nhánh',
    title: 'Tổng Quản Lý Chi Nhánh (General Manager - 3 TQL cho 3 nhà hàng)',
    scope_description: 'Chi nhánh phụ trách (3 TQL độc lập: PNT, TT, NTB)',
    scope_type: 'ASSIGNED_BRANCHES',
    color: '#C58940',
    badge_class: 'bg-amber-600 text-white',
    summary: 'Đứng đầu chi nhánh: Toàn quyền quyết định mọi mặt vận hành tại nhà hàng mình cai quản (Sơ đồ bàn phòng, thêm phòng VIP, tạm khóa bảo trì, duyệt cọc, duyệt hủy tiệc, chỉ tiêu doanh thu & nhân sự cơ sở).',
    can_write: true,
    can_approve: true,
  },
  {
    id: 5,
    level: 5,
    code: 'BRANCH_MANAGER',
    name: 'Quản Lý Khu Vực & Ca Trực',
    title: 'Quản Lý Khu Vực & Ca Trực (Shift & Area Manager)',
    scope_description: 'Theo ca sáng/tối và khu vực sảnh/VIP tại chi nhánh',
    scope_type: 'ASSIGNED_BRANCHES',
    color: '#DD6B20',
    badge_class: 'bg-orange-600 text-white',
    summary: 'Hỗ trợ Tổng Quản Lý điều phối trực tiếp từng ca trực (Ca Sáng, Ca Tối) và từng khu vực (Khu sảnh tiệc, Cụm phòng VIP, Sân vườn): kiểm soát phục vụ, đón khách và xử lý sự cố tại sảnh.',
    can_write: true,
    can_approve: true,
  },
  {
    id: 6,
    level: 6,
    code: 'STAFF',
    name: 'Nhân Viên Vận Hành',
    title: 'Nhân Viên Thực Thi Chi Nhánh (Store Staff)',
    scope_description: 'Đúng 1 chi nhánh, theo vị trí chuyên môn',
    scope_type: 'ASSIGNED_BRANCHES',
    color: '#6B5E55',
    badge_class: 'bg-stone-600 text-white',
    summary: 'Thực thi tác vụ theo màn hình rút gọn chuyên trách (Lễ tân thấy Sơ đồ bàn & Đặt tiệc; Thu ngân thấy Cọc/Hóa đơn; Bếp thấy thực đơn ra món).',
    can_write: true,
    can_approve: false,
  },
];

// 2. MA TRẬN PHÂN QUYỀN 7 MODULE NGHIỆP VỤ THEO 6 CẤP BẬC
export interface ModulePermissionMatrix {
  module_id: string;
  module_name: string;
  description: string;
  level_1: string; // HDTV
  level_2: string; // Super Admin
  level_3: string; // Trưởng Phòng HQ
  level_4: string; // Tổng Quản Lý Chi Nhánh
  level_5: string; // Quản Lý Ca Trực & Khu Vực
  level_6: string; // Nhân Viên Vận Hành
}

export const MODULE_PERMISSIONS_MATRIX: ModulePermissionMatrix[] = [
  {
    module_id: 'M1',
    module_name: 'M1: Cấu hình Hệ thống & User',
    description: 'Quản trị Chi nhánh, Phòng ban, Chức danh, Tài khoản & Ma trận quyền',
    level_1: 'Xem toàn bộ',
    level_2: 'Toàn quyền',
    level_3: 'Xem phòng ban mình',
    level_4: 'Quản lý tài khoản tại CN',
    level_5: 'Xem nhân viên ca trực',
    level_6: '❌ Không có quyền',
  },
  {
    module_id: 'M2_M4',
    module_name: 'M2, M3, M4: MKT, Task & AI Skills',
    description: 'Chiến dịch, Phân rã công việc Kanban, Studio Content & AI Prompts',
    level_1: 'Xem Dashboard ROI',
    level_2: 'Toàn quyền',
    level_3: 'Toàn quyền (TP MKT)',
    level_4: 'Xem & Góp ý chỉ đạo',
    level_5: 'Xem chiến dịch tại CN',
    level_6: 'Chỉ thấy Task được giao',
  },
  {
    module_id: 'M5',
    module_name: 'M5: Phễu Tiệc (Kanban CRM)',
    description: 'Pipeline 6 bước: Mới -> Báo giá -> Cọc 1 -> Cọc 2 -> Hoàn tất -> Chăm sóc',
    level_1: 'Xem tổng hợp',
    level_2: 'Toàn quyền',
    level_3: 'Xem / Tạo Lead từ MKT',
    level_4: 'Toàn quyền tiệc tại CN mình (Duyệt cọc, hủy, đổi sảnh)',
    level_5: 'Điều phối tiệc theo ca trực',
    level_6: 'Nhập tiệc & Chăm sóc lead',
  },
  {
    module_id: 'M5_2',
    module_name: 'M5.2: Khách Hàng 360° & Gu VIP',
    description: 'Hồ sơ khách hàng, gắn thẻ VIP, gu ẩm thực rượu bia, lịch sử đặt tiệc',
    level_1: 'Xem toàn chuỗi',
    level_2: 'Toàn quyền',
    level_3: 'Khai thác tập khách',
    level_4: 'Toàn quyền khách & gu VIP tại CN',
    level_5: 'Tra cứu gu VIP, lưu sở thích vào phòng',
    level_6: 'Tra cứu SĐT / Bắn gu VIP',
  },
  {
    module_id: 'M6',
    module_name: 'M6: Sơ Đồ Bàn Phòng (Canvas 2D)',
    description: 'Mặt bằng phòng VIP theo ca, chống trùng chéo, ghép phòng, khóa bảo trì',
    level_1: 'Xem thời gian thực',
    level_2: 'Toàn quyền',
    level_3: 'Xem tình trạng trống',
    level_4: 'Toàn quyền thêm phòng VIP, sửa sức chứa, khóa bảo trì tại CN',
    level_5: 'Sắp xếp bàn tiệc, ghép phòng theo ca trực',
    level_6: 'Đặt phòng nhanh ca trực',
  },
  {
    module_id: 'M7',
    module_name: 'M7: Đối Soát MISA (3 Chốt)',
    description: '3 chốt chặn: Khớp hoàn toàn, Lệch cọc UNC, Nghi vấn tiệc ngoài luồng',
    level_1: 'Xem cảnh báo lệch',
    level_2: 'Toàn quyền',
    level_3: 'Toàn quyền (Kế toán)',
    level_4: 'Xem chốt đối soát & duyệt cọc tại CN',
    level_5: 'Xem biên lai cọc trong ca',
    level_6: '❌ Không có quyền',
  },
  {
    module_id: 'DASHBOARD',
    module_name: 'Executive Dashboard BGĐ',
    description: '4 Thẻ KPI, So sánh 3 chi nhánh, ROAS Marketing 7.55x, Cảnh báo nóng 48h',
    level_1: 'Toàn quyền tối cao',
    level_2: 'Toàn quyền',
    level_3: 'Báo cáo chuyên môn',
    level_4: 'Báo cáo doanh thu & KPI cơ sở phụ trách',
    level_5: 'Công suất sảnh & bàn ca trực',
    level_6: '❌ Không có quyền',
  },
];

// 3. DANH MỤC CHỨC DANH F&B CHUẨN ĐÃ SEED SẴN (PHÂN BỔ THEO CHI NHÁNH & CA TRỰC)
export const INITIAL_JOB_TITLES: JobTitleRecord[] = [
  // ==========================================
  // KHỐI VĂN PHÒNG ĐIỀU HÀNH & TRỤ SỞ (HQ)
  // ==========================================
  {
    id: 1,
    code: 'JOB_HDTV_MEMBER',
    name: 'Thành Viên Hội Đồng Thành Viên',
    department_code: 'BGD_HDTV',
    department_name: 'Ban Giám Đốc & HĐTV',
    level: 1,
    role_code: 'HDTV',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Giám sát chiến lược và thẩm định báo cáo tài chính tối cao toàn chuỗi',
    is_active: true,
  },
  {
    id: 2,
    code: 'JOB_STRATEGIC_ADVISOR',
    name: 'Cố Vấn Chiến Lược Ban Giám Đốc',
    department_code: 'BGD_HDTV',
    department_name: 'Ban Giám Đốc & HĐTV',
    level: 1,
    role_code: 'HDTV',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Cố vấn mô hình vận hành và chuỗi ẩm thực truyền thống',
    is_active: true,
  },
  {
    id: 3,
    code: 'JOB_SUPER_ADMIN',
    name: 'Super Admin / Giám Đốc Công Nghệ (CTO)',
    department_code: 'BGD_HDTV',
    department_name: 'Ban Giám Đốc & HĐTV',
    level: 2,
    role_code: 'SUPER_ADMIN',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Toàn quyền hạ tầng kỹ thuật, phân quyền người dùng và AI Studio',
    is_active: true,
  },
  {
    id: 4,
    code: 'JOB_HEAD_MKT',
    name: 'Trưởng Phòng Marketing & Truyền Thông',
    department_code: 'MARKETING',
    department_name: 'Phòng Marketing & Truyền Thông',
    level: 3,
    role_code: 'DEPARTMENT_HEAD',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Chỉ đạo toàn bộ chiến dịch marketing, duyệt content và quản lý ngân sách',
    is_active: true,
  },
  {
    id: 5,
    code: 'JOB_CHIEF_ACCOUNTANT',
    name: 'Kế Toán Trưởng Toàn Chuỗi',
    department_code: 'ACCOUNTING',
    department_name: 'Phòng Tài Chính - Kế Toán',
    level: 3,
    role_code: 'DEPARTMENT_HEAD',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Chốt đối soát sổ cái MISA SME, bảo đảm tính minh bạch dòng tiền cọc',
    is_active: true,
  },
  {
    id: 6,
    code: 'JOB_HEAD_HR',
    name: 'Trưởng Phòng Nhân Sự & Đào Tạo',
    department_code: 'HR',
    department_name: 'Phòng Nhân Sự & Đào Tạo',
    level: 3,
    role_code: 'DEPARTMENT_HEAD',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Quản trị nhân sự chuỗi, cấp tài khoản và huấn luyện nghiệp vụ',
    is_active: true,
  },
  {
    id: 7,
    code: 'JOB_HEAD_PURCHASING',
    name: 'Trưởng Phòng Thu Mua & Cung Ứng',
    department_code: 'PURCHASING',
    department_name: 'Phòng Thu Mua & Cung Ứng',
    level: 3,
    role_code: 'DEPARTMENT_HEAD',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Kiểm soát nhà cung cấp thực phẩm tươi sống và tối ưu giá vốn',
    is_active: true,
  },
  {
    id: 8,
    code: 'JOB_MKT_CONTENT',
    name: 'Chuyên Viên Content & AI Creator',
    department_code: 'MARKETING',
    department_name: 'Phòng Marketing & Truyền Thông',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Soạn thảo bài viết, kịch bản Reels/TikTok và xuất bản đa kênh',
    is_active: true,
  },
  {
    id: 9,
    code: 'JOB_MKT_ADS',
    name: 'Chuyên Viên Quảng Cáo (Ads Specialist)',
    department_code: 'MARKETING',
    department_name: 'Phòng Marketing & Truyền Thông',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Quản lý ngân sách quảng cáo Facebook Ads, Google SEO và kéo Lead tiệc',
    is_active: true,
  },
  {
    id: 10,
    code: 'JOB_ACC_RECON',
    name: 'Kế Toán Đối Soát Tiệc & Ngân Hàng',
    department_code: 'ACCOUNTING',
    department_name: 'Phòng Tài Chính - Kế Toán',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'HQ',
    branch_name: 'Trụ Sở Điều Hành (HQ)',
    description: 'Đối chiếu biên lai chuyển khoản ngân hàng UNC với hóa đơn MISA',
    is_active: true,
  },

  // ==========================================
  // CHI NHÁNH 1: QUÊ NHÀ PHẠM NGỌC THẠCH (QUẬN 3)
  // ==========================================
  {
    id: 11,
    code: 'JOB_GM_PNT',
    name: 'Tổng Quản Lý - Quê Nhà Phạm Ngọc Thạch',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 4,
    role_code: 'GENERAL_MANAGER',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    description: 'Toàn quyền điều hành cơ sở PNT: sơ đồ bàn phòng Canvas 2D, thêm phòng VIP, duyệt cọc/hủy tiệc, nhân sự cơ sở',
    is_active: true,
  },
  {
    id: 12,
    code: 'JOB_MGR_MORNING_PNT',
    name: 'Quản Lý Ca Sáng & Sảnh Trệt - PNT',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    description: 'Điều hành ca sáng 09:00 - 16:30, tiếp khách ăn trưa và quản lý khu sảnh trệt',
    is_active: true,
  },
  {
    id: 13,
    code: 'JOB_MGR_EVENING_PNT',
    name: 'Quản Lý Ca Tối & Cụm Phòng VIP - PNT',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    description: 'Điều hành ca tối 16:30 - 23:00, giám sát phục vụ cao điểm và các phòng VIP riêng tư',
    is_active: true,
  },
  {
    id: 14,
    code: 'JOB_HEAD_CHEF_PNT',
    name: 'Bếp Trưởng Chi Nhánh - PNT',
    department_code: 'KITCHEN_BOH',
    department_name: 'Bộ Phận Bếp & Bar (BOH)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    description: 'Quản lý ra món nóng sốt, kiểm soát chất lượng mâm cỗ tiệc cơ sở Phạm Ngọc Thạch',
    is_active: true,
  },
  {
    id: 15,
    code: 'JOB_BANQUET_SALES_PNT',
    name: 'Nhân Viên Tư Vấn Đặt Tiệc - PNT',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    description: 'Tiếp nhận Lead tiệc, tư vấn set menu, lập báo giá và nhận cọc tại PNT',
    is_active: true,
  },
  {
    id: 16,
    code: 'JOB_CHIEF_CASHIER_PNT',
    name: 'Thu Ngân Chính - PNT',
    department_code: 'CASHIER',
    department_name: 'Bộ Phận Thu Ngân',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    description: 'Thu tiền cọc, xuất phiếu tạm tính và quyết toán hóa đơn tiệc tại PNT',
    is_active: true,
  },
  {
    id: 17,
    code: 'JOB_HOSTESS_PNT',
    name: 'Lễ Tân Đón Tiếp (Hostess) - PNT',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'QN_PNT',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    description: 'Chào đón khách, tra cứu tiệc theo SĐT và dẫn khách vào phòng VIP tại PNT',
    is_active: true,
  },

  // ==========================================
  // CHI NHÁNH 2: QUÊ NHÀ THÀNH THÁI (QUẬN 10)
  // ==========================================
  {
    id: 18,
    code: 'JOB_GM_TT',
    name: 'Tổng Quản Lý - Quê Nhà Thành Thái',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 4,
    role_code: 'GENERAL_MANAGER',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    description: 'Toàn quyền điều hành cơ sở TT: sơ đồ bàn phòng Canvas 2D, thêm phòng VIP, duyệt cọc/hủy tiệc, nhân sự cơ sở',
    is_active: true,
  },
  {
    id: 19,
    code: 'JOB_MGR_MORNING_TT',
    name: 'Quản Lý Ca Sáng & Sảnh Sân Vườn - TT',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    description: 'Điều hành ca sáng, kiểm soát sảnh tiệc sân vườn cây xanh thoáng đãng tại Thành Thái',
    is_active: true,
  },
  {
    id: 20,
    code: 'JOB_MGR_EVENING_TT',
    name: 'Quản Lý Ca Tối & Lầu VIP - TT',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    description: 'Điều hành ca tối cao điểm, chăm sóc khách VIP các tầng lầu và tiệc gia đình lớn',
    is_active: true,
  },
  {
    id: 21,
    code: 'JOB_HEAD_CHEF_TT',
    name: 'Bếp Trưởng Chi Nhánh - TT',
    department_code: 'KITCHEN_BOH',
    department_name: 'Bộ Phận Bếp & Bar (BOH)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    description: 'Quản lý bếp tiệc và chất lượng món ăn tại chi nhánh Thành Thái',
    is_active: true,
  },
  {
    id: 22,
    code: 'JOB_BANQUET_SALES_TT',
    name: 'Nhân Viên Tư Vấn Đặt Tiệc - TT',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    description: 'Tư vấn tiệc công ty, tiệc sinh nhật và chốt hợp đồng cọc tại Thành Thái',
    is_active: true,
  },
  {
    id: 23,
    code: 'JOB_CHIEF_CASHIER_TT',
    name: 'Thu Ngân Chính - TT',
    department_code: 'CASHIER',
    department_name: 'Bộ Phận Thu Ngân',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'QN_TT',
    branch_name: 'Quê Nhà - Thành Thái',
    description: 'Thu ngân thanh toán, giữ tiền cọc và đối soát bill ca trực tại Thành Thái',
    is_active: true,
  },

  // ==========================================
  // CHI NHÁNH 3: QUÊ NHÀ NGUYỄN THÁI BÌNH (TÂN BÌNH)
  // ==========================================
  {
    id: 24,
    code: 'JOB_GM_NTB',
    name: 'Tổng Quản Lý - Quê Nhà Nguyễn Thái Bình',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 4,
    role_code: 'GENERAL_MANAGER',
    branch_code: 'QN_NTB',
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    description: 'Toàn quyền điều hành cơ sở NTB: sơ đồ bàn phòng Canvas 2D, thêm phòng VIP, duyệt cọc/hủy tiệc, nhân sự cơ sở',
    is_active: true,
  },
  {
    id: 25,
    code: 'JOB_MGR_MORNING_NTB',
    name: 'Quản Lý Ca Sáng & Sảnh Hội Nghị - NTB',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_NTB',
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    description: 'Điều hành ca sáng, đón khách đoàn sân bay, đối tác doanh nghiệp tại Tân Bình',
    is_active: true,
  },
  {
    id: 26,
    code: 'JOB_MGR_EVENING_NTB',
    name: 'Quản Lý Ca Tối & Sảnh Tiệc - NTB',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_NTB',
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    description: 'Điều hành ca tối cao điểm, tiệc tất niên công ty và liên hoan gia đình',
    is_active: true,
  },
  {
    id: 27,
    code: 'JOB_HEAD_CHEF_NTB',
    name: 'Bếp Trưởng Chi Nhánh - NTB',
    department_code: 'KITCHEN_BOH',
    department_name: 'Bộ Phận Bếp & Bar (BOH)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    branch_code: 'QN_NTB',
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    description: 'Kiểm soát chế biến món ăn và ra món tiệc tại chi nhánh Nguyễn Thái Bình',
    is_active: true,
  },
  {
    id: 28,
    code: 'JOB_BANQUET_SALES_NTB',
    name: 'Nhân Viên Tư Vấn Đặt Tiệc - NTB',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'QN_NTB',
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    description: 'Tư vấn tiệc cưới, báo giá thực đơn và chăm sóc khách hàng tại Nguyễn Thái Bình',
    is_active: true,
  },
  {
    id: 29,
    code: 'JOB_CHIEF_CASHIER_NTB',
    name: 'Thu Ngân Chính - NTB',
    department_code: 'CASHIER',
    department_name: 'Bộ Phận Thu Ngân',
    level: 6,
    role_code: 'STAFF',
    branch_code: 'QN_NTB',
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    description: 'Thu ngân ca trực, quản lý hóa đơn GTGT và tiền cọc tiệc tại Nguyễn Thái Bình',
    is_active: true,
  },
];

// 4. DANH SÁCH TÀI KHOẢN GIẢ LẬP ĐI THEO CHI NHÁNH & CA TRỰC ĐỂ KIỂM THỬ
export const TEST_PROFILES: Record<string, UserProfile> = {
  // ==========================================
  // KHỐI ĐIỀU HÀNH & HQ (TOÀN CHUỖI 3 CHI NHÁNH)
  // ==========================================
  hdtv: {
    id: 'user-hdtv-01',
    email: 'hdtv@quenha.vn',
    full_name: 'Thành Viên Hội Đồng Thành Viên',
    level: 1,
    role_code: 'HDTV',
    role_name: 'Hội Đồng Thành Viên',
    job_title_code: 'JOB_HDTV_MEMBER',
    job_title_name: 'Thành Viên Hội Đồng Thành Viên',
    department_code: 'BGD_HDTV',
    department_name: 'Ban Giám Đốc & HĐTV',
    is_all_branches: true,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },
  super_admin: {
    id: 'user-cto-01',
    email: 'cto@quenha.vn',
    full_name: 'Super Admin / Giám Đốc Công Nghệ',
    level: 2,
    role_code: 'SUPER_ADMIN',
    role_name: 'Super Admin',
    job_title_code: 'JOB_SUPER_ADMIN',
    job_title_name: 'Super Admin / Giám Đốc Công Nghệ',
    department_code: 'BGD_HDTV',
    department_name: 'Ban Giám Đốc & HĐTV',
    is_all_branches: true,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },
  dept_head_mkt: {
    id: 'user-mkt-head-01',
    email: 'tp_mkt@quenha.vn',
    full_name: 'Trưởng Phòng Marketing & Truyền Thông',
    level: 3,
    role_code: 'DEPARTMENT_HEAD',
    role_name: 'Trưởng Phòng HQ',
    job_title_code: 'JOB_HEAD_MKT',
    job_title_name: 'Trưởng Phòng Marketing & Truyền Thông',
    department_code: 'MARKETING',
    department_name: 'Phòng Marketing & Truyền Thông',
    is_all_branches: true,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },
  accountant: {
    id: 'user-acc-01',
    email: 'ketoan@quenha.vn',
    full_name: 'Kế Toán Đối Soát Tiệc & Ngân Hàng',
    level: 6,
    role_code: 'STAFF',
    role_name: 'Kế toán Tài chính',
    job_title_code: 'JOB_ACC_RECON',
    job_title_name: 'Kế Toán Đối Soát Tiệc & Ngân Hàng',
    department_code: 'ACCOUNTING',
    department_name: 'Phòng Tài Chính - Kế Toán',
    is_all_branches: true,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },

  // ========================================================
  // CHI NHÁNH 1: QUÊ NHÀ PHẠM NGỌC THẠCH (QUẬN 3)
  // ========================================================
  gm_pnt: {
    id: 'user-gm-pnt',
    email: 'tql_pnt@quenha.vn',
    full_name: 'Tổng Quản Lý - Quê Nhà Phạm Ngọc Thạch',
    level: 4,
    role_code: 'GENERAL_MANAGER',
    role_name: 'Tổng Quản Lý Chi Nhánh',
    job_title_code: 'JOB_GM_PNT',
    job_title_name: 'Tổng Quản Lý - CN Phạm Ngọc Thạch',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
    ],
  },
  mgr_morning_pnt: {
    id: 'user-mgr-morning-pnt',
    email: 'qlca_sang_pnt@quenha.vn',
    full_name: 'Quản Lý Ca Sáng & Sảnh Trệt (PNT)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    role_name: 'Quản Lý Khu Vực & Ca Trực',
    job_title_code: 'JOB_MGR_MORNING_PNT',
    job_title_name: 'Quản Lý Ca Sáng & Sảnh Trệt - PNT',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
    ],
  },
  mgr_shift_pnt: {
    id: 'user-mgr-pnt',
    email: 'qlca_toi_pnt@quenha.vn',
    full_name: 'Quản Lý Ca Tối & Cụm Phòng VIP (PNT)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    role_name: 'Quản Lý Khu Vực & Ca Trực',
    job_title_code: 'JOB_MGR_EVENING_PNT',
    job_title_name: 'Quản Lý Ca Tối & Cụm VIP - PNT',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
    ],
  },
  staff_sales_pnt: {
    id: 'user-sales-pnt',
    email: 'sales_pnt@quenha.vn',
    full_name: 'Nhân Viên Tư Vấn Đặt Tiệc (PNT)',
    level: 6,
    role_code: 'STAFF',
    role_name: 'Nhân Viên Vận Hành',
    job_title_code: 'JOB_BANQUET_SALES_PNT',
    job_title_name: 'Nhân Viên Tư Vấn Đặt Tiệc - PNT',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    is_all_branches: false,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
    ],
  },

  // ========================================================
  // CHI NHÁNH 2: QUÊ NHÀ THÀNH THÁI (QUẬN 10)
  // ========================================================
  gm_tt: {
    id: 'user-gm-tt',
    email: 'tql_tt@quenha.vn',
    full_name: 'Tổng Quản Lý - Quê Nhà Thành Thái',
    level: 4,
    role_code: 'GENERAL_MANAGER',
    role_name: 'Tổng Quản Lý Chi Nhánh',
    job_title_code: 'JOB_GM_TT',
    job_title_name: 'Tổng Quản Lý - CN Thành Thái',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
    ],
  },
  mgr_shift_tt: {
    id: 'user-mgr-tt',
    email: 'qlca_sang_tt@quenha.vn',
    full_name: 'Quản Lý Ca Sáng & Sảnh Sân Vườn (TT)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    role_name: 'Quản Lý Khu Vực & Ca Trực',
    job_title_code: 'JOB_MGR_MORNING_TT',
    job_title_name: 'Quản Lý Ca Sáng & Sân Vườn - TT',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
    ],
  },
  mgr_evening_tt: {
    id: 'user-mgr-evening-tt',
    email: 'qlca_toi_tt@quenha.vn',
    full_name: 'Quản Lý Ca Tối & Lầu VIP (TT)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    role_name: 'Quản Lý Khu Vực & Ca Trực',
    job_title_code: 'JOB_MGR_EVENING_TT',
    job_title_name: 'Quản Lý Ca Tối & Lầu VIP - TT',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
    ],
  },
  cashier_tt: {
    id: 'user-cashier-tt',
    email: 'thungan_tt@quenha.vn',
    full_name: 'Thu Ngân Chính Chi Nhánh (TT)',
    level: 6,
    role_code: 'STAFF',
    role_name: 'Nhân Viên Vận Hành',
    job_title_code: 'JOB_CHIEF_CASHIER_TT',
    job_title_name: 'Thu Ngân Chính - TT',
    department_code: 'CASHIER',
    department_name: 'Bộ Phận Thu Ngân',
    is_all_branches: false,
    branches: [
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
    ],
  },

  // ========================================================
  // CHI NHÁNH 3: QUÊ NHÀ NGUYỄN THÁI BÌNH (TÂN BÌNH)
  // ========================================================
  gm_ntb: {
    id: 'user-gm-ntb',
    email: 'tql_ntb@quenha.vn',
    full_name: 'Tổng Quản Lý - Quê Nhà Nguyễn Thái Bình',
    level: 4,
    role_code: 'GENERAL_MANAGER',
    role_name: 'Tổng Quản Lý Chi Nhánh',
    job_title_code: 'JOB_GM_NTB',
    job_title_name: 'Tổng Quản Lý - CN Nguyễn Thái Bình',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },
  mgr_morning_ntb: {
    id: 'user-mgr-morning-ntb',
    email: 'qlca_sang_ntb@quenha.vn',
    full_name: 'Quản Lý Ca Sáng & Sảnh Hội Nghị (NTB)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    role_name: 'Quản Lý Khu Vực & Ca Trực',
    job_title_code: 'JOB_MGR_MORNING_NTB',
    job_title_name: 'Quản Lý Ca Sáng & Hội Nghị - NTB',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },
  mgr_shift_ntb: {
    id: 'user-mgr-ntb',
    email: 'qlca_toi_ntb@quenha.vn',
    full_name: 'Quản Lý Ca Tối & Sảnh Tiệc (NTB)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    role_name: 'Quản Lý Khu Vực & Ca Trực',
    job_title_code: 'JOB_MGR_EVENING_NTB',
    job_title_name: 'Quản Lý Ca Tối & Sảnh - NTB',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
    is_all_branches: false,
    branches: [
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },
  staff_sales_ntb: {
    id: 'user-sales-ntb',
    email: 'sales_ntb@quenha.vn',
    full_name: 'Nhân Viên Tư Vấn Đặt Tiệc (NTB)',
    level: 6,
    role_code: 'STAFF',
    role_name: 'Nhân Viên Vận Hành',
    job_title_code: 'JOB_BANQUET_SALES_NTB',
    job_title_name: 'Nhân Viên Tư Vấn Đặt Tiệc - NTB',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    is_all_branches: false,
    branches: [
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },
};

// Aliases tương thích ngược cho AppShell & Header
TEST_PROFILES.general_manager = TEST_PROFILES.gm_pnt;
TEST_PROFILES.branch_manager = TEST_PROFILES.mgr_shift_pnt;
TEST_PROFILES.staff_sales = TEST_PROFILES.staff_sales_pnt;
TEST_PROFILES.bgd = TEST_PROFILES.hdtv;
TEST_PROFILES.mkt_staff = TEST_PROFILES.dept_head_mkt;
TEST_PROFILES.sales_staff = TEST_PROFILES.staff_sales_pnt;

// 5. CÁC HÀM TIỆN ÍCH KIỂM TRA PHÂN QUYỀN (HỖ TRỢ KIÊM NHIỆM MULTI-ROLE)
export function checkPermission(
  roleCode: string,
  module: string,
  secondaryRoles?: string[]
): boolean {
  const rolesToCheck = [roleCode, ...(secondaryRoles || [])];

  return rolesToCheck.some((r) => {
    switch (r) {
      case 'HDTV':
      case 'BGD':
      case 'SUPER_ADMIN':
        return true;

      case 'DEPARTMENT_HEAD':
        return ['marketing', 'content', 'skills', 'misa', 'dashboard'].includes(module);

      case 'GENERAL_MANAGER':
        return ['crm', 'floor', 'dashboard', 'marketing'].includes(module);

      case 'BRANCH_MANAGER':
        return ['crm', 'floor', 'dashboard'].includes(module);

      case 'STAFF':
      case 'SALES_STAFF':
      case 'MKT_STAFF':
        return ['crm', 'floor', 'marketing', 'content', 'skills'].includes(module);

      default:
        return false;
    }
  });
}

/**
 * Kiểm tra quyền truy cập dữ liệu chi nhánh
 * - Level 1, 2, 3 và tài khoản is_all_branches = true: Xem toàn chuỗi
 * - Level 4 (Tổng Quản Lý), Level 5 (Quản Lý Ca/Khu Vực), Level 6 (Nhân viên): Chỉ truy cập đúng chi nhánh được phân công
 */
export function canAccessBranch(user: UserProfile, targetBranchId: number): boolean {
  if (user.is_all_branches || user.level <= 3) return true;
  return user.branches.some((b) => b.id === targetBranchId);
}

