export interface BranchInfo {
  code: 'QN_PNT' | 'QN_TT' | 'QN_NTB';
  name: string;
  tagline: string;
  address: string;
  district: string;
  hotline: string;
  vipRooms: number;
  maxCapacity: number;
  features: string[];
  description: string;
  bgGradient: string;
  id?: string;
  image?: string;
  highlightTag?: string;
  capacity?: string;
}

export interface SetMenuDishItem {
  name: string;
  image: string;
  category?: string;
  description?: string;
}

export interface SetMenu {
  id: string;
  code: string;
  name: string;
  pricePerTable: number; // VNĐ cho bàn 10 người
  badge?: string;
  description: string;
  dishes: string[];
  dishItems?: SetMenuDishItem[];
  suitableFor: string;
}

export interface DishItem {
  id: string;
  name: string;
  category: 'KHAI_VI' | 'MON_CHINH' | 'HAI_SAN' | 'LAU' | 'TRANG_MIENG';
  price: number;
  description: string;
  badge?: string;
  isSignature?: boolean;
  image?: string;
}

export const BRANCHES_DATA: BranchInfo[] = [
  {
    code: 'QN_PNT',
    id: 'QN_PNT',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Biệt Thự Pháp Cổ - Quận 3',
    capacity: '160 khách (15 VIP)',
    name: 'Chi Nhánh Phạm Ngọc Thạch',
    district: 'Quận 3',
    tagline: 'Biệt Thự Pháp Cổ & Tiệc VIP Ngoại Giao',
    address: '28 Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    hotline: '0938 226 166',
    vipRooms: 15,
    maxCapacity: 160,
    features: [
      '15 Phòng VIP đẳng cấp riêng tư (10 - 45 khách)',
      'Kiến trúc biệt thự Pháp cổ kính sang trọng',
      'Phù hợp tiếp khách cấp cao, ngoại giao, ký kết hợp đồng',
      'Đội ngũ phục vụ chuyên biệt từng phòng',
    ],
    description:
      'Nằm tại vị trí trung tâm Quận 3, Quê Nhà Phạm Ngọc Thạch là biểu tượng của sự sang trọng, riêng tư và tĩnh lặng. Từng căn phòng VIP được bài trí tinh tế, mang lại không gian đối thoại tuyệt vời cho các doanh nhân và đối tác.',
    bgGradient: 'from-amber-950/60 to-emerald-950/80',
  },
  {
    code: 'QN_TT',
    id: 'QN_TT',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Sân Vườn Sinh Thái - Quận 10',
    capacity: '250 khách (18 VIP)',
    name: 'Chi Nhánh Thành Thái',
    district: 'Quận 10',
    tagline: 'Ốc Đảo Sân Vườn Sinh Thái & Sảnh Tiệc 250 Khách',
    address: 'Số 05 Thành Thái, Phường 14, Quận 10, TP.HCM',
    hotline: '0938 226 166',
    vipRooms: 18,
    maxCapacity: 250,
    features: [
      'Không gian sân vườn cây xanh & hồ cảnh quan ngàn mét vuông',
      'Sảnh tiệc công ty lớn sức chứa 250 khách',
      '18 Phòng VIP lầu cao lộng gió',
      'Bãi đỗ xe hơi thoải mái, giao thông thuận tiện',
    ],
    description:
      'Cơ sở Thành Thái mở ra một ốc đảo thiên nhiên rợp bóng mát giữa lòng phố thị. Nơi đây là điểm hẹn số 1 cho các bữa tiệc Tất niên công ty, thôi nôi sinh nhật và họp mặt đại gia đình đông đúc.',
    bgGradient: 'from-emerald-950/70 to-teal-950/80',
  },
  {
    code: 'QN_NTB',
    id: 'QN_NTB',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Cửa Ngõ Sân Bay - Tân Bình',
    capacity: '180 khách (12 VIP)',
    name: 'Chi Nhánh Nguyễn Thái Bình',
    district: 'Tân Bình',
    tagline: 'Cửa Ngõ Sân Bay & Sảnh Hội Nghị Ấm Cúng',
    address: '164 - 166 Nguyễn Thái Bình, Phường 12, Quận Tân Bình, TP.HCM',
    hotline: '0938 226 166',
    vipRooms: 12,
    maxCapacity: 180,
    features: [
      'Cách sân bay quốc tế Tân Sơn Nhất chỉ 5 phút di chuyển',
      '12 Phòng VIP hiện đại cách âm tiêu chuẩn cao',
      'Sảnh hội nghị trang bị máy chiếu, âm thanh chuyên nghiệp',
      'Thuận tiện đón tiếp đoàn khách công tác và kiều bào',
    ],
    description:
      'Tọa lạc ngay cửa ngõ giao thương hàng không, Quê Nhà Nguyễn Thái Bình mang lại sự thuận tiện tối đa cho các bữa tiệc đón rước đối tác, hội thảo tổng kết và liên hoan gia đình ấm áp.',
    bgGradient: 'from-stone-900/80 to-amber-950/70',
  },
];

