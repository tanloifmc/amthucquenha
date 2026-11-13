-- ==============================================================================
-- 0000_lookups.sql: Nền tảng danh mục động (Dynamic System Lookups)
-- Thay thế hoàn toàn các ENUM cứng để Admin tự quản lý từ giao diện
-- ==============================================================================

CREATE TABLE IF NOT EXISTS system_lookups (
  id          BIGSERIAL PRIMARY KEY,
  group_code  VARCHAR(50)  NOT NULL,  -- Vd: 'EVENT_TYPE', 'LEAD_SOURCE', 'CHANNEL', 'PAYMENT_METHOD'
  value_code  VARCHAR(50)  NOT NULL,  -- Vd: 'BIRTHDAY', 'MKT_TIKTOK', 'FACEBOOK'
  label_vi    TEXT         NOT NULL,  -- Nhãn tiếng Việt hiển thị trên giao diện
  description TEXT,
  sort_order  INT          DEFAULT 0,
  is_active   BOOLEAN      DEFAULT true,
  created_at  TIMESTAMPTZ  DEFAULT now(),
  CONSTRAINT uq_group_value UNIQUE(group_code, value_code)
);

-- Index tối ưu truy vấn theo nhóm danh mục đang kích hoạt
CREATE INDEX IF NOT EXISTS idx_lookups_group ON system_lookups(group_code) WHERE is_active = true;

COMMENT ON TABLE system_lookups IS 'Bảng lưu trữ toàn bộ danh mục động cho hệ thống Quê Nhà (loại tiệc, kênh, nguồn lead, ca phục vụ...)';
