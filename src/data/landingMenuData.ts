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
}

export interface SetMenu {
  id: string;
  code: string;
  name: string;
  pricePerTable: number; // VNĐ cho bàn 10 người
  badge?: string;
  description: string;
  dishes: string[];
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
}

export const BRANCHES_DATA: BranchInfo[] = [
  {
    code: 'QN_PNT',
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
  },
];

export const DISHES_DATA: DishItem[] = [
  // Khai vị
  {
    id: 'dish-1',
    name: 'Gỏi Tép Đồng Bông Điên Điển',
    category: 'KHAI_VI',
    price: 185000,
    description: 'Vị chua ngọt dịu mát từ tép đồng tươi và bông điên điển mùa nước nổi miền Tây.',
    badge: 'ĐẶC SẢN',
    isSignature: true,
  },
  {
    id: 'dish-2',
    name: 'Chả Giò Quê Nhà Giòn Rụm',
    category: 'KHAI_VI',
    price: 195000,
    description: 'Vỏ rế mỏng giòn tan, nhân tôm thịt cua tươi nêm gia vị gia truyền.',
    badge: 'BÁN CHẠY',
    isSignature: true,
  },
  {
    id: 'dish-3',
    name: 'Đậu Hũ Khói Lửa Quê Nhà',
    category: 'KHAI_VI',
    price: 175000,
    description: 'Đậu hũ non chiên giòn cháy cạnh sốt chà bông cay nóng bốc khói.',
  },
  {
    id: 'dish-4',
    name: 'Gỏi Củ Hũ Dừa Tôm Thịt',
    category: 'KHAI_VI',
    price: 210000,
    description: 'Củ hũ dừa Bến Tre giòn ngọt ăn cùng tôm sú sông luộc nước dừa tươi.',
  },

  // Món chính đặc sản
  {
    id: 'dish-5',
    name: 'Heo Mẹt 4 Món Giòn Da Quê Nhà',
    category: 'MON_CHINH',
    price: 780000,
    description: 'Đặc sản số 1 của quán: Heo quay nổ cốm giòn tan, dồi sụn, chả heo, lòng luộc ăn cùng rau rừng Tây Ninh.',
    badge: 'SIGNATURE 🏆',
    isSignature: true,
  },
  {
    id: 'dish-6',
    name: 'Gà Ta Hấp Lá Chúc An Giang',
    category: 'MON_CHINH',
    price: 495000,
    description: 'Gà ta thả vườn thịt săn chắc ngọt lịm, dậy mùi thơm nồng nàn tinh dầu lá chúc vùng Thất Sơn.',
    badge: 'BÁN CHẠY',
    isSignature: true,
  },
  {
    id: 'dish-7',
    name: 'Bò Tơ Nướng Tảng Muối Kiến Vàng',
    category: 'MON_CHINH',
    price: 460000,
    description: 'Thịt bò tơ Củ Chi tươi mềm nướng than hồng chấm muối kiến vàng Krông Pa đặc sản.',
    badge: 'ĐỘC ĐÁO',
  },
  {
    id: 'dish-8',
    name: 'Giò Heo Chiên Giòn Bánh Bao',
    category: 'MON_CHINH',
    price: 420000,
    description: 'Chân giò rút xương chiên vàng rộm giòn tan ngoài vỏ, mềm thơm bên trong.',
  },

  // Hải sản
  {
    id: 'dish-9',
    name: 'Cá Lăng Nướng Muối Ớt Rừng',
    category: 'HAI_SAN',
    price: 550000,
    description: 'Cá lăng sông thịt chắc ngọt béo bùi, ướp muối ớt rừng xanh nướng than đượm vị.',
    badge: 'BÁN CHẠY',
    isSignature: true,
  },
  {
    id: 'dish-10',
    name: 'Tôm Sú Hoàng Kim Sốt Trứng Muối',
    category: 'HAI_SAN',
    price: 480000,
    description: 'Tôm sú tươi sống chiên giòn phủ lớp sốt trứng muối béo ngậy thơm lừng.',
    badge: 'VIP',
  },
  {
    id: 'dish-11',
    name: 'Mực Một Nắng Nướng Sa Tế',
    category: 'HAI_SAN',
    price: 420000,
    description: 'Mực dày mình ngọt đậm vị từ đảo Phú Quốc nướng xì xèo trên bếp than.',
  },
  {
    id: 'dish-12',
    name: 'Cá Chình Nướng Nghệ Giềng',
    category: 'HAI_SAN',
    price: 680000,
    description: 'Cá chình béo ngậy ướp nghệ vàng và mắm tôm nướng thơm nức mũi.',
  },

  // Lẩu truyền thống
  {
    id: 'dish-13',
    name: 'Lẩu Riêu Cua Bắp Bò Quê Nhà',
    category: 'LAU',
    price: 520000,
    description: 'Nước lẩu cua đồng giã tay 100% thanh mát, ăn kèm bắp bò hoa và rau rừng tươi non.',
    badge: 'BÁN CHẠY 🍲',
    isSignature: true,
  },
  {
    id: 'dish-14',
    name: 'Lẩu Cá Tầm Măng Chua Lá Giang',
    category: 'LAU',
    price: 650000,
    description: 'Cá tầm sụn béo giòn nấu cùng măng chua tự nhiên và lá giang chua thanh bắt vị.',
    badge: 'CAO CẤP',
  },
  {
    id: 'dish-15',
    name: 'Lẩu Gà Ta Nấu Nấm Rừng',
    category: 'LAU',
    price: 490000,
    description: 'Gà ta hầm cùng 5 loại nấm rừng tự nhiên bồi bổ sinh lực.',
  },

  // Tráng miệng
  {
    id: 'dish-16',
    name: 'Chè Hạt Sen Long Nhãn',
    category: 'TRANG_MIENG',
    price: 45000,
    description: 'Hạt sen Huế bùi bùi bọc trong cùi nhãn ngọt thơm nấu đường phèn thanh khiết.',
  },
  {
    id: 'dish-17',
    name: 'Bánh Flan Cốt Dừa Quê Nhà',
    category: 'TRANG_MIENG',
    price: 40000,
    description: 'Flan trứng gà ta mịn màng chan nước cốt dừa béo ngậy và cà phê thơm đắng.',
  },
  {
    id: 'dish-18',
    name: 'Trái Cây Tươi Thập Cẩm Theo Mùa',
    category: 'TRANG_MIENG',
    price: 180000,
    description: 'Mẹt dưa lưới, bưởi da xanh, xoài cát, nho móng tay ướp lạnh giòn ngọt.',
  },
];
