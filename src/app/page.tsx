'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Users,
  ChevronRight,
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
} from 'lucide-react';
import {
  BRANCHES_DATA,
  SET_MENUS_DATA,
  DISHES_DATA,
  BranchInfo,
  SetMenu,
  DishItem,
} from '@/data/landingMenuData';

export default function LandingBanquetPage() {
  // Trạng thái chọn chi nhánh & menu
  const [selectedBranch, setSelectedBranch] = useState<string>('QN_TT');
  const [menuMode, setMenuMode] = useState<'SET' | 'CUSTOM'>('SET');
  const [selectedSetMenu, setSelectedSetMenu] = useState<SetMenu | null>(SET_MENUS_DATA[1]); // Default: Set Như Ý
  const [selectedDishes, setSelectedDishes] = useState<DishItem[]>([]);
  const [dishCategory, setDishCategory] = useState<string>('ALL');

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

  // Trạng thái Bot AI DeepSeek
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        'Kính chào quý thực khách! Em là Trợ Lý Đặt Tiệc Quê Nhà (DeepSeek AI). Em có thể tư vấn chọn món ăn đặc sản, thiết kế set menu theo ngân sách và gợi ý phòng VIP tại 3 chi nhánh Quê Nhà cho quý khách ạ!',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Tính toán số bàn & tổng dự toán
  const estimatedTables = Math.max(1, Math.ceil(guestCount / 10));

  const customDishTotalPerTable = selectedDishes.reduce((sum, d) => sum + d.price, 0);
  const estimatedCostPerTable =
    menuMode === 'SET' && selectedSetMenu ? selectedSetMenu.pricePerTable : customDishTotalPerTable;
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

    let menuDescription = '';
    if (menuMode === 'SET' && selectedSetMenu) {
      menuDescription = `Set Menu: ${selectedSetMenu.name} (${new Intl.NumberFormat('vi-VN').format(selectedSetMenu.pricePerTable)}đ/bàn)`;
    } else if (selectedDishes.length > 0) {
      menuDescription = `Tự chọn ${selectedDishes.length} món: ${selectedDishes.map((d) => d.name).join(', ')}`;
    }

    try {
      const response = await fetch('/api/bookings/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          branchCode: selectedBranch,
          branchName: branchObj?.name,
          bookingDate: bookingDate || 'Theo lịch hẹn',
          timeSlot,
          guestCount,
          tableCount: estimatedTables,
          eventType,
          areaPreference,
          estimatedAmount: totalEstimatedBanquet,
          menuNotes: menuDescription,
          specialRequests,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi gửi phiếu đặt tiệc.');
      }

      setSubmitSuccess(data);
    } catch (err: any) {
      setSubmitError(err.message || 'Không thể kết nối máy chủ. Quý khách vui lòng gọi hotline 0938 226 166.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gửi tin nhắn đến Bot DeepSeek
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
            'Dạ em đang kiểm tra thực đơn. Quý khách có thể xem bảng menu bên dưới hoặc để lại số điện thoại để Tổng Quản Lý tư vấn trực tiếp ngay ạ!',
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a140d] text-amber-50 font-sans selection:bg-amber-600 selection:text-white">
      {/* 1. THANH ĐIỀU HƯỚNG CHÍNH */}
      <header className="sticky top-0 z-40 bg-[#0c1a11]/90 backdrop-blur-md border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Quê Nhà Oval Tự Nhiên */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-14 w-28 transition-transform group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="Ẩm Thực Quê Nhà"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="block font-serif text-xl font-bold tracking-wide text-amber-300">
                ẨM THỰC QUÊ NHÀ
              </span>
              <span className="block text-[11px] tracking-widest text-amber-400/70 uppercase">
                Hệ Thống Tiệc & Phòng VIP
              </span>
            </div>
          </Link>

          {/* Menu Điều Hướng */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-amber-200/80">
            <a href="#branches" className="hover:text-amber-400 transition-colors">
              3 Chi Nhánh
            </a>
            <a href="#set-menus" className="hover:text-amber-400 transition-colors">
              Set Menu Tiệc
            </a>
            <a href="#custom-dishes" className="hover:text-amber-400 transition-colors">
              Chọn Món Động
            </a>
            <a href="#booking-form-section" className="hover:text-amber-400 transition-colors">
              Phiếu Đặt Tiệc
            </a>
          </nav>

          {/* Hotline & Cổng Nội Bộ */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0938226166"
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Hotline: 0938 226 166</span>
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('booking-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-amber-950/50 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Đặt Tiệc Ngay</span>
            </button>

            {/* Cổng Nhân Viên Nội Bộ */}
            <Link
              href="/login"
              className="px-3 py-2 rounded-lg bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 hover:text-white hover:bg-emerald-900/60 text-xs font-medium transition-all flex items-center gap-1"
              title="Cổng Đăng Nhập Dành Cho Cán Bộ Nhân Viên"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cổng Nội Bộ</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION - ĐẬM CHẤT DI SẢN & SANG TRỌNG */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-radial from-emerald-950/50 via-[#0a140d] to-[#070e09]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge Uy Tín */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chuỗi Nhà Hàng Ẩm Thực Quê Nhà — Sài Gòn</span>
          </div>

          {/* Tiêu Đề Chính */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-amber-100 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Không Gian Tiệc Đẳng Cấp, <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Đượm Tình Quê Nhà
            </span>
          </h1>

          <p className="text-base sm:text-lg text-amber-200/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Hệ thống sảnh tiệc sân vườn thoáng đãng và hơn 45 phòng VIP sang trọng tại Quận 3, Quận 10 và Tân Bình.
            Thực đơn hơn 200 món đặc sản ba miền trọn vẹn hương vị tinh hoa.
          </p>

          {/* 2 Nút Hành Động Lớn */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => {
                const el = document.getElementById('booking-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-xl shadow-amber-900/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Gửi Phiếu Nhận Tiệc Trực Tuyến</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('set-menus');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-950/80 border border-amber-600/30 hover:border-amber-500/60 text-amber-200 hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Khám Phá Menu & Chọn Món</span>
            </button>
          </div>

          {/* 4 Thẻ Thông Số Nổi Bật */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-[#0f2317]/80 border border-amber-900/30 backdrop-blur-sm text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-300 mb-1">03</span>
              <span className="text-xs text-amber-400/80 uppercase font-medium">Chi Nhánh Sài Gòn</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0f2317]/80 border border-amber-900/30 backdrop-blur-sm text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-300 mb-1">45+</span>
              <span className="text-xs text-amber-400/80 uppercase font-medium">Phòng VIP Riêng Tư</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0f2317]/80 border border-amber-900/30 backdrop-blur-sm text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-300 mb-1">200+</span>
              <span className="text-xs text-amber-400/80 uppercase font-medium">Món Ăn Đặc Sản</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0f2317]/80 border border-amber-900/30 backdrop-blur-sm text-center">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-300 mb-1">24/7</span>
              <span className="text-xs text-amber-400/80 uppercase font-medium">Trợ Lý AI & Tiếp Nhận</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 3 CHI NHÁNH QUÊ NHÀ */}
      <section id="branches" className="py-20 border-t border-amber-900/30 bg-[#08120b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-2">
              HỆ THỐNG ĐỊA ĐIỂM
            </h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
              3 Chi Nhánh Trung Tâm Sài Gòn
            </p>
            <p className="text-sm text-amber-300/70 mt-3 font-light">
              Mỗi chi nhánh được quản lý độc lập bởi Tổng Quản Lý chuyên trách, sẵn sàng phục vụ các sự kiện từ 10 đến 250 thực khách.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {BRANCHES_DATA.map((branch) => {
              const isSelected = selectedBranch === branch.code;
              return (
                <div
                  key={branch.code}
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-b from-[#142e1e] to-[#0c1b12] shadow-2xl shadow-amber-950/60 scale-[1.02]'
                      : 'border-amber-900/40 bg-[#0e2115]/60 hover:border-amber-700/60 hover:bg-[#102619]'
                  }`}
                >
                  {/* Header Thẻ Chi Nhánh */}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                        {branch.district}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-xs text-amber-300 font-bold bg-amber-600/30 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                          <Check className="w-3 h-3" /> Đã chọn
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-serif font-bold text-amber-100 mb-2">
                      {branch.name}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-medium mb-4 italic">
                      "{branch.tagline}"
                    </p>

                    <div className="space-y-2 text-xs text-amber-200/80 mb-6">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{branch.vipRooms} Phòng VIP — Sức chứa tiệc {branch.maxCapacity} khách</span>
                      </div>
                    </div>

                    {/* Danh sách điểm mạnh */}
                    <div className="space-y-2 border-t border-amber-900/30 pt-4">
                      {branch.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-amber-300/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nút Chọn Chi Nhánh */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => {
                        setSelectedBranch(branch.code);
                        const el = document.getElementById('booking-form-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950'
                          : 'bg-emerald-950/80 border border-amber-800/40 hover:bg-amber-600 hover:text-white text-amber-200'
                      }`}
                    >
                      <span>{isSelected ? 'Đang Đặt Tiệc Tại Cơ Sở Này' : 'Chọn Cơ Sở Này Để Đặt Tiệc'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SECTION SET MENU TIỆC MẪU */}
      <section id="set-menus" className="py-20 border-t border-amber-900/30 bg-[#0a140d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-2">
                ẨM THỰC TINH TUYỂN
              </h2>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
                Set Menu Tiệc Mẫu Đẳng Cấp
              </p>
              <p className="text-sm text-amber-300/70 mt-2 font-light">
                Được thiết kế trọn gói cho bàn 10 người, cân đối dinh dưỡng và hội tụ đủ các món "Tủ" của Quê Nhà.
              </p>
            </div>

            {/* Chuyển Chế Độ Menu */}
            <div className="mt-6 md:mt-0 flex items-center p-1 rounded-xl bg-[#0f2317] border border-amber-900/40">
              <button
                onClick={() => setMenuMode('SET')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  menuMode === 'SET'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                Set Menu Gợi Ý
              </button>
              <button
                onClick={() => {
                  setMenuMode('CUSTOM');
                  const el = document.getElementById('custom-dishes');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  menuMode === 'CUSTOM'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                Tự Chọn Món Động
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SET_MENUS_DATA.map((set) => {
              const isChosen = selectedSetMenu?.id === set.id && menuMode === 'SET';
              return (
                <div
                  key={set.id}
                  className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                    isChosen
                      ? 'border-amber-400 bg-gradient-to-b from-[#163321] to-[#0d1e14] shadow-xl shadow-amber-950/60 ring-1 ring-amber-400/50'
                      : 'border-amber-900/30 bg-[#0e2115]/70 hover:border-amber-700/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {set.badge}
                      </span>
                      <span className="text-xs text-amber-400/70">Bàn 10 người</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-amber-100 mb-1">
                      {set.name}
                    </h3>
                    <div className="text-2xl font-bold text-amber-400 mb-3">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        set.pricePerTable
                      )}
                    </div>

                    <p className="text-xs text-amber-200/70 mb-5 line-clamp-2 font-light">
                      {set.description}
                    </p>

                    <div className="space-y-2 border-t border-amber-900/30 pt-4 mb-6">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400 block mb-2">
                        6 Món Trong Thực Đơn:
                      </span>
                      {set.dishes.map((dish, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-amber-100/90">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{dish}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplySetMenu(set)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isChosen
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-emerald-950/90 border border-amber-700/40 text-amber-300 hover:bg-amber-600 hover:text-white'
                    }`}
                  >
                    <span>{isChosen ? 'Đang Chọn Set Này' : 'Chọn Set Này Đặt Tiệc'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECTION TỰ CHỌN MÓN ĐỘNG (INTERACTIVE MOTION MENU BUILDER) */}
      <section id="custom-dishes" className="py-20 border-t border-amber-900/30 bg-[#08120b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-2">
              TRÌNH DIỄN & TỰ CHỌN MÓN TIỆC
            </h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
              Tự Thiết Kế Thực Đơn Theo Ý Thích
            </p>
            <p className="text-sm text-amber-300/70 mt-3 font-light">
              Nhấp chọn các món ăn ưa thích để tạo khay tiệc độc bản. Hệ thống tự động tính toán dự toán ngân sách tức thì cho bàn tiệc của quý khách.
            </p>
          </div>

          {/* Lọc danh mục món ăn */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'ALL', label: 'Tất Cả Món' },
              { id: 'KHAI_VI', label: 'Món Khai Vị' },
              { id: 'MON_CHINH', label: 'Đặc Sản Heo / Gà / Bò' },
              { id: 'HAI_SAN', label: 'Hải Sản Tươi Sống' },
              { id: 'LAU', label: 'Lẩu Truyền Thống' },
              { id: 'TRANG_MIENG', label: 'Tráng Miệng' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setDishCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  dishCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-950'
                    : 'bg-[#0f2317] border border-amber-900/40 text-amber-300 hover:border-amber-600/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Lưới món ăn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {DISHES_DATA.filter((d) => dishCategory === 'ALL' || d.category === dishCategory).map(
              (dish) => {
                const isSelected = selectedDishes.some((d) => d.id === dish.id);
                return (
                  <div
                    key={dish.id}
                    onClick={() => {
                      toggleSelectDish(dish);
                      setMenuMode('CUSTOM');
                    }}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-[#163523] shadow-lg shadow-amber-950/60 ring-2 ring-amber-400/40 transform -translate-y-1'
                        : 'border-amber-900/30 bg-[#0e2115]/70 hover:border-amber-600/50 hover:bg-[#11281a]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        {dish.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {dish.badge}
                          </span>
                        )}
                        <span className="text-sm font-bold text-amber-400">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            dish.price
                          )}
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-amber-100 mb-1">
                        {dish.name}
                      </h4>
                      <p className="text-xs text-amber-200/70 font-light mb-4">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-amber-900/30">
                      <span className="text-[11px] text-amber-400/70 font-medium">
                        {dish.category === 'LAU' ? 'Khẩu phần 1 nồi lớn' : 'Khẩu phần bàn tiệc'}
                      </span>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-emerald-950 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {isSelected ? 'Đã Chọn' : 'Chọn Món'}
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* KHAY TIỆC ĐANG CHỌN (BANQUET TRAY - REALTIME CALCULATOR) */}
          {selectedDishes.length > 0 && (
            <div className="sticky bottom-4 z-30 max-w-4xl mx-auto rounded-2xl bg-[#0f2418]/95 backdrop-blur-md border border-amber-400/80 p-5 shadow-2xl shadow-stone-950 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Khay Tiệc Tự Chọn ({selectedDishes.length} món)
                  </span>
                  <span className="text-xs text-amber-200/60">•</span>
                  <span className="text-xs text-amber-200/80">
                    Dự toán: <b>{new Intl.NumberFormat('vi-VN').format(customDishTotalPerTable)}đ</b>/bàn
                  </span>
                </div>
                <div className="text-xs text-amber-200/70 truncate max-w-lg">
                  {selectedDishes.map((d) => d.name).join(' • ')}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setSelectedDishes([])}
                  className="p-2 rounded-xl bg-red-950/60 border border-red-800/40 text-red-300 hover:bg-red-900/80 text-xs"
                  title="Xóa chọn lại"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setMenuMode('CUSTOM');
                    const el = document.getElementById('booking-form-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950 flex items-center justify-center gap-1.5"
                >
                  <span>Áp Dụng Thực Đơn Này Vào Phiếu Đặt Tiệc</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. SECTION PHIẾU NHẬN TIỆC TRỰC TUYẾN (SMART BOOKING INTAKE FORM) */}
      <section id="booking-form-section" className="py-20 border-t border-amber-900/30 bg-[#071009]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Tiếp Nhận Đặt Tiệc Nhanh</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
              Phiếu Nhận Tiệc Trực Tuyến
            </h2>
            <p className="text-sm text-amber-300/70 mt-2 font-light">
              Thông tin sẽ được chuyển ngay đến Tổng Quản Lý và Lễ tân chi nhánh được chọn qua hệ thống Telegram nội bộ để liên hệ xác nhận trong 5 phút.
            </p>
          </div>

          {/* Form Chính */}
          <div className="rounded-3xl bg-gradient-to-b from-[#11261a] to-[#0a1710] border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-stone-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* Thông báo lỗi nếu có */}
            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-700/60 text-red-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Thông báo thành công */}
            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-amber-100">
                  Gửi Phiếu Nhận Tiệc Thành Công!
                </h3>
                <p className="text-sm text-amber-200/80 max-w-md mx-auto font-light">
                  Mã hồ sơ đặt tiệc của quý khách: <b className="text-amber-400">{submitSuccess.bookingId}</b>.
                  Hệ thống đã bắn thông báo trực tiếp tới Tổng Quản Lý chi nhánh. Lễ tân sẽ gọi điện thoại xác nhận ngay ạ!
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <a
                    href="tel:0938226166"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi Ngay Hotline: 0938 226 166</span>
                  </a>
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-950 border border-amber-800/40 text-amber-300 text-xs font-semibold hover:bg-emerald-900"
                  >
                    Đặt Thêm Tiệc Khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                {/* 1. Chọn Chi Nhánh */}
                <div>
                  <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                    1. Chi Nhánh Quê Nhà Quý Khách Muốn Tổ Chức (*)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BRANCHES_DATA.map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => setSelectedBranch(b.code)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          selectedBranch === b.code
                            ? 'border-amber-400 bg-amber-500/15 text-amber-100 shadow-md ring-1 ring-amber-400/40'
                            : 'border-amber-900/40 bg-[#0e2115]/60 text-amber-300/80 hover:border-amber-700/60'
                        }`}
                      >
                        <div className="font-serif font-bold text-sm text-amber-200">{b.name}</div>
                        <div className="text-[11px] text-amber-400/70 mt-0.5">{b.district} • {b.vipRooms} VIP</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Loại Tiệc & Khu Vực */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                      2. Loại Tiệc / Sự Kiện
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Tiệc Tất Niên Công Ty">Tiệc Tất Niên / Tân Niên Công Ty</option>
                      <option value="Tiệc Sinh Nhật / Thôi Nôi">Tiệc Sinh Nhật / Thôi Nôi</option>
                      <option value="Tiệc Báo Hỷ / Đính Hôn">Tiệc Báo Hỷ / Đính Hôn</option>
                      <option value="Tiệc Tiếp Khách VIP Đối Tác">Tiệc Tiếp Khách VIP / Ký Kết Đối Tác</option>
                      <option value="Họp Mặt Gia Đình Bạn Bè">Họp Mặt Gia Đình Bạn Bè</option>
                      <option value="Tiệc Khác">Khác (Ghi chú thêm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                      3. Khu Vực Mong Muốn
                    </label>
                    <select
                      value={areaPreference}
                      onChange={(e) => setAreaPreference(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Phòng VIP Máy Lạnh Riêng Tư">Phòng VIP Máy Lạnh Riêng Tư (Ưu tiên)</option>
                      <option value="Khu Vực Sân Vườn Cây Xanh">Khu Vực Sân Vườn Thoáng Đãng</option>
                      <option value="Sảnh Tiệc Lớn Chung">Sảnh Tiệc Lớn Chung</option>
                      <option value="Tổng Quản Lý Sắp Xếp Phù Hợp">Nhờ Quê Nhà Tư Vấn Khu Vực Đẹp Nhất</option>
                    </select>
                  </div>
                </div>

                {/* 3. Ngày, Ca & Số Lượng Khách */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                      4. Ngày Dự Kiến
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                      5. Ca Tổ Chức
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTimeSlot('LUNCH')}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          timeSlot === 'LUNCH'
                            ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                            : 'border-amber-900/40 bg-[#0a160f] text-amber-400/60'
                        }`}
                      >
                        Trưa (10h30-14h)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeSlot('DINNER')}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          timeSlot === 'DINNER'
                            ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                            : 'border-amber-900/40 bg-[#0a160f] text-amber-400/60'
                        }`}
                      >
                        Tối (17h-22h)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                      6. Số Lượng Khách (~{estimatedTables} bàn)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(5, guestCount - 5))}
                        className="p-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-300 hover:bg-amber-900/40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value) || 10)}
                        className="w-full text-center py-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 text-xs font-bold focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setGuestCount(guestCount + 5)}
                        className="p-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-300 hover:bg-amber-900/40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Thông Tin Liên Hệ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                      7. Họ Và Tên Thực Khách (*)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Anh Minh Tuấn"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-400 placeholder:text-amber-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                      8. Số Điện Thoại Nhận Xác Nhận (*)
                    </label>
                    <input
                      type="tel"
                      placeholder="Ví dụ: 0903 888 999"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-400 placeholder:text-amber-500/40 font-mono"
                    />
                  </div>
                </div>

                {/* 5. Tóm Tắt Thực Đơn Đã Chọn */}
                <div className="p-4 rounded-xl bg-[#0b1b11] border border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-amber-300 block mb-0.5">
                      Thực đơn tiệc đã chọn:
                    </span>
                    <span className="text-amber-200/80">
                      {menuMode === 'SET' && selectedSetMenu
                        ? `Set: ${selectedSetMenu.name} (${new Intl.NumberFormat('vi-VN').format(selectedSetMenu.pricePerTable)}đ/bàn)`
                        : selectedDishes.length > 0
                        ? `Tự chọn ${selectedDishes.length} món (${new Intl.NumberFormat('vi-VN').format(customDishTotalPerTable)}đ/bàn)`
                        : 'Chưa chọn món cụ thể (Nhờ nhà hàng tư vấn)'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-amber-400/70 block">Tổng dự toán ước tính (~{estimatedTables} bàn):</span>
                    <span className="text-base font-bold text-amber-400">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        totalEstimatedBanquet
                      )}
                    </span>
                  </div>
                </div>

                {/* 6. Ghi Chú Thêm */}
                <div>
                  <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                    9. Yêu Cầu Riêng (Karaoke, Máy Chiếu, Bánh Kem, Rượu Vang, Khẩu Vị...)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Quý khách có lưu ý gì về món ăn hoặc bài trí phòng xin ghi chú tại đây..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-400 placeholder:text-amber-500/40"
                  />
                </div>

                {/* Nút Bấm Gửi Phiếu */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-xl shadow-amber-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Đang Gửi Phiếu Đến Chi Nhánh & Telegram...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>GỬI PHIẾU NHẬN TIỆC ĐẾN TỔNG QUẢN LÝ NGAY</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. FOOTER CHUỖI NHÀ HÀNG QUÊ NHÀ */}
      <footer className="border-t border-amber-900/40 bg-[#050b07] py-14 text-amber-200/70 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Cột Thương Hiệu */}
            <div className="space-y-4">
              <div className="relative h-12 w-28">
                <Image src="/icon.png" alt="Quê Nhà Logo" fill className="object-contain" />
              </div>
              <p className="text-xs leading-relaxed font-light text-amber-300/80">
                Ẩm Thực Quê Nhà gìn giữ nét tinh hoa ẩm thực ba miền, mang đến không gian tiệc ấm cúng, riêng tư và trọn vẹn nghĩa tình.
              </p>
              <div className="text-amber-400 font-bold">Hotline Tổng: 0938 226 166</div>
            </div>

            {/* Chi nhánh 1 */}
            <div>
              <h4 className="font-serif font-bold text-amber-200 text-sm mb-2">
                CN Phạm Ngọc Thạch (Q.3)
              </h4>
              <p className="text-xs text-amber-400/80 mb-1">28 Phạm Ngọc Thạch, P. Võ Thị Sáu, Q.3</p>
              <p className="text-xs text-amber-200/60 font-light">
                15 Phòng VIP sang trọng, chuyên biệt tiếp khách ngoại giao & đối tác cấp cao.
              </p>
            </div>

            {/* Chi nhánh 2 */}
            <div>
              <h4 className="font-serif font-bold text-amber-200 text-sm mb-2">
                CN Thành Thái (Q.10)
              </h4>
              <p className="text-xs text-amber-400/80 mb-1">Số 05 Thành Thái, Phường 14, Quận 10</p>
              <p className="text-xs text-amber-200/60 font-light">
                Sân vườn sinh thái thoáng mát, sảnh tiệc 250 khách, bãi đỗ xe hơi rộng rãi.
              </p>
            </div>

            {/* Chi nhánh 3 */}
            <div>
              <h4 className="font-serif font-bold text-amber-200 text-sm mb-2">
                CN Nguyễn Thái Bình (Tân Bình)
              </h4>
              <p className="text-xs text-amber-400/80 mb-1">164 - 166 Nguyễn Thái Bình, P.12, Tân Bình</p>
              <p className="text-xs text-amber-200/60 font-light">
                12 Phòng VIP hiện đại, sảnh hội nghị máy chiếu gần sân bay Tân Sơn Nhất.
              </p>
            </div>
          </div>

          <div className="border-t border-amber-950/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-amber-500/60 text-[11px]">
            <div>© 2026 Chuỗi Nhà Hàng Ẩm Thực Quê Nhà. Bản quyền thuộc về hệ thống Quê Nhà.</div>
            <div className="mt-2 sm:mt-0 flex gap-4">
              <Link href="/login" className="hover:text-amber-400 transition-colors">
                Đăng Nhập Quản Trị Nội Bộ
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 8. WIDGET TRỢ LÝ AI TƯ VẤN TIỆC DEEPSEEK (FLOATING BOT) */}
      <div className="fixed bottom-6 right-6 z-50">
        {isAiOpen ? (
          <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl bg-[#0c1c12] border border-amber-500/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header Bot */}
            <div className="p-3.5 bg-gradient-to-r from-[#122b1c] to-[#0d1f14] border-b border-amber-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <span>Trợ Lý Đặt Tiệc Quê Nhà</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-mono">
                      DeepSeek AI
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Sẵn sàng tư vấn 24/7</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-amber-300/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nội Dung Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-amber-600 text-stone-950 font-medium rounded-tr-none'
                        : 'bg-[#142e1f] text-amber-100 border border-amber-800/40 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-[#142e1f] text-amber-300 rounded-2xl p-3 text-xs flex items-center gap-2 border border-amber-800/40">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-amber-400/80 font-light">DeepSeek đang soạn tư vấn...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Gợi Ý Câu Hỏi Nhanh */}
            <div className="px-3 py-2 bg-[#08130c] border-t border-amber-950/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => handleSendAiMessage('Gợi ý set menu 5 triệu/bàn cho 20 người')}
                className="shrink-0 px-2.5 py-1 rounded-full bg-[#11261a] border border-amber-900/50 text-amber-300/90 hover:border-amber-400"
              >
                Set 5tr cho 20 người?
              </button>
              <button
                onClick={() => handleSendAiMessage('Chi nhánh Thành Thái có phòng VIP bao nhiêu người?')}
                className="shrink-0 px-2.5 py-1 rounded-full bg-[#11261a] border border-amber-900/50 text-amber-300/90 hover:border-amber-400"
              >
                Phòng VIP Thành Thái?
              </button>
              <button
                onClick={() => handleSendAiMessage('Chi nhánh Phạm Ngọc Thạch có tiếp khách VIP được không?')}
                className="shrink-0 px-2.5 py-1 rounded-full bg-[#11261a] border border-amber-900/50 text-amber-300/90 hover:border-amber-400"
              >
                VIP Phạm Ngọc Thạch?
              </button>
            </div>

            {/* Ô Nhập Tin Nhắn */}
            <div className="p-3 bg-[#0a180f] border-t border-amber-900/40 flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi (ngân sách, số người, món ăn)..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                className="flex-1 px-3 py-2 rounded-xl bg-[#102619] border border-amber-900/60 text-xs text-amber-100 placeholder:text-amber-500/40 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleSendAiMessage()}
                disabled={isAiThinking || !aiInput.trim()}
                className="p-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAiOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 font-bold text-xs shadow-2xl shadow-stone-950 hover:scale-105 transition-all group border border-amber-300/40"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-stone-950 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span>Tư Vấn Đặt Tiệc AI</span>
          </button>
        )}
      </div>
    </div>
  );
}
