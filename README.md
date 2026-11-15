# ẨM THỰC QUÊ NHÀ — HỆ THỐNG CRM & VẬN HÀNH TIẾP THỊ ĐẶT TIỆC (EST. 2010)

> **Thương hiệu ẩm thực truyền thống Việt Nam — Thành lập từ năm 2010 (>15 năm uy tín)**  
> Nền tảng quản trị vận hành F&B đa chi nhánh, phễu tiệc thông minh (Banquet Pipeline), sơ đồ mặt bằng trực quan chống trùng phòng (Collision Check), đối soát doanh thu 3 cổng MISA và tầng thương mại điện tử trải nghiệm khách hàng cao cấp.

---

## 🏛️ HỆ THỐNG 3 CHI NHÁNH QUÊ NHÀ
1. **Quê Nhà - Phạm Ngọc Thạch:** 28 Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3, TP.HCM (Biệt thự Pháp cổ, 15 phòng VIP máy lạnh riêng tư).
2. **Quê Nhà - Thành Thái:** Số 05 Thành Thái, Phường 14, Quận 10, TP.HCM (Sân vườn sinh thái, hồ nước thoáng mát, sảnh tiệc 250 khách, 18 phòng VIP).
3. **Quê Nhà - Nguyễn Thái Bình:** 164 - 166 Nguyễn Thái Bình, Phường 12, Quận Tân Bình, TP.HCM (Cửa ngõ sân bay Tân Sơn Nhất, 12 phòng VIP hiện đại).

---

## 🚀 7 MODULE VẬN HÀNH NỘI BỘ & TẦNG THƯƠNG MẠI

### Module 1: Cấu hình Hệ thống & Phân quyền Động (Foundation & Dynamic RBAC)
- **Đường dẫn:** `/admin/*` (`/admin/lookups`, `/admin/branches`, `/admin/departments`, `/admin/roles`, `/admin/users`, `/admin/menu`).
- Quản lý danh mục Lookups động (`system_lookups`) cho sự kiện tiệc, gu ẩm thực, nguồn khách.
- Phân quyền theo cấp bậc 8 tầng (`RoleLevel` 1-8: Phục vụ, Thu ngân, Sales, TQL đến Tổng Giám Đốc/BGD).
- Quản trị Thực đơn & Set Menu: Thêm món lẻ, tạo set tiệc, định giá trọn gói, đồng bộ trực tiếp sang Landing Page.

### Module 2: Quản lý Chiến dịch & Tác vụ Marketing (Campaigns & Tasks)
- **Đường dẫn:** `/marketing/campaigns`, `/marketing/tasks`.
- Theo dõi ngân sách kế hoạch vs thực chi, ROI dự kiến theo từng chi nhánh.
- Bảng Kanban tác vụ Marketing: Phân công (`assignee`), người duyệt (`reviewer`), thời hạn (`due_date`).
- **Variance Audit:** Bắt buộc nhập lý do giải trình khi dời deadline, lưu vết lịch sử kiểm toán.
- **Chốt chặn nghiệm thu:** Bắt buộc đính kèm link sản phẩm/bằng chứng (Proof URL) trước khi hoàn tất.

### Module 3: Lập Kế hoạch & Lịch Xuất bản Nội dung Đa Kênh (Content Calendar)
- **Đường dẫn:** `/marketing/content`.
- Quản lý nội dung 5 kênh truyền thông: Facebook Fanpage, TikTok, YouTube, Instagram, Zalo OA.
- Máy trạng thái duyệt bài 4 bước: `DRAFT` $\rightarrow$ `PENDING_APPROVAL` $\rightarrow$ `APPROVED` $\rightarrow$ `PUBLISHED`.
- Lịch xuất bản trực quan (Calendar View) địa phương hóa tiếng Việt (`date-fns/locale/vi`).

### Module 4: Trợ lý Tiếp thị AI & Thư viện Prompt (Marketing AI Skills)
- **Đường dẫn:** `/marketing/skills`.
- Thư viện Prompt chuyên sâu F&B với 5 nhóm kỹ năng: Món mới & Đặc sản, Tiệc & Sự kiện, Kịch bản TikTok/Reels, Chăm sóc khách VIP, Chiến lược định giá.
- Tự động điền biến động (Tên món, nguyên liệu, hương vị, chi nhánh, ưu đãi) sinh nội dung chuẩn văn phong Quê Nhà kèm Hotline.

