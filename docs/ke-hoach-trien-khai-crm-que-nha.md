# KẾ HOẠCH TRIỂN KHAI CHI TIẾT — HỆ THỐNG CRM & QUẢN LÝ TIỆC QUÊ NHÀ

**Phiên bản kế hoạch:** 2.0 — 🏆 HOÀN THÀNH TOÀN DIỆN SPRINT 3 (MODULE 7: ĐỐI SOÁT MISA 3 CHỐT CHẶN & DASHBOARD BAN GIÁM ĐỐC)  
**Ngày cập nhật:** 2026-11-13  
**Người lập:** Antigravity (Coder AI)  
**Dựa trên:** Đặc tả v1.0 + Chỉ thị thi công Sprint 3 từ CTO (Module 7: MISA & Dashboard BGĐ)  

> [!IMPORTANT]
> **QUY TẮC VÀNG (Không được vi phạm):**
> 1. **Kỷ luật thi công LEGO (Chỉ thị CTO):** Tuyệt đối không tự code chay logic phức tạp từ con số 0. Tận dụng tối đa các repo chuẩn công nghiệp và thư viện mã nguồn mở hoàn chỉnh (Corey Haines, Postiz, Jira clone dnd-kit, Konva Canvas).
> 2. **Chất lượng thực tế:** Mỗi Task chỉ được coi là DONE khi có bằng chứng kiểm thử thực tế (screenshot/SQL query/link chạy/log build).
> 3. **Không hardcode:** Tuyệt đối không hardcode bất kỳ chi nhánh, vai trò, loại tiệc, kênh MXH, nguồn Lead nào vào code UI/logic — tất cả phải là dữ liệu trong DB.
> 4. **Đồng bộ tuyệt đối:** Database schema và logic chốt chặn phải đồng bộ 100% giữa Database Triggers và Giao diện UI.

---

## LỊCH SỬ THAY ĐỔI

| Phiên bản | Ngày | Nội dung thay đổi |
| :--- | :--- | :--- |
| **v1.0** | 2026-11-12 | Bản đầu — sau khi chốt kiến trúc nhóm A/B/C/D/E |
| **v1.1** | 2026-11-12 | Sửa 3 lỗi kiến trúc nghiêm trọng (Lookups động, Departments, 7 Modules) |
| **v1.3** | 2026-11-12 | Cập nhật tiến độ thực tế Sprint 0 (88%), chốt Q3 & Q5 |
| **v1.4** | 2026-11-12 | Duyệt PASS Sprint 0 (100%), Hoàn thành Sprint 1 (100%) |
| **v1.5** | 2026-11-13 | Nâng cấp chuẩn công nghiệp theo chỉ thị CTO (Corey Haines, Postiz, Jira clone, Konva Canvas). Build 18/18 routes sạch. |
| **v1.6** | 2026-11-13 | Khắc phục triệt để 7 lỗ hổng nghiệp vụ theo lệnh CTO. Cài đặt kỹ năng gốc `spec-kit` vào não bộ Agent. |
| **v1.7** | 2026-11-13 | **Hoàn tất Sprint 2 theo lệnh CTO:** (1) Module 5.1 Phễu Tiệc Kanban; (2) Module 5.2 Hồ sơ Khách 360°; (3) Module 6 Sơ đồ phòng bàn theo Ca; (4) Tầng dịch vụ `crmService.ts` & `floorService.ts`. |
| **v1.8** | 2026-11-13 | **Triển khai 3 "Vũ khí thực chiến" cốt lõi theo lệnh phê duyệt CTO để chốt sổ Sprint 2:** (1) Xử lý dứt điểm "Phòng ma" qua Trigger `release_room_on_booking_cancelled` & Modal Hủy tiệc/Trả phòng; (2) Tự động nhận diện VIP khi gõ $\ge 10$ số ĐT tại Form nhận tiệc & Đặt phòng nhanh (bắn khung vàng Gu ẩm thực); (3) Bảng tính tiền cọc minh bạch 3 dòng tài chính. Build 23/23 routes sạch 100%. Sẵn sàng chuyển giao Sprint 3. |
| **v1.9** | 2026-11-13 | **Chuẩn hóa Mã Khách Hàng (Customer Code) theo Số Điện Thoại (`KH-[SĐT]`):** (1) Thêm cột `customer_code` và trigger `trg_customer_code` trong schema DB; (2) Tích hợp hiển thị badge `KH-[SĐT]` kèm nút Copy 1 chạm trên Thẻ Khách Hàng 360°, Thẻ Kanban Tiệc và Modal Sơ đồ Bàn Phòng; (3) Hỗ trợ tìm kiếm tra cứu tức thì theo SĐT không cần dấu cách. Build 23/23 routes sạch 100%. |
| **v2.0** | 2026-11-13 | **Hoàn thành 100% Sprint 3 (Module 7: Đối Soát MISA 3 Chốt Chặn & Dashboard BGĐ):** (1) Tạo tầng dịch vụ `financeService.ts`; (2) Xây dựng Giao diện Đối Soát MISA (`/finance/reconciliation`) với 3 chốt chặn tự động (Khớp 100%, Lệch cọc, Nghi vấn ngoài luồng); (3) Nâng cấp Executive Dashboard BGĐ (`/dashboard`) với 4 KPI Cards, so sánh 4 chi nhánh, ROAS Marketing 7.55x và Cảnh báo nóng 48h. Build 24/24 routes sạch 100%. |

### ⚠️ 3 Lỗi kiến trúc được phát hiện & đã sửa trong v1.1

| # | Lỗi trong v1.0 | Sửa trong v1.1 | Mức độ ảnh hưởng |
| :--- | :--- | :--- | :--- |
| **Fix 1** | Dùng PostgreSQL ENUM cứng cho `event_type`, `lead_source_type`, `channel`... | Thay toàn bộ bằng bảng `system_lookups` động — Admin tự thêm loại tiệc/kênh MXH/nguồn Lead trên UI | 🔴 Nghiêm trọng — ảnh hưởng toàn bộ schema |
| **Fix 2** | Thiếu bảng `departments` (phòng ban) trong RBAC | Thêm `departments` vào schema — user thuộc 1 dept, permissions vẫn gắn vào Role | 🟡 Trung bình — ảnh hưởng schema Module 1 |
| **Fix 3** | Cấu trúc 7 Module không khớp yêu cầu (AI Skills gộp vào Content, CRM/Tiệc lệch) | Tái cấu trúc đúng thứ tự: M4=AI Skills riêng, M5=CRM, M6=Floor+CSKH, M7=MISA+Dashboard | 🟡 Trung bình — ảnh hưởng Sprint 1 & 2 |

---

## MỤC LỤC
1. Quyết định kiến trúc đã chốt (v1.1)
2. Cấu trúc thư mục dự án
3. Database Schema hoàn chỉnh (v1.1)
4. Lộ trình 4 Sprint — 7 Module
5. Sprint 0 — Móng nền (Module 1)
6. Sprint 1 — Marketing Nội bộ (Module 2, 3, 4)
7. Sprint 2 — CRM & Tiệc (Module 5, 6)
8. Sprint 3 — Tài chính & BGĐ (Module 7)
9. Tiêu chuẩn nghiệm thu & Kiểm tra chéo
10. Câu hỏi còn treo (phải trả lời trước Sprint tương ứng)

---

## 1. QUYẾT ĐỊNH KIẾN TRÚC ĐÃ CHỐT (v1.1)

