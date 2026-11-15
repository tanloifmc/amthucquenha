'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Check,
  Send,
  MessageSquare,
  UtensilsCrossed,
  ShieldCheck,
  Building2,
  X,
  ExternalLink,
  Flame,
  Award,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Layers,
  ChefHat,
  Heart,
  Eye,
  Info,
  Camera,
  Images,
  Star,
} from 'lucide-react';
import {
  BRANCHES_DATA,
  SET_MENUS_DATA,
  DISHES_DATA,
  BRANCH_SPACES_DATA,
  BranchInfo,
  SetMenu,
  DishItem,
  SpacePhoto,
  BranchSpaceAlbum,
} from '@/data/landingMenuData';
import { Spotlight } from '@/components/ui/spotlight';
import { MovingBorderButton } from '@/components/ui/moving-border';
import { MarqueeRibbon } from '@/components/ui/marquee-ribbon';

// 3 SLIDE HERO ĐẶC SẮC QUÊ NHÀ
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Thành Lập Từ 2010 • Tinh Hoa Ẩm Thực Ba Miền',
    title: 'Gìn Giữ Tinh Hoa',
    highlight: 'Ẩm Thực Ba Miền',
    desc: 'Thành lập từ năm 2010, với hơn 15 năm uy tín phụng sự thực khách Sài Thành, Quê Nhà là điểm hẹn hoàn mỹ cho những buổi tiếp đón ngoại giao trang trọng, tiệc tất niên doanh nghiệp hoành tráng và sum vầy gia đình.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    badge: '15 Phòng VIP Biệt Thự Quận 3',
    dishHighlight: 'Heo Mẹt 4 Món Giòn Da & Rượu Vang',
    stats: [
      { label: 'Năm Thành Lập', value: '2010' },
      { label: 'Chi Nhánh Trung Tâm', value: '3' },
      { label: 'Phòng VIP Riêng Tư', value: '45+' },
      { label: 'Bàn Tiệc Đã Phục Vụ', value: '50K+' },
    ],
  },
  {
    id: 2,
    tag: 'Ốc Đảo Sinh Thái Sài Gòn',
    title: 'Không Gian Sân Vườn',
    highlight: 'Sảnh Tiệc 250 Khách',
    desc: 'Ốc đảo cây xanh ngàn mét vuông tại Chi nhánh Thành Thái Quận 10. Không gian sân vườn thoáng mát lý tưởng cho tiệc liên hoan công ty, ngày hội gia đình và tiệc báo hỷ.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    badge: 'Sức Chứa 250 Khách - Bãi Đậu Xe Thoải Mái',
    dishHighlight: 'Cá Lăng Nướng Than Rừng & Lẩu Cua',
    stats: [
      { label: 'Khuôn Viên Xanh', value: '1.200m²' },
      { label: 'Sức Chứa Tối Đa', value: '250 Khách' },
      { label: 'Phòng VIP Lầu Cao', value: '18 VIP' },
      { label: 'Bãi Đỗ Xe Ô Tô', value: '100% Free' },
    ],
  },
  {
    id: 3,
    tag: 'Mỹ Vị Đồng Quê Độc Bản',
    title: 'Bếp Trưởng 20 Năm',
    highlight: 'Tuyển Chọn Mỗi Sớm',
    desc: 'Từng con cá lăng sông, tép đồng mùa nước nổi, bò tơ Củ Chi đều được tinh tuyển trong ngày, gìn giữ trọn vẹn gia vị truyền thống và phong vị mộc mạc Nam Bộ.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    badge: 'Bếp Trưởng Kỳ Cựu 20+ Năm Kinh Nghiệm',
    dishHighlight: 'Gà Ta Hấp Lá Chúc & Bò Tơ Nướng Tảng',
    stats: [
      { label: 'Món Ăn Tinh Tuyển', value: '300+' },
      { label: 'Nguyên Liệu Tươi Sống', value: '100%' },
      { label: 'Bếp Trưởng Kỳ Cựu', value: '20+ Năm' },
      { label: 'Đánh Giá Hài Lòng', value: '99.8%' },
    ],
  },
];

const DISH_CATEGORIES = [
  { id: 'ALL', label: 'Tất Cả Món (18)', tag: 'Toàn Bộ Thực Đơn' },
  { id: 'KHAI_VI', label: 'Khai Vị Thanh Nhã', tag: 'Khai Vị Mở Màn' },
  { id: 'MON_CHINH', label: 'Món Chính Đặc Sản', tag: 'Đặc Sản Quê Nhà' },
  { id: 'HAI_SAN', label: 'Hải Sản Tươi Sống', tag: 'Hải Sản Biển & Sông' },
  { id: 'LAU', label: 'Lẩu Trứ Danh', tag: 'Lẩu Nước Ngọt Lành' },
  { id: 'TRANG_MIENG', label: 'Tráng Miệng Ngọt Ngào', tag: 'Món Tráng Miệng' },
];