### Module 5: CRM Phễu Đặt Tiệc & Hồ sơ Khách Hàng 360° (Banquet CRM)
- **Đường dẫn:** `/crm/bookings`, `/crm/customers`.
- Tiếp nhận đặt tiệc tự động từ Landing Page (`/api/bookings/public`) vào phễu `NEW`.
- Tự động định danh Khách Hàng VIP khi gõ số điện thoại ($\ge 10$ số: khớp mã `KH-[SĐT]`, gu ẩm thực, lịch sử chi tiêu).
- Sinh mã tiệc chuẩn hóa không trùng lặp: `[Mã CN]-[ddmmyyyy]-[STT]` (vd: `PNT-20112026-001`).
- Bảng tính tiền cọc minh bạch 3 dòng (Cọc 1 giữ chỗ, Cọc 2 chốt món, Tất toán) & bắt buộc đính kèm UNC chuyển khoản.
- **Chống "Phòng Ma":** Tự động giải phóng lock phòng trên sơ đồ mặt bằng ngay khi tiệc bị Hủy (`CANCELLED`).

### Module 6: Sơ đồ Mặt bằng & Quản lý Ca Tiệc (Operations Floor Map)
- **Đường dẫn:** `/operations/floor-map`, `/floor/live`.
- Điều phối phòng/bàn theo 3 chi nhánh, ngày tổ chức và ca tiệc (`LUNCH` 10h-14h, `DINNER` 17h-22h, `FULL_DAY`).
- **Shift Collision Trigger:** Chốt chặn va chạm phòng đa ca (từ chối tiệc trùng ca, từ chối bao ngày đè ca đơn).
- Khóa phòng bảo trì / tạm đóng phòng nhanh (`HOLD`) và bổ sung phòng mới động.
- Quản trị Album Không Gian chi nhánh: GM tải lên hình ảnh, cấu hình sức chứa và tiện ích phòng VIP.

### Module 7: Đối soát Doanh thu MISA 3 Cổng & Dashboard BGD (Finance Reconciliation)
- **Đường dẫn:** `/finance/reconciliation`, `/dashboard`.
- Kiểm tra toàn vẹn bảng kê đối soát bằng thuật toán băm mã MD5 chống giả mạo.
- Phân luồng đối soát 3 cổng tự động:
  - Cổng 1 (`MATCHED`): Khớp 100% mã tiệc và số tiền cọc giữa MISA & CRM.
  - Cổng 2 (`DEPOSIT_MISMATCH`): Báo động lệch cọc giữa kế toán và CRM.
  - Cổng 3 (`ORPHAN_MISA`): Tiền vào tài khoản nhưng chưa liên kết mã tiệc CRM.
- Executive Dashboard: 4 KPI sinh tử (Doanh thu tháng, Số tiệc đã chốt, Tỷ lệ lấp đầy phòng, Tỷ lệ khách VIP quay lại).

### Tầng Thương Mại Khách Hàng (Commercial Landing Page & AI Consultant)
- **Đường dẫn:** `/`, `/dat-tiec`.
- Giao diện trải nghiệm điện ảnh (Cinematic) tôn vinh bản sắc ẩm thực truyền thống, tông màu Đỏ Đô (`#8B1D24`) và Vàng Đồng (`#C58940`).
- Album Không Gian lật ảnh tương tác theo chi nhánh được kết nối từ kho quản trị của Tổng Quản Lý.
- Thực đơn tự chọn Spotlight & 4 Set Menu hoàn mỹ có hình ảnh chi tiết.
- Trợ lý AI Tư Vấn Đặt Tiệc Quê Nhà (`/api/ai/booking-consultant`): Tư vấn món theo ngân sách, phản hồi ấm áp, lịch thiệp, bảo mật 100% dữ liệu quản trị.

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG
- **Framework:** Next.js 16 (App Router, Turbopack, Partial Prefetching)
- **Language:** TypeScript 5
- **UI & Styling:** Tailwind CSS 4, Lucide Icons, Canvas 2D Floor Renderer
- **Drag & Drop:** `@dnd-kit/core`
- **Calendar:** `react-big-calendar`, `date-fns`
- **Security & RBAC:** Next.js Proxy Middleware, Cookie Session Guards
- **Testing:** Custom E2E Operational Suite (28/28 Workflows PASS)

---

## 📦 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy môi trường phát triển (Dev Server)
npm run dev
# Mở trình duyệt tại: http://localhost:3000

# 3. Chạy bộ kiểm định toàn diện 28 luồng vận hành
node scratch/comprehensive_module_test.js

# 4. Kiểm tra biên dịch Production Build
npm run build
```

---

## 📄 TÀI LIỆU DỰ ÁN
- [Đặc Tả Hệ Thống CRM & Marketing Quê Nhà](docs/dac-ta-he-thong-marketing-crm-que-nha.md)
- [Kế Hoạch Triển Khai Chi Tiết](docs/ke-hoach-trien-khai-crm-que-nha.md)
- [Báo Cáo Kiểm Định Vận Hành Toàn Diện](docs/comprehensive_operational_audit_report.md)

---
© 2010 - 2026 Nhà Hàng Ẩm Thực Quê Nhà. Mọi quyền được bảo lưu.
