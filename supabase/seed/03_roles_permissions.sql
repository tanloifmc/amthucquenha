-- ==============================================================================
-- 03_roles_permissions.sql: Seed 5 vai trò lõi, ma trận quyền và phân quyền
-- ==============================================================================

-- 1. VAI TRÒ
INSERT INTO roles (code, name, scope, is_active) VALUES
('BGD', 'Ban Giám Đốc', 'ALL_BRANCHES', true),
('BRANCH_MANAGER', 'Quản lý Chi Nhánh', 'ASSIGNED_BRANCHES', true),
('MKT_STAFF', 'Chuyên viên Marketing', 'ALL_BRANCHES', true),
('SALES_STAFF', 'Nhân viên Sales Tiệc', 'ASSIGNED_BRANCHES', true),
('ACCOUNTANT', 'Kế toán Tài chính', 'ALL_BRANCHES', true)
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  scope = EXCLUDED.scope,
  is_active = true;

-- 2. QUYỀN HẠN CHI TIẾT
INSERT INTO permissions (module, action, description) VALUES
-- Admin
('admin', 'view', 'Xem danh mục cấu hình hệ thống'),
('admin', 'manage', 'Thêm sửa xóa chi nhánh, phòng ban, phân quyền người dùng'),
-- Marketing
('marketing', 'view', 'Xem các chiến dịch và đầu việc marketing'),
('marketing', 'create', 'Tạo chiến dịch và giao việc'),
('marketing', 'edit', 'Chỉnh sửa tiến độ đầu việc marketing'),
-- Content & AI Skills
('content', 'view', 'Xem kho bài viết và lịch xuất bản'),
('content', 'create', 'Soạn thảo bài viết content'),
('content', 'approve', 'Phê duyệt nội dung xuất bản'),
('skills', 'use', 'Sử dụng công cụ AI Marketing Skills'),
-- CRM & Tiệc
('crm', 'view', 'Xem danh sách khách hàng và pipeline tiệc'),
('crm', 'create', 'Tạo mới lead và thông tin đặt tiệc'),
('crm', 'edit', 'Cập nhật tiến trình tư vấn và cọc tiệc'),
-- Floor (Sơ đồ bàn phòng)
('floor', 'view', 'Xem trạng thái bàn phòng theo ca'),
('floor', 'lock', 'Khóa phòng tiệc và xếp bàn'),
-- Tài chính & MISA
('misa', 'view', 'Xem số liệu đối soát doanh thu chi phí'),
('misa', 'import', 'Nhập dữ liệu sao kê từ MISA'),
('misa', 'confirm', 'Phê duyệt chốt số liệu kế toán'),
-- Dashboard
('dashboard', 'view', 'Xem báo cáo tổng hợp kết quả kinh doanh')
ON CONFLICT (module, action) DO UPDATE
SET description = EXCLUDED.description;

-- 3. GẮN QUYỀN CHO BAN GIÁM ĐỐC (Full quyền)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'BGD'
ON CONFLICT DO NOTHING;

-- 4. GẮN QUYỀN CHO QUẢN LÝ CHI NHÁNH
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
  (p.module = 'crm' AND p.action IN ('view', 'create', 'edit')) OR
  (p.module = 'floor' AND p.action IN ('view', 'lock')) OR
  (p.module = 'dashboard' AND p.action = 'view')
)
WHERE r.code = 'BRANCH_MANAGER'
ON CONFLICT DO NOTHING;

-- 5. GẮN QUYỀN CHO NHÂN VIÊN MARKETING
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
  p.module IN ('marketing', 'content', 'skills') OR
  (p.module = 'dashboard' AND p.action = 'view')
)
WHERE r.code = 'MKT_STAFF'
ON CONFLICT DO NOTHING;

-- 6. GẮN QUYỀN CHO NHÂN VIÊN SALES TIỆC
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
  (p.module = 'crm' AND p.action IN ('view', 'create', 'edit')) OR
  (p.module = 'floor' AND p.action = 'view')
)
WHERE r.code = 'SALES_STAFF'
ON CONFLICT DO NOTHING;

-- 7. GẮN QUYỀN CHO KẾ TOÁN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON (
  p.module IN ('misa') OR
  (p.module = 'dashboard' AND p.action = 'view')
)
WHERE r.code = 'ACCOUNTANT'
ON CONFLICT DO NOTHING;
