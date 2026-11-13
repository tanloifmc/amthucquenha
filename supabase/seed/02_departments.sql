-- ==============================================================================
-- 02_departments.sql: Seed 6 phòng ban chức năng chính của Quê Nhà
-- Admin / Ban Giám Đốc có thể tạo thêm phòng ban mới từ giao diện
-- ==============================================================================

INSERT INTO departments (code, name, description, is_active) VALUES
('MARKETING', 'Phòng Marketing & Truyền thông', 'Chịu trách nhiệm chiến dịch, bài viết, AI content và lead tổng thể', true),
('SALES_BANQUET', 'Bộ phận Kinh doanh & Đặt tiệc', 'Tư vấn tiệc, gửi thực đơn, chốt cọc và chăm sóc khách hàng đặt tiệc', true),
('MANAGEMENT', 'Quản lý Vận hành Chi nhánh', 'Giám sát hoạt động phục vụ, sơ đồ bàn phòng và nhân sự tại chi nhánh', true),
('RECEPTIONIST', 'Tổ Lễ tân & Đón tiếp', 'Đón khách, check-in phòng tiệc, sắp xếp bàn sảnh và tiếp nhận yêu cầu trực tiếp', true),
('KITCHEN', 'Bộ phận Bếp & Ẩm thực', 'Chuẩn bị thực đơn tiệc, điều phối ra món đúng giờ cho các đoàn tiệc', true),
('ACCOUNTING', 'Phòng Kế toán & Tài chính', 'Đối soát doanh thu, nhập số liệu MISA và kiểm soát cọc tiệc', true)
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = true;
