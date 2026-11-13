-- ==============================================================================
-- 00_lookups.sql: Seed dữ liệu ban đầu cho system_lookups
-- Tối thiểu 50 lookup values chuẩn bị cho vận hành thực tế Quê Nhà
-- ==============================================================================

INSERT INTO system_lookups (group_code, value_code, label_vi, description, sort_order) VALUES
-- 1. LOẠI TIỆC (EVENT_TYPE)
('EVENT_TYPE', 'YEAR_END_PARTY', 'Tiệc tất niên / Tân niên', 'Tiệc cuối năm, chào năm mới của công ty, gia đình', 10),
('EVENT_TYPE', 'BIRTHDAY', 'Sinh nhật / Thôi nôi', 'Tiệc mừng sinh nhật, kỷ niệm, thôi nôi cho bé', 20),
('EVENT_TYPE', 'WEDDING_ENGAGEMENT', 'Cưới / Hỏi / Đính hôn', 'Tiệc báo hỷ, lễ đính hôn, đám cưới ấm cúng', 30),
('EVENT_TYPE', 'COMPANY_MEETING', 'Hội nghị / Liên hoan công ty', 'Sự kiện doanh nghiệp, họp mặt đối tác, tổng kết quý', 40),
('EVENT_TYPE', 'VIP_PRIVATE', 'Tiệc tiếp khách VIP kín', 'Tiệc riêng tư phục vụ lãnh đạo, khách hàng VIP', 50),
('EVENT_TYPE', 'FAMILY_GATHERING', 'Họp mặt gia đình / Bạn bè', 'Bữa ăn sum họp ấm cúng gia đình, hội đồng hương', 60),
('EVENT_TYPE', 'OTHER', 'Khác (ghi chú riêng)', 'Các sự kiện tiệc đặc thù khác', 70),

-- 2. NGUỒN LEAD (LEAD_SOURCE)
('LEAD_SOURCE', 'MKT_FACEBOOK_ADS', 'Facebook Ads', 'Khách đổ về từ chiến dịch quảng cáo trả phí Facebook', 10),
('LEAD_SOURCE', 'MKT_TIKTOK', 'TikTok (Marketing)', 'Khách đến từ kênh TikTok hoặc quảng cáo TikTok', 20),
('LEAD_SOURCE', 'MKT_CONTENT_ORGANIC', 'Content hữu cơ (Marketing)', 'Khách liên hệ từ bài viết fanpage, reels, review tự nhiên', 30),
('LEAD_SOURCE', 'HOTLINE_DIRECT', 'Gọi điện trực tiếp hotline', 'Khách gọi trực tiếp số hotline chi nhánh hoặc tổng đài', 40),
('LEAD_SOURCE', 'WALK_IN', 'Khách vãng lai (Walk-in)', 'Khách tự vào nhà hàng dùng bữa hoặc hỏi đặt tiệc', 50),
('LEAD_SOURCE', 'CUSTOMER_REFERRAL', 'Khách cũ / Người quen giới thiệu', 'Khách hàng thân thiết giới thiệu bạn bè, đối tác', 60),
('LEAD_SOURCE', 'BGD_RELATION', 'Quan hệ Ban Giám Đốc', 'Mối quan hệ ngoại giao, bạn hữu của Ban Giám Đốc', 70),

-- 3. KÊNH TRUYỀN THÔNG (CHANNEL)
('CHANNEL', 'FACEBOOK', 'Facebook Fanpage', 'Trang Fanpage chính thức của hệ thống', 10),
('CHANNEL', 'TIKTOK', 'TikTok Quê Nhà', 'Kênh video ngắn TikTok', 20),
('CHANNEL', 'YOUTUBE', 'YouTube Official', 'Kênh video dài / Shorts YouTube', 30),
('CHANNEL', 'INSTAGRAM', 'Instagram', 'Kênh hình ảnh món ăn Instagram', 40),
('CHANNEL', 'ZALO', 'Zalo OA', 'Kênh chăm sóc và tin nhắn Zalo OA', 50),

-- 4. HÌNH THỨC THANH TOÁN (PAYMENT_METHOD)
('PAYMENT_METHOD', 'CASH', 'Tiền mặt', 'Thu tiền mặt trực tiếp tại thu ngân', 10),
('PAYMENT_METHOD', 'BANK_TRANSFER', 'Chuyển khoản ngân hàng', 'Khách chuyển khoản tài khoản công ty hoặc QR Code', 20),
('PAYMENT_METHOD', 'POS_CARD', 'Quẹt thẻ POS', 'Thanh toán qua máy POS tại nhà hàng', 30),
('PAYMENT_METHOD', 'MOMO', 'Ví điện tử MoMo', 'Thanh toán qua cổng hoặc QR MoMo', 40),
('PAYMENT_METHOD', 'OTHER', 'Hình thức khác', 'Thanh toán đối trừ công nợ, voucher hoặc hình thức khác', 50),

-- 5. CA PHỤC VỤ (TIME_SLOT)
('TIME_SLOT', 'LUNCH', 'Ca Trưa (11:00 - 14:00)', 'Khung giờ ăn trưa phục vụ khách', 10),
('TIME_SLOT', 'DINNER', 'Ca Tối (17:30 - 22:00)', 'Khung giờ ăn tối, tiệc chính', 20),
('TIME_SLOT', 'ALL_DAY', 'Cả ngày', 'Bao trọn ca hoặc sự kiện kéo dài', 30),

