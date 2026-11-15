# ĐẶC TẢ HỆ THỐNG NỘI BỘ: MARKETING, CRM & QUẢN LÝ TIỆC (CHUỖI NHÀ HÀNG QUÊ NHÀ)

**Phiên bản:** 1.0 (Bản định hướng & Kiến trúc tổng thể)  
**Mục tiêu:** Xây dựng 01 Web App thống nhất, trực quan, dễ dùng (tránh rườm rà và tránh giao diện "mùi AI"), kết nối khép kín từ Kế hoạch Marketing $\rightarrow$ Sản xuất Content $\rightarrow$ Thu nhận Lead $\rightarrow$ Chăm sóc & Xếp bàn/Phòng VIP $\rightarrow$ Đối soát MISA $\rightarrow$ Báo cáo Ban Giám đốc.

---

## PHẦN 1. NGUYÊN TẮC CỐT LÕI & KIẾN TRÚC HẠ TẦNG

### 1.1. Nguyên tắc vận hành (Không làm đối phó)
1. **Một hệ thống – Nhiều góc nhìn (Unified App, Role-based UI):** Chung 01 domain và 01 cơ sở dữ liệu để không đứt gãy dữ liệu giữa Marketing – Chi nhánh – Kế toán – BGĐ, nhưng giao diện tự ẩn/hiện theo đúng vai trò.
2. **Phân quyền động (Dynamic RBAC):** Không gắn cứng tên vai trò hoặc chi nhánh vào code giao diện. Toàn bộ chi nhánh, vai trò và quyền chi tiết nằm trong Database và được bảo vệ ở tầng Postgres RLS (Row Level Security).
3. **Bền vững & Không khóa chặt nhà cung cấp (Vendor-Agnostic):** Giai đoạn 1 chạy chi phí 0đ trên Cloud để chứng minh hiệu quả với BGĐ; sẵn sàng dời toàn bộ sang VPS riêng của công ty với rủi ro gần như bằng 0.
4. **Dữ liệu thật – Chống sai lệch:** Mọi con số tài chính từ MISA phải đi qua vùng đệm đối soát; mọi đặt phòng VIP phải khóa trùng lịch ở tầng Database; mọi công việc Marketing phải bám vào kế hoạch và có bằng chứng hoàn thành.

### 1.2. Ngăn xếp công nghệ (Tech Stack) & Lộ trình hạ tầng
| Thành phần | Giai đoạn 1 (Chứng minh với BGĐ - $0/tháng) | Giai đoạn 2 (Dời về VPS riêng / Mở rộng) | Lưu ý kỹ thuật bắt buộc ngay từ ngày đầu |
| :--- | :--- | :--- | :--- |
| **Frontend & API** | Next.js (App Router, TypeScript) trên **Vercel Free** | Đóng gói Docker Image (`output: 'standalone'`) chạy trên VPS (Coolify/Ubuntu) | Bật `output: 'standalone'` trong `next.config.*` ngay khi khởi tạo. |
| **Database & Auth** | **Supabase Free** (PostgreSQL + Auth + RLS) | PostgreSQL trên VPS hoặc Supabase Self-hosted (`pg_dump` chuyển sang) | Không dùng tính năng quá đặc thù khó xuất; tách SQL migration rõ ràng. |
| **Lưu trữ tệp** | **Supabase Storage Free** (1GB) | MinIO / S3 / Ổ cứng VPS | Chỉ lưu ảnh đã nén nhẹ (< 500KB/ảnh). Video chỉ dán link Drive/YouTube. |
| **Tác vụ hẹn giờ (Cron)** | **Cloudflare Workers Free** (Cron Triggers) | Linux Crontab / Node-cron trên VPS | Worker chỉ gọi vào API của Next.js (`/api/cron/*`). Cài ping nhẹ mỗi ngày để chống Supabase ngủ đông sau 7 ngày. |
| **Sao lưu (Backup)** | **Nút Export Excel/CSV 1 chạm** ngay trên App | Auto-backup PostgreSQL hàng ngày trên VPS | Bắt buộc có nút xuất dữ liệu CRM, Lịch tiệc, Lịch Content để phòng ngừa rủi ro gói Free. |
| **Đăng MXH đa kênh** | Dùng chung 1 bộ kênh hiện tại + nút **Copy nhanh & Tải ảnh** (hoặc Meta Webhook đơn giản) | Chỉ tích hợp **Postiz** (trên Railway ~$5-8/tháng hoặc VPS) khi tách nhiều Fanpage chi nhánh | Không dựng cụm Postiz (Temporal + Redis + Postgres) ở GĐ1 để tránh nặng hệ thống. |
| **Mở rộng Agent/Data** | Chưa nhúng vào lõi app | Xem xét kết nối **Treg (`superdesigndev/treg`)** qua MCP cho Agent nghiên cứu thị trường/đối thủ | Giữ lõi nội bộ gọn nhẹ trước khi nối công cụ ngoài. |

