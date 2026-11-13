'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Grid,
  Users,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  PhoneCall,
  Sparkles,
  PieChart,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { UserProfile, TEST_PROFILES } from '@/lib/auth/permissions';
import {
  financeService,
  BRANCH_PERFORMANCES,
  MARKETING_ROI_DATA,
  URGENT_ALERTS,
  BranchPerformance,
  MarketingROIMetrics,
  UrgentAlert,
} from '@/services/financeService';

export default function ExecutiveDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(TEST_PROFILES.bgd);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');

  // Đọc profile đang chọn (nếu có chuyển đổi)
  useEffect(() => {
    const saved = localStorage.getItem('quenha_current_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        setCurrentUser(TEST_PROFILES.bgd);
      }
    }
  }, []);

  // Tính tổng số liệu 4 chi nhánh theo bộ lọc
  const activeBranches =
    selectedBranch === 'all'
      ? BRANCH_PERFORMANCES
      : BRANCH_PERFORMANCES.filter((b) => b.branch_code === selectedBranch);

  const totalMonthlyRevenue = activeBranches.reduce((acc, b) => acc + b.total_revenue, 0);
  const totalBookings = activeBranches.reduce((acc, b) => acc + b.total_bookings, 0);
  const totalDepositHeld = activeBranches.reduce((acc, b) => acc + b.total_deposit_held, 0);
  const avgOccupancyRate =
    activeBranches.reduce((acc, b) => acc + b.vip_room_occupancy_rate, 0) / (activeBranches.length || 1);

  return (
    <div className="space-y-6">
      {/* BANNER CHỈ HUY ĐIỀU HÀNH BGĐ */}
      <div className="bg-gradient-to-r from-[#8B1D24] via-[#7A181F] to-[#591015] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C58940]" />
            <span>Ẩm Thực Quê Nhà</span>
            <span>•</span>
            <span>Trung Tâm Điều Hành Ban Giám Đốc (Executive Command Center)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kính chào Ban Giám Đốc, {currentUser.full_name}!
          </h1>
          <p className="text-white/80 text-sm mt-2 leading-relaxed">
            Dữ liệu tổng hợp thời gian thực từ 3 chi nhánh (Phạm Ngọc Thạch, Thành Thái, Nguyễn Thái Bình). Hệ thống đã tự động đối soát với sổ kế toán MISA SME.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/finance/reconciliation"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-[#8B1D24] text-xs font-bold hover:bg-[#FDF6EE] transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#8B1D24]" />
              <span>Đối Soát MISA 3 Chốt Chặn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/crm/bookings"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
            >
              <Users className="w-4 h-4 text-[#C58940]" />
              <span>Xem Phễu Đặt Tiệc (Kanban)</span>
            </Link>

            <Link
              href="/operations/floor-map"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
            >
              <Grid className="w-4 h-4 text-[#C58940]" />
              <span>Sơ Đồ Bàn Phòng Trực Tiếp</span>
            </Link>
          </div>
        </div>

        {/* Vòng tròn trang trí mộc */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* THANH BỘ LỌC ĐIỀU HÀNH */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8B1D24]" />
          <span className="text-xs font-bold text-[#231F20] uppercase">Phạm vi dữ liệu:</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs font-bold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white text-[#231F20]"
          >
            <option value="all">Toàn Bộ 3 Chi Nhánh</option>
            <option value="QN_PNT">Quê Nhà - Phạm Ngọc Thạch (Q3)</option>
            <option value="QN_TT">Quê Nhà - Thành Thái (Q10)</option>
            <option value="QN_NTB">Quê Nhà - Nguyễn Thái Bình (Tân Bình)</option>
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs font-bold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white text-[#231F20]"
          >
            <option value="month">Tháng Này (11/2026)</option>
            <option value="last_month">Tháng Trước (10/2026)</option>
            <option value="quarter">Quý IV / 2026</option>
          </select>
        </div>
      </div>

      {/* 4 THẺ SỐ LIỆU LỚN CHO BAN GIÁM ĐỐC (KPI CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Doanh Thu Tiệc */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#6B5E55] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Doanh Thu Tiệc Tháng Này</span>
              <div className="w-9 h-9 rounded-xl bg-[#EAF5EC] text-[#2A7238] flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#231F20] font-mono">
              {totalMonthlyRevenue.toLocaleString('vi-VN')} <span className="text-sm font-sans font-semibold text-[#6B5E55]">đ</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#F0EAE1] text-xs flex items-center justify-between text-[#2A7238] font-bold">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% so với tháng trước</span>
            </span>
            <span className="text-[10px] text-[#A09383] font-normal">Đạt 92% kế hoạch</span>
          </div>
        </div>

        {/* KPI 2: Số Lượng Tiệc */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#6B5E55] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Số Tiệc Đã Nhận / Hoàn Tất</span>
              <div className="w-9 h-9 rounded-xl bg-[#F7EAEB] text-[#8B1D24] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#8B1D24]">
              {totalBookings} <span className="text-sm font-semibold text-[#6B5E55]">tiệc</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#F0EAE1] text-xs flex items-center justify-between text-[#6B5E55]">
            <span>36 tiệc hoàn tất • 16 tiệc đã cọc</span>
            <span className="font-bold text-[#8B1D24]">Tăng 8 tiệc</span>
          </div>
        </div>

        {/* KPI 3: Tỷ Lệ Lấp Đầy Phòng VIP */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#6B5E55] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Tỷ Lệ Lấp Đầy Phòng VIP</span>
              <div className="w-9 h-9 rounded-xl bg-[#FFF9F0] text-[#C58940] flex items-center justify-center font-bold">
                <Grid className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#C58940]">
              {avgOccupancyRate.toFixed(1)}%
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#F0EAE1] text-xs flex items-center justify-between text-[#6B5E55]">
            <span>Ca Tối: 88% • Ca Trưa: 68%</span>
            <span className="text-[#2A7238] font-bold">Cao điểm</span>
          </div>
        </div>

        {/* KPI 4: Tiền Cọc Đang Giữ */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#6B5E55] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Tổng Tiền Cọc Đang Giữ</span>
              <div className="w-9 h-9 rounded-xl bg-[#EBF8FF] text-[#2B6CB0] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#2B6CB0] font-mono">
              {totalDepositHeld.toLocaleString('vi-VN')} <span className="text-sm font-sans font-semibold text-[#6B5E55]">đ</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#F0EAE1] text-xs flex items-center justify-between text-[#2B6CB0] font-medium">
            <span>Đã đối chiếu 100% qua UNC</span>
            <span className="font-bold text-[#2A7238]">An toàn</span>
          </div>
        </div>
      </div>

      {/* KHỐI CẢNH BÁO NÓNG VẬN HÀNH 48 GIỜ (CHỈ THỊ CTO) */}
      <div className="bg-white rounded-2xl border-2 border-red-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-red-100">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-600 animate-bounce" />
            <h2 className="font-bold text-base text-[#231F20]">
              Cảnh Báo Nóng Cần Xử Lý Trong 48 Giờ (Operations Alerts)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
              {URGENT_ALERTS.length} thông báo
            </span>
          </div>
          <span className="text-xs text-[#A09383]">
            Tự động quét phễu tiệc và dữ liệu MISA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {URGENT_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                alert.severity === 'CRITICAL'
                  ? 'bg-red-50/70 border-red-300'
                  : alert.severity === 'HIGH'
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-blue-50/70 border-blue-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-red-600 text-white'
                        : alert.severity === 'HIGH'
                        ? 'bg-amber-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {alert.severity === 'CRITICAL' ? 'NGUY CƠ THẤT THOÁT' : alert.severity === 'HIGH' ? 'CHƯA NỘP CỌC ĐỢT 2' : 'LEAD TRỄ HẠN'}
                  </span>
                  <span className="text-[#8B1D24] font-semibold">{alert.branch_name}</span>
                </div>
                <h4 className="font-bold text-xs text-[#231F20] leading-snug">{alert.title}</h4>
                <p className="text-[11px] text-[#554A41] mt-1 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between">
                <span className="text-[10px] text-red-700 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{alert.deadline}</span>
                </span>
                <Link
                  href={alert.action_href}
                  className="text-xs font-bold text-[#8B1D24] hover:underline flex items-center gap-1"
                >
                  <span>{alert.action_label}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HAI KHỐI ĐỒNG BỘ: SO SÁNH 4 CHI NHÁNH & HIỆU QUẢ MARKETING (ROAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Khối 1: Bảng & Biểu Đồ So Sánh 3 Chi Nhánh */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#8B1D24]" />
                <h3 className="font-bold text-sm text-[#231F20]">
                  So Sánh Hiệu Quả Kinh Doanh 3 Chi Nhánh
                </h3>
              </div>
              <span className="text-xs text-[#6B5E55] font-medium">Tháng 11/2026</span>
            </div>

            <div className="space-y-4">
              {BRANCH_PERFORMANCES.map((branch) => {
                const revenuePercent = (branch.total_revenue / 500000000) * 100;
                return (
                  <div key={branch.branch_id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9]/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#8B1D24]">{branch.branch_name}</span>
                      <span className="font-mono font-bold text-[#231F20]">
                        {branch.total_revenue.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    {/* Progress Bar Doanh thu */}
                    <div className="w-full bg-[#E8E2D9] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8B1D24] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(revenuePercent, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B5E55] pt-1">
                      <span>Đã nhận: <strong>{branch.total_bookings} tiệc</strong></span>
                      <span>Lấp đầy VIP: <strong className="text-[#C58940]">{branch.vip_room_occupancy_rate}%</strong></span>
                      <span>Cọc giữ: <strong className="font-mono text-[#2A7238]">{branch.total_deposit_held.toLocaleString('vi-VN')} đ</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-xs">
            <span className="text-[#6B5E55]">Chi nhánh dẫn đầu doanh thu:</span>
            <strong className="text-[#8B1D24]">Quê Nhà - Phạm Ngọc Thạch (485 triệu)</strong>
          </div>
        </div>

        {/* Khối 2: Hiệu Quả Marketing & ROAS (Doanh Thu Mang Về) */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#2A7238]" />
                <h3 className="font-bold text-sm text-[#231F20]">
                  Hiệu Quả Marketing & Doanh Thu Mang Về (ROAS)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                ROAS: {MARKETING_ROI_DATA.roas}x
              </span>
            </div>

            {/* Chỉ số tài chính Marketing */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] text-center">
                <div className="text-[10px] text-[#6B5E55] uppercase font-bold">Chi Phí MKT</div>
                <div className="font-mono font-bold text-xs text-[#8B1D24] mt-1">
                  {MARKETING_ROI_DATA.total_mkt_spend.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <div className="p-3 bg-[#EAF5EC] rounded-xl border border-[#2A7238]/20 text-center">
                <div className="text-[10px] text-[#2A7238] uppercase font-bold">Doanh Thu Thu Về</div>
                <div className="font-mono font-bold text-xs text-[#2A7238] mt-1">
                  {MARKETING_ROI_DATA.revenue_from_mkt.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <div className="p-3 bg-[#FFF9F0] rounded-xl border border-[#C58940]/20 text-center">
                <div className="text-[10px] text-[#C58940] uppercase font-bold">Tỷ Lệ Chốt Tiệc</div>
                <div className="font-bold text-xs text-[#C58940] mt-1">
                  {MARKETING_ROI_DATA.conversion_rate}% ({MARKETING_ROI_DATA.converted_bookings}/{MARKETING_ROI_DATA.total_leads})
                </div>
              </div>
            </div>

            {/* Chi tiết từng kênh Marketing */}
            <div className="space-y-2.5">
              {MARKETING_ROI_DATA.channels.map((ch, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-[#E8E2D9] hover:bg-[#FAF7F2] transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex-1 pr-3">
                    <div className="font-bold text-[#231F20]">{ch.channel_name}</div>
                    <div className="text-[11px] text-[#6B5E55] mt-0.5">
                      Chi: {ch.spend.toLocaleString('vi-VN')} đ • Thu hút {ch.leads} lead
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-[#2A7238]">
                      {ch.revenue.toLocaleString('vi-VN')} đ
                    </div>
                    <div className="text-[10px] font-bold text-[#C58940]">
                      ROAS: {ch.roas}x
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-xs">
            <span className="text-[#6B5E55]">Kênh hiệu quả cao nhất:</span>
            <strong className="text-[#2A7238]">TikTok Video & Facebook Ads (~8.0x ROAS)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
