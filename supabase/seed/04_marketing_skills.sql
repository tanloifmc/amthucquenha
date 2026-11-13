-- ==============================================================================
-- 04_marketing_skills.sql: Seed 20 Kỹ Năng AI Marketing Thực Chiến Cho Ẩm Thực Quê Nhà
-- Phân nhóm: Món mới (5) | Tiệc & Sự kiện (5) | TikTok Scripts (5) | CSKH (3) | Thị trường (2)
-- ==============================================================================

INSERT INTO marketing_skills (source, category, title, description, prompt_template, variables, example_output, is_active)
VALUES
-- ==========================================
-- NHÓM 1: MÓN MỚI & ĐẶC SẢN QUÊ (5 SKILLS)
-- ==========================================
(
  'CUSTOM',
  'Món mới & Đặc sản',
  'Giới Thiệu Món Đặc Sản Quê Nhà — Khơi Gợi Vị Giác',
  'Viết bài giới thiệu món ăn mới với văn phong ấm áp, khơi gợi ký ức bữa cơm gia đình và kích thích vị giác thực khách.',
  'Bạn là Giám đốc Sáng tạo Content của chuỗi nhà hàng "Ẩm Thực Quê Nhà" (phong cách mộc mạc, truyền thống, sang trọng). Hãy viết 01 bài đăng Facebook giới thiệu món mới:
- Tên món: {dish_name}
- Nguyên liệu & Điểm đặc biệt: {special_ingredients}
- Hương vị đặc trưng: {flavor_profile}
- Chi nhánh phục vụ: {branch_name}
- Ưu đãi áp dụng: {promotion}

Yêu cầu cấu trúc:
1. Đưa ra 3 phương án Tiêu đề (Hook) giật tít đánh trúng cảm xúc thèm ăn cơm quê.
2. Thân bài 3 đoạn: Khơi gợi ký ức quê $\rightarrow$ Tả chi tiết quy trình chế biến công phu $\rightarrow$ Gợi ý phối món (ăn kèm với gì ngon nhất).
3. Lời kêu gọi hành động (CTA) kèm thông tin đặt bàn & hotline 0938 226 166.
4. Bộ 5 hashtag chuẩn Quê Nhà.',
  '[{"key": "dish_name", "label": "Tên món ăn", "placeholder": "Vd: Cá lăng nướng muối ớt", "required": true}, {"key": "special_ingredients", "label": "Nguyên liệu & Điểm đặc biệt", "placeholder": "Cá lăng sông tươi sống, muối hột rừng Tây Bắc", "required": true}, {"key": "flavor_profile", "label": "Hương vị", "placeholder": "Thịt dai ngọt tự nhiên, cay nồng than hoa", "required": false}, {"key": "branch_name", "label": "Chi nhánh", "placeholder": "Toàn chuỗi hoặc Chi nhánh cụ thể", "required": false}, {"key": "promotion", "label": "Ưu đãi", "placeholder": "Tặng nước mát thanh nhiệt hoặc giảm 10%", "required": false}]'::jsonb,
  'Ví dụ bài viết về Cá kho niêu đất thơm nức mũi chấm rau luộc dân dã.',
  true
),
(
  'CUSTOM',
  'Món mới & Đặc sản',
  'Storytelling Nguyên Liệu Sạch Nông Thôn & Bản Sắc Mùa Vụ',
  'Kể câu chuyện hành trình tìm kiếm nguyên liệu tươi ngon từ sông nước miền Tây và ruộng đồng miền Trung.',
  'Viết bài viết phong cách Storytelling kể về hành trình mang nguyên liệu {ingredient_name} từ vùng đất {origin_region} về gian bếp của Quê Nhà. Giọng văn chân thành, tự nhiên, làm nổi bật sự tỉ mỉ của người đầu bếp và cam kết an toàn thực phẩm.',
  '[{"key": "ingredient_name", "label": "Tên nguyên liệu", "placeholder": "Vd: Cua đồng Cà Mau, Lá chúc An Giang", "required": true}, {"key": "origin_region", "label": "Vùng xuất xứ", "placeholder": "Vd: Vùng Bảy Núi An Giang", "required": true}]'::jsonb,
  'Hành trình lá chúc tươi hái lúc sớm mai về bếp Quê Nhà.',
  true
),
(
  'CUSTOM',
  'Món mới & Đặc sản',
  'Combo Cơm Trưa Đồng Quê Cho Giới Văn Phòng',
  'Bài viết nhắm vào khách văn phòng khu vực Quận 3, Quận 10 và Thủ Đức thèm bữa cơm gia đình nóng hổi trưa hè.',
  'Viết bài quảng bá Combo Cơm Trưa Quê Nhà: Giá {combo_price}, gồm các món {combo_dishes}. Nhấn mạnh thời gian lên món nhanh dưới 10 phút, không gian máy lạnh phòng êm dịu, nạp lại năng lượng cho buổi chiều làm việc.',
  '[{"key": "combo_price", "label": "Giá combo", "placeholder": "Vd: 89.000đ/người", "required": true}, {"key": "combo_dishes", "label": "Các món trong combo", "placeholder": "Vd: Canh chua cá lóc, Thịt kho hột vịt, Rau muống xào tỏi", "required": true}]'::jsonb,
  'Bữa trưa tròn vị như cơm mẹ nấu ngay giữa Quận 3.',
  true
),
(
  'CUSTOM',
  'Món mới & Đặc sản',
  'Bộ Đôi Món Nhắm Trứ Danh Cho Bàn Tiệc Rượu Vang & Bia',
  'Giới thiệu các món nhắm đồng quê cao cấp phục vụ các đoàn khách liên hoan đối tác buổi tối.',
  'Viết bài giới thiệu món nhắm {snack_dish} dùng kèm với {beverage}. Tập trung miêu tả độ giòn, bùi, béo ngậy và không khí nâng ly rôm rả cuối ngày của cánh mày râu.',
  '[{"key": "snack_dish", "label": "Món nhắm", "placeholder": "Vd: Heo mẹt đồng quê 4 món, Khô mực một nắng chiên nước mắm", "required": true}, {"key": "beverage", "label": "Thức uống kèm", "placeholder": "Vd: Rượu vang thượng hạng hoặc Bia tươi mát lạnh", "required": true}]'::jsonb,
  'Mẹt heo mọi nướng than giòn bì thơm lừng bàn tiệc tối.',
  true
),
(
  'CUSTOM',
  'Món mới & Đặc sản',
  'Gợi Ý Thực Đơn Chay & Món Thanh Đạm Mùng Một, Rằm',
  'Bài viết cho các ngày rằm, mùng 1 âm lịch với các món chay thanh lọc cơ thể từ rau củ đồng quê.',
  'Viết bài gợi ý thực đơn thanh lọc cơ thể ngày rằm tại Quê Nhà với các món nấm, đậu hũ và rau luộc chấm kho quẹt chay. Giọng văn thư thái, an yên, nhẹ nhàng.',
  '[{"key": "vegetarian_dishes", "label": "Các món chay", "placeholder": "Vd: Lẩu nấm đồng nội, Đậu hũ lướt ván, Nấm kho tiêu xanh", "required": true}]'::jsonb,
  'Tìm về chốn an yên với mâm cơm chay thanh đạm ngày Rằm.',
  true
),