---

## PHẦN 2. DESIGN SYSTEM & QUY TRÌNH GIAO DIỆN (TRÁNH "MÙI AI")

### 2.1. Công cụ bắt buộc cho Coder / Antigravity
Cài đặt bộ skill thiết kế UI/UX để ép Antigravity làm đúng quy trình (đọc code $\rightarrow$ viết brief $\rightarrow$ dựng 2-3 wireframe với dữ liệu thật $\rightarrow$ code $\rightarrow$ kiểm tra lỗi tràn khung/tương phản):
- **Skill giao diện:** `npx skills add evondev/evondevKit -a antigravity` (gọi lệnh `/ui-ux` trước khi code giao diện từng module).
- **Kho component:** `shadcn/ui` (Layout, Data Table, Drawer, Dialog, Form) + `Tremor` (Biểu đồ tài chính, phễu chuyển đổi) + `Novel` (Soạn thảo content kiểu Notion gọn nhẹ, tùy chọn).

### 2.2. Quy chuẩn thẩm mỹ & Trải nghiệm
1. **Phong cách phẳng doanh nghiệp (Flat Enterprise UI):**
   - Nền trang xám rất nhạt (`#F8FAFC`), thẻ nội dung (Card) nền trắng (`#FFFFFF`), viền mảnh `1px solid #E2E8F0`.
   - Tuyệt đối **không** dùng nền tối tím neon, gradient sặc sỡ, hiệu ứng kính mờ (glassmorphism) hay đổ bóng dày kiểu "demo AI".
2. **Kỷ luật hành động:** Mỗi màn hình/khối chỉ có **01 nút hành động chính (Primary CTA)** nổi bật theo màu thương hiệu; các nút phụ dùng kiểu viền (Outline) hoặc chữ (Ghost).
3. **Thân thiện thao tác tại nhà hàng (Mobile & Tablet First):**
   - Quản lý chi nhánh thường mở app trên điện thoại/iPad ngay tại sảnh nhà hàng.
   - Bắt buộc kiểm tra hiển thị từ `375px` (điện thoại) đến `1920px` (màn hình BGĐ), kiểm thử với dữ liệu thật tiếng Việt dài (tên khách dài, tên món dài, số tiền hàng trăm triệu đồng) để không bị vỡ bảng hoặc rớt chữ.
4. **Thanh điều hướng (Sidebar) động theo quyền:**
   - **Marketing:** Chỉ thấy *Tổng quan việc hôm nay*, *Kế hoạch & Chiến dịch*, *Xưởng Content & Thư viện Skill*.
   - **Quản lý chi nhánh:** Chỉ thấy *Sơ đồ Bàn/Phòng VIP*, *Danh sách Tiệc & CRM*, *Khách hàng & Lịch sử*.
   - **Kế toán:** Chỉ thấy *Đối soát MISA*, *Báo cáo Doanh thu - Chi phí*.
   - **BGĐ & Trưởng phòng MKT:** Thấy *Dashboard Tổng hợp* và toàn bộ các phân hệ được cấp quyền.

---

## PHẦN 3. CƠ CHẾ CHỐNG CHÊNH LỆCH GIỮA KẾ HOẠCH VÀ TRIỂN KHAI

