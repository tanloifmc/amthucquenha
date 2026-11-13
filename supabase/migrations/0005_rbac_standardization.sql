-- ==============================================================================
-- 0005_rbac_standardization.sql: Chuẩn hóa hệ thống phân quyền RBAC 6 Cấp Bậc
-- và Danh mục Phòng Ban - Chức Danh F&B Chuỗi Ẩm Thực Quê Nhà
-- ==============================================================================

-- 1. Bổ sung cột level vào bảng roles (nếu chưa có)
ALTER TABLE roles ADD COLUMN IF NOT EXISTS level INT DEFAULT 6;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS description TEXT;

-- Cập nhật hoặc thêm 6 Role cốt lõi theo 6 cấp bậc
INSERT INTO roles (code, name, level, scope, description, is_active)
VALUES
  ('HDTV', 'Hội Đồng Thành Viên / Chủ Đầu Tư', 1, 'ALL_BRANCHES', 'Toàn quyền giám sát tối cao Read-only toàn bộ Doanh thu, Lãi lỗ, Dòng tiền cọc, KPI 3 chi nhánh. Không nhập liệu.', true),
  ('SUPER_ADMIN', 'Quản Trị Hệ Thống / CTO', 2, 'ALL_BRANCHES', 'Toàn quyền cấu hình kỹ thuật, phòng ban, chức danh, phân quyền, API keys, nhật ký audit hệ thống.', true),
  ('DEPARTMENT_HEAD', 'Trưởng Phòng (Văn Phòng HQ)', 3, 'ALL_BRANCHES', 'Toàn quyền chuyên môn phòng ban mình phụ trách trên toàn chuỗi (Marketing, Kế toán, Nhân sự, Thu mua).', true),
  ('GENERAL_MANAGER', 'Tổng Quản Lý Chuỗi', 4, 'ALL_BRANCHES', 'Toàn quyền điều hành sảnh tiệc, sơ đồ phòng bàn 3 chi nhánh, phân bổ chỉ tiêu, cấp quyền quản lý cơ sở.', true),
  ('BRANCH_MANAGER', 'Quản Lý Chi Nhánh', 5, 'ASSIGNED_BRANCHES', 'Toàn quyền vận hành, duyệt cọc, tạm khóa bảo trì phòng, phân việc nhân viên tại chi nhánh được gán.', true),
  ('STAFF', 'Nhân Viên Vận Hành', 6, 'ASSIGNED_BRANCHES', 'Thực thi tác vụ cụ thể theo chức danh (Lễ tân, Sales tiệc, Thu ngân, Bếp, Phục vụ).', true)
ON CONFLICT (code) DO UPDATE SET
  level = EXCLUDED.level,
  name = EXCLUDED.name,
  scope = EXCLUDED.scope,
  description = EXCLUDED.description;

