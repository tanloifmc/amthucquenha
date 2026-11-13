'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Search,
  Tag,
  Flame,
  Film,
  HeartHandshake,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Bot,
} from 'lucide-react';

interface SkillVariable {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
}

interface SkillItem {
  id: number;
  category: 'Món mới & Đặc sản' | 'Tiệc & Sự kiện' | 'Kịch bản TikTok / Reels' | 'Chăm sóc khách & CSKH' | 'Phân tích & Chiến lược';
  title: string;
  description: string;
  prompt_template: string;
  variables: SkillVariable[];
  example_output: string;
}

const SEED_SKILLS: SkillItem[] = [
  // 1. Món mới
  {
    id: 1,
    category: 'Món mới & Đặc sản',
    title: 'Giới Thiệu Món Đặc Sản Quê Nhà — Khơi Gợi Vị Giác',
    description: 'Viết bài giới thiệu món mới ấm áp, khơi gợi ký ức bữa cơm quê và kích thích vị giác.',
    prompt_template: `Bạn là Giám đốc Sáng tạo Content của chuỗi nhà hàng "Ẩm Thực Quê Nhà". Hãy viết 01 bài đăng Facebook giới thiệu món mới:
- Tên món: {dish_name}
- Nguyên liệu & Điểm đặc biệt: {special_ingredients}
- Hương vị đặc trưng: {flavor_profile}
- Chi nhánh phục vụ: {branch_name}
- Ưu đãi áp dụng: {promotion}

Yêu cầu:
1. Đưa ra 3 phương án Tiêu đề (Hook) giật tít đánh trúng cảm xúc thèm ăn cơm quê.
2. Thân bài 3 đoạn: Ký ức quê $\rightarrow$ Quy trình chế biến công phu $\rightarrow$ Gợi ý phối món.
3. Kêu gọi đặt bàn (Hotline 0938 226 166) & 5 hashtag chuẩn Quê Nhà.`,
    variables: [
      { key: 'dish_name', label: 'Tên món ăn', placeholder: 'Vd: Cá lăng nướng muối ớt than hoa', required: true },
      { key: 'special_ingredients', label: 'Nguyên liệu đặc biệt', placeholder: 'Cá lăng sông tươi sống, muối hột rừng', required: true },
      { key: 'flavor_profile', label: 'Hương vị', placeholder: 'Thịt dai ngọt tự nhiên, cay nồng đậm đà', required: false },
      { key: 'branch_name', label: 'Chi nhánh phục vụ', placeholder: 'Toàn chuỗi hoặc Chi nhánh cụ thể', required: false },
      { key: 'promotion', label: 'Ưu đãi kèm theo', placeholder: 'Tặng nước mát thanh nhiệt hoặc giảm 10%', required: false },
    ],
    example_output: 'Ví dụ bài viết về Cá kho niêu đất thơm nức mũi chấm rau luộc dân dã.',
  },
  {
    id: 2,
    category: 'Món mới & Đặc sản',
    title: 'Storytelling Nguyên Liệu Sạch Nông Thôn & Bản Sắc Mùa Vụ',
    description: 'Kể câu chuyện hành trình tìm kiếm nguyên liệu tươi sạch từ miền Tây và miền Trung.',
    prompt_template: `Viết bài viết phong cách Storytelling kể về hành trình mang nguyên liệu {ingredient_name} từ vùng đất {origin_region} về gian bếp của Quê Nhà. Giọng văn chân thành, tự nhiên, làm nổi bật sự tỉ mỉ của người đầu bếp và cam kết an toàn thực phẩm.`,
    variables: [
      { key: 'ingredient_name', label: 'Tên nguyên liệu', placeholder: 'Vd: Cua đồng Cà Mau, Lá chúc An Giang', required: true },
      { key: 'origin_region', label: 'Vùng xuất xứ', placeholder: 'Vd: Vùng Bảy Núi An Giang', required: true },
    ],
    example_output: 'Hành trình lá chúc tươi hái lúc sớm mai về bếp Quê Nhà.',
  },
  {
    id: 3,
    category: 'Món mới & Đặc sản',
    title: 'Combo Cơm Trưa Đồng Quê Cho Giới Văn Phòng',
    description: 'Bài viết kích cầu cho khách văn phòng khu vực Quận 3, Quận 10 và Thủ Đức.',
    prompt_template: `Viết bài quảng bá Combo Cơm Trưa Quê Nhà: Giá {combo_price}, gồm các món {combo_dishes}. Nhấn mạnh thời gian lên món nhanh dưới 10 phút, không gian máy lạnh phòng êm dịu, nạp lại năng lượng cho buổi chiều làm việc.`,
    variables: [
      { key: 'combo_price', label: 'Giá combo', placeholder: 'Vd: 89.000đ/người', required: true },
      { key: 'combo_dishes', label: 'Các món trong combo', placeholder: 'Canh chua cá lóc, Thịt kho hột vịt, Rau muống xào tỏi', required: true },
    ],
    example_output: 'Bữa trưa tròn vị như cơm mẹ nấu ngay giữa Quận 3.',
  },
  {
    id: 4,
    category: 'Món mới & Đặc sản',
    title: 'Bộ Đôi Món Nhắm Trứ Danh Cho Bàn Tiệc Tối',
    description: 'Giới thiệu các món nhắm đồng quê cao cấp cho khách liên hoan đối tác buổi tối.',
    prompt_template: `Viết bài giới thiệu món nhắm {snack_dish} dùng kèm với {beverage}. Tập trung miêu tả độ giòn, bùi, béo ngậy và không khí nâng ly rôm rả cuối ngày của cánh mày râu.`,
    variables: [
      { key: 'snack_dish', label: 'Món nhắm', placeholder: 'Vd: Heo mẹt đồng quê 4 món', required: true },
      { key: 'beverage', label: 'Thức uống kèm', placeholder: 'Vd: Rượu vang hoặc Bia tươi mát lạnh', required: true },
    ],
    example_output: 'Mẹt heo mọi nướng than giòn bì thơm lừng bàn tiệc tối.',
  },
  {
    id: 5,
    category: 'Món mới & Đặc sản',
    title: 'Gợi Ý Thực Đơn Chay & Món Thanh Đạm Mùng Một, Rằm',
    description: 'Bài viết ngày rằm với các món chay thanh lọc cơ thể từ rau củ đồng quê.',
    prompt_template: `Viết bài gợi ý thực đơn thanh lọc cơ thể ngày rằm tại Quê Nhà với các món nấm, đậu hũ và rau luộc chấm kho quẹt chay. Giọng văn thư thái, an yên, nhẹ nhàng. Món: {vegetarian_dishes}`,
    variables: [
      { key: 'vegetarian_dishes', label: 'Món chay', placeholder: 'Vd: Lẩu nấm đồng nội, Đậu hũ lướt ván', required: true },
    ],
    example_output: 'Tìm về chốn an yên với mâm cơm chay thanh đạm ngày Rằm.',
  },

  // 2. Tiệc & Sự kiện
  {
    id: 6,
    category: 'Tiệc & Sự kiện',
    title: 'Thư Ngỏ Mời Tiệc Tất Niên Doanh Nghiệp (Year End Party)',
    description: 'Thư ngỏ chuyên nghiệp gửi đến ban giám đốc và phòng nhân sự về gói tiệc liên hoan.',
    prompt_template: `Hãy soạn một bức Thư Ngỏ trang trọng gửi tới Quý Doanh Nghiệp & Phòng Nhân Sự về dịch vụ Tiệc Tất Niên 2026 tại Quê Nhà.
- Quy mô tiệc: từ {min_guests} đến {max_guests} khách
- Ngân sách set menu: từ {price_per_table} / bàn 10 khách
- Chi nhánh có sảnh lớn: {branch_name}
- Gói quà tặng kèm: {gift_package} (âm thanh, backdrop, bia...)

Yêu cầu: Lời văn trang nhã, thể hiện sự thấu hiểu sự vất vả của doanh nghiệp suốt 1 năm qua, cam kết phục vụ chu đáo, xuất hóa đơn VAT đầy đủ.`,
    variables: [
      { key: 'min_guests', label: 'Số khách tối thiểu', placeholder: '20', required: true },
      { key: 'max_guests', label: 'Số khách tối đa', placeholder: '150', required: true },
      { key: 'price_per_table', label: 'Giá từ', placeholder: '3.500.000đ/bàn', required: true },
      { key: 'branch_name', label: 'Chi nhánh có sảnh tiệc', placeholder: 'Quê Nhà Phạm Ngọc Thạch & Thành Thái', required: false },
      { key: 'gift_package', label: 'Gói quà tặng', placeholder: 'Miễn phí âm thanh, backdrop thiết kế riêng', required: false },
    ],
    example_output: 'Thư ngỏ tiệc tất niên trang trọng gửi doanh nghiệp đối tác.',
  },
  {
    id: 7,
    category: 'Tiệc & Sự kiện',
    title: 'Bài Đăng Đặt Tiệc Sinh Nhật / Kỷ Niệm Gia Đình',
    description: 'Viết bài ấm cúng cho khách hàng tổ chức sinh nhật cho ông bà, con nhỏ.',
    prompt_template: `Viết bài quảng bá dịch vụ Tiệc Sinh Nhật Ấm Cúng tại phòng VIP Quê Nhà. Nhấn mạnh món ăn hợp khẩu vị người lớn tuổi và trẻ nhỏ, hỗ trợ trang trí bóng bay, bánh kem: {special_perk}. Trọng tâm: {event_focus}.`,
    variables: [
      { key: 'event_focus', label: 'Mục tiêu tiệc', placeholder: 'Vd: Mừng thọ ông bà, Thôi nôi bé yêu', required: true },
      { key: 'special_perk', label: 'Ưu đãi tiệc', placeholder: 'Tặng gói trang trí hoa & backdrop tên', required: false },
    ],
    example_output: 'Gia đình sum vầy mừng sinh nhật ý nghĩa tại phòng VIP Quê Nhà.',
  },
  {
    id: 8,
    category: 'Tiệc & Sự kiện',
    title: 'Giới Thiệu Hệ Thống Phòng VIP Riêng Tư Kín Đáo',
    description: 'Quảng bá chuỗi phòng VIP sang trọng dành cho các buổi tiếp khách thương thảo.',
    prompt_template: `Viết bài giới thiệu chuỗi phòng VIP tại chi nhánh {branch_name}. Sức chứa {capacity} khách, trang bị máy lạnh, bàn tròn tiệc lớn, nhà vệ sinh riêng và đội ngũ phục vụ chuyên trách.`,
    variables: [
      { key: 'branch_name', label: 'Chi nhánh', placeholder: 'Quê Nhà - Phạm Ngọc Thạch', required: true },
      { key: 'capacity', label: 'Sức chứa', placeholder: '10 đến 35 khách', required: true },
    ],
    example_output: 'Không gian phòng VIP thượng lưu đậm chất mộc mạc Nam Bộ.',
  },
  {
    id: 9,
    category: 'Tiệc & Sự kiện',
    title: 'Ưu Đãi Đặt Cọc Tiệc Sớm (Early-Bird Booking)',
    description: 'Bài viết thúc giục khách hàng chốt cọc sớm để giữ phòng VIP đẹp và nhận khuyến mãi.',
    prompt_template: `Viết bài thúc giục chốt cọc tiệc cuối năm: "ĐẶT CỌC SỚM TRƯỚC {deadline_date} — NHẬN NGAY ƯU ĐÃI {promotion_value}". Nhấn mạnh tình trạng các phòng VIP cuối tuần đang dần kín chỗ để tạo cảm giác khan hiếm tích cực.`,
    variables: [
      { key: 'deadline_date', label: 'Hạn chót cọc', placeholder: '30/11/2026', required: true },
      { key: 'promotion_value', label: 'Gói ưu đãi', placeholder: 'Giảm 10% thực đơn + Miễn phí thức uống', required: true },
    ],
    example_output: 'Giữ phòng VIP ngay hôm nay trước khi cháy phòng mùa tiệc!',
  },
  {
    id: 10,
    category: 'Tiệc & Sự kiện',
    title: 'Gợi Ý 3 Set Thực Đơn Tiệc Cưới Báo Hỷ Ấm Cúng',
    description: 'Bài viết cho cặp đôi thích tiệc cưới quy mô ấm cúng (50-100 khách) dân dã.',
    prompt_template: `Viết bài gợi ý tiệc cưới báo hỷ ấm cúng mộc mạc tại Quê Nhà. Giới thiệu 3 set menu kết hợp hài hòa giữa hải sản cao cấp và các món quê quen thuộc. Chủ đề: {wedding_theme}`,
    variables: [
      { key: 'wedding_theme', label: 'Chủ đề cưới', placeholder: 'Đám cưới quê ấm cúng, Tiệc báo hỷ thân mật', required: true },
    ],
    example_output: 'Hôn lễ ngập tràn cảm xúc bên mâm cỗ cưới thuần Việt.',
  },

  // 3. TikTok / Reels
  {
    id: 11,
    category: 'Kịch bản TikTok / Reels',
    title: 'Kịch Bản Review Món Ăn 45 Giây — ASMR & Bốc Khói',
    description: 'Kịch bản chi tiết từng giây từ Hook 3s, góc quay, lời dẫn và hiệu ứng âm thanh.',
    prompt_template: `Bạn là đạo diễn sáng tạo kịch bản TikTok ẩm thực triệu view. Hãy viết kịch bản 45 giây review món {dish_name}:
- Giây 0-3 (Hook): Hành động gây tò mò thị giác + câu nói giật mình.
- Giây 4-15: Cận cảnh món ăn bốc khói, tiếng xèo xèo ASMR giòn tan.
- Giây 16-35: Cảm nhận chân thật khi ăn miếng đầu tiên, nét mặt thỏa mãn.
- Giây 36-45: Tiết lộ địa chỉ chi nhánh {branch_name} và giá bán bất ngờ.`,
    variables: [
      { key: 'dish_name', label: 'Tên món quay', placeholder: 'Heo mẹt nướng than giòn rụm', required: true },
      { key: 'branch_name', label: 'Địa chỉ quay', placeholder: '28 Phạm Ngọc Thạch, Q3', required: true },
    ],
    example_output: 'Kịch bản TikTok 45s khiến người xem phải nuốt nước bọt nửa đêm.',
  },
  {
    id: 12,
    category: 'Kịch bản TikTok / Reels',
    title: 'Kịch Bản "Một Ngày Đi Chợ & Vào Bếp Cùng Bếp Trưởng"',
    description: 'Behind-The-Scenes ghi lại sự tỉ mỉ của người làm bếp Quê Nhà từ sáng sớm.',
    prompt_template: `Viết kịch bản video ngắn (60 giây) Behind The Scenes theo chân bếp trưởng {chef_name} của Quê Nhà chọn nguyên liệu tươi lúc 5h sáng và kỳ công hầm nước dùng suốt 6 tiếng.`,
    variables: [
      { key: 'chef_name', label: 'Tên bếp trưởng', placeholder: 'Bếp trưởng Tư Quê Nhà', required: false },
    ],
    example_output: 'Tâm huyết người đầu bếp đặt trọn vào từng nồi lẩu nghi ngút.',
  },
  {
    id: 13,
    category: 'Kịch bản TikTok / Reels',
    title: 'Kịch Bản Phỏng Vấn Thực Khách Thật Tại Bàn Tiệc (Vox Pop)',
    description: 'Phỏng vấn nhanh thực khách về lý do nhiều năm qua chỉ chọn Quê Nhà tiếp khách.',
    prompt_template: `Viết kịch bản phỏng vấn nhanh thực khách {target_customer} tại bàn ăn. Hỏi 2 câu chân thật: "Món nào ở đây làm bác nhớ nhà nhất?" và "Điểm gì giữ chân anh chị quay lại suốt nhiều năm?".`,
    variables: [
      { key: 'target_customer', label: 'Đối tượng phỏng vấn', placeholder: 'Bác trung niên sành ăn, Khách doanh nghiệp', required: true },
    ],
    example_output: 'Khách quen 10 năm chia sẻ lý do mê đắm vị canh chua cá lóc.',
  },
  {
    id: 14,
    category: 'Kịch bản TikTok / Reels',
    title: 'Kịch Bản Check-in Phòng VIP Sân Vườn Giữa Sài Gòn',
    description: 'Video khoe không gian xanh mát, đối lập với sự xô bồ ngoài phố.',
    prompt_template: `Viết kịch bản video TikTok dạng POV: "Bỏ lại deadline và kẹt xe ngoài kia, bước chân vào ốc đảo xanh Quê Nhà...". Góc quay máy lướt từ sảnh tre nứa vào phòng VIP máy lạnh thơm mùi gỗ mộc tại {branch_highlight}.`,
    variables: [
      { key: 'branch_highlight', label: 'Điểm nhấn không gian', placeholder: 'Hồ cá koi sân vườn chi nhánh Phạm Ngọc Thạch', required: true },
    ],
    example_output: 'Ốc đảo xanh yên bình trốn khói bụi ngay trung tâm Sài Gòn.',
  },
  {
    id: 15,
    category: 'Kịch bản TikTok / Reels',
    title: 'Kịch Bản Thử Thách "Ăn Hết Mâm Cỗ 10 Người"',
    description: 'Kịch bản hài hước bắt trend thử thách nhóm bạn ăn sạch mâm cỗ tiệc tất niên.',
    prompt_template: `Viết kịch bản video giải trí: Nhóm bạn {group_type} gọi mâm tiệc 10 người đầy ú khú và thử thách xem có ăn hết không. Tương tác lầy lội, gần gũi giới trẻ.`,
    variables: [
      { key: 'group_type', label: 'Nhóm bạn', placeholder: 'Hội đồng hương, Team phòng Marketing', required: false },
    ],
    example_output: 'Thử thách mâm tiệc đại bác ăn no căng rốn cùng hội bạn thân.',
  },

  // 4. CSKH
  {
    id: 16,
    category: 'Chăm sóc khách & CSKH',
    title: 'Tin Nhắn Zalo Chúc Mừng Sinh Nhật Khách Thân Thiết Kèm Ưu Đãi',
    description: 'Mẫu tin nhắn chúc mừng sinh nhật cá nhân hóa gửi từ Zalo OA, tặng voucher.',
    prompt_template: `Soạn 01 tin nhắn Zalo gửi khách hàng VIP nhân dịp sinh nhật:
- Tên khách: {customer_name}
- Quà tặng từ Quê Nhà: {birthday_gift}
- Lời chúc: Chúc sức khỏe, công việc hanh thông, luôn giữ niềm vui bên gia đình.`,
    variables: [
      { key: 'customer_name', label: 'Tên khách hàng', placeholder: 'Anh Hoàng Nam', required: true },
      { key: 'birthday_gift', label: 'Quà tặng sinh nhật', placeholder: 'Tặng bánh kem + Giảm 10% phòng VIP', required: true },
    ],
    example_output: 'Tin nhắn Zalo ấm áp khiến khách VIP mỉm cười và đặt bàn ngay.',
  },
  {
    id: 17,
    category: 'Chăm sóc khách & CSKH',
    title: 'Phản Hồi Review Khen Của Khách Hàng Trên Google Maps',
    description: 'Mẫu trả lời bình luận khen ngợi với thái độ trân trọng, khiêm nhường.',
    prompt_template: `Hãy viết câu trả lời phản hồi lại lời khen của thực khách {customer_name} vừa để lại đánh giá 5 sao về món {liked_dish} và sự phục vụ chu đáo của nhân viên {branch_name}. Lời văn ấm áp như người nhà cảm ơn người thân ghé chơi.`,
    variables: [
      { key: 'customer_name', label: 'Tên khách', placeholder: 'Chị Mai Phương', required: true },
      { key: 'liked_dish', label: 'Món khách khen', placeholder: 'Lẩu cua đồng và thái độ phục vụ', required: true },
      { key: 'branch_name', label: 'Chi nhánh', placeholder: 'Quê Nhà Thành Thái', required: true },
    ],
    example_output: 'Lời cảm ơn chân thành từ đáy lòng của đại gia đình Quê Nhà.',
  },
  {
    id: 18,
    category: 'Chăm sóc khách & CSKH',
    title: 'Xử Lý Khiếu Nại Phục Vụ Chậm / Món Ăn Chưa Vừa Ý Khéo Léo',
    description: 'Kịch bản trả lời thư/tin nhắn xoa dịu khách khi có sự cố giờ cao điểm.',
    prompt_template: `Viết thư xin lỗi gửi khách hàng gặp trải nghiệm chưa trọn vẹn tại nhà hàng: Sự cố {issue_description} vào ngày {issue_date}. Thể hiện sự cầu thị, nhận lỗi thẳng thắn, không đổ lỗi cho giờ cao điểm, và trân trọng mời khách quay lại dùng bữa với lời mời từ Quản lý chi nhánh.`,
    variables: [
      { key: 'issue_description', label: 'Vấn đề gặp phải', placeholder: 'Ra món chậm 20 phút do bếp quá tải ca tối', required: true },
      { key: 'issue_date', label: 'Ngày xảy ra', placeholder: 'Tối thứ Bảy vừa qua', required: true },
    ],
    example_output: 'Bức thư xin lỗi chân thành chuyển hóa khách bực thành khách trung thành.',
  },

  // 5. Phân tích thị trường
  {
    id: 19,
    category: 'Phân tích & Chiến lược',
    title: 'Phân Tích Định Vị Món Ăn Với Đối Thủ Cùng Phân Khúc',
    description: 'So sánh thực đơn và mức giá set tiệc của Quê Nhà với các chuỗi ẩm thực Việt khác.',
    prompt_template: `Phân tích ma trận cạnh tranh giữa Quê Nhà và các chuỗi nhà hàng ẩm thực Việt phân khúc tiệc gia đình/công ty tại khu vực {target_area}. Đưa ra 3 đề xuất định vị để Quê Nhà nổi bật.`,
    variables: [
      { key: 'target_area', label: 'Khu vực cạnh tranh', placeholder: 'Quận 3 và TP. Thủ Đức', required: true },
    ],
    example_output: 'Bản phân tích 3 lợi thế độc tôn giúp Quê Nhà dẫn đầu phân khúc.',
  },
  {
    id: 20,
    category: 'Phân tích & Chiến lược',
    title: 'Ý Tưởng Chiến Dịch Kéo Khách Mùa Thấp Điểm Trong Tuần',
    description: 'Gợi ý 5 ý tưởng chương trình ưu đãi kéo khách dùng bữa thứ Ba đến thứ Năm.',
    prompt_template: `Đề xuất 5 ý tưởng kích cầu ẩm thực cho các ngày thứ Ba, thứ Tư, thứ Năm (thời điểm vắng hơn cuối tuần) tại chi nhánh {target_branch}, đảm bảo không hạ thấp giá trị thương hiệu sang trọng.`,
    variables: [
      { key: 'target_branch', label: 'Chi nhánh áp dụng', placeholder: 'Toàn chuỗi Quê Nhà', required: false },
    ],
    example_output: '5 chiến dịch thông minh biến ngày thường thành ngày đông khách.',
  },
];

