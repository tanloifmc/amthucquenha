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
    name: 'Tổng Quản Lý',
    title: 'Tổng Quản Lý Vận Hành Chuỗi (General Manager)',
    scope_description: 'Toàn hệ thống 3 chi nhánh',
    scope_type: 'ALL_BRANCHES',
    color: '#C58940',
    badge_class: 'bg-amber-600 text-white',
    summary: 'Toàn quyền điều phối phễu tiệc (M5) và sơ đồ phòng bàn (M6) của cả 3 chi nhánh; kiểm soát chỉ tiêu doanh thu và cấp quyền quản lý cơ sở.',
    can_write: true,
    can_approve: true,
  },
  {
    id: 5,
    level: 5,
    code: 'BRANCH_MANAGER',
    name: 'Quản Lý Chi Nhánh',
    title: 'Quản Lý Nhà Hàng / Chi Nhánh (Restaurant Manager)',
    scope_description: 'Đúng 1 chi nhánh được gán (Branch Scope)',
    scope_type: 'ASSIGNED_BRANCHES',
    color: '#DD6B20',
    badge_class: 'bg-orange-600 text-white',
    summary: 'Toàn quyền vận hành nội bộ tại cơ sở: thêm phòng VIP, đổi sức chứa, tạm khóa bảo trì, duyệt cọc, duyệt hủy tiệc tại chi nhánh mình. Chặn xem chéo cơ sở khác.',
    can_write: true,
    can_approve: true,
  },
  {
    id: 6,
    level: 6,
    code: 'STAFF',
    name: 'Nhân Viên Vận Hành',
    title: 'Nhân Viên Thực Thi Chi Nhánh (Staff)',
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
  level_3: string; // Trưởng Phòng
  level_4: string; // Tổng Quản Lý
  level_5: string; // Quản Lý CN
  level_6: string; // Nhân Viên
}

export const MODULE_PERMISSIONS_MATRIX: ModulePermissionMatrix[] = [
  {
    module_id: 'M1',
    module_name: 'M1: Cấu hình Hệ thống & User',
    description: 'Quản trị Chi nhánh, Phòng ban, Chức danh, Tài khoản & Ma trận quyền',
    level_1: 'Xem toàn bộ',
    level_2: 'Toàn quyền',
    level_3: 'Xem phòng ban mình',
    level_4: 'Cấp quyền QL & NV',
    level_5: 'Xem nhân viên CN mình',
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
    level_4: 'Toàn quyền 3 chi nhánh',
    level_5: 'Toàn quyền tại CN mình',
    level_6: 'Nhập tiệc & Chăm sóc lead',
  },
  {
    module_id: 'M5_2',
    module_name: 'M5.2: Khách Hàng 360° & Gu VIP',
    description: 'Hồ sơ khách hàng, gắn thẻ VIP, gu ẩm thực rượu bia, lịch sử đặt tiệc',
    level_1: 'Xem toàn chuỗi',
    level_2: 'Toàn quyền',
    level_3: 'Khai thác tập khách',
    level_4: 'Toàn chuỗi',
    level_5: 'Toàn quyền khách tại CN',
    level_6: 'Tra cứu SĐT / Bắn gu VIP',
  },
  {
    module_id: 'M6',
    module_name: 'M6: Sơ Đồ Bàn Phòng (Canvas 2D)',
    description: 'Mặt bằng phòng VIP theo ca, chống trùng chéo, ghép phòng, khóa bảo trì',
    level_1: 'Xem thời gian thực',
    level_2: 'Toàn quyền',
    level_3: 'Xem tình trạng trống',
    level_4: 'Khóa / Mở toàn chuỗi',
    level_5: 'Toàn quyền cơ cấu tại CN',
    level_6: 'Đặt phòng nhanh ca trực',
  },
  {
    module_id: 'M7',
    module_name: 'M7: Đối Soát MISA (3 Chốt)',
    description: '3 chốt chặn: Khớp hoàn toàn, Lệch cọc UNC, Nghi vấn tiệc ngoài luồng',
    level_1: 'Xem cảnh báo lệch',
    level_2: 'Toàn quyền',
    level_3: 'Toàn quyền (Kế toán)',
    level_4: 'Xem chốt đối soát',
    level_5: 'Đối soát cọc tại CN mình',
    level_6: '❌ Không có quyền',
  },
  {
    module_id: 'DASHBOARD',
    module_name: 'Executive Dashboard BGĐ',
    description: '4 Thẻ KPI, So sánh 3 chi nhánh, ROAS Marketing 7.55x, Cảnh báo nóng 48h',
    level_1: 'Toàn quyền tối cao',
    level_2: 'Toàn quyền',
    level_3: 'Báo cáo chuyên môn',
    level_4: 'Toàn quyền 3 chi nhánh',
    level_5: 'Báo cáo riêng CN mình',
    level_6: '❌ Không có quyền',
  },
];