-- ==========================================
-- NHÓM 2: TIỆC & SỰ KIỆN TẤT NIÊN (5 SKILLS)
-- ==========================================
(
  'CUSTOM',
  'Tiệc & Sự kiện',
  'Thư Ngỏ Mời Tiệc Tất Niên Doanh Nghiệp (Year End Party)',
  'Thư ngỏ chuyên nghiệp gửi đến ban giám đốc, phòng nhân sự và công đoàn các công ty về gói tiệc liên hoan cuối năm.',
  'Hãy soạn một bức Thư Ngỏ trang trọng gửi tới Quý Doanh Nghiệp & Phòng Nhân Sự về dịch vụ Tiệc Tất Niên 2026 tại Quê Nhà.
- Quy mô tiệc: từ {min_guests} đến {max_guests} khách
- Ngân sách set menu: từ {price_per_table} / bàn 10 khách
- Chi nhánh có sảnh lớn: {branch_name}
- Gói quà tặng kèm: {gift_package} (âm thanh, backdrop, bia...)

Yêu cầu: Lời văn trang nhã, thể hiện sự thấu hiểu sự vất vả của doanh nghiệp suốt 1 năm qua, cam kết phục vụ chu đáo, xuất hóa đơn VAT đầy đủ.',
  '[{"key": "min_guests", "label": "Số khách tối thiểu", "placeholder": "20", "required": true}, {"key": "max_guests", "label": "Số khách tối đa", "placeholder": "150", "required": true}, {"key": "price_per_table", "label": "Giá từ", "placeholder": "3.500.000đ/bàn", "required": true}, {"key": "branch_name", "label": "Chi nhánh", "placeholder": "Quê Nhà Phạm Ngọc Thạch & Thành Thái", "required": false}, {"key": "gift_package", "label": "Gói quà tặng", "placeholder": "Miễn phí âm thanh, backdrop thiết kế riêng", "required": false}]'::jsonb,
  'Thư ngỏ tiệc tất niên trang trọng gửi doanh nghiệp đối tác.',
  true
),
(
  'CUSTOM',
  'Tiệc & Sự kiện',
  'Bài Đăng Đặt Tiệc Sinh Nhật / Kỷ Niệm Gia Đình',
  'Viết bài ấm cúng cho khách hàng có nhu cầu tổ chức sinh nhật cho ông bà, bố mẹ hoặc tiệc thôi nôi cho con trẻ.',
  'Viết bài quảng bá dịch vụ Tiệc Sinh Nhật Ấm Cúng tại phòng VIP Quê Nhà. Nhấn mạnh món ăn hợp khẩu vị người lớn tuổi và trẻ nhỏ, hỗ trợ trang trí bóng bay, bánh kem và tặng món quà bất ngờ từ nhà hàng.',
  '[{"key": "event_focus", "label": "Mục tiêu tiệc", "placeholder": "Vd: Mừng thọ ông bà, Thôi nôi bé yêu, Sinh nhật ấm cúng", "required": true}, {"key": "special_perk", "label": "Ưu đãi tiệc sinh nhật", "placeholder": "Tặng gói trang trí hoa & backdrop tên bé", "required": false}]'::jsonb,
  'Gia đình sum vầy mừng sinh nhật ý nghĩa tại phòng VIP Quê Nhà.',
  true
),
(
  'CUSTOM',
  'Tiệc & Sự kiện',
  'Giới Thiệu Hệ Thống Phòng VIP Riêng Tư Kín Đáo',
  'Bài viết quảng bá hệ thống phòng VIP sang trọng, cách âm tốt dành riêng cho các buổi tiếp khách thương thảo hợp đồng.',
  'Viết bài giới thiệu chuỗi phòng VIP tại chi nhánh {branch_name}. Sức chứa {capacity} khách, trang bị máy lạnh, bàn tròn tiệc lớn, nhà vệ sinh riêng và đội ngũ phục vụ chuyên trách.',
  '[{"key": "branch_name", "label": "Chi nhánh", "placeholder": "Quê Nhà - Phạm Ngọc Thạch", "required": true}, {"key": "capacity", "label": "Sức chứa", "placeholder": "10 đến 35 khách", "required": true}]'::jsonb,
  'Không gian phòng VIP thượng lưu đậm chất mộc mạc Nam Bộ.',
  true
),
(
  'CUSTOM',
  'Tiệc & Sự kiện',
  'Ưu Đãi Đặt Cọc Tiệc Sớm (Early-Bird Booking)',
  'Bài viết thúc giục khách hàng chốt cọc sớm để giữ phòng VIP đẹp và nhận gói khuyến mãi khủng trước mùa cao điểm.',
  'Viết bài thúc giục chốt cọc tiệc cuối năm: "ĐẶT CỌC SỚM TRƯỚC {deadline_date} — NHẬN NGAY ƯU ĐÃI {promotion_value}". Nhấn mạnh tình trạng các phòng VIP cuối tuần đang dần kín chỗ để tạo cảm giác khan hiếm tích cực.',
  '[{"key": "deadline_date", "label": "Hạn chót cọc", "placeholder": "30/11/2026", "required": true}, {"key": "promotion_value", "label": "Gói ưu đãi", "placeholder": "Giảm 10% thực đơn + Miễn phí gói thức uống", "required": true}]'::jsonb,
  'Giữ phòng VIP ngay hôm nay trước khi cháy phòng mùa tiệc!',
  true
),
(
  'CUSTOM',
  'Tiệc & Sự kiện',
  'Gợi Ý 3 Set Thực Đơn Tiệc Cưới Báo Hỷ Ấm Cúng',
  'Bài viết cho các cặp đôi thích tiệc cưới quy mô ấm cúng (50-100 khách), phong cách dân dã hoài niệm.',
  'Viết bài gợi ý tiệc cưới báo hỷ ấm cúng mộc mạc tại Quê Nhà. Giới thiệu 3 set menu kết hợp hài hòa giữa hải sản cao cấp và các món quê quen thuộc.',
  '[{"key": "wedding_theme", "label": "Chủ đề cưới", "placeholder": "Vd: Đám cưới quê ấm cúng, Tiệc báo hỷ thân mật", "required": true}]'::jsonb,
  'Hôn lễ ngập tràn cảm xúc bên mâm cỗ cưới thuần Việt.',
  true
),