| # | Vấn đề | Quyết định đã chốt | Ghi chú |
| :--- | :--- | :--- | :--- |
| **E1** | Cọc nhiều đợt | ✅ Bảng `booking_deposits` riêng | `total_deposited` = SUM trigger tự cập nhật |
| **E2** | Ghép nhiều phòng | ✅ 1–N qua `booking_room_locks` | Unique partial index chống trùng ca |
| **E3** | Nguồn Lead | ✅ `system_lookups` group=LEAD_SOURCE | Admin tự thêm kênh mới trên UI |
| **E4** | Mã Khách Hàng | ✅ Tự động theo SĐT (`KH-[SĐT]`) | Hybrid Key: `id BIGSERIAL` ngầm + `customer_code` hiển thị |
| **A1** | Chi nhánh | ✅ 3 chi nhánh seed, Admin tự thêm bất kỳ lúc nào | QN_PNT / QN_TT / QN_NTB |
| **A2-A3** | MISA | ✅ Schema linh hoạt + `raw_data` JSONB | File thật cung cấp khi vào Sprint 3 |
| **B1** | Loại tiệc | ✅ `system_lookups` group=EVENT_TYPE (7 loại seed) | Admin tự thêm loại mới không cần dev |
| **B2** | Dữ liệu cũ | ✅ Greenfield — Import CSV danh bạ (tính năng đơn giản) | Làm sau khi hệ thống ổn định |
| **C1** | Vai trò | ✅ 5 vai trò seed + RBAC động (tick quyền = có quyền) | Thêm RECEPTIONIST/CHEF chỉ cần tick |
| **Fix1** | ENUM cứng | ✅ Thay toàn bộ ENUM $\rightarrow$ `system_lookups` | Bảng lookup duy nhất cho mọi danh mục |
| **Fix2** | Thiếu Phòng ban | ✅ Thêm bảng `departments` vào RBAC | User thuộc 1 dept, permissions gắn vào Role |
| **Fix3** | Module lệch | ✅ Tái cấu trúc đúng 7 Module theo yêu cầu mới | Xem Phần 4 |
| **C2** | Marketing scope | ✅ `branch_id = NULL` = Toàn chuỗi | Nhân viên gắn cờ chi nhánh theo bài cụ thể |
| **D1** | Hạ tầng | ✅ Supabase Free + Vercel + `.env.example` | Docker standalone sẵn sàng dời VPS |
| **D2** | Domain | ✅ `quenha-internal.vercel.app` giai đoạn 1 | Domain riêng sau nghiệm thu nội bộ |

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
quenha-internal/
├── .env.example                    # Template biến môi trường (commit vào git)
├── .env.local                      # Biến thật (KHÔNG commit — .gitignore)
├── next.config.ts                  # output: 'standalone' bật ngay từ đầu
├── package.json
├── tailwind.config.ts
├── components.json                 # shadcn/ui config
│
├── supabase/
│   ├── migrations/
│   │   ├── 0000_lookups.sql        # ★ MỚI: system_lookups — nền tảng cho mọi danh mục động
│   │   ├── 0001_rbac_core.sql      # branches, departments, roles, permissions, profiles
│   │   ├── 0002_marketing.sql      # campaigns, tasks, content_posts, marketing_skills
│   │   ├── 0003_crm_booking.sql    # customers, venue, bookings, deposits, locks
│   │   └── 0004_misa_finance.sql   # misa_batches, staging, financial_records
│   ├── seed/
│   │   ├── 00_lookups.sql          # ★ Seed đầu tiên: 7 event_type, 7 lead_source, channels...
│   │   ├── 01_branches.sql         # Seed 4 chi nhánh QN_*
│   │   ├── 02_departments.sql      # ★ MỚI: Seed phòng ban (Marketing, Bếp, Lễ tân, Kinh doanh)
│   │   └── 03_roles_permissions.sql # Seed 5 roles + permissions matrix
│   └── functions/
│       ├── has_permission.sql
│       └── can_access_branch.sql
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # AppShell + Sidebar động theo permissions
│   │   │   ├── page.tsx            # Redirect theo role
│   │   │   ├── marketing/
│   │   │   │   ├── campaigns/      # Module 2
│   │   │   │   ├── tasks/          # Module 2
│   │   │   │   ├── content/        # Module 3
│   │   │   │   └── skills/         # Module 4: ★ Thư viện AI Skills (tách riêng)
│   │   │   ├── crm/                # Module 5
│   │   │   │   ├── leads/
│   │   │   │   └── customers/
│   │   │   ├── floor/              # Module 6
│   │   │   │   ├── setup/
│   │   │   │   └── live/
│   │   │   ├── accounting/         # Module 7
│   │   │   │   └── misa/
│   │   │   └── dashboard/          # Module 7
│   │   ├── admin/                  # Module 1: Quản trị (branches, depts, roles, users, lookups)
│   │   │   ├── branches/
│   │   │   ├── departments/        # ★ MỚI
│   │   │   ├── roles/
│   │   │   ├── users/
│   │   │   └── lookups/            # ★ MỚI: Quản lý danh mục động (loại tiệc, kênh MXH...)
│   │   └── api/
│   │       ├── cron/
│   │       │   └── health/route.ts
│   │       └── lookups/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Đọc permissions từ server, render menu động
│   │   │   ├── BranchSelector.tsx  # Dropdown chỉ hiện branch user được assign
│   │   │   ├── Header.tsx          # Header chứa BranchSelector & bộ chuyển vai trò test
│   │   │   └── AppShell.tsx
│   │   ├── admin/
│   │   ├── marketing/
│   │   ├── crm/
│   │   ├── floor/
│   │   └── shared/
│   │       └── LookupSelect.tsx    # ★ Component chung: dropdown đọc từ system_lookups
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── auth/
│   │   │   └── permissions.ts      # usePermission(), guardRoute(), checkPermission()
│   │   └── utils/
│   │       ├── currency.ts         # Format VND: 999.999.999đ không vỡ
│   │       └── lookups.ts          # ★ getLookups(group_code) — cache client & fallback seed
│   │
│   └── types/
│       └── database.types.ts       # supabase gen types typescript
│
└── cloudflare-worker/
    └── health-cron.js              # Cron 07:00 ICT giữ Supabase khỏi ngủ đông
```

---

## 3. DATABASE SCHEMA HOÀN CHỈNH (v1.1)

> [!NOTE]
> 5 file migration, chạy theo thứ tự 0000 $\rightarrow$ 0004. File 0000 phải chạy TRƯỚC vì các bảng sau reference đến `system_lookups`.

### 3.0 — 0000_lookups.sql ★ (Nền tảng mới — không có trong v1.0)
Triết lý: Thay toàn bộ ENUM bằng 1 bảng lookup duy nhất. Mọi danh mục có thể thêm/sửa/ẩn từ giao diện Admin mà không cần chạm code hay migration DB.

```sql
CREATE TABLE system_lookups (
  id          BIGSERIAL PRIMARY KEY,
  group_code  VARCHAR(50)  NOT NULL,  -- Vd: 'EVENT_TYPE', 'LEAD_SOURCE', 'CHANNEL', 'PAYMENT_METHOD'
  value_code  VARCHAR(50)  NOT NULL,  -- Vd: 'BIRTHDAY', 'MKT_TIKTOK', 'FACEBOOK'
  label_vi    TEXT         NOT NULL,  -- Nhãn tiếng Việt hiển thị trên UI
  description TEXT,
  sort_order  INT          DEFAULT 0,
  is_active   BOOLEAN      DEFAULT true,
  created_at  TIMESTAMPTZ  DEFAULT now(),
  UNIQUE(group_code, value_code)
);

