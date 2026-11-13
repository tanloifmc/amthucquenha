-- ==============================================================================
-- 0001_rbac_core.sql: Cấu trúc phân quyền động, Chi nhánh, Phòng ban & Profiles
-- Phiên bản v1.1 - Đã bổ sung departments và ma trận Role ↔ Permissions động
-- ==============================================================================

-- 1. CHI NHÁNH (Động hoàn toàn - Admin tự thêm/sửa/ẩn)
CREATE TABLE IF NOT EXISTS branches (
  id         BIGSERIAL PRIMARY KEY,
  code       VARCHAR(20) UNIQUE NOT NULL,  -- QN_PNT, QN_TT, QN_NTB
  name       TEXT NOT NULL,
  address    TEXT,
  city       VARCHAR(100) DEFAULT 'TP. Hồ Chí Minh',
  hotline    VARCHAR(20),
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PHÒNG BAN (Động hoàn toàn - Ban Giám Đốc tự quản trị)
CREATE TABLE IF NOT EXISTS departments (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(50) UNIQUE NOT NULL,  -- MARKETING, KITCHEN, RECEPTIONIST, SALES_BANQUET, MANAGEMENT, ACCOUNTING
  name        TEXT NOT NULL,
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. VAI TRÒ (Roles)
CREATE TABLE IF NOT EXISTS roles (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(50) UNIQUE NOT NULL,  -- BGD, BRANCH_MANAGER, SALES_STAFF, MKT_STAFF, RECEPTIONIST, ACCOUNTANT
  name        TEXT NOT NULL,
  scope       VARCHAR(30) DEFAULT 'ASSIGNED_BRANCHES', -- 'ALL_BRANCHES' (Toàn chuỗi) | 'ASSIGNED_BRANCHES' (Theo chi nhánh)
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. DANH MỤC QUYỀN HẠN CHI TIẾT (Permissions)
CREATE TABLE IF NOT EXISTS permissions (
  id          BIGSERIAL PRIMARY KEY,
  module      VARCHAR(50) NOT NULL,   -- admin, marketing, content, skills, crm, floor, misa, dashboard
  action      VARCHAR(50) NOT NULL,   -- view, edit, delete, approve, create, import, confirm, setup, finance
  description TEXT,
  CONSTRAINT uq_module_action UNIQUE(module, action)
);

-- 5. MA TRẬN VAI TRÒ ↔ QUYỀN HẠN (Role Permissions - Tick là có quyền)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       BIGINT REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 6. HỒ SƠ NGƯỜI DÙNG (Profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  phone         VARCHAR(15),
  avatar_url    TEXT,
  role_id       BIGINT REFERENCES roles(id),
  department_id BIGINT REFERENCES departments(id),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 7. PHÂN BỔ CHI NHÁNH PHỤ TRÁCH CHO NHÂN VIÊN (User Branches)
CREATE TABLE IF NOT EXISTS user_branches (
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id  BIGINT REFERENCES branches(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, branch_id)
);

-- ==============================================================================
-- CÁC HÀM BẢO MẬT & KIỂM TRA QUYỀN DÙNG CHO RLS VÀ LOGIC
-- ==============================================================================

-- Hàm kiểm tra quyền theo Module và Action
CREATE OR REPLACE FUNCTION has_permission(p_user_id UUID, p_module TEXT, p_action TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    JOIN role_permissions rp ON rp.role_id = p.role_id
    JOIN permissions perm ON perm.id = rp.permission_id
    WHERE p.id = p_user_id
      AND p.is_active = true
      AND perm.module = p_module
      AND perm.action = p_action
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Hàm kiểm tra quyền truy cập chi nhánh (Đã tối ưu cho dữ liệu cấp chuỗi branch_id IS NULL)
CREATE OR REPLACE FUNCTION can_access_branch(p_user_id UUID, p_branch_id BIGINT)
RETURNS BOOLEAN AS $$
  SELECT CASE
    -- Nếu p_branch_id IS NULL (dữ liệu chung toàn chuỗi), mọi nhân viên đang active đều truy cập được
    WHEN p_branch_id IS NULL THEN EXISTS (
      SELECT 1 FROM profiles WHERE id = p_user_id AND is_active = true
    )
    -- Nếu có branch_id cụ thể, kiểm tra quyền ALL_BRANCHES hoặc chi nhánh được gán
    ELSE EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON r.id = p.role_id
      WHERE p.id = p_user_id AND p.is_active = true AND (
        r.scope = 'ALL_BRANCHES'
        OR EXISTS (
          SELECT 1 FROM user_branches ub
          WHERE ub.user_id = p_user_id AND ub.branch_id = p_branch_id
        )
      )
    )
  END;
$$ LANGUAGE sql SECURITY DEFINER STABLE;