export const SET_MENUS_DATA: SetMenu[] = [
  {
    id: 'set-cat-tuong',
    code: 'CAT_TUONG',
    name: 'Set Tiệc Cát Tường',
    pricePerTable: 3850000,
    badge: 'ẤM CÚNG',
    description: 'Thực đơn 6 món đậm đà phong vị đồng quê Nam Bộ, thích hợp cho tiệc gia đình và liên hoan phòng ban thân mật.',
    suitableFor: 'Họp mặt gia đình, Bạn bè sum vầy (Bàn 10 người)',
    dishes: [
      'Gỏi tép đồng bông điên điển củ hũ dừa',
      'Chả giò Quê Nhà giòn rụm sốt chua ngọt',
      'Gà ta thả vườn hấp lá chúc An Giang (kèm xôi hạt sen)',
      'Bò tơ nướng tảng than hoa chấm muối kiến vàng',
      'Lẩu riêu cua đồng bắp bò Quê Nhà thanh ngọt',
      'Tráng miệng: Chè hạt sen long nhãn thanh mát',
    ],
    dishItems: [
      {
        name: 'Gỏi tép đồng bông điên điển củ hũ dừa',
        category: 'Khai Vị',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        description: 'Tép đồng tươi ngọt dịu kết hợp bông điên điển mùa lũ và củ hũ dừa giòn sần sật.',
      },
      {
        name: 'Chả giò Quê Nhà giòn rụm sốt chua ngọt',
        category: 'Khai Vị',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
        description: 'Vỏ rế mỏng vàng ruộm giòn tan, nhân tôm thịt cua tươi nêm gia vị gia truyền.',
      },
      {
        name: 'Gà ta thả vườn hấp lá chúc An Giang',
        category: 'Món Chính',
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
        description: 'Gà ta thả vườn thịt săn chắc ngọt lịm, dậy mùi thơm nồng nàn tinh dầu lá chúc Thất Sơn.',
      },
      {
        name: 'Bò tơ nướng tảng than hoa muối kiến vàng',
        category: 'Món Chính',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
        description: 'Bò tơ tươi mềm ngọt nước xèo trên bếp than hồng, chấm muối kiến vàng Krông Pa độc đáo.',
      },
      {
        name: 'Lẩu riêu cua đồng bắp bò Quê Nhà',
        category: 'Lẩu',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
        description: 'Nước dùng cua đồng giã tay 100% thanh ngọt, gạch cua béo ngậy ăn kèm bắp bò hoa.',
      },
      {
        name: 'Tráng miệng: Chè hạt sen long nhãn',
        category: 'Tráng Miệng',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        description: 'Hạt sen Huế bùi bùi bọc trong cùi nhãn ngọt thơm nấu đường phèn thanh khiết.',
      },
    ],
  },
  {
    id: 'set-nhu-y',
    code: 'NHU_Y',
    name: 'Set Tiệc Như Ý',
    pricePerTable: 5250000,
    badge: 'BÁN CHẠY NHẤT 🏆',
    description: 'Quy tụ đầy đủ các món "Tủ" trứ danh của Quê Nhà. Sự kết hợp hoàn hảo giữa Heo mẹt giòn da, Cá lăng và Tôm sú hoàng kim.',
    suitableFor: 'Tiệc Tất niên công ty, Sinh nhật, Thôi nôi (Bàn 10 người)',
    dishes: [
      'Khai vị 3 món: Gỏi bưởi tôm thịt + Đậu hũ khói lửa + Chả đùm lá cách',
      'Heo mẹt 4 món nổ cốm giòn da (Món đặc sản số 1 Quê Nhà)',
      'Cá lăng sông nướng muối ớt rừng Tây Bắc',
      'Tôm sú đại sốt hoàng kim trứng muối béo ngậy',
      'Lẩu cá tầm nấu măng chua lá giang thanh khiết',
      'Tráng miệng: Bánh flan cốt dừa Quê Nhà & Trái cây mùa',
    ],
    dishItems: [
      {
        name: 'Khai vị 3 món: Gỏi bưởi + Đậu hũ + Chả đùm',
        category: 'Khai Vị',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        description: 'Mâm khai vị 3 vị đánh thức vị giác: chua ngọt thanh mát, giòn rụm béo bùi và thơm đượm lá cách.',
      },
      {
        name: 'Heo mẹt 4 món nổ cốm giòn da',
        category: 'Món Chính',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        description: 'Heo sữa quay da nổ cốm giòn tan, dồi sụn nướng than hoa, lòng heo luộc và chả giò Quê Nhà.',
      },
      {
        name: 'Cá lăng sông nướng muối ớt rừng',
        category: 'Hải Sản',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
        description: 'Cá lăng sông tươi chắc thịt béo bùi, ướp muối ớt rừng Tây Bắc nướng than hoa vàng rượm.',
      },
      {
        name: 'Tôm sú đại sốt hoàng kim trứng muối',
        category: 'Hải Sản',
        image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=600&q=80',
        description: 'Tôm sú tươi sống chiên giòn phủ trọn lớp sốt trứng muối béo bùi sánh mịn thơm lừng.',
      },
      {
        name: 'Lẩu cá tầm nấu măng chua lá giang',
        category: 'Lẩu',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        description: 'Cá tầm sụn béo giòn ninh trong nước măng chua giòn và lá giang chua dịu sảng khoái.',
      },
      {
        name: 'Tráng miệng: Bánh flan cốt dừa & Trái cây',
        category: 'Tráng Miệng',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
        description: 'Bánh flan trứng gà ta mềm mượt béo ngậy chan nước cốt dừa nướng cùng mẹt hoa quả thanh nhiệt.',
      },
    ],
  },
  {
    id: 'set-hoang-kim',
    code: 'HOANG_KIM',
    name: 'Set Tiệc Hoàng Kim',
    pricePerTable: 7600000,
    badge: 'CAO CẤP ⭐',
    description: 'Bữa tiệc ẩm thực thượng hạng với nguyên liệu hải sản tinh tuyển và bò nhập khẩu cao cấp, thiết kế cho sự kiện trọng thể.',
    suitableFor: 'Tiệc tri ân đối tác, Tiếp khách doanh nghiệp, Báo hỷ (Bàn 10 người)',
    dishes: [
      'Gỏi sứa biển Nha Trang rong nho tuyết nhĩ',
      'Nem cua bể đất Cảng nướng than hoa',
      'Bò Wagyu nướng xốt tiêu rừng Phú Quốc (kèm khoai tây nghiền)',
      'Mực một nắng Phú Quốc nướng sa tế tôm đậm vị',
      'Cá chình hoa om chuối đậu đất Bắc niêu đất',
      'Lẩu nấm hải sản thượng hạng Quê Nhà',
      'Tráng miệng: Chè yến sào tiềm hạt sen táo đỏ',
    ],
    dishItems: [
      {
        name: 'Gỏi sứa biển Nha Trang rong nho tuyết nhĩ',
        category: 'Khai Vị',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        description: 'Sứa biển tươi giòn sần sật, rong nho mọng nước kết hợp tuyết nhĩ và nước mắm nhĩ chua ngọt.',
      },
      {
        name: 'Nem cua bể đất Cảng nướng than hoa',
        category: 'Khai Vị',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
        description: 'Thịt cua bể tươi béo nạc kết hợp mộc nhĩ nấm hương bọc bánh đa nướng giòn rụm thơm lừng.',
      },
      {
        name: 'Bò Wagyu nướng xốt tiêu rừng Phú Quốc',
        category: 'Món Chính',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        description: 'Bò Wagyu vân mỡ cẩm thạch mềm tan đượm sốt tiêu sọ chín đỏ Phú Quốc, ăn kèm khoai tây nghiền mịn.',
      },
      {
        name: 'Mực một nắng Phú Quốc nướng sa tế tôm',
        category: 'Hải Sản',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
        description: 'Mực ống dày mình phơi đúng một nắng đảo ngọc, nướng xì xèo trên than hồng thơm cay đượm vị.',
      },
      {
        name: 'Cá chình hoa om chuối đậu đất Bắc niêu đất',
        category: 'Món Chính',
        image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
        description: 'Cá chình hoa béo ngậy om chậm cùng chuối xanh, đậu phụ chiên trong niêu đất nung thơm nức mũi.',
      },
      {
        name: 'Lẩu nấm hải sản thượng hạng Quê Nhà',
        category: 'Lẩu',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
        description: 'Nước dùng ninh từ 7 loại nấm rừng quý và hải sản tươi sống ngọt lành thanh lọc cơ thể.',
      },
      {
        name: 'Tráng miệng: Chè yến sào tiềm hạt sen táo đỏ',
        category: 'Tráng Miệng',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        description: 'Tổ yến đảo chưng cách thủy cùng hạt sen Tây Hồ và táo đỏ hữu cơ thanh tao bổ dưỡng.',
      },
    ],
  },
  {
    id: 'set-thuong-uyen',
    code: 'THUONG_UYEN',
    name: 'Set Thượng Uyển VIP',
    pricePerTable: 10500000,
    badge: 'ĐẶC QUYỀN VIP 👑',
    description: 'Thực đơn thiết kế độc bản theo yêu cầu khẩu vị của chủ tiệc. Phục vụ chuyên biệt trong phòng VIP Tổng Thống.',
    suitableFor: 'Tiệc tiếp khách VIP ngoại giao, Yến tiệc doanh nhân (Bàn 10 người)',
    dishes: [
      'Khai vị quý tộc: Bào ngư sốt dầu hào & Salad cá hồi xông khói',
      'Tôm hùm bông nướng phô mai Pháp thượng hạng',
      'Bò Úc đút lò sốt vang đỏ & Nấm Truffle',
      'Cá bơn Hàn Quốc hấp xì dầu gừng non nguyên con',
      'Súp vi cá hải sâm cung đình',
      'Tráng miệng: Yến chưng đường phèn hoa cúc vạn thọ',
    ],
    dishItems: [
      {
        name: 'Khai vị: Bào ngư sốt dầu hào & Salad cá hồi',
        category: 'Khai Vị',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
        description: 'Bào ngư nguyên con hầm mềm mọng nước cùng sốt dầu hào thượng phẩm và salad cá hồi Nauy.',
      },
      {
        name: 'Tôm hùm bông nướng phô mai Pháp',
        category: 'Hải Sản',
        image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=600&q=80',
        description: 'Tôm hùm bông tươi sống Nha Trang phủ lớp phô mai béo thơm nướng vàng óng lừng danh.',
      },
      {
        name: 'Bò Úc đút lò sốt vang đỏ & Nấm Truffle',
        category: 'Món Chính',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        description: 'Thăn bò Úc hảo hạng nướng mọng nước đượm hương thơm tinh tế từ nấm Truffle đen quý hiếm.',
      },
      {
        name: 'Cá bơn Hàn Quốc hấp xì dầu gừng non',
        category: 'Hải Sản',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
        description: 'Cá bơn sống hấp vừa chín tới, giữ nguyên vị ngọt thanh và thớ thịt trắng tinh mịn màng.',
      },
      {
        name: 'Súp vi cá hải sâm cung đình',
        category: 'Món Chính',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
        description: 'Món súp đại bổ hầm chậm từ hải sâm đen và nước cốt sườn non đậm đà bổ dưỡng.',
      },
      {
        name: 'Tráng miệng: Yến chưng đường phèn hoa cúc',
        category: 'Tráng Miệng',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        description: 'Tổ yến sợi dài chưng đường phèn thanh nhẹ kết hợp cánh hoa cúc hữu cơ thanh nhiệt an thần.',
      },
    ],
  },
];

