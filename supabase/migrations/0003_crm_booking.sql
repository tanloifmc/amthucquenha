-- ==============================================================================
-- 0003_crm_booking.sql: Phân hệ CRM Khách Hàng, Pipeline Tiệc & Sơ Đồ Bàn Phòng
-- Phiên bản v1.1 - Khóa phòng chống trùng ca (E2), Cọc nhiều đợt (E1)
-- ==============================================================================

-- 1. HỒ SƠ KHÁCH HÀNG (Customers)
CREATE TABLE IF NOT EXISTS customers (
  id              BIGSERIAL PRIMARY KEY,
  customer_code   VARCHAR(30) UNIQUE,           -- Mã định danh khách hàng dạng KH-[SĐT] (vd: KH-0903889912)
  phone           VARCHAR(15) UNIQUE NOT NULL,  -- Khóa định danh chính
  full_name       TEXT NOT NULL,
  company_name    TEXT,
  email           TEXT,
  total_bookings  INT DEFAULT 0,
  total_spent     NUMERIC(15,0) DEFAULT 0,
  tags            TEXT[] DEFAULT '{}',          -- VIP, THUONG_XUYEN, DOANH_NGHIEP...
  notes           TEXT,                         -- Sở thích ẩm thực, bàn quen, dị ứng...
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Trigger tự động sinh customer_code = 'KH-' || REPLACE(phone, ' ', '')
CREATE OR REPLACE FUNCTION generate_customer_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_code IS NULL OR NEW.customer_code = '' THEN
    NEW.customer_code := 'KH-' || regexp_replace(NEW.phone, '\s+', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_customer_code ON customers;
CREATE TRIGGER trg_customer_code
  BEFORE INSERT OR UPDATE OF phone ON customers
  FOR EACH ROW EXECUTE FUNCTION generate_customer_code();

-- 2. DANH MỤC BÀN & PHÒNG VIP (Tables & Rooms)
CREATE TABLE IF NOT EXISTS tables_rooms (
  id                 BIGSERIAL PRIMARY KEY,
  branch_id          BIGINT REFERENCES branches(id) NOT NULL,
  name               TEXT NOT NULL,                 -- VIP 01, VIP Sen Trắng, Sảnh Trúc, Bàn 08...
  room_type          VARCHAR(20) NOT NULL,          -- Ref system_lookups group=ROOM_TYPE
  capacity_min       INT DEFAULT 2,
  capacity_max       INT DEFAULT 10,
  shape              VARCHAR(20) DEFAULT 'RECT',    -- Ref system_lookups group=TABLE_SHAPE
  is_combinable      BOOLEAN DEFAULT false,         -- Có thể ghép thông phòng không
  combined_with_ids  BIGINT[] DEFAULT '{}',         -- Danh sách id phòng có thể thông vách
  pos_x              INT DEFAULT 0,                 -- Tọa độ X trên sơ đồ 2D
  pos_y              INT DEFAULT 0,                 -- Tọa độ Y trên sơ đồ 2D
  width              INT DEFAULT 100,               -- Chiều rộng hiển thị
  height             INT DEFAULT 80,                -- Chiều cao hiển thị
  is_active          BOOLEAN DEFAULT true,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- 3. HỢP ĐỒNG ĐẶT TIỆC & TIẾP NHẬN LEAD (Bookings & Leads)
CREATE TABLE IF NOT EXISTS bookings_leads (
  id                BIGSERIAL PRIMARY KEY,
  customer_id       BIGINT REFERENCES customers(id) NOT NULL,
  branch_id         BIGINT REFERENCES branches(id) NOT NULL,
  event_type        VARCHAR(50) NOT NULL,          -- Ref system_lookups group=EVENT_TYPE
  lead_source       VARCHAR(50) NOT NULL,          -- Ref system_lookups group=LEAD_SOURCE
  booking_date      DATE NOT NULL,
  time_slot         VARCHAR(20) NOT NULL,          -- Ref system_lookups group=TIME_SLOT
  guest_count       INT NOT NULL,
  estimated_budget  NUMERIC(15,0) DEFAULT 0,
  actual_revenue    NUMERIC(15,0) DEFAULT 0,
  total_deposited   NUMERIC(15,0) DEFAULT 0,       -- Tổng tiền cọc (tự động cập nhật qua trigger)
  pipeline_stage    VARCHAR(30) DEFAULT 'NEW',     -- Ref system_lookups group=PIPELINE_STAGE
  special_notes     TEXT,                          -- Yêu cầu thực đơn, âm thanh, trang trí tiệc
  assigned_to       UUID REFERENCES profiles(id),  -- Nhân viên sales tiệc phụ trách
  campaign_id       BIGINT REFERENCES campaigns(id), -- Chiến dịch marketing dẫn về (nếu có)
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- 4. ĐẶT CỌC NHIỀU ĐỢT (Booking Deposits - Quyết định kiến trúc E1)
CREATE TABLE IF NOT EXISTS booking_deposits (
  id                 BIGSERIAL PRIMARY KEY,
  booking_id         BIGINT REFERENCES bookings_leads(id) ON DELETE CASCADE NOT NULL,
  amount             NUMERIC(15,0) NOT NULL,
  deposit_date       DATE NOT NULL,
  payment_method     VARCHAR(30) NOT NULL,          -- Ref system_lookups group=PAYMENT_METHOD
  receipt_image_url  TEXT,                          -- Ảnh ủy nhiệm chi / biên nhận cọc
  note               TEXT,
  created_by         UUID REFERENCES profiles(id),
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- Trigger tự động cộng dồn total_deposited vào bookings_leads
CREATE OR REPLACE FUNCTION update_booking_total_deposited()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bookings_leads
  SET total_deposited = (
    SELECT COALESCE(SUM(amount), 0)
    FROM booking_deposits
    WHERE booking_id = COALESCE(NEW.booking_id, OLD.booking_id)
  )
  WHERE id = COALESCE(NEW.booking_id, OLD.booking_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_deposit ON booking_deposits;
CREATE TRIGGER trg_update_deposit
AFTER INSERT OR UPDATE OR DELETE ON booking_deposits
FOR EACH ROW EXECUTE FUNCTION update_booking_total_deposited();

-- 5. KHÓA PHÒNG & GHÉP BÀN THEO CA TIỆC (Booking Room Locks - Quyết định kiến trúc E2)
CREATE TABLE IF NOT EXISTS booking_room_locks (
  id              BIGSERIAL PRIMARY KEY,
  booking_id      BIGINT REFERENCES bookings_leads(id) ON DELETE CASCADE NOT NULL,
  table_room_id   BIGINT REFERENCES tables_rooms(id) NOT NULL,
  booking_date    DATE NOT NULL,
  time_slot       VARCHAR(20) NOT NULL,            -- Ref system_lookups group=TIME_SLOT
  lock_status     VARCHAR(20) DEFAULT 'HOLD',      -- Ref system_lookups group=LOCK_STATUS
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ★ RÀNG BUỘC SỐNG CÒN: Chống trùng phòng toàn diện (Xử lý chéo giữa FULL_DAY và LUNCH/DINNER)
CREATE OR REPLACE FUNCTION check_room_lock_collision()
RETURNS TRIGGER AS $$
DECLARE
  v_collision_count INT;
BEGIN
  -- Chỉ kiểm tra với các trạng thái chiếm giữ phòng
  IF NEW.lock_status IN ('HOLD', 'CONFIRMED', 'SEATED') THEN
    IF NEW.time_slot = 'FULL_DAY' THEN
      -- Nếu đặt FULL_DAY: Chặn nếu đã có bất kỳ ca LUNCH, DINNER hoặc FULL_DAY nào khác
      SELECT COUNT(*) INTO v_collision_count
      FROM booking_room_locks
      WHERE table_room_id = NEW.table_room_id
        AND booking_date = NEW.booking_date
        AND id != COALESCE(NEW.id, -1)
        AND lock_status IN ('HOLD', 'CONFIRMED', 'SEATED')
        AND time_slot IN ('LUNCH', 'DINNER', 'FULL_DAY');
    ELSE
      -- Nếu đặt LUNCH hoặc DINNER: Chặn nếu đã có ca trùng HOẶC đã có tiệc FULL_DAY
      SELECT COUNT(*) INTO v_collision_count
      FROM booking_room_locks
      WHERE table_room_id = NEW.table_room_id
        AND booking_date = NEW.booking_date
        AND id != COALESCE(NEW.id, -1)
        AND lock_status IN ('HOLD', 'CONFIRMED', 'SEATED')
        AND (time_slot = NEW.time_slot OR time_slot = 'FULL_DAY');
    END IF;

    IF v_collision_count > 0 THEN
      RAISE EXCEPTION 'Xung đột phòng/bàn [ID: %]: Bàn/phòng này đã được khóa hoặc đã có tiệc bao trọn ngày (FULL_DAY) trong ngày % ca %!',
        NEW.table_room_id, NEW.booking_date, NEW.time_slot;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_room_lock_collision ON booking_room_locks;
CREATE TRIGGER trg_check_room_lock_collision
BEFORE INSERT OR UPDATE ON booking_room_locks
FOR EACH ROW EXECUTE FUNCTION check_room_lock_collision();


-- 6. NHẬT KÝ TƯƠNG TÁC KHÁCH HÀNG (Customer Interactions - 360 độ)
CREATE TABLE IF NOT EXISTS customer_interactions (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) NOT NULL,
  booking_id  BIGINT REFERENCES bookings_leads(id) ON DELETE SET NULL,
  user_id     UUID REFERENCES profiles(id),
  channel     VARCHAR(20),  -- CALL, ZALO, DIRECT, EMAIL
  note        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index tối ưu tìm kiếm
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings_leads(booking_date, time_slot);
CREATE INDEX IF NOT EXISTS idx_bookings_stage ON bookings_leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_locks_room ON booking_room_locks(table_room_id, booking_date);

-- ★ TRIGGER CHỐNG PHÒNG MA: Tự động giải phóng khóa phòng khi tiệc bị Hủy (CANCELLED)
CREATE OR REPLACE FUNCTION release_room_on_booking_cancelled()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.pipeline_stage = 'CANCELLED' AND OLD.pipeline_stage != 'CANCELLED') THEN
    UPDATE booking_room_locks
    SET lock_status = 'CANCELLED'
    WHERE booking_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_cancelled ON bookings_leads;
CREATE TRIGGER trg_booking_cancelled
AFTER UPDATE ON bookings_leads
FOR EACH ROW EXECUTE FUNCTION release_room_on_booking_cancelled();