-- ==========================================
-- NHÓM 3: KỊCH BẢN VIDEO TIKTOK / REELS (5 SKILLS)
-- ==========================================
(
  'CUSTOM',
  'Kịch bản TikTok / Reels',
  'Kịch Bản Review Món Ăn 45 Giây — Khói Nghi Ngút & Âm Thanh ASMR',
  'Kịch bản chi tiết từng giây từ Hook 3s, góc quay, lời dẫn và hiệu ứng âm thanh kích thích thèm ăn.',
  'Bạn là đạo diễn sáng tạo kịch bản TikTok ẩm thực triệu view. Hãy viết kịch bản 45 giây review món {dish_name}:
- Giây 0-3 (Hook): Hành động gây tò mò thị giác + câu nói giật mình.
- Giây 4-15: Cận cảnh món ăn bốc khói, tiếng xèo xèo ASMR giòn tan.
- Giây 16-35: Cảm nhận chân thật khi ăn miếng đầu tiên, nét mặt thỏa mãn.
- Giây 36-45: Tiết lộ địa chỉ chi nhánh {branch_name} và giá bán bất ngờ.',
  '[{"key": "dish_name", "label": "Tên món quay", "placeholder": "Vd: Heo mẹt nướng than giòn rụm", "required": true}, {"key": "branch_name", "label": "Địa chỉ quay", "placeholder": "28 Phạm Ngọc Thạch, Q3", "required": true}]'::jsonb,
  'Kịch bản TikTok 45s khiến người xem phải nuốt nước bọt nửa đêm.',
  true
),
(
  'CUSTOM',
  'Kịch bản TikTok / Reels',
  'Kịch Bản "Một Ngày Đi Chợ & Vào Bếp Cùng Bếp Trưởng"',
  'Behind-The-Scenes ghi lại sự tỉ mỉ của người làm bếp Quê Nhà từ sáng sớm.',
  'Viết kịch bản video ngắn (60 giây) Behind The Scenes theo chân bếp trưởng Quê Nhà chọn nguyên liệu tươi lúc 5h sáng và kỳ công hầm nước dùng suốt 6 tiếng.',
  '[{"key": "chef_name", "label": "Tên/Hình tượng bếp trưởng", "placeholder": "Bếp trưởng Tư Quê Nhà", "required": false}]'::jsonb,
  'Tâm huyết người đầu bếp đặt trọn vào từng nồi lẩu nghi ngút.',
  true
),
(
  'CUSTOM',
  'Kịch bản TikTok / Reels',
  'Kịch Bản Phỏng Vấn Thực Khách Thật Tại Bàn Tiệc (Vox Pop)',
  'Phỏng vấn nhanh các bác lớn tuổi hoặc dân văn phòng về lý do 5 năm qua chỉ chọn Quê Nhà tiếp khách.',
  'Viết kịch bản phỏng vấn nhanh thực khách tại bàn ăn. Hỏi 2 câu hỏi chân thật: "Món nào ở đây làm bác nhớ nhà nhất?" và "Điểm gì giữ chân anh chị quay lại suốt nhiều năm?".',
  '[{"key": "target_customer", "label": "Đối tượng phỏng vấn", "placeholder": "Vd: Bác trung niên sành ăn, Khách doanh nghiệp tiếp đối tác", "required": true}]'::jsonb,
  'Khách quen 10 năm chia sẻ lý do mê đắm vị canh chua cá lóc.',
  true
),
(
  'CUSTOM',
  'Kịch bản TikTok / Reels',
  'Kịch Bản Check-in Phòng VIP Sân Vườn Giữa Sài Gòn',
  'Video khoe không gian xanh mát, tiếng nước chảy róc rách đối lập với sự xô bồ ngoài phố.',
  'Viết kịch bản video TikTok dạng POV: "Bỏ lại deadline và kẹt xe ngoài kia, bước chân vào ốc đảo xanh Quê Nhà...". Góc quay máy lướt từ sảnh tre nứa vào phòng VIP máy lạnh thơm mùi gỗ mộc.',
  '[{"key": "branch_highlight", "label": "Điểm nhấn không gian", "placeholder": "Hồ cá koi sân vườn chi nhánh Phạm Ngọc Thạch", "required": true}]'::jsonb,
  'Ốc đảo xanh yên bình trốn khói bụi ngay trung tâm Sài Gòn.',
  true
),
(
  'CUSTOM',
  'Kịch bản TikTok / Reels',
  'Kịch Bản Thử Thách "Ăn Hết Mâm Cỗ 10 Người"',
  'Kịch bản hài hước bắt trend thử thách nhóm bạn 4 người ăn sạch mâm cỗ tiệc tất niên khổng lồ.',
  'Viết kịch bản video giải trí: Nhóm bạn gọi mâm tiệc 10 người đầy ú khú và thử thách xem có ăn hết không. Tương tác lầy lội, gần gũi giới trẻ.',
  '[{"key": "group_type", "label": "Nhóm bạn", "placeholder": "Hội đồng hương, Team đồng nghiệp phòng Marketing", "required": false}]'::jsonb,
  'Thử thách mâm tiệc đại bác ăn no căng rốn cùng hội bạn thân.',
  true
),