// 3. DANH MỤC CHỨC DANH F&B CHUẨN ĐÃ SEED SẴN
export const INITIAL_JOB_TITLES: JobTitleRecord[] = [
  // Khối Văn Phòng Điều Hành (HQ)
  {
    id: 1,
    code: 'JOB_HDTV_MEMBER',
    name: 'Thành Viên Hội Đồng Thành Viên',
    department_code: 'BGD_HDTV',
    department_name: 'Ban Giám Đốc & HĐTV',
    level: 1,
    role_code: 'HDTV',
    description: 'Giám sát chiến lược và thẩm định báo cáo tài chính tối cao',
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
    description: 'Toàn quyền hạ tầng kỹ thuật, phân quyền và AI Studio',
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
    description: 'Đối chiếu biên lai chuyển khoản ngân hàng UNC với hóa đơn MISA',
    is_active: true,
  },

  // Khối Chi Nhánh Vận Hành (Store)
  {
    id: 11,
    code: 'JOB_GM_CHAIN',
    name: 'Tổng Quản Lý Vận Hành Chuỗi (GM)',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh (FOH)',
    level: 4,
    role_code: 'GENERAL_MANAGER',
    description: 'Toàn quyền điều phối công suất tiệc, phê duyệt điều chỉnh giữa 3 cơ sở',
    is_active: true,
  },
  {
    id: 12,
    code: 'JOB_RESTAURANT_MANAGER',
    name: 'Quản Lý Nhà Hàng / Chi Nhánh (RM)',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh (FOH)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    description: 'Toàn quyền điều hành cơ sở: thêm phòng, duyệt cọc, tạm khóa bảo trì',
    is_active: true,
  },
  {
    id: 13,
    code: 'JOB_ASST_RM',
    name: 'Trợ Lý Quản Lý Chi Nhánh (ARM)',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh (FOH)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    description: 'Hỗ trợ điều phối phục vụ tiệc và kiểm soát chất lượng bàn ăn',
    is_active: true,
  },
  {
    id: 14,
    code: 'JOB_FLOOR_SUPERVISOR',
    name: 'Giám Sát Ca Sảnh Tiệc (Supervisor)',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh (FOH)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    description: 'Kiểm tra setup phòng VIP trước giờ tiệc, đốc thúc nhân viên phục vụ',
    is_active: true,
  },
  {
    id: 15,
    code: 'JOB_HEAD_HOSTESS',
    name: 'Tổ Trưởng Lễ Tân Đón Tiếp',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    level: 6,
    role_code: 'STAFF',
    description: 'Quản lý sơ đồ bàn ca trực và tiếp nhận khách VIP bước vào nhà hàng',
    is_active: true,
  },
  {
    id: 16,
    code: 'JOB_HOSTESS',
    name: 'Nhân Viên Lễ Tân (Hostess)',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    level: 6,
    role_code: 'STAFF',
    description: 'Chào đón khách tại cửa, tra cứu tiệc theo SĐT và dẫn khách vào phòng VIP',
    is_active: true,
  },
  {
    id: 17,
    code: 'JOB_BANQUET_SALES',
    name: 'Nhân Viên Tư Vấn Đặt Tiệc (Banquet Sales)',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    level: 6,
    role_code: 'STAFF',
    description: 'Tiếp nhận Lead, tư vấn thực đơn tiệc, gửi báo giá và chốt cọc',
    is_active: true,
  },
  {
    id: 18,
    code: 'JOB_CHIEF_CASHIER',
    name: 'Thu Ngân Chính Chi Nhánh (Cashier)',
    department_code: 'CASHIER',
    department_name: 'Bộ Phận Thu Ngân',
    level: 6,
    role_code: 'STAFF',
    description: 'Thu cọc giữ chỗ, in hóa đơn tạm tính và thanh toán quyết toán tiệc',
    is_active: true,
  },
  {
    id: 19,
    code: 'JOB_HEAD_CHEF',
    name: 'Bếp Trưởng Chi Nhánh (Head Chef)',
    department_code: 'KITCHEN_BOH',
    department_name: 'Bộ Phận Bếp & Bar (BOH)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    description: 'Quản lý ra món tiệc nóng sốt, kiểm soát chất lượng mâm cỗ truyền thống',
    is_active: true,
  },
  {
    id: 20,
    code: 'JOB_CAPTAIN_WAITER',
    name: 'Tổ Trưởng Phục Vụ (Captain)',
    department_code: 'SERVICE_BAR',
    department_name: 'Bộ Phận Phục Vụ & Pha Chế',
    level: 6,
    role_code: 'STAFF',
    description: 'Phân công nhân viên phục vụ bàn tiệc và chăm sóc bàn VIP',
    is_active: true,
  },
  {
    id: 21,
    code: 'JOB_WAITER',
    name: 'Nhân Viên Phục Vụ Bàn (Waiter/Waitress)',
    department_code: 'SERVICE_BAR',
    department_name: 'Bộ Phận Phục Vụ & Pha Chế',
    level: 6,
    role_code: 'STAFF',
    description: 'Phục vụ bàn tiệc, lên món nóng hổi, tiếp nước và chăm sóc thực khách',
    is_active: true,
  },
  {
    id: 22,
    code: 'JOB_HEAD_SECURITY',
    name: 'Tổ Trưởng Bảo Vệ & An Ninh',
    department_code: 'SECURITY_MAINTENANCE',
    department_name: 'Bộ Phận Bảo Vệ & Kỹ Thuật',
    level: 6,
    role_code: 'STAFF',
    description: 'Giữ an ninh bãi xe và hướng dẫn ô tô của thực khách đậu gọn gàng',
    is_active: true,
  },
];