Để khắc phục tình trạng "kế hoạch một đằng, triển khai một nẻo, giao việc trôi tin trên Zalo", hệ thống áp dụng 4 cơ chế khóa chặt ngay trong luồng nghiệp vụ:

1. **Liên kết Cha – Con bắt buộc (Hard Linkage):**
   - Mọi **Bài Content** phải gắn vào một **Đầu việc (Task)** hoặc **Chiến dịch (Campaign)**.
   - Mọi **Đầu việc** phải gắn vào một **Mục tiêu/Chiến dịch**. Các việc phát sinh đột xuất bắt buộc gắn nhãn `Phát sinh (Ad-hoc)` để cuối tháng thống kê được tỷ lệ thời gian bị cuốn theo việc ngoài kế hoạch.
2. **Hiển thị song song Kế hoạch vs. Thực tế (Plan vs. Actual):**
   - Trên từng Chiến dịch luôn đặt cạnh nhau hai cột số liệu: *Kế hoạch* (Số bài dự kiến, Số Lead mục tiêu, Ngân sách dự kiến) và *Thực tế* (Số bài đã đăng, Số Lead đổ về CRM, Chi phí thực đã đối soát MISA).
3. **Tiêu chuẩn hoàn thành có bằng chứng (Proof of Done):**
   - Nhân viên không thể bấm chuyển việc sang `Chờ duyệt` hoặc `Hoàn thành` nếu để trống ô kết quả (phải có link Google Drive/bài đăng hoặc ảnh nháp đính kèm).
4. **Nhật ký sai lệch (Variance Log):**
   - Khi dời hạn chót (Deadline) hoặc hủy một hạng mục đã lên kế hoạch, hệ thống yêu cầu chọn nhanh 01 lý do chuẩn hóa (vd: *Chờ duyệt thực đơn*, *Thiếu hình ảnh chi nhánh*, *Đổi ưu đãi BGĐ*, *Quá tải nhân sự*) thay vì im lặng tự sửa ngày. Nhờ đó Trưởng phòng nhìn ra đúng điểm nghẽn để tháo gỡ.

---

## PHẦN 4. THIẾT KẾ CƠ SỞ DỮ LIỆU TỔNG THỂ (POSTGRESQL / SUPABASE)

Dưới đây là khung dữ liệu cốt lõi để Antigravity triển khai theo từng module:

### Nhóm 1: Tổ chức & Phân quyền động (Dynamic RBAC)
- `branches`: `id`, `code` (vd: QN_TT, QN_DBP), `name`, `address`, `is_active`, `created_at`
- `roles`: `id`, `code` (`BGD`, `MKT_LEAD`, `MKT_STAFF`, `BRANCH_MANAGER`, `ACCOUNTANT`, ...), `name`, `scope` (`ALL_BRANCHES` | `ASSIGNED_BRANCHES`)
- `permissions`: `id`, `module`, `action` (vd: `crm.view`, `crm.edit`, `floor.manage`, `misa.import`, `content.approve`, `dashboard.finance`)
- `role_permissions`: `role_id`, `permission_id`
- `profiles`: `id` (FK `auth.users`), `full_name`, `phone`, `role_id`, `is_active`
- `user_branches`: `user_id`, `branch_id` *(Cho phép 1 quản lý phụ trách 1 hoặc nhiều chi nhánh linh hoạt)*