export const DISHES_DATA: DishItem[] = [
  // Khai vị
  {
    id: 'dish-1',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    name: 'Gỏi Tép Đồng Bông Điên Điển',
    category: 'KHAI_VI',
    price: 185000,
    description: 'Vị chua ngọt dịu mát từ tép đồng tươi và bông điên điển mùa nước nổi miền Tây.',
    badge: 'ĐẶC SẢN',
    isSignature: true,
  },
  {
    id: 'dish-2',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    name: 'Chả Giò Quê Nhà Giòn Rụm',
    category: 'KHAI_VI',
    price: 195000,
    description: 'Vỏ rế mỏng giòn tan, nhân tôm thịt cua tươi nêm gia vị gia truyền.',
    badge: 'BÁN CHẠY',
    isSignature: true,
  },
  {
    id: 'dish-3',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    name: 'Đậu Hũ Khói Lửa Quê Nhà',
    category: 'KHAI_VI',
    price: 175000,
    description: 'Đậu hũ non chiên giòn cháy cạnh sốt chà bông cay nóng bốc khói.',
  },
  {
    id: 'dish-4',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    name: 'Gỏi Củ Hũ Dừa Tôm Thịt',
    category: 'KHAI_VI',
    price: 210000,
    description: 'Củ hũ dừa Bến Tre giòn ngọt ăn cùng tôm sú sông luộc nước dừa tươi.',
  },

  // Món chính đặc sản
  {
    id: 'dish-5',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    name: 'Heo Mẹt 4 Món Giòn Da Quê Nhà',
    category: 'MON_CHINH',
    price: 780000,
    description: 'Đặc sản số 1 của quán: Heo quay nổ cốm giòn tan, dồi sụn, chả heo, lòng luộc ăn cùng rau rừng Tây Ninh.',
    badge: 'SIGNATURE 🏆',
    isSignature: true,
  },
  {
    id: 'dish-6',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    name: 'Gà Ta Hấp Lá Chúc An Giang',
    category: 'MON_CHINH',
    price: 495000,
    description: 'Gà ta thả vườn thịt săn chắc ngọt lịm, dậy mùi thơm nồng nàn tinh dầu lá chúc vùng Thất Sơn.',
    badge: 'BÁN CHẠY',
    isSignature: true,
  },
  {
    id: 'dish-7',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    name: 'Bò Tơ Nướng Tảng Muối Kiến Vàng',
    category: 'MON_CHINH',
    price: 460000,
    description: 'Thịt bò tơ Củ Chi tươi mềm nướng than hồng chấm muối kiến vàng Krông Pa đặc sản.',
    badge: 'ĐỘC ĐÁO',
  },
  {
    id: 'dish-8',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80',
    name: 'Giò Heo Chiên Giòn Bánh Bao',
    category: 'MON_CHINH',
    price: 420000,
    description: 'Chân giò rút xương chiên vàng rộm giòn tan ngoài vỏ, mềm thơm bên trong.',
  },

  // Hải sản
  {
    id: 'dish-9',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    name: 'Cá Lăng Nướng Muối Ớt Rừng',
    category: 'HAI_SAN',
    price: 550000,
    description: 'Cá lăng sông thịt chắc ngọt béo bùi, ướp muối ớt rừng xanh nướng than đượm vị.',
    badge: 'BÁN CHẠY',
    isSignature: true,
  },
  {
    id: 'dish-10',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=600&q=80',
    name: 'Tôm Sú Hoàng Kim Sốt Trứng Muối',
    category: 'HAI_SAN',
    price: 480000,
    description: 'Tôm sú tươi sống chiên giòn phủ lớp sốt trứng muối béo ngậy thơm lừng.',
    badge: 'VIP',
  },
  {
    id: 'dish-11',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    name: 'Mực Một Nắng Nướng Sa Tế',
    category: 'HAI_SAN',
    price: 420000,
    description: 'Mực dày mình ngọt đậm vị từ đảo Phú Quốc nướng xì xèo trên bếp than.',
  },
  {
    id: 'dish-12',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
    name: 'Cá Chình Nướng Nghệ Giềng',
    category: 'HAI_SAN',
    price: 680000,
    description: 'Cá chình béo ngậy ướp nghệ vàng và mắm tôm nướng thơm nức mũi.',
  },

  // Lẩu truyền thống
  {
    id: 'dish-13',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    name: 'Lẩu Riêu Cua Bắp Bò Quê Nhà',
    category: 'LAU',
    price: 520000,
    description: 'Nước lẩu cua đồng giã tay 100% thanh mát, ăn kèm bắp bò hoa và rau rừng tươi non.',
    badge: 'BÁN CHẠY 🍲',
    isSignature: true,
  },
  {
    id: 'dish-14',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    name: 'Lẩu Cá Tầm Măng Chua Lá Giang',
    category: 'LAU',
    price: 650000,
    description: 'Cá tầm sụn béo giòn nấu cùng măng chua tự nhiên và lá giang chua thanh bắt vị.',
    badge: 'CAO CẤP',
  },
  {
    id: 'dish-15',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    name: 'Lẩu Gà Ta Nấu Nấm Rừng',
    category: 'LAU',
    price: 490000,
    description: 'Gà ta hầm cùng 5 loại nấm rừng tự nhiên bồi bổ sinh lực.',
  },

  // Tráng miệng
  {
    id: 'dish-16',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    name: 'Chè Hạt Sen Long Nhãn',
    category: 'TRANG_MIENG',
    price: 45000,
    description: 'Hạt sen Huế bùi bùi bọc trong cùi nhãn ngọt thơm nấu đường phèn thanh khiết.',
  },
  {
    id: 'dish-17',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    name: 'Bánh Flan Cốt Dừa Quê Nhà',
    category: 'TRANG_MIENG',
    price: 40000,
    description: 'Flan trứng gà ta mịn màng chan nước cốt dừa béo ngậy và cà phê thơm đắng.',
  },
  {
    id: 'dish-18',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    name: 'Trái Cây Tươi Thập Cẩm Theo Mùa',
    category: 'TRANG_MIENG',
    price: 180000,
    description: 'Mẹt dưa lưới, bưởi da xanh, xoài cát, nho móng tay ướp lạnh giòn ngọt.',
  },
];