-- 6. LOẠI KHÔNG GIAN / BÀN PHÒNG (ROOM_TYPE)
('ROOM_TYPE', 'VIP_ROOM', 'Phòng VIP riêng', 'Phòng máy lạnh khép kín, có phục vụ riêng', 10),
('ROOM_TYPE', 'HALL_TABLE', 'Bàn sảnh chung', 'Khu vực sảnh lớn nhà hàng', 20),
('ROOM_TYPE', 'OUTDOOR', 'Ngoài trời / Sân vườn', 'Khu vực thoáng đãng sân vườn, hành lang', 30),

-- 7. HÌNH DẠNG BÀN (TABLE_SHAPE)
('TABLE_SHAPE', 'RECT', 'Bàn chữ nhật', 'Bàn dài chữ nhật dành cho đoàn hoặc gia đình', 10),
('TABLE_SHAPE', 'CIRCLE', 'Bàn tròn', 'Bàn tiệc tròn truyền thống (8 - 12 khách)', 20),

-- 8. GIAI ĐOẠN PIPELINE TIỆC (PIPELINE_STAGE)
('PIPELINE_STAGE', 'NEW', 'Mới tiếp nhận', 'Lead mới đổ về, chưa phân bổ hoặc chưa tư vấn', 10),
('PIPELINE_STAGE', 'CONSULTING', 'Đang tư vấn / Gửi thực đơn', 'Nhân viên sales tiệc đang liên hệ tư vấn, gửi menu', 20),
('PIPELINE_STAGE', 'QUOTED', 'Đã báo giá / Chờ phản hồi', 'Đã gửi bảng báo giá chi tiết và dự toán chi phí', 30),
('PIPELINE_STAGE', 'DEPOSITED', 'Đã đặt cọc / Chốt tiệc', 'Khách đã chuyển cọc, giữ phòng và chốt menu', 40),
('PIPELINE_STAGE', 'COMPLETED', 'Đã hoàn tất tiệc', 'Tiệc đã diễn ra, khách đã thanh toán toàn bộ', 50),
('PIPELINE_STAGE', 'LOST', 'Không chốt được (Huỷ)', 'Khách đổi ý, trùng lịch hoặc huỷ đặt tiệc', 60),

-- 9. TRẠNG THÁI ĐẦU VIỆC (TASK_STATUS)
('TASK_STATUS', 'TODO', 'Cần làm', 'Đầu việc mới được giao, chưa thực hiện', 10),
('TASK_STATUS', 'IN_PROGRESS', 'Đang thực hiện', 'Đang trong quá trình triển khai', 20),
('TASK_STATUS', 'IN_REVIEW', 'Chờ duyệt kết quả', 'Đã có sản phẩm/bằng chứng, chờ quản lý duyệt', 30),
('TASK_STATUS', 'DONE', 'Hoàn thành', 'Quản lý đã nghiệm thu và xác nhận đạt yêu cầu', 40),
('TASK_STATUS', 'CANCELLED', 'Đã hủy', 'Công việc không còn cần thiết thực hiện', 50),

-- 10. TRẠNG THÁI BÀI ĐĂNG (CONTENT_STATUS)
('CONTENT_STATUS', 'DRAFT', 'Bản nháp', 'Nội dung đang soạn thảo bởi nhân viên marketing', 10),
('CONTENT_STATUS', 'PENDING_APPROVAL', 'Chờ duyệt nội dung', 'Chờ Trưởng phòng Marketing / Ban Giám Đốc duyệt', 20),
('CONTENT_STATUS', 'APPROVED', 'Đã duyệt', 'Nội dung đã được duyệt, sẵn sàng đăng', 30),
('CONTENT_STATUS', 'SCHEDULED', 'Đã lên lịch xuất bản', 'Đã hẹn giờ xuất bản tự động trên nền tảng', 40),
('CONTENT_STATUS', 'PUBLISHED', 'Đã xuất bản thực tế', 'Bài viết đã online trên kênh truyền thông chính thức', 50),

-- 11. TRẠNG THÁI KHÓA PHÒNG / BÀN (LOCK_STATUS)
('LOCK_STATUS', 'HOLD', 'Đang giữ chỗ tạm', 'Giữ chỗ trong vòng 24h chờ khách đặt cọc', 10),
('LOCK_STATUS', 'CONFIRMED', 'Đã xác nhận (Đã cọc)', 'Đã cọc thành công, khóa phòng chắc chắn cho ca tiệc', 20),
('LOCK_STATUS', 'SEATED', 'Đang phục vụ / Đang ngồi', 'Khách đã có mặt và nhà hàng đang lên món', 30),
('LOCK_STATUS', 'RELEASED', 'Đã trả bàn / Hoàn tất ca', 'Khách đã thanh toán rời tiệc, dọn dẹp sạch sẽ', 40),

-- 12. TRẠNG THÁI CHIẾN DỊCH (CAMPAIGN_STATUS)
('CAMPAIGN_STATUS', 'PLANNING', 'Lên kế hoạch', 'Chiến dịch đang được lập kế hoạch và xin ngân sách', 10),
('CAMPAIGN_STATUS', 'ACTIVE', 'Đang diễn ra', 'Chiến dịch đang trong thời gian chạy chính thức', 20),
('CAMPAIGN_STATUS', 'COMPLETED', 'Đã kết thúc', 'Chiến dịch hoàn thành thời gian chạy', 30),
('CAMPAIGN_STATUS', 'CANCELLED', 'Đã hủy', 'Chiến dịch tạm dừng hoặc hủy bỏ', 40)

ON CONFLICT (group_code, value_code) DO UPDATE
SET 
  label_vi = EXCLUDED.label_vi,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = true;