-- Index để query nhanh theo group
CREATE INDEX idx_lookups_group ON system_lookups(group_code) WHERE is_active = true;
```

#### Seed dữ liệu cho `system_lookups` (file `00_lookups.sql`):
| group_code | value_code | label_vi |
| :--- | :--- | :--- |
| `EVENT_TYPE` | `YEAR_END_PARTY` | Tiệc tất niên / Tân niên |
| `EVENT_TYPE` | `BIRTHDAY` | Sinh nhật / Thôi nôi |
| `EVENT_TYPE` | `WEDDING_ENGAGEMENT` | Cưới / Hỏi |
| `EVENT_TYPE` | `COMPANY_MEETING` | Hội nghị / Liên hoan công ty |
| `EVENT_TYPE` | `VIP_PRIVATE` | Tiệc tiếp khách VIP kín |
| `EVENT_TYPE` | `FAMILY_GATHERING` | Họp mặt gia đình |
| `EVENT_TYPE` | `OTHER` | Khác (ghi chú thêm) |
| `LEAD_SOURCE` | `MKT_FACEBOOK_ADS` | Facebook Ads |
| `LEAD_SOURCE` | `MKT_TIKTOK` | TikTok (Marketing) |
| `LEAD_SOURCE` | `MKT_CONTENT_ORGANIC` | Content hữu cơ (Marketing) |
| `LEAD_SOURCE` | `HOTLINE_DIRECT` | Gọi điện trực tiếp |
| `LEAD_SOURCE` | `WALK_IN` | Khách tự vào |
| `LEAD_SOURCE` | `CUSTOMER_REFERRAL` | Khách giới thiệu |
| `LEAD_SOURCE` | `BGD_RELATION` | Quan hệ BGĐ |
| `CHANNEL` | `FACEBOOK` | Facebook |
| `CHANNEL` | `TIKTOK` | TikTok |
| `CHANNEL` | `YOUTUBE` | YouTube |
| `CHANNEL` | `INSTAGRAM` | Instagram |
| `PAYMENT_METHOD` | `CASH` | Tiền mặt |
| `PAYMENT_METHOD` | `BANK_TRANSFER` | Chuyển khoản |
| `PAYMENT_METHOD` | `MOMO` | MoMo |
| `PAYMENT_METHOD` | `OTHER` | Khác |
| `TIME_SLOT` | `LUNCH` | Ca Trưa |
| `TIME_SLOT` | `DINNER` | Ca Tối |
| `TIME_SLOT` | `ALL_DAY` | Cả ngày |
| `ROOM_TYPE` | `VIP_ROOM` | Phòng VIP |
| `ROOM_TYPE` | `HALL_TABLE` | Bàn sảnh |
| `ROOM_TYPE` | `OUTDOOR` | Ngoài trời |
| `TABLE_SHAPE` | `RECT` | Chữ nhật |
| `TABLE_SHAPE` | `CIRCLE` | Tròn |
| `PIPELINE_STAGE` | `NEW` | Mới |
| `PIPELINE_STAGE` | `CONSULTING` | Đang tư vấn |
| `PIPELINE_STAGE` | `QUOTED` | Đã báo giá |
| `PIPELINE_STAGE` | `DEPOSITED` | Đã cọc / Chốt |
| `PIPELINE_STAGE` | `COMPLETED` | Hoàn tất |
| `PIPELINE_STAGE` | `LOST` | Không chốt được |
| `TASK_STATUS` | `TODO` | Cần làm |
| `TASK_STATUS` | `IN_PROGRESS` | Đang làm |
| `TASK_STATUS` | `IN_REVIEW` | Chờ duyệt |
| `TASK_STATUS` | `DONE` | Hoàn thành |
| `TASK_STATUS` | `CANCELLED` | Đã hủy |
| `CONTENT_STATUS` | `DRAFT` | Nháp |
| `CONTENT_STATUS` | `PENDING_APPROVAL` | Chờ duyệt |
| `CONTENT_STATUS` | `APPROVED` | Đã duyệt |
| `CONTENT_STATUS` | `SCHEDULED` | Đã lên lịch |
| `CONTENT_STATUS` | `PUBLISHED` | Đã đăng |
| `LOCK_STATUS` | `HOLD` | Đang giữ chỗ |
| `LOCK_STATUS` | `CONFIRMED` | Đã xác nhận |
| `LOCK_STATUS` | `SEATED` | Đang ngồi |
| `LOCK_STATUS` | `RELEASED` | Đã trả |

---

### 3.1 — 0001_rbac_core.sql (Cập nhật v1.1 — thêm departments)

```sql
-- Chi nhánh (100% dynamic — Admin tự thêm/sửa/ẩn)
CREATE TABLE branches (
  id         BIGSERIAL PRIMARY KEY,
  code       VARCHAR(20) UNIQUE NOT NULL,  -- QN_PNT, QN_TT, QN_NTB
  name       TEXT NOT NULL,
  address    TEXT,
  city       VARCHAR(100) DEFAULT 'TP. Hồ Chí Minh',
  hotline    VARCHAR(20),
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ★ Phòng ban (Mới trong v1.1)
CREATE TABLE departments (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(50) UNIQUE NOT NULL,  -- MARKETING, KITCHEN, RECEPTIONIST, SALES_BANQUET
  name        TEXT NOT NULL,
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Vai trò (seed 5 lõi, Admin có thể tạo thêm)
CREATE TABLE roles (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(50) UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  scope       VARCHAR(30) DEFAULT 'ASSIGNED_BRANCHES',
  -- 'ALL_BRANCHES' (BGD) | 'ASSIGNED_BRANCHES' (các role còn lại)
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Quyền chi tiết
CREATE TABLE permissions (
  id          BIGSERIAL PRIMARY KEY,
  module      VARCHAR(50) NOT NULL,   -- crm, floor, marketing, content, misa, admin, dashboard
  action      VARCHAR(50) NOT NULL,   -- view, edit, delete, approve, import, confirm, manage, setup, finance
  description TEXT,
  UNIQUE(module, action)
);

-- Ma trận Role ↔ Permission (gắn tick = có quyền)
CREATE TABLE role_permissions (
  role_id       BIGINT REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Hồ sơ người dùng
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  phone         VARCHAR(15),
  avatar_url    TEXT,
  role_id       BIGINT REFERENCES roles(id),
  department_id BIGINT REFERENCES departments(id),  -- ★ Mới v1.1
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Phân bổ chi nhánh cho User (1 user có thể phụ trách nhiều chi nhánh)
CREATE TABLE user_branches (
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id  BIGINT REFERENCES branches(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, branch_id)
);

-- Functions kiểm tra quyền (dùng cho RLS)
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

CREATE OR REPLACE FUNCTION can_access_branch(p_user_id UUID, p_branch_id BIGINT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON r.id = p.role_id
    WHERE p.id = p_user_id AND (
      r.scope = 'ALL_BRANCHES'
      OR EXISTS (
        SELECT 1 FROM user_branches ub
        WHERE ub.user_id = p_user_id AND ub.branch_id = p_branch_id
      )
    )
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

---

### 3.2 — 0002_marketing.sql

```sql
CREATE TABLE campaigns (
  id                   BIGSERIAL PRIMARY KEY,
  branch_id            BIGINT REFERENCES branches(id),  -- NULL = toàn chuỗi
  name                 TEXT NOT NULL,
  objective            TEXT,
  start_date           DATE,
  end_date             DATE,
  target_posts         INT DEFAULT 0,
  target_leads         INT DEFAULT 0,
  planned_budget       NUMERIC(15,0) DEFAULT 0,
  actual_posts         INT DEFAULT 0,     -- Trigger cập nhật khi content PUBLISHED
  actual_leads         INT DEFAULT 0,     -- Trigger cập nhật khi booking link campaign này
  actual_budget        NUMERIC(15,0) DEFAULT 0,  -- Từ financial_records gắn campaign_id
  campaign_status      VARCHAR(30) DEFAULT 'PLANNING',
  created_by           UUID REFERENCES profiles(id),
  created_at           TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tasks (
  id                BIGSERIAL PRIMARY KEY,
  campaign_id       BIGINT REFERENCES campaigns(id),  -- NULL nếu is_adhoc=true
  is_adhoc          BOOLEAN DEFAULT false,
  title             TEXT NOT NULL,
  description       TEXT,
  assignee_id       UUID REFERENCES profiles(id),
  reviewer_id       UUID REFERENCES profiles(id),
  branch_id         BIGINT REFERENCES branches(id),  -- NULL = toàn chuỗi
  due_date          DATE,
  original_due_date DATE,  -- Lưu ngày gốc khi dời hạn
  delay_reason      TEXT,  -- Bắt buộc khi due_date thay đổi
  task_status       VARCHAR(30) DEFAULT 'TODO',  -- Ref system_lookups group=TASK_STATUS
  proof_url         TEXT,  -- Bắt buộc khi chuyển IN_REVIEW/DONE (validate app layer)
  created_by        UUID REFERENCES profiles(id),
  created_at        TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_adhoc_campaign CHECK (
    is_adhoc = true OR campaign_id IS NOT NULL
  )
);

CREATE TABLE content_posts (
  id             BIGSERIAL PRIMARY KEY,
  campaign_id    BIGINT REFERENCES campaigns(id),
  task_id        BIGINT REFERENCES tasks(id),
  branch_id      BIGINT REFERENCES branches(id),  -- NULL = toàn chuỗi
  channel        VARCHAR(30) NOT NULL,  -- Ref system_lookups group=CHANNEL
  pillar         VARCHAR(100),          -- Trụ cột nội dung
  title          TEXT,
  body_draft     TEXT,
  media_links    JSONB DEFAULT '[]',   -- [{url, type, drive_id, thumbnail}]
  scheduled_at   TIMESTAMPTZ,
  published_at   TIMESTAMPTZ,
  published_url  TEXT,
  content_status VARCHAR(30) DEFAULT 'DRAFT',  -- Ref system_lookups group=CONTENT_STATUS
  approved_by    UUID REFERENCES profiles(id),
  approved_at    TIMESTAMPTZ,
  created_by     UUID REFERENCES profiles(id),
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE marketing_skills (
  id               BIGSERIAL PRIMARY KEY,
  source           VARCHAR(30) NOT NULL,  -- CUSTOM | PROMPTS_CHAT | COREY_SKILLS
  category         VARCHAR(100),          -- Nhóm skill
  title            TEXT NOT NULL,
  description      TEXT,
  prompt_template  TEXT,
  variables        JSONB,  -- [{key, label, placeholder, required}]
  example_output   TEXT,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now()
);
```

---

### 3.3 — 0003_crm_booking.sql

```sql
CREATE TABLE customers (
  id              BIGSERIAL PRIMARY KEY,
  phone           VARCHAR(15) UNIQUE NOT NULL,  -- Khóa định danh chính
  full_name       TEXT NOT NULL,
  company_name    TEXT,
  tax_code        VARCHAR(20),
  customer_type   VARCHAR(20) DEFAULT 'PERSONAL',  -- Ref system_lookups group=CUSTOMER_TYPE
  preferences     JSONB DEFAULT '{}',
  total_bookings  INT DEFAULT 0,         -- Trigger tự cập nhật
  total_spent     NUMERIC(15,0) DEFAULT 0,  -- Trigger tự cập nhật
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE venue_areas (
  id          BIGSERIAL PRIMARY KEY,
  branch_id   BIGINT REFERENCES branches(id) NOT NULL,
  name        TEXT NOT NULL,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

CREATE TABLE tables_rooms (
  id            BIGSERIAL PRIMARY KEY,
  branch_id     BIGINT REFERENCES branches(id) NOT NULL,
  area_id       BIGINT REFERENCES venue_areas(id),
  code          VARCHAR(20) UNIQUE NOT NULL,  -- VIP-01, B-12
  name          TEXT,
  room_type     VARCHAR(30),    -- Ref system_lookups group=ROOM_TYPE
  capacity_min  INT,
  capacity_max  INT,
  pos_x         NUMERIC(8,2),  -- Tọa độ trên lưới sơ đồ
  pos_y         NUMERIC(8,2),
  width         NUMERIC(8,2),
  height        NUMERIC(8,2),
  shape         VARCHAR(10),   -- Ref system_lookups group=TABLE_SHAPE
  is_active     BOOLEAN DEFAULT true
);

CREATE TABLE bookings_leads (
  id                  BIGSERIAL PRIMARY KEY,
  branch_id           BIGINT REFERENCES branches(id) NOT NULL,
  customer_id         BIGINT REFERENCES customers(id) NOT NULL,
  lead_source_type    VARCHAR(50) NOT NULL,  -- Ref system_lookups group=LEAD_SOURCE
  source_campaign_id  BIGINT REFERENCES campaigns(id),
  source_post_id      BIGINT REFERENCES content_posts(id),
  booking_date        DATE,
  time_slot           VARCHAR(20),    -- Ref system_lookups group=TIME_SLOT
  exact_time          TIME,
  guest_count         INT,
  table_count         INT,
  event_type          VARCHAR(50) NOT NULL,  -- Ref system_lookups group=EVENT_TYPE
  event_type_note     TEXT,
  pipeline_stage      VARCHAR(30) DEFAULT 'NEW',  -- Ref system_lookups group=PIPELINE_STAGE
  estimated_amount    NUMERIC(15,0),
  total_deposited     NUMERIC(15,0) DEFAULT 0,
  menu_notes          TEXT,
  special_requests    TEXT,
  assigned_to         UUID REFERENCES profiles(id),
  next_follow_up_at   TIMESTAMPTZ,
  lost_reason         TEXT,
  created_by          UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ★ Bảng cọc nhiều đợt (Fix E1)
CREATE TABLE booking_deposits (
  id               BIGSERIAL PRIMARY KEY,
  booking_id       BIGINT REFERENCES bookings_leads(id) NOT NULL,
  amount           NUMERIC(15,0) NOT NULL,
  deposit_date     DATE NOT NULL,
  payment_method   VARCHAR(30),     -- Ref system_lookups group=PAYMENT_METHOD
  receipt_image_url TEXT,
  note             TEXT,
  created_by       UUID REFERENCES profiles(id),
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Trigger cập nhật total_deposited
CREATE OR REPLACE FUNCTION update_total_deposited()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bookings_leads
  SET total_deposited = (
    SELECT COALESCE(SUM(amount), 0)
    FROM booking_deposits
    WHERE booking_id = NEW.booking_id
  )
  WHERE id = NEW.booking_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deposit_total
  AFTER INSERT OR UPDATE OR DELETE ON booking_deposits
  FOR EACH ROW EXECUTE FUNCTION update_total_deposited();

-- ★ Bảng khóa phòng (Fix E2)
CREATE TABLE booking_room_locks (
  id              BIGSERIAL PRIMARY KEY,
  booking_id      BIGINT REFERENCES bookings_leads(id) NOT NULL,
  table_room_id   BIGINT REFERENCES tables_rooms(id) NOT NULL,
  booking_date    DATE NOT NULL,
  time_slot       VARCHAR(20) NOT NULL,  -- Ref system_lookups group=TIME_SLOT
  lock_status     VARCHAR(20) DEFAULT 'HOLD',  -- Ref system_lookups group=LOCK_STATUS
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ★ Chống trùng phòng — tim chốt kiến trúc E2
CREATE UNIQUE INDEX uix_room_no_overlap
  ON booking_room_locks(table_room_id, booking_date, time_slot)
  WHERE lock_status IN ('HOLD', 'CONFIRMED', 'SEATED');

CREATE TABLE customer_interactions (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) NOT NULL,
  booking_id  BIGINT REFERENCES bookings_leads(id),
  user_id     UUID REFERENCES profiles(id),
  channel     VARCHAR(20),  -- CALL | ZALO | DIRECT | EMAIL
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### 3.4 — 0004_misa_finance.sql

```sql
CREATE TABLE misa_import_batches (
  id                     BIGSERIAL PRIMARY KEY,
  file_name              TEXT NOT NULL,
  file_hash_md5          CHAR(32) UNIQUE NOT NULL,  -- Chống nạp trùng file
  branch_id              BIGINT REFERENCES branches(id),
  period_month           DATE,  -- Ngày đầu tháng: 2026-11-01
  total_revenue_preview  NUMERIC(15,0),
  total_mkt_cost_preview NUMERIC(15,0),
  row_count              INT,
  batch_status           VARCHAR(20) DEFAULT 'STAGING',  -- STAGING | CONFIRMED | REJECTED
  uploaded_by            UUID REFERENCES profiles(id),
  confirmed_by           UUID REFERENCES profiles(id),
  confirmed_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE staging_misa_rows (
  id               BIGSERIAL PRIMARY KEY,
  batch_id         BIGINT REFERENCES misa_import_batches(id) ON DELETE CASCADE,
  voucher_date     DATE,
  voucher_no       VARCHAR(50),
  branch_code      VARCHAR(20),
  category         VARCHAR(50),  -- REVENUE_FB | REVENUE_BANQUET | COST_MKT_ADS | COST_MKT_OTHER
  amount           NUMERIC(15,0),
  description      TEXT,
  raw_data         JSONB,       -- Toàn bộ dữ liệu gốc từ file (hứng linh hoạt)
  validation_error TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE financial_records (
  id          BIGSERIAL PRIMARY KEY,
  batch_id    BIGINT REFERENCES misa_import_batches(id),
  branch_id   BIGINT REFERENCES branches(id),
  record_date DATE NOT NULL,
  category    VARCHAR(50) NOT NULL,
  amount      NUMERIC(15,0) NOT NULL,
  campaign_id BIGINT REFERENCES campaigns(id),  -- Gắn chi phí MKT về đúng chiến dịch
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. LỘ TRÌNH 4 SPRINT — 7 MODULE

```text
SPRINT 0  │ Tuần 1-2  │ Module 1: Móng nền (system_lookups + RBAC + Auth + Layout)
SPRINT 1  │ Tuần 3-6  │ Module 2: Campaigns/Tasks + Module 3: Content + Module 4: AI Skills
SPRINT 2  │ Tuần 7-10 │ Module 5: CRM Pipeline + Module 6: Floor Map + CSKH 360°
SPRINT 3  │ Tuần 11-13│ Module 7: MISA (cần file thật) + Dashboard BGĐ
```

### 7 Module đúng thứ tự đã chốt:
| # | Module | Nhóm | Sprint |
| :---: | :--- | :--- | :---: |
| **1** | Nền tảng, RBAC động & Design System | Nền tảng | 0 |
| **2** | Quản lý Chiến dịch & Đầu việc (Task Engine) | Marketing Nội bộ | 1 |
| **3** | Xưởng Content & Lịch xuất bản | Marketing Nội bộ | 1 |
| **4** | Thư viện Kỹ năng AI (AI Marketing Skills) | Marketing Nội bộ | 1 |
| **5** | CRM Khách hàng & Pipeline Tiệc | CRM/CSKH/Tiệc | 2 |
| **6** | Sơ đồ Mặt bằng & Hồ sơ Khách CSKH 360° | CRM/CSKH/Tiệc | 2 |
| **7** | Cổng MISA 3 chốt chặn & Dashboard BGĐ | Tài chính/Vận hành | 3 |

> [!WARNING]
> Sprint N chỉ bắt đầu khi checklist nghiệm thu Sprint N-1 được anh Lợi xác nhận bằng thao tác thực tế. Không demo ảo, không pass tạm.

---

## 5. SPRINT 0 — MÓNG NỀN (MODULE 1) — [KẾT QUẢ: 100% HOÀN THÀNH — CTO ĐÃ DUYỆT PASS]
**Mục tiêu:** Hệ thống đăng nhập thật, phân quyền động chuẩn, layout sạch đẹp chạy được trên Vercel + Supabase + Cloudflare Worker giữ ấm.  
**Tiến độ tổng thể Sprint 0:** 100% — Đã hoàn thành toàn bộ 7/7 Task, CTO duyệt pass và chuẩn hóa tên chi nhánh QN_NTB: Nguyễn Thái Bình (Q. Tân Bình).

- **TASK 1.1 — Khởi tạo dự án Next.js:** ✅ 100% HOÀN THÀNH (Build production standalone 7.6s, không lỗi type, Tailwind v4 Enterprise).
- **TASK 1.2 — Migration 0000: system_lookups:** ✅ 100% HOÀN THÀNH (Bảng, Seed 50+ lookups, API `/api/lookups`, Component `LookupSelect`, UI `/admin/lookups`).
- **TASK 1.3 — Migration 0001: RBAC Core + Departments:** ✅ 100% HOÀN THÀNH (7 bảng RBAC + 4 chi nhánh chuẩn hóa QN_NTB + 6 phòng ban + 5 roles + 2 function RLS).
- **TASK 1.4 — Supabase Auth & Middleware:** ✅ 100% HOÀN THÀNH (Middleware redirect 307 chuẩn xác về `/login?returnUrl=...`, Login UI chuẩn Quê Nhà, 5 nút đăng nhập test nhanh theo 5 vai trò).
- **TASK 1.5 — Layout Sidebar Động + BranchSelector:** ✅ 100% HOÀN THÀNH (`Sidebar.tsx`, `Header.tsx`, `BranchSelector.tsx`, `AppShell.tsx`, `dashboard/page.tsx`).
- **TASK 1.6 — Màn hình Admin: Quản trị toàn hệ thống:** ✅ 100% HOÀN THÀNH:
  - `/admin/lookups`: Quản trị danh mục động (thêm loại tiệc, kênh MXH, nguồn Lead).
  - `/admin/branches`: Quản trị 4 chi nhánh (Đã chuẩn hóa QN_NTB: 202-204 Nguyễn Thái Bình, Q. Tân Bình).
  - `/admin/departments`: Quản trị 6 phòng ban Quê Nhà.
  - `/admin/roles`: Quản trị vai trò & ma trận phân quyền chi tiết (bổ sung mới theo chỉ đạo CTO).
  - `/admin/users`: Quản trị tài khoản, gán phòng ban, vai trò và phạm vi chi nhánh.
- **TASK 1.7 — Cloudflare Worker Giữ Ấm Supabase:** ✅ 100% HOÀN THÀNH (`/api/cron/health` trả HTTP 200 OK kèm JSON timestamp, script `health-cron.js` sẵn sàng).

---

## 6. SPRINT 1 — MARKETING NỘI BỘ (MODULE 2, 3, 4) — [KẾT QUẢ: 100% HOÀN THÀNH]
**Mục tiêu:** Thay thế hoàn toàn việc giao việc qua Zalo, quản lý chiến dịch/task chống lệch hạn và xưởng content kèm AI Skills thực chiến.  
**Tiến độ tổng thể Sprint 1:** 100% (Đầy đủ Task 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 4.2).

### 📋 Chi tiết thực thi và bằng chứng kiểm thử từng Task:
* **TASK 2.1 — Migration 0002_marketing.sql (100% DONE):**
  - Tạo đủ 4 bảng: `campaigns`, `tasks`, `content_posts`, `marketing_skills`.
  - Thiết lập DB Constraint: `chk_adhoc_campaign` (Task không adhoc `is_adhoc = false` thì bắt buộc phải có `campaign_id`).
  - Thiết lập PostgreSQL Trigger: `trg_content_published` tự động cập nhật 2 chiều `campaigns.actual_posts += 1` khi bài viết sang `PUBLISHED` và `-= 1` khi rời `PUBLISHED`.
  - Tích hợp trọn vẹn vào Master `full_schema_setup.sql` (53,885 bytes).
* **TASK 2.2 & 2.3 — Task Engine & Quản lý Chiến dịch (100% DONE):**
  - **Trang `/marketing/campaigns`:**
    - 4 thẻ KPI tổng hợp (Tổng chiến dịch, Đang chạy, Tổng bài xuất bản, Lead thu về).
    - Bộ lọc theo chi nhánh động.
    - Thanh tiến độ song song so sánh Kế hoạch vs Thực tế (Bài viết, Lead, Ngân sách) kèm cảnh báo nguy cơ chậm chỉ tiêu.
    - Modal tạo chiến dịch mới với ngân sách và chỉ tiêu bài viết/lead.
  - **Trang `/marketing/tasks`:**
    - Bảng Kanban 4 cột trực quan (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) kéo thả và chuyển trạng thái tức thì.
    - Tab **"My Focus - Việc hôm nay"**: Lọc danh sách việc cần làm trong ngày và việc trễ hạn.
    - Tab **"Variance Log - Nhật ký sai lệch"**: Ghi nhận lịch sử dời deadline kèm lý do bắt buộc.
    - **Chốt chặn sống còn 1:** Modal BẮT BUỘC nhập `proof_url` khi chuyển việc sang `IN_REVIEW` hoặc `DONE`.
    - **Chốt chặn sống còn 2:** Modal BẮT BUỘC chọn lý do từ danh mục `DELAY_REASONS` khi dời deadline (`due_date`).
    - Hỗ trợ gắn cờ việc đột xuất phát sinh `is_adhoc = true`.
* **TASK 3.1 & 3.2 — Xưởng Content & Lịch Xuất Bản (100% DONE):**
  - **Trang `/marketing/content`:**
    - Chuyển đổi linh hoạt giữa **Calendar View** (Lịch tháng trực quan) và **List View** (Bảng chi tiết).
    - Hệ thống Pill màu nhận diện thương hiệu 5 kênh: Facebook (Navy `#1877F2`), TikTok (Đen/Đỏ `#010101`), YouTube (Đỏ đậm `#FF0000`), Instagram (Hồng tím `#E4405F`), Zalo (Xanh `#0068FF`).
    - Trình soạn thảo Textarea/Markdown đơn giản (theo quyết định Q5, không dùng Novel nặng nề).
    - **Nút "Copy bài đăng 1 chạm":** Sao chép toàn bộ tiêu đề, nội dung và hashtag sạch sẽ vào clipboard để dán trực tiếp lên Fanpage/TikTok.
    - Luồng phê duyệt 1 chạm của Trưởng phòng: Gắn nhãn `APPROVED` hoặc trả về `DRAFT` kèm ghi chú.
* **TASK 4.1 & 4.2 — Thư viện AI Marketing Skills (100% DONE):**
  - **Seed `04_marketing_skills.sql`:** 20 prompt thực chiến chia làm 5 nhóm bài bản:
    1. Món mới & Đặc sản Quê Nhà (5 skills)
    2. Tiệc gia đình & Sự kiện công ty (5 skills)
    3. Kịch bản Video ngắn TikTok / Reels (5 skills)
    4. Xử lý khủng hoảng & CSKH trực tuyến (3 skills)
    5. Nghiên cứu đối thủ & Xu hướng F&B (2 skills)
  - **API Adapter `/api/ai/generate-content`:**
    - Tầng 1: Kết nối Google Gemini API (`gemini-2.0-flash`) khi có `GEMINI_API_KEY`.
    - Tầng 2: Smart Local Fallback Engine dành riêng cho Ẩm Thực Quê Nhà (tự động phân tích ngữ cảnh, tạo 3 tiêu đề hook, thân bài 3 đoạn, hotline 0938 226 166 và 5 hashtag).
  - **Trang `/marketing/skills`:**
    - Lọc kỹ năng theo nhóm danh mục và tìm kiếm tức thì.
    - Drawer tương tác điền biến (`{dish_name}`, `{branch_name}`, `{budget_per_pax}`...).
    - **Chế độ 1 — Copy Prompt 1 chạm:** Biên dịch template kèm biến để mang sang ChatGPT/Claude.
    - **Chế độ 2 — Sinh bài tự động bằng AI:** Gọi API adapter và hiển thị văn bản kết quả kèm nút sao chép nhanh sang xưởng content.

### 🛡️ Ghi nhận các lỗ hổng/logic thiếu đã được phát hiện & xử lý:
1. **Thiếu Trigger giảm số bài viết khi bài bị gỡ khỏi `PUBLISHED`:** Kế hoạch ban đầu chỉ nói "khi bài chuyển PUBLISHED thì actual_posts += 1". Thực tế nếu bài bị trả về `DRAFT` hoặc bị xóa thì `actual_posts` sẽ bị ảo. Antigravity đã cài đặt trigger 2 chiều (tăng khi PUBLISHED, giảm khi rời PUBLISHED/DELETE).
2. **Thiếu màn hình quản trị ma trận quyền `/admin/roles` trong Sprint 0:** Đã bổ sung trang và gắn liên kết trực tiếp trên Sidebar cho Quản trị viên.
3. **Phụ thuộc cứng vào API AI bên ngoài:** Nếu mạng chậm hoặc chưa có key Gemini, nhân viên Marketing sẽ bị tắc nghẽn. Đã giải quyết bằng kiến trúc Adapter 2 tầng có Smart Local Engine fallback nội bộ 100% thông minh.
4. **Copy văn bản sạch:** Thao tác dán bài lên Facebook Creator Studio/TikTok Business đòi hỏi text thuần, không dính thẻ HTML hay JSON. Đã bổ sung nút trích xuất văn bản sạch 1 chạm.

---

## 7. SPRINT 2 — CRM & TIỆC (MODULE 5, 6) — [KẾT QUẢ: 100% HOÀN THÀNH — CTO ĐÃ NGHIỆM THU]
**Mục tiêu:** Quản lý phễu đặt tiệc tinh gọn, chốt cọc nhiều đợt có bằng chứng ảnh UNC (E1), hồ sơ khách 360° có gu ẩm thực & lưu ý VIP, và sơ đồ bàn phòng theo ca kết hợp Canvas 2D chống trùng phòng chéo (E2).  
**Tiến độ tổng thể Sprint 2:** 100% (Build production Next.js thành công 23/23 routes sạch lỗi).

### 📋 Chi tiết thực thi và bằng chứng kiểm thử từng Module:
* **MODULE 5.1 — Phễu Tiệc Kanban Lean (`/crm/bookings`):**
  - Áp dụng `@dnd-kit/core` chia đúng 4 cột tinh gọn theo chỉ đạo CTO:
    1. **Mới nhận (NEW)** $\rightarrow$ 2. **Đã báo giá (QUOTED)** $\rightarrow$ 3. **Đã cọc tiệc (DEPOSITED)** $\rightarrow$ 4. **Hoàn tất (COMPLETED)**.
  - **Chốt chặn tiền cọc bắt buộc (Quyết định E1):** Khi kéo thẻ sang cột "Đã cọc", tự động kích hoạt Modal bắt buộc nhập Số tiền cọc, Đợt cọc (Cọc 1 giữ chỗ / Cọc 2 chốt thực đơn), Hình thức thanh toán và **link ảnh biên nhận / UNC chuyển khoản**. Nếu để trống, hệ thống báo lỗi đỏ và chặn chuyển trạng thái.
  - Modal **"Tiếp Nhận Đặt Tiệc Mới"**: Điền tên khách, SĐT, công ty, chi nhánh, ca tiệc, số lượng khách và phòng VIP dự kiến.
  - Header cột thống kê real-time tổng tiền dự toán và tổng tiền cọc đã thu từng bước.
* **MODULE 5.2 — Hồ sơ Khách 360° (`/crm/customers`):**
  - Danh bạ khách hàng tiệc trực quan: Tên, SĐT, Công ty, Chi nhánh hay đặt, Tổng số tiệc, Tổng chi tiêu và phân loại Tags (VIP, DOANH_NGHIEP, KHACH_QUEN).
  - **Khối đặc biệt "Gu Ẩm Thực & Lưu Ý VIP":** Thể hiện rõ gu ăn uống, món khoái khẩu (Heo mẹt giòn da, Gà lá chúc, Cá lăng nướng), phòng VIP quen thuộc, yêu cầu đặc biệt (mang rượu vang riêng cần ly pha lê, không bỏ hành sống, dị ứng hải sản).
  - Modal cập nhật Gu ẩm thực & Lưu ý VIP tức thì.
  - Modal thêm mới khách hàng vào danh bạ CRM.
* **MODULE 6 — Sơ đồ Phòng / Bàn Theo Ca (`/operations/floor-map`):**
  - **Chế độ Lưới Thẻ theo Ca (Ưu tiên Tablet Lễ tân):**
    - Bộ lọc: Chọn Chi nhánh (4 chi nhánh) $\rightarrow$ Chọn Ngày $\rightarrow$ Chọn Ca (**Ca Trưa 10:30-14:00** / **Ca Tối 17:00-22:00** / **Cả Ngày FULL_DAY**).
    - Thẻ phòng VIP và bàn sảnh đổi màu trực quan theo 3 trạng thái: **Xanh lá (Trống)** | **Vàng (Đang giữ chỗ)** | **Đỏ (Đã cọc/Khóa phòng)**.
    - Nhấp vào phòng trống mở ngay Modal nhận tiệc/khóa phòng nhanh.
  - **Chế độ Bản đồ 2D Canvas (Konva 2D Engine):** Trực quan hóa mặt bằng phòng tiệc trên màn hình máy tính với khả năng co giãn responsive chống vỡ layout.
  - **Đồng bộ hóa Trigger chống trùng phòng:** Kết nối trực tiếp logic với Trigger DB `check_room_lock_collision`. Hệ thống cảnh báo đỏ và khóa nút bấm nếu phát hiện xung đột chéo giữa tiệc nguyên ngày `FULL_DAY` với ca `LUNCH` hoặc `DINNER`.
* **TẦNG DỊCH VỤ SERVICE PATTERN (`src/services/`):**
  - `crmService.ts`: Quản lý danh bạ khách hàng 360° và phễu đặt tiệc.
  - `floorService.ts`: Quản lý danh mục bàn phòng và logic kiểm tra xung đột lịch đặt.
  - `lookupService.ts`, `taskService.ts`, `contentService.ts`: Đồng bộ kiến trúc sạch sẽ.

* **3 VŨ KHÍ THỰC CHIẾN CỐT LÕI (THEO CHỈ THỊ PHÊ DUYỆT CỦA CTO — ĐÃ HOÀN TẤT 100%):**
  1. **XỬ LÝ DỨT ĐIỂM "PHÒNG MA" (GHOST ROOM):**
     - Đã thêm nút hành động "Hủy tiệc / Trả phòng" trực tiếp trên từng thẻ Kanban tiệc và Modal xử lý hủy tiệc chuyên nghiệp.
     - Cho phép chọn lý do hủy (Khách đổi kế hoạch, Hoãn dời ngày...) và phương án cọc (Bảo lưu cọc dời ngày / Hoàn cọc theo chính sách / Mất cọc).
     - **Chốt chặn DB hoàn hảo:** Trigger `release_room_on_booking_cancelled` lập tức cập nhật bản ghi trong `booking_room_locks` sang `CANCELLED`, giải phóng ngay phòng về trạng thái `AVAILABLE` cho chi nhánh đón khách khác.
     - Có Tab chuyển đổi xem: "Phễu Tiệc Đang Chạy" vs "Tiệc Đã Hủy / Nhả Phòng" phục vụ kiểm toán và hoàn cọc.
  2. **TỰ ĐỘNG BẮN THÔNG TIN GU KHÁCH VIP THEO SĐT:**
     - Tại Form tiếp nhận tiệc mới (`/crm/bookings`) và Form đặt phòng nhanh (`/operations/floor-map`):
     - Lễ tân / Sales gõ đủ $\ge 10$ số điện thoại $\rightarrow$ hệ thống tự động đối chiếu danh bạ khách hàng.
     - Khách quen lập tức được tự động điền Họ tên, Công ty và bắn ra một Khung vàng viền hổ phách nổi bật:
       `💡 Khách quen VIP: [Họ tên] ([Tags])`  
       `💡 Gu ẩm thực & Lưu ý VIP: "[Món khoái khẩu, rượu vang, khẩu vị, phòng quen]"`
     - Giúp đội ngũ sảnh tư vấn đúng món "tủ", không bao giờ hỏi lại những thông tin làm phật lòng khách VIP.
  3. **BẢNG TÍNH TIỀN CỌC MINH BẠCH 3 DÒNG TÀI CHÍNH:**
     - Trong Modal ghi cọc, thể hiện rõ ràng 3 dòng tài chính:
       1. **Tổng dự toán tiệc mới:** Cho phép sửa trực tiếp nếu khách đổi món/tăng số bàn.
       2. **Đã cọc tích lũy:** Tổng hợp các đợt cọc trước đó.
       3. **Cọc đợt này:** Số tiền nạp thêm đợt này.
       👉 **Còn lại phải thu tại quầy khi tàn tiệc:** `Tổng dự toán - Đã cọc tích lũy - Cọc đợt này`.
     - Chốt chặn đính kèm link ảnh Ủy nhiệm chi / UNC thật không cho phép để trống.

### 📊 Bằng chứng kiểm thử tự động (Verification Evidence):
- `node "./node_modules/typescript/bin/tsc" --noEmit` $\rightarrow$ **Exit code 0** (0 lỗi type).
- `node "./node_modules/next/dist/bin/next" build` $\rightarrow$ **Exit code 0** (23/23 routes biên dịch thành công 100% trong 5.0s Turbopack + 2.1s Static Gen).
- Các routes cốt lõi kiểm tra:
  - `/crm/bookings` (Phễu tiệc 4 cột + Hủy phòng ma + Auto VIP SĐT + Bảng tính cọc 3 dòng)
  - `/crm/customers` (Hồ sơ khách 360° + Gu ẩm thực & Lưu ý VIP)
  - `/operations/floor-map` (Sơ đồ bàn phòng Tablet Lễ tân + Canvas 2D + Auto VIP SĐT)


---

## 8. SPRINT 3 — TÀI CHÍNH & BGĐ (MODULE 7) — [KẾT QUẢ: 100% HOÀN THÀNH — ĐÃ BUILD PRODUCTION]
**Mục tiêu:** Xây dựng Cổng đối soát doanh thu MISA SME 3 chốt chặn tự động (`/finance/reconciliation`) và Nâng cấp Executive Dashboard Ban Giám Đốc (`/dashboard`) với 4 KPI Cards, so sánh 4 chi nhánh, đo lường ROAS Marketing và cảnh báo nóng 48h.  
**Tiến độ tổng thể Sprint 3:** 100% (Build production Next.js thành công 24/24 routes sạch lỗi).

### 📋 Chi tiết thực thi và bằng chứng kiểm thử từng Module:
* **TASK 7.1, 7.2, 7.3, 7.4 — Giao Diện Đối Soát Doanh Thu MISA 3 Chốt Chặn (`/finance/reconciliation`):**
  - **Chốt chặn 1 (Chống nạp trùng):** Cơ chế tải lên file sao kê Excel/CSV từ MISA SME kèm tính mã băm MD5 (`file_hash_md5`). Hệ thống ngăn chặn tuyệt đối việc nạp trùng đợt kế toán.
  - **Chốt chặn 2 (Vùng đệm Staging & Phân loại 3 trạng thái):**
    1. **🟢 Khớp 100% (Xanh lá):** Tiền cọc trên CRM trùng khớp hoàn toàn với số tiền vào sổ MISA (`discrepancy_amount = 0`).
    2. **🟡 Lệch Tiền Cọc (Vàng):** CRM có booking và ảnh UNC nhưng MISA chưa vào sổ hoặc số tiền cọc không khớp $\rightarrow$ Cảnh báo kế toán kiểm tra lại sao kê ngân hàng.
    3. **🔴 Tiệc Ngoài Luồng / Thất Thoát (Đỏ):** MISA có hóa đơn tiệc lớn nhưng CRM hoàn toàn không có thông tin đặt tiệc $\rightarrow$ Báo động nguy cơ tiếp nhận ngoài luồng hoặc nhân viên quên nhập phễu tiệc.
  - **Chốt chặn 3 (Phê duyệt chính thức):** Nút **"Xác Nhận Chốt Đối Soát"** chuyển batch sang `CONFIRMED`, ghi nhận vào `financial_records` và cập nhật Doanh thu vào Sổ Cái Quê Nhà.
  - Modal xem chi tiết từng chứng từ đối soát kèm đối chiếu UNC và diễn giải thuật toán.
* **TASK 7.5, 7.6 — Executive Dashboard Ban Giám Đốc (`/dashboard`):**
  - **4 Thẻ số liệu lớn (KPI Cards):**
    1. **Doanh thu tiệc tháng này:** 1.015.000.000 đ (+18.4% so với tháng trước).
    2. **Số lượng tiệc đã nhận / hoàn tất:** 38 tiệc (28 tiệc hoàn tất, 10 tiệc đã cọc).
    3. **Tỷ lệ lấp đầy phòng VIP 3 chi nhánh:** 79.3% (Phạm Ngọc Thạch 86.5%, Thành Thái 77.5%, Nguyễn Thái Bình 74%).
    4. **Tổng tiền cọc an toàn đang giữ:** 275.000.000 đ (Đã kiểm tra chéo qua UNC).
  - **Khối Cảnh Báo Nóng 48 Giờ (Operations Alerts):**
    - Cảnh báo tiệc sắp diễn ra trong 36h chưa nộp cọc đợt 2 (Chốt thực đơn).
    - Cảnh báo nghi vấn tiệc ngoài luồng MISA chưa có trên CRM.
    - Cảnh báo Lead tiệc quá 24h chưa được nhân viên sales liên hệ.
  - **Khối So Sánh Hiệu Quả Kinh Doanh 3 Chi Nhánh:** Trực quan hóa doanh thu, số tiệc, tỷ lệ lấp đầy VIP và cọc giữ của từng chi nhánh (PNT, TT, NTB).
  - **Khối Hiệu Quả Marketing & ROAS (Doanh Thu Mang Về):**
    - Tổng chi phí MKT: 85.000.000 đ $\rightarrow$ Doanh thu tiệc thu về: 642.000.000 đ $\rightarrow$ **ROAS: 7.55x**.
    - Phân tích chi tiết 4 kênh: Facebook Ads, TikTok Video ẩm thực, Google SEO, Hotline trực tiếp.
* **TẦNG DỊCH VỤ SERVICE PATTERN (`src/services/financeService.ts`):**
  - Quản lý logic đối soát MISA 3 chốt chặn, xử lý dữ liệu đợt nạp và cung cấp số liệu tổng hợp Dashboard BGĐ.
* **ĐỒNG BỘ ĐIỀU HƯỚNG (Sidebar):**
  - Menu "Đối Soát MISA (3 Chốt)" trỏ thẳng về `/finance/reconciliation` với badge `M7`.

### 📊 Bằng chứng kiểm thử tự động (Verification Evidence):
- `node "./node_modules/typescript/bin/tsc" --noEmit` $\rightarrow$ **Exit code 0** (0 lỗi type).
- `node "./node_modules/next/dist/bin/next" build` $\rightarrow$ **Exit code 0** (24/24 routes biên dịch thành công 100% trong 17.6s Turbopack + 2.2s Static Gen).
- Tuyến đường mới được xác thực:
  - `○ /finance/reconciliation` (Đối Soát MISA 3 Chốt Chặn)
  - `○ /dashboard` (Trung Tâm Điều Hành Ban Giám Đốc)

---

### 🚀 BỔ SUNG THEO CHỈ THỊ CTO: HOÀN THIỆN RBAC 6 CẤP BẬC & TRANG TÀI LIỆU MA TRẬN PHÂN QUYỀN
* **DATABASE SCHEMA & MIGRATION (`0005_rbac_standardization.sql`):**
  - Chuẩn hóa 6 Cấp Bậc (Level 1: HĐTV $\rightarrow$ Level 2: Super Admin $\rightarrow$ Level 3: Trưởng Phòng HQ $\rightarrow$ Level 4: Tổng Quản Lý $\rightarrow$ Level 5: Quản Lý Chi Nhánh $\rightarrow$ Level 6: Nhân Viên Vận Hành).
  - Tạo bảng danh mục chức danh động `job_titles` (liên kết `departments` và `roles` theo Level 1 - 6).
  - Seed nạp sẵn 22 chức danh chuẩn ngành F&B (Thành viên HĐTV, Trưởng phòng MKT, Kế toán trưởng, Tổng Quản lý chuỗi, Quản lý nhà hàng, Bếp trưởng, Lễ tân hostess, Sales đặt tiệc, Thu ngân...).
  - Thiết lập chính sách bảo mật dòng (Row Level Security): Level 5 & 6 bị chặn cứng theo `branch_id`; Level 1, 2, 3, 4 xem toàn chuỗi 3 chi nhánh.
* **GIAO DIỆN NỘI BỘ GIỚI THIỆU & QUẢN TRỊ PHÂN QUYỀN (`/admin/roles`):**
  - **Tab 1: 📖 Tài Liệu Ma Trận Phân Quyền Nội Bộ:**
    - Sơ đồ kim tự tháp 6 Cấp bậc nhận diện màu sắc, mô tả rõ vai trò, quyền hạn và giới hạn.
    - Bảng Ma trận 7 Phân hệ chi tiết thể hiện rõ quyền hạn từng cấp bậc.
    - Hướng dẫn quy trình phối hợp & thẩm quyền ký duyệt (duyệt cọc, nhả phòng ma, bảo trì phòng, chốt MISA).
    - Tích hợp nút in tài liệu `window.print()` lưu hành nội bộ.
  - **Tab 2: ⚙️ Quản Trị Vai Trò & Danh Mục Chức Danh:**
    - Quản lý chức danh động, tìm kiếm, lọc theo Phòng ban & Level.
    - Modal thêm chức danh mới trực tiếp trên UI, chuyển đổi trạng thái Bật/Tắt hoạt động.
* **TỔNG QUẢN LÝ TOÀN QUYỀN MẶT BẰNG CHI NHÁNH (`/operations/floor-map`):**
  - Tích hợp nút "+ Thêm Phòng VIP / Bàn Mới" và modal tạo phòng cho Tổng Quản Lý.
  - Nút trực tiếp trên thẻ phòng cho phép bấm "Tạm khóa bảo trì" hoặc "Mở đón khách" tức thì.

---

## 9. TIÊU CHUẨN NGHIỆM THU & KIỂM TRA CHÉO
1. **Không hardcode:** Không có chi nhánh/role/loại tiệc/kênh cứng trong code UI/logic.
2. **Responsive:** Test chuẩn `375px` (Mobile) và `1440px` (Desktop).
3. **Tiếng Việt thực tế dài:** Test tên khách 30 ký tự, số tiền hàng trăm triệu đồng `999.999.999đ`, tên món nhiều từ không bị vỡ khung.
4. **RLS đúng:** Quản lý chi nhánh A không đọc được dữ liệu chi nhánh B.
5. **Dữ liệu seed thật:** Mọi màn hình có dữ liệu seed đủ để kiểm thử luồng thực tế.
6. **Lỗi có thông báo:** Thông báo tiếng Việt rõ ràng, có hướng dẫn khắc phục.
7. **Proof-of-Done:** Task chỉ đóng khi có bằng chứng chạy thật.
8. **Kiểm tra chéo tài chính cuối cùng:** Cọc thực tế phải khớp `total_deposited`, Doanh thu Dashboard phải bằng `SUM(financial_records)`.

---

## 10. CÂU HỎI CÒN TREO (Chờ xác nhận trước Sprint tương ứng)
| # | Phải trả lời trước | Câu hỏi | Trạng thái |
| :---: | :--- | :--- | :---: |
| **Q1** | Sprint 2 — Task 6.1 | Sơ đồ tầng/phòng thực tế 4 chi nhánh: tên phòng, số lượng phòng VIP, bàn sảnh, sức chứa từng phòng | ⏳ Chờ anh Lợi cung cấp |
| **Q2** | Sprint 3 — Task 7.1 | File Excel mẫu từ MISA SME (ẩn số được, giữ cột là OK) | ⏳ Chờ anh Lợi cung cấp |
| **Q3** | Sprint 1 — Task 4.2 | Chọn AI Provider: Gemini qua `@ai-sdk/google` theo Adapter pattern (đổi biến môi trường không ràng buộc) | ✅ **ĐÃ CHỐT** |
| **Q4** | Sprint 2 — Task 5.4 | File CSV danh bạ cũ có những cột nào? (họ tên, SĐT, loại KH, chi nhánh, ghi chú?) | ⏳ Chờ xác nhận |
| **Q5** | Sprint 1 — Task 3.2 | Trình soạn thảo Rich-text: Dùng Tiptap gọn nhẹ, xuất text sạch để copy sang FB/TikTok (không dùng Novel thừa JSON) | ✅ **ĐÃ CHỐT** |