// 4. DANH SÁCH TÀI KHOẢN GIẢ LẬP THEO 6 CẤP BẬC ĐỂ KIỂM THỬ
export const TEST_PROFILES: Record<string, UserProfile> = {
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
  general_manager: {
    id: 'user-gm-01',
    email: 'gm@quenha.vn',
    full_name: 'Tổng Quản Lý Vận Hành Chuỗi (GM)',
    level: 4,
    role_code: 'GENERAL_MANAGER',
    role_name: 'Tổng Quản Lý',
    job_title_code: 'JOB_GM_CHAIN',
    job_title_name: 'Tổng Quản Lý Vận Hành Chuỗi (GM)',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh (FOH)',
    is_all_branches: true,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
      { id: 3, code: 'QN_NTB', name: 'Quê Nhà - Nguyễn Thái Bình' },
    ],
  },
  branch_manager: {
    id: 'user-bm-01',
    email: 'ql_pnt@quenha.vn',
    full_name: 'Quản Lý Nhà Hàng / Chi Nhánh (RM)',
    level: 5,
    role_code: 'BRANCH_MANAGER',
    role_name: 'Quản lý Chi Nhánh',
    job_title_code: 'JOB_RESTAURANT_MANAGER',
    job_title_name: 'Quản Lý Nhà Hàng / Chi Nhánh',
    department_code: 'FOH_MANAGEMENT',
    department_name: 'Bộ Phận Quản Lý Sảnh (FOH)',
    is_all_branches: false,
    branches: [
      { id: 1, code: 'QN_PNT', name: 'Quê Nhà - Phạm Ngọc Thạch' },
    ],
  },
  staff_sales: {
    id: 'user-sales-01',
    email: 'sales_tt@quenha.vn',
    full_name: 'Nhân Viên Tư Vấn Đặt Tiệc (Banquet Sales)',
    level: 6,
    role_code: 'STAFF',
    role_name: 'Nhân Viên Vận Hành',
    job_title_code: 'JOB_BANQUET_SALES',
    job_title_name: 'Nhân Viên Tư Vấn Đặt Tiệc (Banquet Sales)',
    department_code: 'RECEPTION_CSKH',
    department_name: 'Bộ Phận Đón Tiếp & CSKH',
    is_all_branches: false,
    branches: [
      { id: 2, code: 'QN_TT', name: 'Quê Nhà - Thành Thái' },
    ],
  },
};

// Aliases tương thích ngược cho AppShell & Header
TEST_PROFILES.bgd = TEST_PROFILES.hdtv;
TEST_PROFILES.mkt_staff = TEST_PROFILES.dept_head_mkt;
TEST_PROFILES.sales_staff = TEST_PROFILES.staff_sales;
TEST_PROFILES.accountant = {
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
};

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

export function canAccessBranch(user: UserProfile, targetBranchId: number): boolean {
  if (user.is_all_branches || user.level <= 4) return true;
  return user.branches.some((b) => b.id === targetBranchId);
}