export default function LandingBanquetPage() {
  // Trạng thái chọn chi nhánh & menu
  const [selectedBranch, setSelectedBranch] = useState<string>('QN_TT');
  const [menuMode, setMenuMode] = useState<'SET' | 'CUSTOM' | 'NONE'>('SET');
  const [selectedSetMenu, setSelectedSetMenu] = useState<SetMenu | null>(SET_MENUS_DATA[1]); // Default: Set Như Ý
  const [selectedDishes, setSelectedDishes] = useState<DishItem[]>([]);

  // Trạng thái Hero Slider 3 slides
  const [heroSlide, setHeroSlide] = useState(0);

  // Tự động chuyển slide Hero sau mỗi 6 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);

  const [allSetMenus, setAllSetMenus] = useState<SetMenu[]>(SET_MENUS_DATA);
  const [allDishes, setAllDishes] = useState<DishItem[]>(DISHES_DATA);

  // Đọc danh mục món ăn & set menu tùy biến từ Admin (nếu có)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSets = localStorage.getItem('quenha_custom_set_menus');
        if (storedSets) {
          const parsed = JSON.parse(storedSets);
          if (Array.isArray(parsed) && parsed.length > 0) setAllSetMenus(parsed);
        }
      } catch {}

      try {
        const storedDishes = localStorage.getItem('quenha_custom_dishes');
        if (storedDishes) {
          const parsed = JSON.parse(storedDishes);
          if (Array.isArray(parsed) && parsed.length > 0) setAllDishes(parsed);
        }
      } catch {}
    }
  }, []);

  // Trạng thái Thực đơn Tự chọn Spotlight
  const [activeCategory, setActiveCategory] = useState<string>('MON_CHINH');
  const [activeDishId, setActiveDishId] = useState<string>('dish-5'); // Default: Heo mẹt 4 món

  // Lọc món theo category
  const filteredDishes = useMemo(() => {
    if (activeCategory === 'ALL') return allDishes;
    return allDishes.filter((d) => d.category === activeCategory);
  }, [activeCategory, allDishes]);

  // Món ăn đang hiển thị ở tâm điểm
  const currentDish = useMemo(() => {
    return filteredDishes.find((d) => d.id === activeDishId) || filteredDishes[0] || allDishes[0];
  }, [filteredDishes, activeDishId, allDishes]);

  const currentDishIndex = filteredDishes.findIndex((d) => d.id === currentDish.id);

  const handleNextDish = () => {
    const nextIdx = (currentDishIndex + 1) % filteredDishes.length;
    setActiveDishId(filteredDishes[nextIdx].id);
  };

  const handlePrevDish = () => {
    const prevIdx = (currentDishIndex - 1 + filteredDishes.length) % filteredDishes.length;
    setActiveDishId(filteredDishes[prevIdx].id);
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const list = catId === 'ALL' ? allDishes : allDishes.filter((d) => d.category === catId);
    if (list.length > 0) {
      setActiveDishId(list[0].id);
    }
  };

  // Trạng thái Album Không Gian Quê Nhà (theo chi nhánh & lật ảnh, liên thông quản trị Tổng Quản Lý)
  const [spaceAlbums, setSpaceAlbums] = useState<BranchSpaceAlbum[]>(BRANCH_SPACES_DATA);
  const [activeSpaceBranch, setActiveSpaceBranch] = useState<'QN_PNT' | 'QN_TT' | 'QN_NTB'>('QN_PNT');
  const [activeSpacePhotoIndex, setActiveSpacePhotoIndex] = useState<number>(0);

  // Đọc dữ liệu Album mới nhất nếu Tổng Quản Lý đã cập nhật từ giao diện quản trị nội bộ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('quenha_space_albums');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSpaceAlbums(parsed);
          }
        }
      } catch {}
    }
  }, []);

  const currentSpaceAlbum = useMemo(() => {
    return spaceAlbums.find((a) => a.branchCode === activeSpaceBranch) || spaceAlbums[0];
  }, [spaceAlbums, activeSpaceBranch]);

  const currentSpacePhoto = useMemo(() => {
    return currentSpaceAlbum.photos[activeSpacePhotoIndex] || currentSpaceAlbum.photos[0];
  }, [currentSpaceAlbum, activeSpacePhotoIndex]);

  const handleSelectSpaceBranch = (code: 'QN_PNT' | 'QN_TT' | 'QN_NTB') => {
    setActiveSpaceBranch(code);
    setActiveSpacePhotoIndex(0);
  };

  const prevSpacePhoto = () => {
    setActiveSpacePhotoIndex((prev) => (prev - 1 + currentSpaceAlbum.photos.length) % currentSpaceAlbum.photos.length);
  };

  const nextSpacePhoto = () => {
    setActiveSpacePhotoIndex((prev) => (prev + 1) % currentSpaceAlbum.photos.length);
  };

  const handleBookAtSpace = (space: SpacePhoto) => {
    setSelectedBranch(activeSpaceBranch);
    setAreaPreference(
      space.type === 'VIP'
        ? 'Phòng VIP Máy Lạnh Riêng Tư'
        : space.type === 'SAN_VUON'
        ? 'Sân Vườn Thoáng Mát Sinh Thái'
        : 'Sảnh Tiệc Lớn Có Âm Thanh/Sân Khấu'
    );
    setSpecialRequests(`Yêu cầu giữ góc không gian: ${space.title} (${space.capacity})`);
    const el = document.getElementById('booking-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Trạng thái Phiếu Nhận Tiệc
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState<'LUNCH' | 'DINNER'>('DINNER');
  const [guestCount, setGuestCount] = useState<number>(20);
  const [eventType, setEventType] = useState('Tiệc Tất Niên Công Ty');
  const [areaPreference, setAreaPreference] = useState('Phòng VIP Máy Lạnh');
  const [specialRequests, setSpecialRequests] = useState('');

  // Trạng thái gửi form & phản hồi
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [submitError, setSubmitError] = useState('');

  // Trạng thái Trợ lý Tư Vấn Tiệc
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        'Kính chào quý thực khách! Em là Chuyên Viên Tư Vấn Tiệc của Ẩm Thực Quê Nhà. Em rất hân hạnh được hỗ trợ quý khách chọn món đặc sản, thiết kế thực đơn theo ngân sách và chuẩn bị phòng tiệc chu đáo nhất cho đoàn mình ạ!',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Trạng thái nút Back to Top
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowBackToTop(window.scrollY > 300);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Tính toán số bàn & tổng dự toán
  const estimatedTables = Math.max(1, Math.ceil(guestCount / 10));

  const customDishTotalPerTable = selectedDishes.reduce((sum, d) => sum + d.price, 0);
  const estimatedCostPerTable =
    menuMode === 'SET' && selectedSetMenu
      ? selectedSetMenu.pricePerTable
      : menuMode === 'CUSTOM'
      ? customDishTotalPerTable
      : 0;
  const totalEstimatedBanquet = estimatedCostPerTable * estimatedTables;

  // Xử lý thêm/bớt món tự chọn
  const toggleSelectDish = (dish: DishItem) => {
    if (selectedDishes.some((d) => d.id === dish.id)) {
      setSelectedDishes(selectedDishes.filter((d) => d.id !== dish.id));
    } else {
      setSelectedDishes([...selectedDishes, dish]);
    }
  };

  // Áp dụng Set Menu vào form
  const handleApplySetMenu = (set: SetMenu) => {
    setSelectedSetMenu(set);
    setMenuMode('SET');
    const el = document.getElementById('booking-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Áp dụng Khay món tự chọn vào form
  const handleApplyCustomMenu = () => {
    if (selectedDishes.length === 0) {
      alert('Quý khách vui lòng chọn ít nhất 1 món vào Set Menu tự chọn trước ạ!');
      return;
    }
    setMenuMode('CUSTOM');
    const el = document.getElementById('booking-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Hủy/Xóa thực đơn đã chọn (để đặt bàn trước, chọn món tại chỗ)
  const handleRemoveMenu = () => {
    setMenuMode('NONE');
    setSelectedSetMenu(null);
    setSelectedDishes([]);
  };

  // Xử lý gửi Phiếu Nhận Tiệc
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setSubmitError('Vui lòng điền Họ tên và Số điện thoại để Quê Nhà liên hệ xác nhận.');
      return;
    }

    setIsSubmitting(true);

    const branchObj = BRANCHES_DATA.find((b) => b.code === selectedBranch);

    let menuDescription = 'Đặt bàn trước, chọn món trực tiếp tại nhà hàng';
    if (menuMode === 'SET' && selectedSetMenu) {
      menuDescription = `Set Menu: ${selectedSetMenu.name} (${new Intl.NumberFormat('vi-VN').format(selectedSetMenu.pricePerTable)}đ/bàn)`;
    } else if (menuMode === 'CUSTOM' && selectedDishes.length > 0) {
      menuDescription = `Tự chọn ${selectedDishes.length} món: ${selectedDishes.map((d) => d.name).join(', ')}`;
    }

    try {
      const payload = {
        customerName,
        customerPhone,
        branchCode: selectedBranch,
        branchName: branchObj?.name || 'Quê Nhà',
        bookingDate: bookingDate || new Date().toISOString().split('T')[0],
        timeSlot,
        guestCount: Number(guestCount),
        tableCount: estimatedTables,
        eventType,
        areaPreference,
        menuType: menuMode,
        setMenuId: selectedSetMenu?.id,
        setMenuName: menuDescription,
        menuNotes: menuDescription,
        selectedDishes: selectedDishes.map((d) => ({ id: d.id, name: d.name, price: d.price })),
        specialRequests,
        estimatedCost: totalEstimatedBanquet,
        estimatedAmount: totalEstimatedBanquet,
      };

      const res = await fetch('/api/bookings/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gửi phiếu đặt tiệc thất bại');

      if (typeof window !== 'undefined') {
        try {
          const newRecord = {
            id: data.bookingId || `BK-${Date.now()}`,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_code: data.customerCode || `KH-${customerPhone.slice(-6)}`,
            branch_id: selectedBranch === 'QN_TT' ? 2 : selectedBranch === 'QN_NTB' ? 3 : 1,
            branch_name: branchObj?.name || 'Quê Nhà - Phạm Ngọc Thạch',
            event_type: eventType || 'TIEC_THAN_MAT',
            event_type_label: eventType || 'Tiệc Đặt Online',
            booking_date: bookingDate || new Date().toISOString().split('T')[0],
            time_slot: timeSlot,
            guest_count: Number(guestCount),
            room_name: 'Chưa gán phòng (Chờ Quê Nhà duyệt)',
            table_room_id: 0,
            estimated_budget: totalEstimatedBanquet,
            total_deposited: 0,
            stage: 'NEW',
            sales_rep_name: 'Khách Đặt Landing Page',
            special_requests: `Khu vực: ${areaPreference}. ${menuDescription ? `Thực đơn: ${menuDescription}. ` : ''}${specialRequests ? `Yêu cầu: ${specialRequests}` : ''}`,
            created_at: new Date().toISOString().split('T')[0],
          };
          const old = localStorage.getItem('quenha_crm_bookings');
          const list = old ? JSON.parse(old) : [];
          localStorage.setItem('quenha_crm_bookings', JSON.stringify([newRecord, ...list]));
        } catch (e) {}
      }

      setSubmitSuccess(data);
    } catch (err: any) {
      setSubmitError(err.message || 'Không thể kết nối máy chủ. Quý khách vui lòng gọi hotline 0938 226 166.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gửi tin nhắn đến Trợ lý Tư Vấn Tiệc
  const handleSendAiMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || aiInput;
    if (!textToSend.trim() || isAiThinking) return;

    const newMessages = [...aiMessages, { role: 'user' as const, content: textToSend }];
    setAiMessages(newMessages);
    if (!customPrompt) setAiInput('');
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/ai/booking-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          currentFormState: {
            branchCode: selectedBranch,
            guestCount,
            eventType,
            budgetPerTable: estimatedCostPerTable,
          },
        }),
      });

      const data = await res.json();
      if (data.content) {
        setAiMessages([...newMessages, { role: 'assistant', content: data.content }]);
      }
    } catch (err) {
      setAiMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            'Dạ em đang kiểm tra thực đơn. Quý khách có thể xem bảng menu bên dưới hoặc để lại số điện thoại để Quê Nhà tư vấn trực tiếp ngay ạ!',
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const activeSlideData = HERO_SLIDES[heroSlide];
  const isCurrentDishSelected = selectedDishes.some((d) => d.id === currentDish.id);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#231F20] font-sans selection:bg-[#8B1D24] selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BAR (TỐI ƯU MOBILE) */}
      <div className="bg-gradient-to-r from-[#72161C] via-[#8B1D24] to-[#72161C] text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#C58940]/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="px-1.5 py-0.5 rounded-full bg-[#C58940] text-white font-bold text-[9px] sm:text-[10px] tracking-wider uppercase">
              Ưu Đãi
            </span>
            <span className="text-amber-100 font-medium truncate max-w-xs sm:max-w-none">
              Tặng gói hoa tươi trang trí VIP + Giảm 10% vang cho đoàn từ 3 bàn!
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-amber-200 text-[10px] sm:text-[11px]">
            <span className="hidden md:inline text-amber-200/80">Mở cửa: 10:00 - 23:00 hàng ngày</span>
            <span className="hidden md:inline text-amber-400/50">|</span>
            <a href="tel:0938226166" className="flex items-center gap-1 hover:text-white font-bold transition-colors">
              <Phone className="w-3 h-3 text-[#E5B869] animate-pulse" />
              <span>Hotline 24/7: 0938 226 166</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. THANH ĐIỀU HƯỚNG CHÍNH (LUXURY NAVBAR) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo Quê Nhà Oval Tự Nhiên & Brand Typography */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
            <div className="relative h-11 sm:h-13 w-auto shrink-0 flex items-center">
              <img
                src="/logo-oval-transparent.png"
                alt="Ẩm Thực Quê Nhà - Không Gian Ẩm Thực Việt"
                className="h-11 sm:h-13 w-auto object-contain drop-shadow-xs transition-transform group-hover:scale-105"
              />
            </div>
            <div className="whitespace-nowrap shrink-0">
              <span className="block font-serif text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-[#8B1D24] leading-tight">
                ẨM THỰC QUÊ NHÀ
              </span>
              <span className="block text-[8px] sm:text-[9px] lg:text-[10px] tracking-widest text-[#C58940] font-bold uppercase mt-0.5">
                Hệ Thống Tiệc & Phòng VIP • Từ 2010
              </span>
            </div>
          </Link>

          {/* Menu Điều Hướng Desktop */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold text-[#554A41] uppercase tracking-wide shrink-0">
            <a href="#branches" className="hover:text-[#8B1D24] transition-colors whitespace-nowrap">
              3 Chi Nhánh
            </a>
            <a href="#set-menus" className="hover:text-[#8B1D24] transition-colors whitespace-nowrap">
              Set Menu Tiệc
            </a>
            <a href="#custom-dishes" className="text-[#8B1D24] font-black hover:text-[#72161C] transition-colors flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-[#C58940]" />
              <span>Thực Đơn Tự Chọn</span>
            </a>
            <a href="#spaces" className="hover:text-[#8B1D24] transition-colors whitespace-nowrap">
              Không Gian Quê Nhà
            </a>
            <a href="#booking-form-section" className="text-[#8B1D24] hover:text-[#72161C] transition-colors whitespace-nowrap">
              Phiếu Đặt Tiệc
            </a>
          </nav>

          {/* Hotline & Nút Đặt Tiệc Nhanh */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="tel:0938226166"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-[#FDF6EE] border border-[#C58940]/40 text-[#8B1D24] text-xs font-bold hover:bg-[#FBEAD6] transition-all whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#C58940]" />
              <span>0938 226 166</span>
            </a>

            <MovingBorderButton
              onClick={() => {
                const el = document.getElementById('booking-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              borderRadius="0.75rem"
              duration={2800}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#8B1D24] to-[#72161C] text-white font-bold text-xs flex items-center gap-1.5 shadow-md whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#F6D38B]" />
              <span>Đặt Tiệc</span>
            </MovingBorderButton>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION - CINEMATIC FULL-BLEED LIVING STAGE WITH SYNCHRONIZED CROSSFADE */}
      <section className="relative overflow-hidden bg-[#170406] text-white border-b-4 border-[#C58940] min-h-[660px] sm:min-h-[720px] lg:min-h-[760px] flex items-center">
        {/* Aceternity Spotlight Effect (Theatrical Ambient Glow) */}
        <Spotlight
          className="-top-40 left-0 md:left-48 md:-top-20 z-20 pointer-events-none"
          fill="#F6D38B"
        />

        {/* Delicate golden geometric grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C58940_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none z-20" />

        {/* 3 SLIDES RENDERED CONCURRENTLY FOR 100% SYNCHRONIZED BUTTER-SMOOTH DISSOLVE */}
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = heroSlide === idx;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              {/* Lớp Ảnh Nền Tràn Viền Toàn Cảnh (Full-bleed Photography) */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Mặt nạ màu nghệ thuật: Hòa quyện ảnh và chữ vào nhau thành một bức họa */}
                {/* 1. Scrim màu rượu đỏ sẫm từ trái qua phải: Đảm bảo chữ đọc rõ 100% mà hình ảnh vẫn tỏa sáng */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#170406] via-[#1f0508]/90 via-40% md:via-45% to-[#170406]/35" />
                {/* 2. Gradient từ trên xuống và từ dưới lên: Hòa viền êm ái */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#170406] via-transparent via-50% to-[#170406]/65" />
                {/* 3. Lớp ánh sáng vàng ẩm thực: Tôn vẻ ngon miệng và sang trọng */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,137,64,0.18),transparent_65%)] pointer-events-none" />
              </div>

              {/* Nội dung Nghệ Thuật: Chữ và Dữ Liệu Tự Nhiên Hòa Trong Không Gian */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-16 sm:py-20 lg:py-24">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Cột Trái: Tiêu Đề Tinh Hoa & Thông Điệp Bếp Trưởng (7/12) */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#C58940]/60 text-[#F6D38B] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-[#F6D38B] animate-pulse" />
                      <span>{slide.tag}</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.12] text-white drop-shadow-xl">
                      {slide.title} <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6D38B] via-[#FFE29F] to-[#E6B357] italic">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="text-xs sm:text-base text-amber-50/90 leading-relaxed max-w-xl font-light mx-auto lg:mx-0 drop-shadow-sm">
                      {slide.desc}
                    </p>

                    {/* 2 Nút Hành Động Sang Trọng */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                      <MovingBorderButton
                        onClick={() => {
                          const el = document.getElementById('booking-form-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        borderRadius="0.875rem"
                        duration={3200}
                        className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#8B1D24] via-[#72161C] to-[#8B1D24] text-[#F6D38B] font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-2xl"
                      >
                        <Calendar className="w-4 h-4 text-[#F6D38B]" />
                        <span>Đặt Bàn & Giữ Phòng VIP Ngay</span>
                        <ArrowRight className="w-4 h-4 text-[#F6D38B]" />
                      </MovingBorderButton>

                      <a
                        href="#custom-dishes"
                        className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 hover:border-[#C58940]/60 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 group shadow-lg"
                      >
                        <UtensilsCrossed className="w-4 h-4 text-[#F6D38B] group-hover:rotate-12 transition-transform" />
                        <span>Khám Phá Món Ngon</span>
                      </a>
                    </div>

                    {/* 4 Thước Đo Uy Tín Hoà Vào Nền Rượu Vang */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-5 sm:pt-6 border-t border-white/15 text-center">
                      {slide.stats.map((st, i) => (
                        <div key={i} className="bg-black/30 backdrop-blur-xs p-2.5 sm:p-2 rounded-xl border border-white/10">
                          <div className="font-serif text-xl sm:text-3xl font-black text-[#F6D38B]">{st.value}</div>
                          <div className="text-[10px] sm:text-[11px] text-amber-200/80 uppercase font-medium mt-0.5 tracking-wider">{st.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cột Phải: Thẻ Bảo Chứng Mỹ Vị Bay Bổng Nghệ Thuật (5/12) */}
                  <div className="hidden lg:flex flex-col items-end justify-center">
                    <div className="w-full max-w-sm rounded-3xl bg-black/45 backdrop-blur-xl border border-[#C58940]/50 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-[#F6D38B] transition-all duration-300">
                      {/* Ánh sáng kim loại góc thẻ */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C58940]/30 to-transparent rounded-bl-full pointer-events-none" />

                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-[#8B1D24] text-[#F6D38B] font-bold text-[11px] uppercase tracking-wider border border-[#C58940]/60 shadow-md">
                          {slide.badge}
                        </span>
                        <div className="flex items-center gap-1 text-[#F6D38B] text-xs font-black ml-auto">
                          <Star className="w-3.5 h-3.5 fill-[#F6D38B]" />
                          <span>5.0</span>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl font-black text-white group-hover:text-[#F6D38B] transition-colors leading-snug">
                        {slide.dishHighlight}
                      </h3>

                      <p className="text-xs text-amber-100/80 mt-2.5 font-light leading-relaxed">
                        Tuyển chọn tươi sống nguyên con mỗi sớm. Chế biến theo công thức gia truyền Nam Bộ, gìn giữ phong vị tinh tế đãi khách quý.
                      </p>

                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-amber-200/90 flex items-center gap-1.5 font-medium">
                          <ChefHat className="w-4 h-4 text-[#F6D38B]" />
                          Bếp Trưởng 20+ Năm
                        </span>
                        <button
                          onClick={() => {
                            const el = document.getElementById('booking-form-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-[#F6D38B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Giữ bàn tiệc <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Nút Chuyển Slide Trái / Phải Kiểu Glassmorphism */}
        <button
          onClick={prevSlide}
          aria-label="Slide trước"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#8B1D24] text-white/90 hover:text-white border border-[#C58940]/60 flex items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Slide tiếp theo"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#8B1D24] text-white/90 hover:text-white border border-[#C58940]/60 flex items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bảng Điều Khiển Tiến Trình Slide Sang Trọng Dưới Đáy Hero */}
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
          {HERO_SLIDES.map((slide, idx) => {
            const isCurrent = heroSlide === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setHeroSlide(idx)}
                aria-label={`Chuyển đến cảnh ${idx + 1}`}
                className="group flex items-center gap-2 cursor-pointer focus:outline-hidden"
              >
                <span className={`text-[10px] sm:text-xs font-mono font-bold transition-colors ${
                  isCurrent ? 'text-[#F6D38B]' : 'text-white/50 group-hover:text-white/80'
                }`}>
                  0{idx + 1}
                </span>
                <span
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${
                    isCurrent
                      ? 'w-8 sm:w-12 bg-gradient-to-r from-[#C58940] to-[#F6D38B] shadow-md shadow-[#C58940]/50'
                      : 'w-3 sm:w-4 bg-white/30 group-hover:bg-white/60'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* MARQUEE RIBBON: THƯỚC ĐO UY TÍN & ĐẲNG CẤP (MAGIC UI & ACETERNITY) */}
      <MarqueeRibbon
        items={[
          { icon: <Award className="w-4 h-4 text-[#F6D38B]" />, text: 'Hơn 15 Năm Uy Tín Ẩm Thực Sài Gòn', sub: 'Est. 2010' },
          { icon: <Building2 className="w-4 h-4 text-[#F6D38B]" />, text: 'Biệt Thự Pháp Cổ & 15 Phòng VIP Riêng Tư', sub: 'Quận 3' },
          { icon: <Sparkles className="w-4 h-4 text-[#F6D38B]" />, text: 'Ốc Đảo Sinh Thái Sân Vườn 250 Khách', sub: 'Quận 10' },
          { icon: <UtensilsCrossed className="w-4 h-4 text-[#F6D38B]" />, text: 'Cửa Ngõ Sân Bay Tân Sơn Nhất', sub: 'Tân Bình' },
          { icon: <ChefHat className="w-4 h-4 text-[#F6D38B]" />, text: 'Bếp Trưởng Kỳ Cựu 20+ Năm Kinh Nghiệm', sub: 'Đặc Sản Ba Miền' },
          { icon: <ShieldCheck className="w-4 h-4 text-[#F6D38B]" />, text: '100% Nguyên Liệu Tươi Sống Trong Ngày', sub: 'Chuẩn Vệ Sinh ATTP' },
        ]}
      />

      {/* 4. SECTION: KHÁM PHÁ 3 CHI NHÁNH ĐẮC ĐỊA */}
      <section id="branches" className="py-14 sm:py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-[#8B1D24] tracking-widest uppercase bg-[#F7EAEB] px-3 py-1 rounded-full border border-[#8B1D24]/20">
              Vị Trí Trung Tâm & Đắc Địa
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#231F20] mt-3">
              Hệ Thống 3 Chi Nhánh Tại Sài Gòn
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-2 font-normal">
              Mỗi chi nhánh mang một phong cách kiến trúc đặc trưng, đáp ứng trọn vẹn mọi nhu cầu tổ chức tiệc từ thân mật đến quy mô 250 khách.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {BRANCHES_DATA.map((branch) => {
              const isSelected = selectedBranch === branch.code;
              return (
                <div
                  key={branch.code}
                  onClick={() => setSelectedBranch(branch.code)}
                  className={`group bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col cursor-pointer ${
                    isSelected
                      ? 'border-[#8B1D24] shadow-xl ring-2 ring-[#8B1D24]/20 -translate-y-1'
                      : 'border-[#E8E2D9] hover:border-[#C58940] hover:shadow-lg'
                  }`}
                >
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={branch.image || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'}
                      alt={branch.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8B1D24] text-white shadow-sm">
                        {branch.highlightTag || branch.district}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-white text-[#8B1D24] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md border border-[#8B1D24]">
                        <Check className="w-3.5 h-3.5 text-[#8B1D24]" />
                        <span>Đang Chọn</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#8B1D24]">
                        {branch.name}
                      </h3>
                      <p className="text-xs text-[#554A41] flex items-center gap-1.5 mt-2 font-medium">
                        <MapPin className="w-4 h-4 text-[#8B1D24] shrink-0" />
                        <span>{branch.address}</span>
                      </p>
                      <p className="text-xs text-[#6B5E55] mt-3 leading-relaxed">
                        {branch.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-[#E8E2D9] grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E2D9]">
                          <span className="text-[10px] text-[#A09383] block uppercase font-bold">Phòng VIP</span>
                          <strong className="text-[#8B1D24]">{branch.vipRooms} phòng</strong>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E2D9]">
                          <span className="text-[10px] text-[#A09383] block uppercase font-bold">Sức Chứa</span>
                          <strong className="text-[#231F20]">{branch.capacity || `${branch.maxCapacity} khách`}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBranch(branch.code);
                        const el = document.getElementById('booking-form-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-[#8B1D24] text-white'
                          : 'bg-[#FAF7F2] text-[#8B1D24] border border-[#D5C9BC] hover:bg-[#8B1D24] hover:text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Đang Đặt Tiệc Tại Đây' : 'Chọn Chi Nhánh Này'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECTION: 4 SET MENU TIỆC CHUẨN VỊ */}
      <section id="set-menus" className="py-14 sm:py-20 bg-[#FAF7F2] border-t border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-[#8B1D24] tracking-widest uppercase bg-[#F7EAEB] px-3 py-1 rounded-full border border-[#8B1D24]/20">
              Tuyển Chọn Trọn Gói Tinh Hoa
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#231F20] mt-3">
              4 Set Menu Tiệc Hoàn Mỹ
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-2">
              Được thiết kế tỉ mỉ bởi Bếp trưởng Quê Nhà, kết hợp hài hòa giữa hương vị Bắc - Trung - Nam, làm thỏa mãn vị giác của những thực khách sành ăn nhất.
            </p>
          </div>

          {/* Tab Chọn Set Menu */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
            {allSetMenus.map((menu) => {
              const isCurrent = selectedSetMenu?.id === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setSelectedSetMenu(menu)}
                  className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-[#8B1D24] shadow-md ring-2 ring-[#8B1D24]/10'
                      : 'bg-white/70 border-[#E8E2D9] hover:bg-white hover:border-[#C58940]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#8B1D24] truncate">{menu.name}</span>
                    {menu.badge && (
                      <span className="hidden sm:inline text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#8B1D24] text-white shrink-0">
                        {menu.badge}
                      </span>
                    )}
                  </div>
                  <div className="font-serif text-sm sm:text-lg font-black text-[#231F20]">
                    {new Intl.NumberFormat('vi-VN').format(menu.pricePerTable)} đ
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#A09383] mt-0.5">Bàn 10 người ({menu.dishes.length} món)</div>
                </button>
              );
            })}
          </div>

          {/* Hiển Thị Chi Tiết Set Menu Đang Chọn */}
          {selectedSetMenu && (
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E8E2D9] shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-[#E8E2D9]">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl sm:text-2xl font-black text-[#8B1D24]">
                      {selectedSetMenu.name}
                    </h3>
                    {selectedSetMenu.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FDF6EE] text-[#C58940] border border-[#C58940]/40 font-bold text-xs">
                        {selectedSetMenu.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B5E55] mt-1 font-medium">
                    {selectedSetMenu.suitableFor}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="sm:text-right">
                    <div className="text-[10px] sm:text-[11px] uppercase text-[#A09383] font-bold">Đơn giá trọn gói</div>
                    <div className="font-serif text-xl sm:text-2xl font-black text-[#8B1D24]">
                      {new Intl.NumberFormat('vi-VN').format(selectedSetMenu.pricePerTable)} đ
                      <span className="text-xs font-normal text-[#6B5E55]"> / bàn 10 khách</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplySetMenu(selectedSetMenu)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#8B1D24] hover:bg-[#72161C] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Chọn Set Này Cho Bàn Tiệc</span>
                  </button>
                </div>
              </div>

              {/* Danh Sách Món Trong Set (Hiển Thị Hình Ảnh & Mô Tả Trực Quan) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 mt-6">
                {(selectedSetMenu.dishItems && selectedSetMenu.dishItems.length > 0
                  ? selectedSetMenu.dishItems
                  : selectedSetMenu.dishes.map((dishName, i) => ({
                      name: dishName,
                      category: i === 0 || i === 1 ? 'Khai Vị' : i === selectedSetMenu.dishes.length - 1 ? 'Tráng Miệng' : 'Món Chính',
                      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
                      description: 'Món ngon tinh hoa được chế biến theo công thức gia truyền của Bếp trưởng Quê Nhà.'
                    }))
                ).map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex flex-row sm:flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E8E2D9] hover:border-[#8B1D24] hover:shadow-md transition-all p-2.5 sm:p-0 items-center sm:items-stretch gap-3 sm:gap-0"
                  >
                    {/* Ảnh món ăn có huy hiệu số thứ tự */}
                    <div className="relative w-24 h-24 sm:w-full sm:h-44 shrink-0 rounded-xl sm:rounded-none overflow-hidden bg-stone-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 hidden sm:block" />

                      {/* Số thứ tự tròn màu Đỏ Đô */}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#8B1D24] text-white flex items-center justify-center font-serif font-black text-[11px] sm:text-xs shadow-md border border-[#F6D38B]/50">
                        {idx + 1}
                      </div>

                      {/* Nhãn phân loại trên desktop */}
                      {item.category && (
                        <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#8B1D24] px-2 py-0.5 rounded-full shadow-xs hidden sm:block">
                          {item.category}
                        </div>
                      )}
                    </div>

                    {/* Nội dung chi tiết món */}
                    <div className="flex-1 min-w-0 sm:p-4 sm:bg-white flex flex-col justify-between">
                      <div>
                        {item.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58940] block sm:hidden mb-0.5">
                            {item.category}
                          </span>
                        )}
                        <h4 className="font-serif text-sm sm:text-base font-bold text-[#231F20] group-hover:text-[#8B1D24] transition-colors leading-snug">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-[#6B5E55] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2 font-light">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. SECTION: THỰC ĐƠN TỰ CHỌN - MÓN Ở TÂM ĐIỂM, BÊN PHẢI GIỚI THIỆU & THÊM VÀO SET */}
      <section id="custom-dishes" className="py-14 sm:py-24 bg-[#FDFBF7] relative overflow-hidden border-t border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold text-[#8B1D24] tracking-widest uppercase bg-[#F7EAEB] px-3.5 py-1 rounded-full border border-[#8B1D24]/20 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C58940]" />
              <span>Mỹ Vị Ba Miền Tinh Tuyển</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#231F20] mt-3">
              Tự Chọn Thực Đơn Độc Bản
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-2">
              Thực khách tự do kết hợp các món đặc sản trứ danh của Quê Nhà để hoàn thiện bàn tiệc tròn vị theo đúng khẩu vị và sở thích của đoàn mình.
            </p>
          </div>

          {/* Bộ lọc nhóm món ăn (Categories Scrollable) */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {DISH_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#8B1D24] text-white shadow-md shadow-[#8B1D24]/20 border-2 border-[#C58940]'
                      : 'bg-white border border-[#D5C9BC] text-[#6B5E55] hover:border-[#8B1D24] hover:text-[#8B1D24]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* CONTAINER TRÌNH BÀY THỰC ĐƠN: 3 CỘT TRỰC QUAN */}
          <div className="bg-white rounded-3xl border-2 border-[#E8E2D9] shadow-xl overflow-hidden p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* CỘT 1 (Trái - 3 cột): Danh sách món thu nhỏ trong nhóm để chuyển nhanh */}
              <div className="lg:col-span-3 order-3 lg:order-1 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
                  <span className="text-xs font-bold text-[#8B1D24] uppercase tracking-wider">
                    Các món trong nhóm ({filteredDishes.length})
                  </span>
                  <span className="text-[11px] text-[#A09383]">Chạm để đổi</span>
                </div>

                <div className="max-h-80 lg:max-h-96 overflow-y-auto space-y-2 pr-1">
                  {filteredDishes.map((dish, idx) => {
                    const isCurrent = dish.id === currentDish.id;
                    const isAdded = selectedDishes.some((d) => d.id === dish.id);
                    return (
                      <div
                        key={dish.id}
                        onClick={() => setActiveDishId(dish.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isCurrent
                            ? 'bg-[#FAF7F2] border-[#8B1D24] shadow-xs ring-1 ring-[#8B1D24]/20'
                            : 'bg-white border-[#E8E2D9] hover:border-[#C58940]'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          <Image
                            src={dish.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                            alt={dish.name}
                            fill
                            className="object-cover"
                          />
                          {isAdded && (
                            <div className="absolute inset-0 bg-[#2A7238]/80 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-[#8B1D24]' : 'text-[#231F20]'}`}>
                            {dish.name}
                          </h4>
                          <span className="text-[11px] font-serif font-black text-[#C58940]">
                            {new Intl.NumberFormat('vi-VN').format(dish.price)} đ
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CỘT 2 (Ở Giữa - 5 cột): TÂM ĐIỂM NGHỆ THUẬT MÓN ĂN (3D TILT EFFECT) */}
              <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center">
                <CardContainer className="inter-var w-full max-w-md aspect-square" containerClassName="py-0">
                  <CardBody className="relative w-full h-full rounded-3xl overflow-hidden p-3 bg-gradient-to-b from-[#C58940]/40 via-white/5 to-[#8B1D24]/20 border-2 border-[#C58940]/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group backdrop-blur-xs">
                    <CardItem translateZ="60" className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-900 shadow-inner">
                      <Image
                        src={currentDish.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'}
                        alt={currentDish.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                      {/* Tag Huy Hiệu Món */}
                      <CardItem translateZ="80" as="div" className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-3 py-1 rounded-full bg-[#8B1D24] text-[#F6D38B] font-bold text-xs uppercase tracking-wide border border-[#C58940]/50 shadow-md">
                          {currentDish.badge || (currentDish.isSignature ? 'Món Đặc Sản Quê Nhà' : 'Món Ngon Tinh Tuyển')}
                        </span>
                      </CardItem>

                      {/* Bộ Đếm Món */}
                      <CardItem translateZ="70" as="div" className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-amber-200 text-xs px-2.5 py-1 rounded-full font-bold border border-white/20">
                        Món 0{currentDishIndex + 1} / 0{filteredDishes.length}
                      </CardItem>

                      {/* Nút Chuyển Món Trực Tiếp Trên Tâm Điểm */}
                      <button
                        onClick={handlePrevDish}
                        aria-label="Món trước đó"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-[#8B1D24] text-white border border-[#C58940]/60 flex items-center justify-center transition-all shadow-md backdrop-blur-xs cursor-pointer z-20"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextDish}
                        aria-label="Món tiếp theo"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-[#8B1D24] text-white border border-[#C58940]/60 flex items-center justify-center transition-all shadow-md backdrop-blur-xs cursor-pointer z-20"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Chú thích nhanh dưới ảnh */}
                      <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                        <CardItem translateZ="50" as="div" className="text-[11px] text-[#F6D38B] uppercase tracking-wider font-bold">
                          Món Ngon Đặc Sản Quê Nhà
                        </CardItem>
                        <CardItem translateZ="90" as="h3" className="font-serif text-lg font-bold truncate text-white drop-shadow-md">
                          {currentDish.name}
                        </CardItem>
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>

              {/* CỘT 3 (Bên Phải - 4 cột): GIỚI THIỆU MÓN, GIÁ & NÚT THÊM MÓN VÀO 1 SETMENU TỰ CHỌN */}
              <div className="lg:col-span-4 order-2 lg:order-3 space-y-4 sm:space-y-5 bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#E8E2D9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#8B1D24] bg-white px-2 py-0.5 rounded-md border border-[#8B1D24]/20">
                      Chi Tiết Món Ăn
                    </span>
                    {isCurrentDishSelected && (
                      <span className="text-[10px] font-bold text-[#2A7238] bg-[#EAF5EC] px-2 py-0.5 rounded-md border border-[#2A7238]/20 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Đã có trong Set</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#8B1D24] mt-2 leading-snug">
                    {currentDish.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-serif text-2xl sm:text-3xl font-black text-[#C58940]">
                      {new Intl.NumberFormat('vi-VN').format(currentDish.price)} đ
                    </span>
                    <span className="text-xs text-[#6B5E55] font-medium">/ phần bàn 10 khách</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E2D9]">
                  <p className="text-xs sm:text-sm text-[#554A41] leading-relaxed">
                    {currentDish.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-[#6B5E55] pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C58940] shrink-0" />
                    <span>Nguyên liệu tươi sống nhập mới mỗi sáng từ vùng đồng quê</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C58940] shrink-0" />
                    <span>Phục vụ nóng hổi ngay tại bàn tiệc theo tiêu chuẩn phòng VIP</span>
                  </div>
                </div>

                {/* NÚT THÊM MÓN VÀO 1 SETMENU TỰ CHỌN */}
                <div className="pt-3 border-t border-[#E8E2D9] space-y-2.5">
                  <button
                    type="button"
                    onClick={() => toggleSelectDish(currentDish)}
                    className={`w-full py-3 sm:py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCurrentDishSelected
                        ? 'bg-[#2A7238] hover:bg-[#235d2e] text-white shadow-[#2A7238]/20'
                        : 'bg-[#8B1D24] hover:bg-[#72161C] text-white border-2 border-[#C58940] shadow-[#8B1D24]/20'
                    }`}
                  >
                    {isCurrentDishSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã Thêm Vào Set (Bấm để gỡ món)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Thêm Món Này Vào Set Tự Chọn</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#A09383] pt-1">
                    <button
                      onClick={handlePrevDish}
                      className="hover:text-[#8B1D24] transition-colors flex items-center gap-1 font-medium"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Món trước
                    </button>
                    <button
                      onClick={handleNextDish}
                      className="hover:text-[#8B1D24] transition-colors flex items-center gap-1 font-medium"
                    >
                      Món tiếp theo <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* KHAY TỔNG KẾT THỰC ĐƠN TỰ CHỌN (ITEMIZED CUSTOM MENU TRAY) */}
          <div className="mt-8 p-5 sm:p-7 bg-white rounded-3xl border-2 border-[#8B1D24] shadow-xl">
            {/* Header của Khay */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#8B1D24] text-[#F6D38B] flex items-center justify-center font-serif font-black text-base sm:text-lg shrink-0 shadow-md">
                  {selectedDishes.length}
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#8B1D24] leading-snug">
                    Thực Đơn Tự Chọn Của Quý Khách
                  </h3>
                  <p className="text-xs text-[#6B5E55] mt-0.5">
                    {selectedDishes.length === 0
                      ? 'Chưa chọn món nào. Quý khách vui lòng bấm nút "+ Thêm Món Này Vào Set Tự Chọn" ở trên để lên thực đơn.'
                      : `Đã chọn ${selectedDishes.length} món đặc sản cho bàn tiệc 10 người`}
                  </p>
                </div>
              </div>

              {selectedDishes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedDishes([])}
                  className="text-xs text-[#8B1D24] hover:text-[#5A1015] font-semibold flex items-center gap-1 self-start sm:self-center py-1.5 px-3 rounded-lg hover:bg-[#F7EAEB] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa tất cả món đã chọn</span>
                </button>
              )}
            </div>

            {/* Danh Sách Món Liệt Kê Chi Tiết (Itemized Cards Grid) */}
            {selectedDishes.length === 0 ? (
              <div className="py-8 text-center bg-[#FAF7F2] rounded-2xl border border-dashed border-[#D5C9BC] my-4">
                <UtensilsCrossed className="w-8 h-8 text-[#C58940] mx-auto mb-2 opacity-60" />
                <p className="text-xs text-[#6B5E55] max-w-md mx-auto leading-relaxed">
                  Quý khách hãy nhấn nút <strong>"+ Thêm Món Này Vào Set Tự Chọn"</strong> ở khung bên trên để đưa các món ăn yêu thích vào danh sách thực đơn bàn tiệc của mình.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 py-4">
                {selectedDishes.map((dish, idx) => (
                  <div
                    key={dish.id}
                    onClick={() => setActiveDishId(dish.id)}
                    className="group relative flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9] hover:border-[#8B1D24] hover:shadow-md transition-all cursor-pointer"
                  >
                    {/* Ảnh nhỏ của món */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-[#D5C9BC]/50">
                      <Image
                        src={dish.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#8B1D24] text-white text-[9px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                    </div>

                    {/* Thông tin tên & giá */}
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A09383] block">
                        {dish.category === 'KHAI_VI'
                          ? 'Khai Vị'
                          : dish.category === 'MON_CHINH'
                          ? 'Món Chính'
                          : dish.category === 'HAI_SAN'
                          ? 'Hải Sản'
                          : dish.category === 'LAU'
                          ? 'Lẩu'
                          : 'Tráng Miệng'}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-[#231F20] truncate group-hover:text-[#8B1D24] transition-colors">
                        {dish.name}
                      </h4>
                      <div className="font-serif font-black text-xs text-[#8B1D24] mt-0.5">
                        {new Intl.NumberFormat('vi-VN').format(dish.price)} đ
                        <span className="text-[10px] text-[#A09383] font-normal font-sans"> / bàn 10 khách</span>
                      </div>
                    </div>

                    {/* Nút X gỡ món ngay trên card */}
                    <button
                      type="button"
                      title="Gỡ món này khỏi thực đơn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectDish(dish);
                      }}
                      className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white hover:bg-red-50 text-[#6B5E55] hover:text-red-600 border border-[#D5C9BC] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Thanh Tính Tổng & Nút Áp Dụng */}
            <div className="pt-4 border-t border-[#E8E2D9] flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#6B5E55] text-center sm:text-left">
                {selectedDishes.length > 0 && (
                  <div className="bg-[#FAF7F2] py-1.5 px-3 rounded-lg border border-[#E8E2D9] inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C58940]" />
                    <span>
                      Đã chọn <strong>{selectedDishes.length} món</strong>. Bàn tiệc 10 người nên có từ <strong>5 - 7 món</strong> để mâm tiệc đầy đặn, tròn vị nhất.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
                <div className="text-center sm:text-right">
                  <div className="text-[10px] text-[#A09383] uppercase font-bold tracking-wider">
                    Dự toán tạm tính (1 bàn 10 khách)
                  </div>
                  <div className="font-serif font-black text-2xl sm:text-3xl text-[#8B1D24] leading-tight">
                    {new Intl.NumberFormat('vi-VN').format(customDishTotalPerTable)} đ
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyCustomMenu}
                  disabled={selectedDishes.length === 0}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#8B1D24] hover:bg-[#72161C] disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#C58940]"
                >
                  <Check className="w-4 h-4 text-[#F6D38B]" />
                  <span>Áp Dụng Set Này Vào Phiếu Đặt Tiệc</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. SECTION: ALBUM KHÔNG GIAN QUÊ NHÀ (INTERACTIVE PHOTO ALBUM) */}
      <section id="spaces" className="py-14 sm:py-24 bg-[#FAF7F2] border-t border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Tiêu Đề */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-[#8B1D24] tracking-widest uppercase bg-[#F7EAEB] px-3.5 py-1 rounded-full border border-[#8B1D24]/20 inline-flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#C58940]" />
              <span>Trải Nghiệm Đa Dạng • Sân Vườn & Phòng VIP</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#231F20] mt-3">
              Không Gian Ẩm Thực Quê Nhà
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-2 leading-relaxed">
              Từ ốc đảo sân vườn sinh thái rợp bóng mát, sảnh tiệc lớn 250 khách đến hệ thống 45 phòng VIP sang trọng kín đáo. Khám phá album từng góc không gian theo từng chi nhánh để chọn vị trí hoàn hảo nhất cho bữa tiệc của quý khách.
            </p>
          </div>

          {/* 3 Tab Chọn Chi Nhánh Để Xem Album */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {spaceAlbums.map((album) => {
              const isCurrent = activeSpaceBranch === album.branchCode;
              return (
                <button
                  key={album.branchCode}
                  onClick={() => handleSelectSpaceBranch(album.branchCode)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-[#8B1D24] shadow-md ring-2 ring-[#8B1D24]/10'
                      : 'bg-white/70 border-[#E8E2D9] hover:bg-white hover:border-[#C58940]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#8B1D24]">{album.branchName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B5E55] border border-[#E8E2D9]">
                      {album.district}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#231F20] truncate">
                    {album.tagline}
                  </div>
                  <div className="text-[11px] text-[#A09383] mt-1 flex items-center gap-3">
                    <span>{album.photos.length} góc chụp</span>
                    <span>•</span>
                    <span>{album.totalCapacity}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bố Cục Album Lật Đẹp Mắt: Cột Trái Ảnh Chính Lớn & Cột Phải Danh Sách Các Ảnh Khác */}
          <div className="bg-white rounded-3xl p-4 sm:p-7 border border-[#E8E2D9] shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* CỘT TRÁI (7 CỘT): ẢNH CHÍNH HIỂN THỊ LỚN VỚI NÚT LẬT ẢNH */}
              <div className="lg:col-span-7 flex flex-col">
                {/* Khung Ảnh Lớn */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-stone-900 border-2 border-[#8B1D24]/20 shadow-md group">
                  <Image
                    src={currentSpacePhoto.image}
                    alt={currentSpacePhoto.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Nút lật ảnh: Trước (Prev) */}
                  <button
                    type="button"
                    onClick={prevSpacePhoto}
                    aria-label="Ảnh trước"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#8B1D24] text-white flex items-center justify-center transition-all shadow-lg backdrop-blur-xs cursor-pointer border border-white/20"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Nút lật ảnh: Tiếp theo (Next) */}
                  <button
                    type="button"
                    onClick={nextSpacePhoto}
                    aria-label="Ảnh tiếp theo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#8B1D24] text-white flex items-center justify-center transition-all shadow-lg backdrop-blur-xs cursor-pointer border border-white/20"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Badges góc trên */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#8B1D24] text-white shadow-md border border-[#F6D38B]/40">
                      {currentSpacePhoto.typeLabel}
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-xs">
                      {currentSpacePhoto.capacity}
                    </span>
                  </div>

                  {/* Chỉ số ảnh (Ví dụ: Ảnh 1 / 5) */}
                  <div className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-xs">
                    Ảnh {activeSpacePhotoIndex + 1} / {currentSpaceAlbum.photos.length}
                  </div>

                  {/* Thông tin nhanh ngay trên chân ảnh */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif text-lg sm:text-2xl font-black drop-shadow-md">
                      {currentSpacePhoto.title}
                    </h3>
                  </div>
                </div>

                {/* Chi Tiết Góc Không Gian & Nút Đặt Tiệc Nhanh */}
                <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9] space-y-3">
                  <p className="text-xs sm:text-sm text-[#554A41] leading-relaxed">
                    {currentSpacePhoto.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {currentSpacePhoto.features.map((feat: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-white border border-[#E8E2D9] text-[#6B5E55] inline-flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-[#2A7238]" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#E8E2D9]">
                    <div className="text-xs text-[#8B1D24] font-bold">
                      📍 {currentSpaceAlbum.branchName} • {currentSpaceAlbum.district}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookAtSpace(currentSpacePhoto)}
                      className="px-5 py-2.5 rounded-xl bg-[#8B1D24] hover:bg-[#72161C] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#C58940]"
                    >
                      <Calendar className="w-4 h-4 text-[#F6D38B]" />
                      <span>Đặt Tiệc Tại Không Gian Này</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (5 CỘT): DANH SÁCH TẤT CẢ ẢNH TRONG ALBUM (LIST / THUMBNAILS) */}
              <div className="lg:col-span-5 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9] mb-3">
                    <div className="flex items-center gap-2">
                      <Images className="w-4 h-4 text-[#8B1D24]" />
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#231F20]">
                        Album Góc Không Gian ({currentSpaceAlbum.photos.length} góc chụp)
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#A09383] font-medium hidden sm:inline">
                      Bấm vào ảnh để lật xem
                    </span>
                  </div>

                  {/* Danh Sách Thẻ Ảnh Thu Nhỏ */}
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {currentSpaceAlbum.photos.map((photo: SpacePhoto, idx: number) => {
                      const isActive = idx === activeSpacePhotoIndex;
                      return (
                        <div
                          key={photo.id}
                          onClick={() => setActiveSpacePhotoIndex(idx)}
                          className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#FAF7F2] border-[#8B1D24] shadow-md ring-2 ring-[#8B1D24]/20'
                              : 'bg-white border-[#E8E2D9] hover:border-[#C58940] hover:bg-stone-50'
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                            <Image
                              src={photo.image}
                              alt={photo.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#8B1D24] text-white text-[9px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </div>
                          </div>

                          {/* Thông tin tóm tắt */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] font-bold text-[#8B1D24] uppercase tracking-wider truncate">
                                {photo.typeLabel}
                              </span>
                              <span className="text-[10px] text-[#6B5E55] shrink-0 font-medium">
                                {photo.capacity}
                              </span>
                            </div>
                            <h5 className="font-serif text-xs sm:text-sm font-bold text-[#231F20] truncate">
                              {photo.title}
                            </h5>
                            <p className="text-[11px] text-[#6B5E55] truncate font-light mt-0.5">
                              {photo.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION: ĐẶT BÀN & ĐẶT TIỆC (BOOKING FORM TỐI ƯU MOBILE) */}
      <section id="booking-form-section" className="py-14 sm:py-24 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#8B1D24] via-[#7A161C] to-[#5A1015] rounded-3xl p-6 sm:p-12 text-white shadow-2xl border-4 border-[#C58940]">
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
              <span className="text-[10px] sm:text-xs font-bold text-[#F6D38B] tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-[#C58940]/40">
                Phiếu Nhận Tiệc Trực Tuyến
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-black text-white mt-3">
                Đặt Bàn & Đặt Tiệc Quê Nhà
              </h2>
              <p className="text-xs sm:text-sm text-amber-100/90 mt-2 font-light">
                Quý khách vui lòng cung cấp thông tin buổi tiệc. Quê Nhà sẽ trực tiếp liên hệ xác nhận trong vòng 5 phút!
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-white text-[#231F20] rounded-2xl p-6 sm:p-8 text-center space-y-4 border-2 border-[#C58940] shadow-xl animate-in fade-in">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EAF5EC] text-[#2A7238] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-[#8B1D24]">
                  Tiếp Nhận Đặt Tiệc Thành Công!
                </h3>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] max-w-md mx-auto text-xs space-y-1">
                  <div>Mã Tiệc Khách Hàng: <strong className="text-[#8B1D24] text-sm">{submitSuccess.bookingId}</strong></div>
                  <div>Mã Khách Hàng: <strong className="text-[#231F20]">{submitSuccess.customerCode}</strong></div>
                  <div className="text-[#6B5E55] pt-1">
                    Quê Nhà đang kiểm tra lịch phòng và sẽ liên hệ xác nhận với quý khách ngay ạ!
                  </div>
                </div>
                <button
                  onClick={() => setSubmitSuccess(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#8B1D24] text-white text-xs font-bold hover:bg-[#72161C] transition-all cursor-pointer"
                >
                  Tạo Thêm Phiếu Đặt Tiệc Khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-5 sm:space-y-6">
                {submitError && (
                  <div className="p-3 sm:p-4 rounded-xl bg-red-900/60 border border-red-400 text-white text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-100 mb-1">
                      Họ và Tên Khách Hàng / Đơn Vị *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Anh Nguyễn Văn An / Cty FECON"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white text-[#231F20] placeholder:text-[#A09383] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C58940]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-100 mb-1">
                      Số Điện Thoại Liên Hệ *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0909 123 456"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white text-[#231F20] placeholder:text-[#A09383] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C58940]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-100 mb-1">
                      Chi Nhánh Đặt Tiệc
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-white text-[#231F20] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C58940]"
                    >
                      {BRANCHES_DATA.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name} ({b.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-100 mb-1">
                      Ngày Tổ Chức Tiệc
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-white text-[#231F20] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C58940]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-100 mb-1">
                      Khung Giờ
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTimeSlot('LUNCH')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          timeSlot === 'LUNCH'
                            ? 'bg-[#C58940] text-[#5A1015]'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        Trưa (11h)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeSlot('DINNER')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          timeSlot === 'DINNER'
                            ? 'bg-[#C58940] text-[#5A1015]'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        Tối (18h)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-100 mb-1">
                      Số Lượng Khách Dự Kiến
                    </label>
                    <div className="flex items-center gap-2 bg-white rounded-xl p-1 text-[#231F20]">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(5, guestCount - 5))}
                        className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#8B1D24] font-black flex items-center justify-center hover:bg-[#8B1D24] hover:text-white transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-sm">
                        {guestCount} khách ({estimatedTables} bàn)
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuestCount(guestCount + 5)}
                        className="w-9 h-9 rounded-lg bg-[#FAF7F2] text-[#8B1D24] font-black flex items-center justify-center hover:bg-[#8B1D24] hover:text-white transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-100 mb-1">
                      Loại Hình Sự Kiện
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-white text-[#231F20] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C58940]"
                    >
                      <option value="Tiệc Tất Niên Doanh Nghiệp">Tiệc Tất Niên Doanh Nghiệp</option>
                      <option value="Tiệc Tiếp Khách Ngoại Giao">Tiệc Tiếp Khách Ngoại Giao</option>
                      <option value="Họp Mặt Đại Gia Đình">Họp Mặt Đại Gia Đình</option>
                      <option value="Tiệc Sinh Nhật / Thôi Nôi">Tiệc Sinh Nhật / Thôi Nôi</option>
                      <option value="Tiệc Báo Hỷ / Đính Hôn">Tiệc Báo Hỷ / Đính Hôn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-100 mb-1">
                      Không Gian Yêu Cầu
                    </label>
                    <select
                      value={areaPreference}
                      onChange={(e) => setAreaPreference(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-white text-[#231F20] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C58940]"
                    >
                      <option value="Phòng VIP Máy Lạnh Riêng Tư">Phòng VIP Máy Lạnh Riêng Tư</option>
                      <option value="Sân Vườn Thoáng Mát Sinh Thái">Sân Vườn Thoáng Mát Sinh Thái</option>
                      <option value="Sảnh Tiệc Lớn Có Âm Thanh/Sân Khấu">Sảnh Tiệc Lớn Có Âm Thanh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-100 mb-1">
                    Ghi Chú & Yêu Cầu Đặc Biệt Cho Buổi Tiệc
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Cần máy chiếu thuyết trình, trang trí hoa tươi, chuẩn bị rượu vang..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white text-[#231F20] placeholder:text-[#A09383] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C58940]"
                  />
                </div>

                {/* Hộp Tóm Tắt Thực Đơn & Chi Phí Dự Kiến (Có Chức Năng Xóa & Đổi Thực Đơn) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  {menuMode !== 'NONE' && (selectedSetMenu || selectedDishes.length > 0) ? (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-[11px] text-amber-200 uppercase font-bold tracking-wider">
                              Thực đơn đã chọn
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#C58940] text-[#5A1015]">
                              {menuMode === 'SET' ? 'Set Trọn Gói' : 'Món Tự Chọn'}
                            </span>
                          </div>
                          <span className="font-serif text-base sm:text-lg font-bold text-white block mt-0.5">
                            {menuMode === 'SET' && selectedSetMenu
                              ? selectedSetMenu.name
                              : `Set Tự Chọn (${selectedDishes.length} món đặc sản)`}
                          </span>
                          <span className="block text-xs text-amber-200/80 mt-0.5">
                            Đơn giá: {new Intl.NumberFormat('vi-VN').format(estimatedCostPerTable)} đ / bàn ({estimatedTables} bàn)
                          </span>
                        </div>

                        {/* Dự toán tạm tính */}
                        <div className="sm:text-right">
                          <span className="text-[10px] sm:text-[11px] text-amber-200 uppercase font-bold block">
                            Dự toán tạm tính ({estimatedTables} bàn)
                          </span>
                          <span className="font-serif text-2xl sm:text-3xl font-black text-[#F6D38B] leading-tight block">
                            {new Intl.NumberFormat('vi-VN').format(totalEstimatedBanquet)} đ
                          </span>
                        </div>
                      </div>

                      {/* Các Nút Thao Tác: Xóa Thực Đơn & Đổi Thực Đơn Khác */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <button
                          type="button"
                          onClick={handleRemoveMenu}
                          className="text-red-200 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-950/50 hover:bg-red-900/70 transition-colors border border-red-400/40 cursor-pointer text-xs"
                          title="Hủy chọn thực đơn để đặt bàn trước, đến quán gọi món sau"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-300" />
                          <span>Xóa thực đơn (Đến quán gọi món trực tiếp)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const targetId = menuMode === 'SET' ? 'set-menus' : 'custom-dishes';
                            const el = document.getElementById(targetId);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-amber-200 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-amber-300/40 cursor-pointer text-xs"
                        >
                          <span>Đổi sang thực đơn khác</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div>
                        <span className="text-[10px] sm:text-[11px] text-amber-200 uppercase font-bold tracking-wider block">
                          Thực đơn áp dụng
                        </span>
                        <span className="font-serif text-sm sm:text-base font-bold text-white block mt-0.5">
                          Đặt bàn giữ chỗ trước (chọn món trực tiếp tại nhà hàng)
                        </span>
                        <span className="text-xs text-amber-200/70 block mt-0.5">
                          Chi phí sẽ tính theo thực tế các món gọi tại bàn vào ngày dùng tiệc.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('set-menus');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-xl bg-[#C58940] hover:bg-[#D4AF37] text-[#5A1015] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Chọn Set Menu Trước</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C58940] via-[#D4AF37] to-[#C58940] hover:brightness-110 text-[#5A1015] font-black text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-5 h-5 text-[#5A1015]" />
                  <span>{isSubmitting ? 'Đang Xử Lý Gửi Tiệc...' : 'Xác Nhận & Gửi Phiếu Nhận Tiệc'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. FOOTER CHÂN TRANG */}
      <footer className="bg-gradient-to-b from-[#72161C] to-[#5A1015] text-white pt-12 sm:pt-16 pb-8 border-t-4 border-[#C58940]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-oval-transparent.png"
                  alt="Ẩm Thực Quê Nhà"
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Ẩm Thực Quê Nhà</h3>
                  <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Hệ Thống Nhà Hàng & Tiệc</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/80 leading-relaxed font-light">
                Thành lập từ năm 2010, Ẩm Thực Quê Nhà là nơi hội tụ tinh hoa ẩm thực ba miền, mang lại không gian đối thoại đỉnh cao và trải nghiệm yến tiệc trọn vẹn cho mọi doanh nghiệp và gia đình.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#F6D38B] mb-3">
                Chi Nhánh Phạm Ngọc Thạch
              </h4>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                28 Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3, TP.HCM
              </p>
              <div className="mt-2 text-xs text-amber-200">Hotline: 0938 226 166</div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#F6D38B] mb-3">
                Chi Nhánh Thành Thái
              </h4>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                Số 05 Thành Thái, Phường 14, Quận 10, TP.HCM
              </p>
              <div className="mt-2 text-xs text-amber-200">Hotline: 0938 226 166</div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#F6D38B] mb-3">
                Chi Nhánh Nguyễn Thái Bình
              </h4>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                164 - 166 Nguyễn Thái Bình, Phường 12, Quận Tân Bình, TP.HCM
              </p>
              <div className="mt-2 text-xs text-amber-200">Hotline: 0938 226 166</div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-200/60 text-[11px] text-center sm:text-left">
            <div>
              © 2026 Ẩm Thực Quê Nhà. Tất cả các quyền được bảo lưu.
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <a href="#branches" className="hover:text-white transition-colors">3 Chi Nhánh</a>
              <a href="#set-menus" className="hover:text-white transition-colors">Set Menu</a>
              <Link href="/login" className="hover:text-white transition-colors font-bold text-[#F6D38B]">
                Cổng Nội Bộ
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. NÚT BACK TO TOP & TRỢ LÝ TƯ VẤN TIỆC AI FLOATING WIDGET (TỐI ƯU TOÀN DIỆN CHO MOBILE) */}
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-none">
        {/* Nút Back to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          title="Cuộn lên đầu trang"
          aria-label="Cuộn lên đầu trang"
          className={`pointer-events-auto flex items-center justify-center gap-1.5 p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-white/95 text-[#8B1D24] border-2 border-[#8B1D24] shadow-2xl hover:bg-[#8B1D24] hover:text-[#F6D38B] hover:border-[#C58940] transition-all duration-300 hover:scale-105 active:scale-95 group backdrop-blur-sm cursor-pointer ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-1 transition-transform" />
          <span className="hidden sm:inline font-serif text-xs font-bold tracking-wide">
            Lên Đầu Trang
          </span>
        </button>

        {/* Trợ lý Tư Vấn Tiệc Quê Nhà */}
        <div className="pointer-events-auto">
          {isAiOpen ? (
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#8B1D24] w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 max-h-[82vh] sm:max-h-[580px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              {/* Header Chatbox */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#8B1D24] to-[#72161C] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center border border-[#C58940]">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F6D38B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Trợ Lý Đặt Tiệc Quê Nhà</h4>
                    <div className="flex items-center gap-1 text-[10px] text-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Tư Vấn Trực Tuyến • Hỗ trợ 24/7</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiOpen(false)}
                  className="text-amber-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Khung Tin Nhắn */}
              <div className="p-3.5 sm:p-4 h-64 sm:h-80 overflow-y-auto space-y-3 bg-[#FAF7F2] text-xs">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-2.5 sm:p-3 leading-relaxed shadow-xs ${
                        msg.role === 'user'
                          ? 'bg-[#8B1D24] text-white rounded-tr-none'
                          : 'bg-white text-[#231F20] border border-[#E8E2D9] rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white text-[#8B1D24] rounded-2xl p-2.5 text-xs flex items-center gap-2 border border-[#8B1D24]/30 shadow-xs">
                      <div className="w-2 h-2 rounded-full bg-[#8B1D24] animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-[#8B1D24] animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-[#8B1D24] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-[#6B5E55] font-light">Đang chuẩn bị câu trả lời cho quý khách...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Gợi Ý Nhanh */}
              <div className="px-3 py-2 bg-white border-t border-[#E8E2D9] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                <button
                  onClick={() => handleSendAiMessage('Gợi ý set menu 4-5 triệu/bàn cho 20 người')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D5C9BC] text-[#8B1D24] hover:bg-[#8B1D24] hover:text-white transition-colors cursor-pointer"
                >
                  Set 4-5tr cho 20 người?
                </button>
                <button
                  onClick={() => handleSendAiMessage('Chi nhánh Thành Thái có phòng VIP bao nhiêu người?')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D5C9BC] text-[#8B1D24] hover:bg-[#8B1D24] hover:text-white transition-colors cursor-pointer"
                >
                  VIP Thành Thái?
                </button>
                <button
                  onClick={() => handleSendAiMessage('Chi nhánh Phạm Ngọc Thạch có tiếp khách VIP được không?')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D5C9BC] text-[#8B1D24] hover:bg-[#8B1D24] hover:text-white transition-colors cursor-pointer"
                >
                  VIP Phạm Ngọc Thạch?
                </button>
              </div>

              {/* Ô Nhập Tin Nhắn */}
              <div className="p-2.5 sm:p-3 bg-white border-t border-[#E8E2D9] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Hỏi về món ăn, ngân sách, phòng VIP..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C9BC] text-xs text-[#231F20] placeholder:text-[#A09383] focus:outline-none focus:border-[#8B1D24]"
                />
                <button
                  onClick={() => handleSendAiMessage()}
                  disabled={isAiThinking || !aiInput.trim()}
                  className="p-2 rounded-xl bg-[#8B1D24] text-white hover:bg-[#72161C] disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#8B1D24] via-[#A0232B] to-[#72161C] text-white font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all group border-2 border-[#C58940] cursor-pointer"
            >
              <div className="relative">
                <Sparkles className="w-4 h-4 text-[#F6D38B] group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="hidden xs:inline">Tư Vấn Đặt Tiệc</span>
              <span className="xs:hidden">Tư Vấn Tiệc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