-- 2. Đảm bảo đầy đủ danh mục Phòng Ban HQ & Chi Nhánh
INSERT INTO departments (code, name, description, is_active)
VALUES
  -- Khối Văn Phòng Điều Hành (HQ)
  ('BGD_HDTV', 'Ban Giám Đốc & HĐTV', 'Cơ quan lãnh đạo tối cao và cố vấn chiến lược chuỗi Ẩm Thực Quê Nhà', true),
  ('MARKETING', 'Phòng Marketing & Truyền Thông', 'Quản lý chiến dịch, content mạng xã hội, AI Studio và chăm sóc Lead tiệc', true),
  ('ACCOUNTING', 'Phòng Tài Chính - Kế Toán', 'Quản trị dòng tiền, kiểm toán, đối soát MISA SME và báo cáo thuế', true),
  ('HR', 'Phòng Nhân Sự & Đào Tạo', 'Tuyển dụng, đào tạo quy chuẩn phục vụ Quê Nhà và quản lý chế độ đãi ngộ', true),
  ('PURCHASING', 'Phòng Thu Mua & Cung Ứng', 'Cung ứng nguyên vật liệu tươi sống, kiểm soát giá vốn (Food Cost) và QA/QC', true),

  -- Khối Chi Nhánh Vận Hành (Store / Branch)
  ('FOH_MANAGEMENT', 'Bộ Phận Quản Lý Sảnh (FOH)', 'Quản lý nhà hàng, giám sát ca, kiểm soát chất lượng phục vụ tại sảnh', true),
  ('RECEPTION_CSKH', 'Bộ Phận Đón Tiếp & CSKH', 'Tổ tiếp tân, hostess đón khách và chuyên viên tư vấn tiệc VIP (Banquet Sales)', true),
  ('SERVICE_BAR', 'Bộ Phận Phục Vụ & Pha Chế', 'Nhân viên bàn, tiếp thực và quầy bar nước giải khát', true),
  ('CASHIER', 'Bộ Phận Thu Ngân', 'Quản lý máy POS quầy, thu cọc, xuất hóa đơn quyết toán tiệc', true),
  ('KITCHEN_BOH', 'Bộ Phận Bếp & Bar (BOH)', 'Bếp trưởng, bếp chính chảo thớt nướng và sơ chế món ăn truyền thống', true),
  ('SECURITY_MAINTENANCE', 'Bộ Phận Bảo Vệ & Kỹ Thuật', 'An ninh trật tự, bãi đỗ xe và bảo trì hệ thống điện lạnh phòng VIP', true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 3. Tạo bảng Danh Mục Chức Danh (job_titles)
CREATE TABLE IF NOT EXISTS job_titles (
  id             BIGSERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  code           VARCHAR(60) UNIQUE NOT NULL,
  department_id  BIGINT REFERENCES departments(id) ON DELETE SET NULL,
  role_id        BIGINT REFERENCES roles(id) ON DELETE SET NULL,
  level          INT NOT NULL CHECK (level BETWEEN 1 AND 6),
  description    TEXT,
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- Seed danh mục Chức Danh F&B chuẩn hóa cho chuỗi Quê Nhà
INSERT INTO job_titles (name, code, department_id, role_id, level, description, is_active)
SELECT 
  v.name, 
  v.code, 
  d.id AS department_id, 
  r.id AS role_id, 
  v.level, 
  v.description, 
  true
FROM (
  VALUES
    -- Khối HQ (Level 1, 2, 3, 6)
    ('Thành Viên Hội Đồng Thành Viên', 'JOB_HDTV_MEMBER', 'BGD_HDTV', 'HDTV', 1, 'Giám sát chiến lược, thẩm định báo cáo tài chính tối cao'),
    ('Cố Vấn Chiến Lược Ban Giám Đốc', 'JOB_STRATEGIC_ADVISOR', 'BGD_HDTV', 'HDTV', 1, 'Tư vấn mở rộng chuỗi và định vị thương hiệu Quê Nhà'),
    ('Super Admin / Giám Đốc Công Nghệ (CTO)', 'JOB_SUPER_ADMIN', 'BGD_HDTV', 'SUPER_ADMIN', 2, 'Toàn quyền kỹ thuật, phân quyền và hạ tầng hệ thống'),
    ('Trưởng Phòng Marketing & Truyền Thông', 'JOB_HEAD_MKT', 'MARKETING', 'DEPARTMENT_HEAD', 3, 'Chỉ đạo chiến dịch quảng bá, phê duyệt ngân sách và bài đăng'),
    ('Kế Toán Trưởng Toàn Chuỗi', 'JOB_CHIEF_ACCOUNTANT', 'ACCOUNTING', 'DEPARTMENT_HEAD', 3, 'Chốt đối soát sổ cái MISA, kiểm soát thất thoát và dòng tiền cọc'),
    ('Trưởng Phòng Nhân Sự & Đào Tạo', 'JOB_HEAD_HR', 'HR', 'DEPARTMENT_HEAD', 3, 'Điều phối nhân sự chuỗi, cấp tài khoản và đánh giá KPI'),
    ('Trưởng Phòng Thu Mua & Cung Ứng', 'JOB_HEAD_PURCHASING', 'PURCHASING', 'DEPARTMENT_HEAD', 3, 'Kiểm soát nhà cung cấp thực phẩm và tối ưu giá vốn mâm cỗ'),
    ('Chuyên Viên Content & AI Creator', 'JOB_MKT_CONTENT', 'MARKETING', 'STAFF', 6, 'Soạn thảo bài viết, kịch bản video và khai thác AI Studio'),
    ('Chuyên Viên Quảng Cáo (Ads Specialist)', 'JOB_MKT_ADS', 'MARKETING', 'STAFF', 6, 'Quản lý ngân sách quảng cáo Facebook Ads, Google SEO, TikTok'),
    ('Kế Toán Tổng Hợp & Đối Soát Tiệc', 'JOB_ACC_RECON', 'ACCOUNTING', 'STAFF', 6, 'Kiểm tra chéo biên nhận cọc, ảnh UNC và hóa đơn MISA'),

    -- Khối Chi Nhánh (Level 4, 5, 6)
    ('Tổng Quản Lý Vận Hành Chuỗi (GM)', 'JOB_GM_CHAIN', 'FOH_MANAGEMENT', 'GENERAL_MANAGER', 4, 'Toàn quyền điều phối công suất phòng tiệc 3 chi nhánh'),
    ('Quản Lý Nhà Hàng / Chi Nhánh (RM)', 'JOB_RESTAURANT_MANAGER', 'FOH_MANAGEMENT', 'BRANCH_MANAGER', 5, 'Toàn quyền điều hành cơ sở, duyệt cọc, khóa phòng bảo trì'),
    ('Trợ Lý Quản Lý Chi Nhánh (ARM)', 'JOB_ASST_RM', 'FOH_MANAGEMENT', 'BRANCH_MANAGER', 5, 'Hỗ trợ quản lý điều phối nhân sự và xử lý phàn nàn khách VIP'),
    ('Giám Sát Ca Sảnh Tiệc (Supervisor)', 'JOB_FLOOR_SUPERVISOR', 'FOH_MANAGEMENT', 'BRANCH_MANAGER', 5, 'Theo dõi tiến độ tiệc và đôn đốc phục vụ các phòng VIP'),
    ('Tổ Trưởng Lễ Tân Đón Tiếp', 'JOB_HEAD_HOSTESS', 'RECEPTION_CSKH', 'STAFF', 6, 'Điều phối sơ đồ bàn ca trực, phân chia phòng cho khách'),
    ('Nhân Viên Lễ Tân (Hostess)', 'JOB_HOSTESS', 'RECEPTION_CSKH', 'STAFF', 6, 'Chào đón thực khách tại cửa, tra cứu thông tin đặt tiệc'),
    ('Nhân Viên Tư Vấn Đặt Tiệc (Banquet Sales)', 'JOB_BANQUET_SALES', 'RECEPTION_CSKH', 'STAFF', 6, 'Tiếp nhận Lead, tư vấn thực đơn tiệc, chốt cọc với khách'),
    ('Thu Ngân Chính Chi Nhánh (Cashier)', 'JOB_CHIEF_CASHIER', 'CASHIER', 'STAFF', 6, 'Thu ngân tại quầy, in phiếu tạm tính và hóa đơn VAT'),
    ('Bếp Trưởng Chi Nhánh (Head Chef)', 'JOB_HEAD_CHEF', 'KITCHEN_BOH', 'BRANCH_MANAGER', 5, 'Quản lý ra món tiệc nóng hổi, kiểm soát định lượng và an toàn thực phẩm'),
    ('Bếp Phó Chi Nhánh (Sous Chef)', 'JOB_SOUS_CHEF', 'KITCHEN_BOH', 'STAFF', 6, 'Điều phối tổ bếp chảo thớt khi tiệc vào ca cao điểm'),
    ('Tổ Trưởng Phục Vụ (Captain)', 'JOB_CAPTAIN_WAITER', 'SERVICE_BAR', 'STAFF', 6, 'Giám sát tác phong phục vụ tiệc và tiếp rượu cho bàn VIP'),
    ('Nhân Viên Phục Vụ Bàn (Waiter/Waitress)', 'JOB_WAITER', 'SERVICE_BAR', 'STAFF', 6, 'Bê đồ, châm đá, thay chén dĩa cho thực khách theo chuẩn Quê Nhà'),
    ('Nhân Viên Pha Chế (Bartender)', 'JOB_BARTENDER', 'SERVICE_BAR', 'STAFF', 6, 'Pha chế đồ uống, bia tươi và tráng miệng theo thực đơn'),
    ('Tổ Trưởng Bảo Vệ & An Ninh', 'JOB_HEAD_SECURITY', 'SECURITY_MAINTENANCE', 'STAFF', 6, 'Điều phối bãi đậu xe ô tô và bảo đảm an ninh sảnh tiệc')
) AS v(name, code, dept_code, role_code, level, description)
JOIN departments d ON d.code = v.dept_code
JOIN roles r ON r.code = v.role_code
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  level = EXCLUDED.level,
  description = EXCLUDED.description;

-- 4. Bổ sung liên kết job_title_id vào profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title_id BIGINT REFERENCES job_titles(id) ON DELETE SET NULL;

-- 5. CHÍNH SÁCH BẢO MẬT HÀNG (RLS POLICIES) CHUẨN HÓA
-- Hàm kiểm tra level của người dùng
CREATE OR REPLACE FUNCTION get_user_role_level(p_user_id UUID)
RETURNS INT AS $$
  SELECT COALESCE(r.level, 6)
  FROM profiles p
  JOIN roles r ON r.id = p.role_id
  WHERE p.id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS Policy cho bảng bookings_leads (Ví dụ điển hình):
-- Level 1, 2, 3, 4: Được xem toàn bộ bookings trên cả 3 chi nhánh
-- Level 5, 6: Chỉ được xem và sửa bookings có branch_id thuộc chi nhánh mình phụ trách
ALTER TABLE bookings_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "p_bookings_isolation" ON bookings_leads;
CREATE POLICY "p_bookings_isolation" ON bookings_leads
  FOR ALL
  USING (
    get_user_role_level(auth.uid()) <= 4
    OR branch_id IN (
      SELECT branch_id FROM user_branches WHERE user_id = auth.uid()
    )
  );