-- ==========================================
-- NHÓM 4: CHĂM SÓC KHÁCH HÀNG & PHẢN HỒI (3 SKILLS)
-- ==========================================
(
  'CUSTOM',
  'Chăm sóc khách & CSKH',
  'Tin Nhắn Zalo Chúc Mừng Sinh Nhật Khách Thân Thiết Kèm Ưu Đãi',
  'Mẫu tin nhắn chúc mừng sinh nhật cá nhân hóa gửi từ Zalo OA hoặc Sales tiệc, tặng voucher dùng bữa.',
  'Soạn 01 tin nhắn Zalo gửi khách hàng VIP nhân dịp sinh nhật:
- Tên khách: {customer_name}
- Danh xưng thân mật: Anh / Chị
- Quà tặng từ Quê Nhà: {birthday_gift} (Vd: Tặng 1 đĩa tráng miệng đặc biệt + Giảm 10% tổng hóa đơn)
- Lời chúc: Chúc sức khỏe, công việc hanh thông, luôn giữ niềm vui bên gia đình.',
  '[{"key": "customer_name", "label": "Tên khách hàng", "placeholder": "Anh Hoàng Nam", "required": true}, {"key": "birthday_gift", "label": "Quà tặng sinh nhật", "placeholder": "Tặng bánh kem + Giảm 10% phòng VIP", "required": true}]'::jsonb,
  'Tin nhắn Zalo ấm áp khiến khách VIP mỉm cười và đặt bàn ngay.',
  true
),
(
  'CUSTOM',
  'Chăm sóc khách & CSKH',
  'Phản Hồi Review Khen Của Khách Hàng Trên Google Maps & Fanpage',
  'Mẫu trả lời bình luận khen ngợi với thái độ trân trọng, khiêm nhường, không sáo rỗng.',
  'Hãy viết câu trả lời phản hồi lại lời khen của thực khách {customer_name} vừa để lại đánh giá 5 sao về món {liked_dish} và sự phục vụ chu đáo của nhân viên {branch_name}. Lời văn ấm áp như người nhà cảm ơn người thân ghé chơi.',
  '[{"key": "customer_name", "label": "Tên khách", "placeholder": "Chị Mai Phương", "required": true}, {"key": "liked_dish", "label": "Món khách khen", "placeholder": "Lẩu cua đồng và thái độ phục vụ", "required": true}, {"key": "branch_name", "label": "Chi nhánh", "placeholder": "Quê Nhà Thành Thái", "required": true}]'::jsonb,
  'Lời cảm ơn chân thành từ đáy lòng của đại gia đình Quê Nhà.',
  true
),
(
  'CUSTOM',
  'Chăm sóc khách & CSKH',
  'Xử Lý Khiếu Nại Phục Vụ Chậm / Món Ăn Chưa Vừa Ý Khéo Léo',
  'Kịch bản trả lời thư/tin nhắn xoa dịu khách khi có sự cố giờ cao điểm, giữ chân khách hàng trung thành.',
  'Viết thư xin lỗi gửi khách hàng gặp trải nghiệm chưa trọn vẹn tại nhà hàng: Sự cố {issue_description} vào ngày {issue_date}. Thể hiện sự cầu thị, nhận lỗi thẳng thắn, không đổ lỗi cho giờ cao điểm, và trân trọng mời khách quay lại dùng bữa với lời mời từ Quản lý chi nhánh.',
  '[{"key": "issue_description", "label": "Vấn đề gặp phải", "placeholder": "Ra món chậm 20 phút do bếp quá tải ca tối", "required": true}, {"key": "issue_date", "label": "Ngày xảy ra", "placeholder": "Tối thứ Bảy vừa qua", "required": true}]'::jsonb,
  'Bức thư xin lỗi chân thành chuyển hóa khách bực thành khách trung thành.',
  true
),