export interface SpacePhoto {
  id: string;
  title: string;
  type: 'VIP' | 'SAN_VUON' | 'SANH_TIEC' | 'BAN_TIEC';
  typeLabel: string;
  capacity: string;
  features: string[];
  description: string;
  image: string;
}

export interface BranchSpaceAlbum {
  branchCode: 'QN_PNT' | 'QN_TT' | 'QN_NTB';
  branchName: string;
  district: string;
  tagline: string;
  totalVip: number;
  totalCapacity: string;
  photos: SpacePhoto[];
}

export const BRANCH_SPACES_DATA: BranchSpaceAlbum[] = [
  {
    branchCode: 'QN_PNT',
    branchName: 'Chi Nhánh Phạm Ngọc Thạch',
    district: 'Quận 3',
    tagline: 'Biệt Thự Pháp Cổ & 15 Phòng VIP Đẳng Cấp',
    totalVip: 15,
    totalCapacity: '160 khách',
    photos: [
      {
        id: 'pnt-1',
        title: 'Phòng VIP Ngoại Giao Tổng Thống',
        type: 'VIP',
        typeLabel: 'Phòng VIP Đẳng Cấp',
        capacity: '30 - 45 khách',
        features: ['Máy lạnh công suất lớn', 'Bàn tròn xoay tự động', 'Âm thanh biểu diễn', 'Kệ vang cao cấp'],
        description: 'Kiến trúc biệt thự Pháp cổ điển trang trọng, cách âm tuyệt đối, dành riêng cho các buổi tiếp đãi ngoại giao và ký kết hợp đồng thương mại quan trọng.',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'pnt-2',
        title: 'Phòng VIP Biệt Thự Gỗ Trầm Cổ Điển',
        type: 'VIP',
        typeLabel: 'Phòng VIP Thân Mật',
        capacity: '15 - 25 khách',
        features: ['Nội thất gỗ tự nhiên', 'Hoa tươi nghệ thuật', 'Đội ngũ phục vụ chuyên biệt'],
        description: 'Gam màu gỗ trầm ấm cúng kết hợp tranh nghệ thuật ba miền mang lại cảm giác thân thuộc, tĩnh lặng cho những cuộc gặp gỡ thân tình.',
        image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'pnt-3',
        title: 'Phòng VIP Gia Đình Sum Vầy',
        type: 'VIP',
        typeLabel: 'Phòng VIP Gia Đình',
        capacity: '10 - 16 khách',
        features: ['Không gian kín đáo', 'Ghế đệm êm ái', 'Bàn xoay thông minh'],
        description: 'Không gian ấm áp dành riêng cho các dịp kỷ niệm ngày cưới, sinh nhật ông bà và họp mặt đại gia đình ngày cuối tuần.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'pnt-4',
        title: 'Sảnh Trệt Biệt Thự Pháp Hoài Niệm',
        type: 'SANH_TIEC',
        typeLabel: 'Sảnh Tiệc Ấm Cúng',
        capacity: '40 - 60 khách',
        features: ['Cửa vòm kiến trúc Pháp', 'Ánh sáng vàng dịu', 'Bàn tiệc dài linh hoạt'],
        description: 'Kiến trúc thuộc địa Pháp giao thoa với nét mộc đồng quê Việt Nam, không gian mở thoáng đãng nhìn ra rặng tre xanh mát.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'pnt-5',
        title: 'Khu Bàn Tiệc Hội Ngộ Bạn Bè',
        type: 'BAN_TIEC',
        typeLabel: 'Khu Bàn Tiệc',
        capacity: '8 - 20 khách',
        features: ['Bàn gỗ tự nhiên', 'Không gian thoáng mát', 'Phục vụ nhanh chóng'],
        description: 'Điểm hẹn lý tưởng cho những bữa cơm trưa cùng đồng nghiệp hay buổi tối nâng ly chúc mừng rôm rả.',
        image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    branchCode: 'QN_TT',
    branchName: 'Chi Nhánh Thành Thái',
    district: 'Quận 10',
    tagline: 'Ốc Đảo Sinh Thái Sân Vườn & Sảnh Tiệc 250 Khách',
    totalVip: 18,
    totalCapacity: '250 khách',
    photos: [
      {
        id: 'tt-1',
        title: 'Đại Sảnh Tiệc Sân Vườn Sinh Thái',
        type: 'SANH_TIEC',
        typeLabel: 'Sảnh Tiệc Quy Mô Lớn',
        capacity: '150 - 250 khách',
        features: ['Sân khấu lớn có màn hình LED', 'Dàn âm thanh biểu diễn', 'Không gian cây xanh rợp bóng', 'Bãi đỗ ô tô rộng'],
        description: 'Ốc đảo sinh thái ngàn mét vuông rợp bóng mát, lý tưởng cho các buổi tiệc Tất niên công ty, hội nghị khách hàng và đại tiệc báo hỷ.',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'tt-2',
        title: 'Khu Sân Vườn Thác Nước & Hồ Cảnh Quan',
        type: 'SAN_VUON',
        typeLabel: 'Sân Vườn Sinh Thái',
        capacity: '60 - 100 khách',
        features: ['Hồ cảnh quan mát rượi', 'Gió trời tự nhiên', 'Rợp bóng cây xanh'],
        description: 'Hòa mình vào thiên nhiên trong lành giữa lòng phố thị Sài Gòn, tận hưởng không khí miệt vườn sông nước sảng khoái.',
        image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'tt-3',
        title: 'Phòng VIP Lầu Cao View Trọn Sân Vườn',
        type: 'VIP',
        typeLabel: 'Phòng VIP Lầu Cao',
        capacity: '20 - 35 khách',
        features: ['Cửa kính panorama view vườn', 'Máy lạnh mát rượi', 'Cách âm tiêu chuẩn cao'],
        description: 'Tận hưởng trọn vẹn cảnh sắc xanh tươi từ trên cao trong không gian máy lạnh mát lành và riêng tư tuyệt đối.',
        image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'tt-4',
        title: 'Dãy Bàn Tiệc Sinh Thái Ngoài Trời',
        type: 'BAN_TIEC',
        typeLabel: 'Khu Bàn Ngoài Trời',
        capacity: '10 - 30 khách',
        features: ['Mái che linh hoạt', 'Gió trời thoáng đãng', 'Đèn lồng ấm cúng'],
        description: 'Bàn dài kết hợp linh hoạt cho các bữa tiệc liên hoan phòng ban, họp mặt bạn bè vừa nhâm nhi đặc sản vừa chuyện trò thoải mái.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'tt-5',
        title: 'Phòng Tiệc Thôi Nôi & Sinh Nhật Gia Đình',
        type: 'VIP',
        typeLabel: 'Phòng Tiệc Chủ Đề',
        capacity: '25 - 45 khách',
        features: ['Backdrop trang trí hoa/bóng', 'Dàn karaoke gia đình', 'Bàn tròn ấm cúng'],
        description: 'Nơi lưu giữ những khoảnh khắc đáng nhớ của gia đình trong các dịp thôi nôi, sinh nhật, mừng thọ với đội ngũ trang trí tận tâm.',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    branchCode: 'QN_NTB',
    branchName: 'Chi Nhánh Nguyễn Thái Bình',
    district: 'Tân Bình',
    tagline: 'Cửa Ngõ Sân Bay & 12 Phòng VIP Hiện Đại',
    totalVip: 12,
    totalCapacity: '180 khách',
    photos: [
      {
        id: 'ntb-1',
        title: 'Sảnh Hội Nghị & Tiệc Đón Tiếp Đối Tác',
        type: 'SANH_TIEC',
        typeLabel: 'Sảnh Hội Nghị Đa Năng',
        capacity: '80 - 140 khách',
        features: ['Màn chiếu máy chiếu sắc nét', 'Dàn âm thanh biểu diễn', 'Gần sân bay Tân Sơn Nhất'],
        description: 'Vị trí chiến lược ngay cửa ngõ sân bay, cực kỳ thuận tiện đón tiếp các phái đoàn doanh nghiệp, đối tác tỉnh xa và tổ chức tiệc hội nghị tổng kết.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'ntb-2',
        title: 'Phòng VIP Doanh Nhân Hiện Đại',
        type: 'VIP',
        typeLabel: 'Phòng VIP Hiện Đại',
        capacity: '15 - 25 khách',
        features: ['Nội thất sang trọng', 'Bàn tiệc gỗ cao cấp', 'Cách âm tiêu chuẩn'],
        description: 'Thiết kế tinh gọn, trang nhã, tạo không khí tin cậy và chuyên nghiệp cho các cuộc đàm phán thương mại quan trọng.',
        image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'ntb-3',
        title: 'Phòng VIP Bàn Tròn Thân Mật',
        type: 'VIP',
        typeLabel: 'Phòng VIP Gia Đình',
        capacity: '10 - 15 khách',
        features: ['Bàn xoay thông minh', 'Ánh sáng vàng ấm', 'Máy lạnh riêng biệt'],
        description: 'Không gian tĩnh lặng, tách biệt khỏi sự nhộn nhịp của đường phố, mang đến bữa tiệc sum vầy thân mật cho người thân.',
        image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'ntb-4',
        title: 'Khu Bàn Tiệc Trung Tâm Ấm Áp',
        type: 'BAN_TIEC',
        typeLabel: 'Khu Bàn Sảnh Trung Tâm',
        capacity: '30 - 50 khách',
        features: ['Bàn ghế bố trí linh hoạt', 'Phục vụ nhanh chóng', 'Không gian thoáng mát'],
        description: 'Thích hợp cho tiệc liên hoan công ty năng động, các buổi họp mặt bạn bè phương xa hạ cánh sân bay ghé quán ăn bữa cơm quê đậm đà.',
        image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
];