// Import 53 kỹ năng chuẩn từ repo Corey Haines
import coreySkillsData from '@/data/corey_marketing_skills.json';

const ALL_SKILLS: (SkillItem & { source?: string })[] = [
  ...SEED_SKILLS.map(s => ({ ...s, source: 'QUE_NHA' })),
  ...coreySkillsData.map((s, idx) => ({
    id: 100 + idx,
    category: s.category as any,
    title: s.title,
    description: s.description,
    prompt_template: s.prompt_template,
    variables: s.variables,
    example_output: s.example_output,
    source: 'COREY_HAINES'
  }))
];

const SOURCES = [
  { key: 'ALL', label: 'Tất cả kỹ năng', count: ALL_SKILLS.length },
  { key: 'QUE_NHA', label: 'Thực chiến Quê Nhà F&B', count: SEED_SKILLS.length },
  { key: 'COREY_HAINES', label: 'Playbook Corey Haines (Quốc tế)', count: coreySkillsData.length }
];

export default function MarketingSkillsPage() {
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSkill, setActiveSkill] = useState<(SkillItem & { source?: string }) | null>(null);

  // Form điền biến
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedGenerated, setCopiedGenerated] = useState<boolean>(false);

  // AI Generation State
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');

  // Lấy danh sách Categories động từ các skills hiện có
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    set.add('Tất cả');
    ALL_SKILLS.forEach(s => {
      if (selectedSource === 'ALL' || s.source === selectedSource) {
        set.add(s.category);
      }
    });
    return Array.from(set);
  }, [selectedSource]);

  const filteredSkills = ALL_SKILLS.filter((skill) => {
    const matchSource = selectedSource === 'ALL' || skill.source === selectedSource;
    const matchCategory = selectedCategory === 'Tất cả' || skill.category === selectedCategory;
    const matchSearch =
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSource && matchCategory && matchSearch;
  });

  const openSkillDrawer = (skill: SkillItem) => {
    setActiveSkill(skill);
    setGeneratedOutput('');
    setCopiedPrompt(false);
    setCopiedGenerated(false);

    // Khởi tạo giá trị mặc định cho biến
    const initialVals: Record<string, string> = {};
    skill.variables.forEach((v) => {
      initialVals[v.key] = '';
    });
    setFormValues(initialVals);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // Tạo prompt hoàn chỉnh
  const getCompiledPrompt = () => {
    if (!activeSkill) return '';
    let p = activeSkill.prompt_template;
    activeSkill.variables.forEach((v) => {
      const val = formValues[v.key]?.trim() || `[${v.label}]`;
      p = p.replaceAll(`{${v.key}}`, val);
    });
    return p;
  };

  // Chế độ 1: Copy prompt 1-chạm
  const handleCopyPrompt = () => {
    const text = getCompiledPrompt();
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Chế độ 2: Sinh bài viết trực tiếp với AI API
  const handleGenerateAI = async () => {
    if (!activeSkill) return;
    setGenerating(true);
    setGeneratedOutput('');

    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillTitle: activeSkill.title,
          category: activeSkill.category,
          promptTemplate: activeSkill.prompt_template,
          variables: formValues,
        }),
      });

      const data = await res.json();
      if (data.content) {
        setGeneratedOutput(data.content);
      } else {
        setGeneratedOutput('⚠️ Không thể sinh bài. Vui lòng thử lại sau.');
      }
    } catch {
      setGeneratedOutput('⚠️ Lỗi kết nối mạng hoặc server không phản hồi.');
    } finally {
      setGenerating(false);
    }
  };

  // Copy bài viết sinh ra
  const handleCopyGenerated = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopiedGenerated(true);
    setTimeout(() => setCopiedGenerated(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8B1D24] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#C58940]" />
            <span>Phân hệ Marketing • Module 4 (AI Marketing Skills)</span>
          </div>
          <h1 className="text-2xl font-black text-[#231F20] tracking-tight">
            Kho Kỹ Năng AI Marketing Chuẩn Quốc Tế & Thực Chiến Quê Nhà
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Kết hợp 20 Prompt bản sắc Quê Nhà và 53 Playbook quốc tế từ Corey Haines (CRO, Ad Creative, SEO, Churn...). Điền biến và sinh bài tự động.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-xs font-bold text-[#8B1D24] bg-[#F7EAEB] px-3.5 py-2 rounded-lg border border-[#8B1D24]/20">
            {filteredSkills.length} / {ALL_SKILLS.length} Kỹ Năng
          </div>
        </div>
      </div>

      {/* Tabs Chọn Nguồn Kỹ Năng (Corey Haines vs Quê Nhà) */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-3 overflow-x-auto">
        {SOURCES.map((src) => (
          <button
            key={src.key}
            onClick={() => {
              setSelectedSource(src.key);
              setSelectedCategory('Tất cả');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              selectedSource === src.key
                ? 'bg-[#8B1D24] text-white shadow-xs'
                : 'bg-white text-[#6B5E55] hover:bg-[#F3EFEA] border border-[#E8E2D9]'
            }`}
          >
            <span>{src.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedSource === src.key
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F3EFEA] text-[#8B1D24]'
              }`}
            >
              {src.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tìm Kiếm & Tabs Phân Loại */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9C8E82] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm kỹ năng: ad-creative, copy, cá kho, tất niên, TikTok, SEO, giữ chân khách..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-[#D5C9BC] rounded-xl bg-white focus:outline-none focus:border-[#8B1D24] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#C58940] text-white shadow-xs'
                  : 'bg-white text-[#6B5E55] border border-[#E8E2D9] hover:bg-[#FAF7F2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Danh Sách Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => openSkillDrawer(skill)}
            className="bg-white rounded-xl p-5 border border-[#E8E2D9] hover:border-[#8B1D24] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#8B1D24] bg-[#F7EAEB] px-2 py-0.5 rounded border border-[#8B1D24]/10">
                  {skill.category}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    skill.source === 'COREY_HAINES'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {skill.source === 'COREY_HAINES' ? 'Corey Haines' : 'F&B Quê Nhà'}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#231F20] group-hover:text-[#8B1D24] transition-colors leading-snug">
                {skill.title}
              </h3>
              <p className="text-xs text-[#6B5E55] mt-1.5 line-clamp-2">
                {skill.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F3EFEA] text-[11px] text-[#9C8E82]">
              <span>{skill.variables.length} biến tùy biến</span>
              <span className="font-bold text-[#8B1D24] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Điền & Sử dụng <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DRAWER SỬ DỤNG SKILL (2 CHẾ ĐỘ: COPY PROMPT 1-CHẠM & SINH BÀI GEMINI) */}
      {activeSkill && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#E8E2D9] max-h-[92vh] flex flex-col animate-in fade-in">
            {/* Header Drawer */}
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#8B1D24]">
                  {activeSkill.category}
                </span>
                <h2 className="text-base font-bold text-[#231F20] mt-1">
                  {activeSkill.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveSkill(null)}
                className="text-[#9C8E82] hover:text-[#8B1D24] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              {/* Form Điền Biến */}
              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D9]">
                <div className="text-xs font-bold text-[#8B1D24] uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Điền Thông Số Thực Tế (Tự Động Nạp Vào Prompt):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeSkill.variables.map((v) => (
                    <div key={v.key} className={activeSkill.variables.length % 2 !== 0 && v.key === activeSkill.variables[activeSkill.variables.length - 1].key ? 'sm:col-span-2' : ''}>
                      <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">
                        {v.label} {v.required && <span className="text-[#9B1C1C]">*</span>}
                      </label>
                      <input
                        type="text"
                        placeholder={v.placeholder}
                        value={formValues[v.key] || ''}
                        onChange={(e) => handleInputChange(v.key, e.target.value)}
                        className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#8B1D24]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 2 Chế Độ Thực Thi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Chế độ 1: Copy Prompt */}
                <div className="p-4 rounded-xl border border-[#E8E2D9] bg-white space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#231F20] flex items-center gap-1.5">
                      <Copy className="w-4 h-4 text-[#C58940]" />
                      <span>Chế Độ 1: Copy Dùng Ngoài</span>
                    </div>
                    <p className="text-[11px] text-[#6B5E55] mt-1">
                      Sao chép toàn bộ prompt đã nạp thông số để dán sang ChatGPT/Claude cá nhân.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyPrompt}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                      copiedPrompt
                        ? 'bg-[#2A7238] text-white'
                        : 'bg-[#FDF6EE] hover:bg-[#F5EFE6] text-[#8B1D24] border border-[#C58940]/40'
                    }`}
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã chép Prompt!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt Kèm Ngữ Cảnh</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Chế độ 2: Gọi AI Trực Tiếp */}
                <div className="p-4 rounded-xl border border-[#8B1D24]/20 bg-[#F7EAEB]/30 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#8B1D24] flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#8B1D24]" />
                      <span>Chế Độ 2: Sinh Bài Với Gemini AI</span>
                    </div>
                    <p className="text-[11px] text-[#6B5E55] mt-1">
                      Tự động tạo ngay 3 Hook + Bài nháp + Hashtags trực tiếp trong hệ thống.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateAI}
                    disabled={generating}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-[#8B1D24] text-white hover:bg-[#72161C] transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang sinh nội dung...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sinh Bài Viết Ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Hộp Kết Quả Sinh Bài (Nếu Có) */}
              {generatedOutput && (
                <div className="space-y-2 p-4 rounded-xl bg-white border border-[#2A7238]/30 shadow-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2A7238] flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Kết quả từ AI Engine (Quê Nhà Content):
                    </span>
                    <button
                      onClick={handleCopyGenerated}
                      className="text-xs font-bold text-[#8B1D24] hover:underline flex items-center gap-1"
                    >
                      {copiedGenerated ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2A7238]" />
                          <span className="text-[#2A7238]">Đã chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép kết quả</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed text-[#231F20] max-h-64 overflow-y-auto border border-[#E8E2D9]">
                    {generatedOutput}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-end">
              <button
                onClick={() => setActiveSkill(null)}
                className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
