-- ==============================================================================
-- 0004_misa_finance.sql: Cổng Đối Soát MISA 3 Chốt Chặn & Dữ Liệu Tài Chính
-- Phiên bản v1.1 - Chống nạp trùng MD5, Staging linh hoạt JSONB, Kiểm tra chéo
-- ==============================================================================

-- 1. ĐỢT NHẬP DỮ LIỆU SAO KÊ MISA (Import Batches)
CREATE TABLE IF NOT EXISTS misa_import_batches (
  id                     BIGSERIAL PRIMARY KEY,
  file_name              TEXT NOT NULL,
  file_hash_md5          CHAR(32) UNIQUE NOT NULL,  -- ★ Chốt chặn 1: Chống nạp trùng file
  branch_id              BIGINT REFERENCES branches(id),
  period_month           DATE,                      -- Ngày đầu tháng: 2026-11-01
  total_revenue_preview  NUMERIC(15,0) DEFAULT 0,
  total_mkt_cost_preview NUMERIC(15,0) DEFAULT 0,
  row_count              INT DEFAULT 0,
  batch_status           VARCHAR(20) DEFAULT 'STAGING', -- STAGING | CONFIRMED | REJECTED
  uploaded_by            UUID REFERENCES profiles(id),
  confirmed_by           UUID REFERENCES profiles(id),
  confirmed_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT now()
);

-- 2. DỮ LIỆU TẠM THỜI MISA (Staging Rows - Cổng hứng linh hoạt)
CREATE TABLE IF NOT EXISTS staging_misa_rows (
  id               BIGSERIAL PRIMARY KEY,
  batch_id         BIGINT REFERENCES misa_import_batches(id) ON DELETE CASCADE NOT NULL,
  voucher_date     DATE,
  voucher_no       VARCHAR(50),
  branch_code      VARCHAR(20),
  category         VARCHAR(50),  -- REVENUE_FB | REVENUE_BANQUET | COST_MKT_ADS | COST_MKT_OTHER
  amount           NUMERIC(15,0),
  description      TEXT,
  raw_data         JSONB,        -- ★ Lưu trọn vẹn toàn bộ các cột từ file MISA gốc
  validation_error TEXT,         -- Ghi nhận lỗi nếu thiếu trường hoặc sai định dạng
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- 3. BẢNG GHI TÀI CHÍNH CHÍNH THỨC (Financial Records - Dữ liệu đã chốt)
CREATE TABLE IF NOT EXISTS financial_records (
  id          BIGSERIAL PRIMARY KEY,
  batch_id    BIGINT REFERENCES misa_import_batches(id) ON DELETE SET NULL,
  branch_id   BIGINT REFERENCES branches(id),
  record_date DATE NOT NULL,
  category    VARCHAR(50) NOT NULL,
  amount      NUMERIC(15,0) NOT NULL,
  campaign_id BIGINT REFERENCES campaigns(id),  -- Gắn chi phí marketing về đúng chiến dịch để tính ROI
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index tra cứu số liệu
CREATE INDEX IF NOT EXISTS idx_misa_batches_hash ON misa_import_batches(file_hash_md5);
CREATE INDEX IF NOT EXISTS idx_staging_batch ON staging_misa_rows(batch_id);
CREATE INDEX IF NOT EXISTS idx_financial_date ON financial_records(record_date);
CREATE INDEX IF NOT EXISTS idx_financial_campaign ON financial_records(campaign_id);