### Nhóm 2: Kế hoạch, Công việc & Content
- `campaigns`: `id`, `branch_id` (nullable = toàn chuỗi), `name`, `objective`, `start_date`, `end_date`, `target_posts`, `target_leads`, `planned_budget`, `status` (`PLANNING`, `ACTIVE`, `COMPLETED`, `PAUSED`), `created_by`
- `tasks`: `id`, `campaign_id` (nullable nếu `is_adhoc = true`), `is_adhoc`, `title`, `description`, `assignee_id`, `reviewer_id`, `due_date`, `original_due_date`, `delay_reason`, `status` (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `CANCELLED`), `proof_url`
- `content_posts`: `id`, `campaign_id`, `task_id`, `branch_id` (nullable = dùng chung chuỗi), `channel` (`FACEBOOK`, `TIKTOK`, `YOUTUBE`, `INSTAGRAM`), `pillar` (Trụ cột nội dung), `title`, `body_draft`, `media_links` (JSONB), `scheduled_at`, `published_at`, `published_url`, `status` (`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `SCHEDULED`, `PUBLISHED`), `approved_by`
- `marketing_skills`: `id`, `source` (`CUSTOM`, `PROMPTS_CHAT`, `COREY_MARKETING_SKILLS`), `category`, `title`, `description`, `prompt_template`, `variables` (JSONB), `example_output`, `is_active`

### Nhóm 3: CRM, Lịch sử Khách & Sơ đồ Bàn/Phòng VIP
- `customers`: `id`, `phone` (UNIQUE - khóa định danh chính), `full_name`, `company_name`, `tax_code`, `customer_type` (`PERSONAL`, `VIP`, `CORPORATE_B2B`), `preferences` *(Sở thích, kiêng kỵ, gu phòng VIP, ghi chú phục vụ lâu dài)*, `total_bookings`, `total_spent`, `created_at`
- `venue_areas`: `id`, `branch_id`, `name` (vd: *Tầng Trệt*, *Sân Vườn*, *Khu VIP Lầu 1*), `sort_order`
- `tables_rooms`: `id`, `branch_id`, `area_id`, `code` (vd: `VIP-01`, `B-12`), `name`, `room_type` (`VIP_ROOM`, `HALL_TABLE`, `OUTDOOR`), `capacity_min`, `capacity_max`, `pos_x`, `pos_y`, `width`, `height`, `shape` (`RECT`, `CIRCLE`), `is_active` *(Tọa độ phục vụ vẽ Sơ đồ mặt bằng trực quan)*
- `bookings_leads`: `id`, `branch_id`, `customer_id`, `source_campaign_id` (nullable), `source_post_id` (nullable), `source_channel`, `booking_date`, `time_slot` (`LUNCH`, `DINNER`, `ALL_DAY`), `exact_time`, `guest_count`, `table_count`, `event_type` (`BIRTHDAY`, `CORPORATE`, `VIP_HOSTING`, `FAMILY`, `YEAR_END`), `pipeline_stage` (`NEW`, `CONSULTING`, `QUOTED`, `DEPOSITED`, `COMPLETED`, `LOST`), `estimated_amount`, `deposit_amount`, `menu_notes`, `special_requests`, `assigned_to`, `next_follow_up_at`, `lost_reason`
- `booking_room_locks`: `id`, `booking_id`, `table_room_id`, `booking_date`, `time_slot`, `lock_status` (`HOLD`, `CONFIRMED`, `SEATED`, `RELEASED`)
  - **Ràng buộc chống trùng phòng (Unique Partial Index):** `UNIQUE (table_room_id, booking_date, time_slot) WHERE lock_status IN ('HOLD', 'CONFIRMED', 'SEATED')`. Không bao giờ xảy ra lỗi đặt trùng 1 phòng VIP cho 2 đoàn khách cùng một ca!
- `customer_interactions`: `id`, `customer_id`, `booking_id`, `user_id`, `channel` (`CALL`, `ZALO`, `DIRECT`), `note`, `created_at`

### Nhóm 4: Đối soát Kế toán MISA
- `misa_import_batches`: `id`, `file_name`, `file_hash_md5` (UNIQUE - chống nạp trùng file), `branch_id`, `period_month`, `total_revenue_preview`, `total_mkt_cost_preview`, `row_count`, `status` (`STAGING`, `CONFIRMED`, `REJECTED`), `uploaded_by`, `confirmed_by`, `confirmed_at`
- `staging_misa_rows`: `id`, `batch_id`, `voucher_date`, `voucher_no`, `branch_code`, `category` (`REVENUE_FB`, `REVENUE_BANQUET`, `COST_MKT_ADS`, `COST_MKT_OTHER`), `amount`, `description`, `validation_error`
- `financial_records`: `id`, `batch_id`, `branch_id`, `record_date`, `category`, `amount`, `campaign_id` (nullable - gắn chi phí về chiến dịch nếu có), `created_at`

---

## PHẦN 5. CHIA 7 MODULE TRIỂN KHAI CUỐN CHIẾU

Mỗi module phải hoàn thiện trọn vẹn từ Database $\rightarrow$ API/Logic $\rightarrow$ Giao diện (`evon:ui-ux`) $\rightarrow$ Kiểm thử thực tế rồi mới sang module tiếp theo.

### Module 1: Xương sống Nền tảng & Phân quyền động (Core & Dynamic RBAC)
- **Mục tiêu:** Có hệ thống đăng nhập thật, phân quyền chuẩn, khung layout sạch đẹp chạy được trên Vercel + Supabase + Cloudflare Worker giữ ấm DB.
- **Đầu ra bắt buộc:**
  1. Khởi tạo Next.js (`output: 'standalone'`), Tailwind, `shadcn/ui`, Supabase SSR Auth.
  2. Chạy SQL tạo nhóm bảng RBAC + hàm Postgres `has_permission()` / `can_access_branch()` cho RLS.
  3. Màn hình Đăng nhập, Khung Sidebar tự động ẩn/hiện menu theo `permissions`, Bộ chọn Chi nhánh trên Header (chỉ hiện các chi nhánh user được gán).
  4. Màn hình Quản trị (dành cho Admin/BGĐ): Thêm/sửa Chi nhánh, Tạo/sửa Vai trò, Gán nhân viên vào Chi nhánh (thay đổi nhân sự bất kỳ lúc nào không cần chạm code).
  5. Cloudflare Worker Cron gọi `/api/cron/health` mỗi sáng 07:00 để giữ Supabase không ngủ đông.

### Module 2: Kế hoạch, Mục tiêu & Điều hành Công việc Marketing
- **Mục tiêu:** Thay thế việc giao việc trên Zalo, kiểm soát độ chênh lệch giữa Kế hoạch và Thực tế.
- **Đầu ra bắt buộc:**
  1. Quản lý Chiến dịch: Tạo chiến dịch theo tháng/sự kiện, nhập chỉ tiêu (số bài, số lead, ngân sách).
  2. Màn hình **Việc hôm nay của tôi (My Focus)** cho 4–5 nhân viên Marketing mở lên thấy ngay việc cần làm.
  3. Bảng/Kanban 4 trạng thái (`Cần làm` $\rightarrow$ `Đang làm` $\rightarrow$ `Chờ duyệt` $\rightarrow$ `Hoàn thành`), bắt buộc đính kèm `proof_url` khi nộp duyệt, bắt buộc chọn lý do khi dời deadline.
  4. Thanh đo **Plan vs. Actual** trên đầu mỗi chiến dịch và cảnh báo việc trễ hạn.

### Module 3: Xưởng Content, Lịch Xuất bản & Kho Skill AI
- **Mục tiêu:** Quản lý lịch đăng bài đồng bộ cho 1 bộ kênh chung (FB/TikTok/YT/IG) và tích hợp thư viện tri thức AI để nhân viên viết bài nhanh, đúng giọng Quê Nhà.
- **Đầu ra bắt buộc:**
  1. Lịch Content dạng Lịch tuần/tháng (Calendar View) và Danh sách (List View), có trường `branch_id` mở sẵn cho tương lai.
  2. Nạp dữ liệu khởi tạo cho `marketing_skills`: Lọc và Việt hóa những mẫu thực chiến nhất từ `prompts.chat` và cấu trúc 53 skill từ `coreyhaines31/marketingskills` (chia nhóm: Món mới, Tiệc/Sự kiện, Kịch bản TikTok, Chăm sóc khách, Phân tích đối thủ).
  3. Trình soạn bài 2 chế độ:
     - *Chế độ 1 (API trực tiếp):* Chọn Skill + nhập vài ý thô (tên món, ưu đãi, chi nhánh) $\rightarrow$ AI trả 3 Hook + bài nháp + gợi ý ảnh.
     - *Chế độ 2 (Copy dùng ngoài):* Nút **Copy Prompt kèm ngữ cảnh Quê Nhà** 1 chạm để nhân viên dán sang ChatGPT/Claude cá nhân.
  4. Luồng Duyệt 1 chạm (Trưởng phòng duyệt trên App) + Nút **Copy chữ & Tải ảnh** đăng ngay trong 10 giây (chừa sẵn Hook Webhook để cắm Meta Graph API / Postiz sau này).

### Module 4: CRM Khách hàng & Hồ sơ Lịch sử 360°
- **Mục tiêu:** Gom toàn bộ khách hỏi tiệc, khách doanh nghiệp, khách VIP về một nơi theo từng chi nhánh; không để rớt khách và giữ được ký ức phục vụ.
- **Đầu ra bắt buộc:**
  1. Bảng phễu Pipeline 5 bước (`Mới` $\rightarrow$ `Đang tư vấn` $\rightarrow$ `Đã báo giá` $\rightarrow$ `Đã cọc/Chốt` $\rightarrow$ `Chưa chốt`).
  2. Tự động nhận diện khách cũ theo SĐT khi tạo mới Lead/Booking: Vừa gõ SĐT là hiện ngay thông báo *"Khách quen – Đã đặt 3 lần, thích VIP 2, hay lấy VAT công ty X"*.
  3. Trang **Chi tiết Khách hàng (Customer 360° Drawer)**: Hiển thị toàn bộ lịch sử các lần đặt tiệc trước đó, tổng chi tiêu, sở thích/lưu ý kiêng kỵ và nhật ký các cuộc gọi chăm sóc (`customer_interactions`).
  4. Bộ lọc nhắc lịch gọi lại hôm nay (`next_follow_up_at`) + Nút **Xuất Excel/CSV 1 chạm** để sao lưu dự phòng.

### Module 5: Quản lý Tiệc & Sơ đồ Bàn / Phòng VIP Trực quan
- **Mục tiêu:** Giúp Quản lý chi nhánh và BGĐ nhìn bằng mắt là nắm được ngay phòng VIP nào còn trống, phòng nào có khách gì, lịch sử khách ra sao theo từng ngày và ca (Trưa / Tối).
- **Đầu ra bắt buộc:**
  1. Màn hình **Thiết lập Mặt bằng Chi nhánh (Floor Setup)**: Cho phép tạo Khu vực (Sảnh, Sân vườn, Lầu VIP) và đặt vị trí các Phòng VIP / Cụm bàn trên lưới trực quan (số chỗ ngồi, hình chữ nhật/tròn).
  2. Màn hình **Sơ đồ Tiệc Trực quan (Live Floor Map)**:
     - Bộ chọn nhanh: `[Chi nhánh] + [Ngày] + [Ca Trưa / Ca Tối]`.
     - Hiển thị các Phòng VIP & Bàn theo màu trạng thái trực quan: **Trống** (Xám nhạt) | **Đang giữ chỗ** (Vàng) | **Đã cọc/Chốt** (Xanh dương) | **Đang ngồi** (Cam).
     - Trên mỗi ô phòng VIP hiển thị gọn: *Tên phòng + Sức chứa + Tên khách/Công ty + Số khách + Biểu tượng VIP/Bánh sinh nhật/VAT*.
  3. **Bấm vào ô Phòng VIP trên sơ đồ** sẽ trượt ra bảng bên phải (Side Drawer) chứa ngay: Thông tin bữa tiệc (Thực đơn, tiền cọc, yêu cầu trang trí), Lịch sử khách đó (đã đi mấy lần, gu phục vụ gì), và các nút đổi trạng thái nhanh (Gán phòng / Ghép nhiều phòng cho đoàn lớn / Đổi sang Đã vào bàn / Trả bàn).
  4. Khóa chống đặt trùng ca ở tầng Database (`booking_room_locks`).

### Module 6: Cổng đối soát Kế toán MISA (Pipeline 3 Chốt chặn)
- **Mục tiêu:** Nạp số liệu doanh thu và chi phí Marketing từ file Excel xuất từ MISA vào hệ thống một cách an toàn tuyệt đối, không trùng lặp, không sai số.
- **Đầu ra bắt buộc:**
  1. Mẫu file chuẩn mapping cột từ Excel MISA (Ngày chứng từ, Số chứng từ, Mã chi nhánh, Khoản mục Doanh thu/Chi phí MKT, Số tiền).
  2. **Chốt 1 (Kiểm tra & Chống trùng):** Upload file Excel (.xlsx/.csv) $\rightarrow$ Tính mã băm MD5. Nếu file đã từng nạp $\rightarrow$ Chặn ngay. Nếu thiếu cột hoặc sai định dạng số $\rightarrow$ Báo lỗi từng dòng ngay trên màn hình.
  3. **Chốt 2 (Vùng đệm Staging):** Hiển thị bảng xem trước gồm: Tổng doanh thu từng chi nhánh, Tổng chi phí MKT trong file vừa nạp để Kế toán đối chiếu mắt thường với phần mềm MISA.
  4. **Chốt 3 (Xác nhận chính thức):** Kế toán bấm *"Xác nhận ghi nhận số liệu"* (kèm nhật ký người duyệt & thời gian) thì dữ liệu mới chảy vào bảng `financial_records`. Hỗ trợ hủy cả đợt nạp (`batch`) nếu phát hiện sai sót sau này để nạp lại sạch sẽ.

### Module 7: Dashboard Ban Giám đốc & Báo cáo Khép kín
- **Mục tiêu:** Cung cấp màn hình tổng quan trong 30 giây cho BGĐ và chứng minh hiệu quả thực tế của Phòng Marketing.
- **Đầu ra bắt buộc:**
  1. 4 thẻ chỉ số lớn (KPI Cards): *Doanh thu thực (MISA)* | *Chi phí MKT & Tỷ suất sinh lời* | *Giá trị Phễu Tiệc đang chăm sóc & Đã cọc* | *Tỷ lệ hoàn thành đúng hạn Kế hoạch MKT*.
  2. Biểu đồ cột so sánh Doanh thu & Công suất phòng VIP theo từng Chi nhánh (dùng `Tremor`).
  3. Bảng truy vết hiệu quả Chiến dịch: `Chiến dịch` $\rightarrow$ `Số bài thực tế / Kế hoạch` $\rightarrow$ `Số Lead tạo ra` $\rightarrow$ `Số tiệc đã chốt & Doanh thu ước tính`.
  4. Cảnh báo nhanh cho BGĐ/Trưởng phòng: Việc Marketing trễ hạn, Lead quá 24h chưa có quản lý gọi lại.

---

## PHẦN 6. QUY TRÌNH LÀM VIỆC VỚI ANTIGRAVITY CODER

Khi bắt đầu từng Module, anh Lợi giao lệnh cho Antigravity theo đúng thứ tự 4 bước để tránh sinh code rác và vỡ kiến trúc:

1. **Bước 1 – Nạp ngữ cảnh & Skill:** Nhắc Antigravity đọc file đặc tả này và kích hoạt `/ui-ux` (từ `evon:ui-ux`).
2. **Bước 2 – Chốt Database & Logic trước:** Yêu cầu viết file SQL Migration (bao gồm RLS Policy) và TypeScript Types cho đúng Module đang làm, kiểm tra kỹ rồi mới viết UI.
3. **Bước 3 – Duyệt Wireframe trên dữ liệu thật:** Với các màn hình quan trọng (đặc biệt là Sơ đồ Phòng VIP ở Module 5, Bảng việc Module 2 và Màn hình Staging MISA Module 6), yêu cầu phác bố cục bằng dữ liệu mẫu tiếng Việt có độ dài thực tế để anh duyệt trước khi hoàn thiện code.
4. **Bước 4 – Nghiệm thu chuẩn hóa:** Kiểm tra hiển thị trên màn hình điện thoại `375px` và desktop `1440px`, test thử đăng nhập bằng 2 tài khoản khác vai trò (vd: Quản lý chi nhánh A không được thấy dữ liệu chi nhánh B) rồi mới chuyển sang Module kế tiếp.
