-- ==============================================================================
-- 01_branches.sql: Seed 3 chi nhánh chính thức của Ẩm Thực Quê Nhà
-- Admin có thể tự thêm chi nhánh mới trên giao diện bất cứ lúc nào
-- ==============================================================================

INSERT INTO branches (code, name, address, city, hotline, is_active) VALUES
('QN_PNT', 'Ẩm Thực Quê Nhà - Phạm Ngọc Thạch', '28 Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3', 'TP. Hồ Chí Minh', '0938 226 166', true),
('QN_TT', 'Ẩm Thực Quê Nhà - Thành Thái', '52A Thành Thái, Phường 12, Quận 10', 'TP. Hồ Chí Minh', '0938 226 166', true),
('QN_NTB', 'Ẩm Thực Quê Nhà - Nguyễn Thái Bình', '202 - 204 Nguyễn Thái Bình, Phường 12, Quận Tân Bình', 'TP. Hồ Chí Minh', '0938 226 166', true)
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  hotline = EXCLUDED.hotline,
  is_active = true;