-- ==========================================
-- NHÓM 5: PHÂN TÍCH ĐỐI THỦ & CHIẾN LƯỢC (2 SKILLS)
-- ==========================================
(
  'CUSTOM',
  'Phân tích & Chiến lược',
  'Phân Tích Định Vị Món Ăn Với Đối Thủ Cùng Phân Khúc',
  'So sánh thực đơn và mức giá set tiệc của Quê Nhà với các chuỗi ẩm thực truyền thống khác tại TP.HCM.',
  'Phân tích ma trận cạnh tranh giữa Quê Nhà và các chuỗi nhà hàng ẩm thực Việt phân khúc tiệc gia đình/công ty tại TP.HCM. Đưa ra 3 đề xuất định vị để Quê Nhà nổi bật về: Hương vị mộc mạc nguyên bản, Không gian phòng VIP rộng rãi và Sự nhiệt tình của đội ngũ phục vụ.',
  '[{"key": "target_area", "label": "Khu vực cạnh tranh", "placeholder": "Quận 3 và TP. Thủ Đức", "required": true}]'::jsonb,
  'Bản phân tích 3 lợi thế độc tôn giúp Quê Nhà dẫn đầu phân khúc.',
  true
),
(
  'CUSTOM',
  'Phân tích & Chiến lược',
  'Ý Tưởng Chiến Dịch Kéo Khách Mùa Thấp Điểm Trong Tuần',
  'Gợi ý 5 ý tưởng chương trình ưu đãi kéo khách dùng bữa thứ Ba đến thứ Năm.',
  'Đề xuất 5 ý tưởng kích cầu ẩm thực cho các ngày thứ Ba, thứ Tư, thứ Năm (thời điểm vắng hơn cuối tuần) tại 4 chi nhánh Quê Nhà, đảm bảo không hạ thấp giá trị thương hiệu sang trọng.',
  '[{"key": "target_branch", "label": "Chi nhánh áp dụng", "placeholder": "Toàn chuỗi hoặc Chi nhánh cụ thể", "required": false}]'::jsonb,
  '5 chiến dịch thông minh biến ngày thường thành ngày đông khách.',
  true
)
ON CONFLICT DO NOTHING;
