'use client';

import React, { useState } from 'react';
import { TEST_PROFILES, UserProfile } from '@/lib/auth/permissions';
import { Lock, Mail, ShieldCheck, ArrowRight, Building2, MapPin } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBranchTab, setSelectedBranchTab] = useState<'HQ' | 'PNT' | 'TT' | 'NTB'>('PNT');

  const handleLogin = (profile: UserProfile) => {
    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Lưu session giả lập chuẩn vào localStorage cho Client AppShell
      localStorage.setItem('quenha_current_user', JSON.stringify(profile));

      // 2. Set cookie để Middleware Next.js cho phép truy cập ngay lập tức
      document.cookie = `quenha_mock_user=${encodeURIComponent(
        JSON.stringify({ id: profile.id, role_code: profile.role_code, level: profile.level })
      )}; path=/; max-age=86400; SameSite=Lax`;

      // 3. Chuyển hướng trực tiếp để AppShell và Middleware đồng bộ hoàn hảo
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 150);
    } catch {
      setErrorMessage('Không thể khởi tạo phiên đăng nhập. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    // Kiểm tra email trong danh mục mẫu
    const matched = Object.values(TEST_PROFILES).find(
      (p) => p.email?.toLowerCase() === email.toLowerCase()
    );

    if (matched) {
      handleLogin(matched);
    } else {
      // Mặc định đăng nhập với quyền HĐTV / Ban Giám Đốc
      handleLogin(TEST_PROFILES.hdtv);
    }
  };

  // Cấu trúc danh mục đăng nhập mẫu ĐI THEO CHI NHÁNH & CA TRỰC THỰC TẾ
  const branchGroups = [
    {
      id: 'HQ',
      name: 'Trụ Sở HQ',
      subtitle: 'Khối Điều Hành Toàn Chuỗi',
      icon: Building2,
      profiles: [
        { key: 'hdtv', levelBadge: 'Level 1', color: 'border-red-300 bg-red-50 text-red-800' },
        { key: 'super_admin', levelBadge: 'Level 2', color: 'border-indigo-300 bg-indigo-50 text-indigo-800' },
        { key: 'dept_head_mkt', levelBadge: 'Level 3', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
        { key: 'accountant', levelBadge: 'Level 6', color: 'border-stone-300 bg-stone-50 text-stone-800' },
      ],
    },
    {
      id: 'PNT',
      name: 'CN Phạm Ngọc Thạch',
      subtitle: 'Quận 3 • Độc lập vận hành',
      icon: MapPin,
      profiles: [
        { key: 'gm_pnt', levelBadge: 'Level 4', color: 'border-amber-300 bg-amber-50 text-amber-800' },
        { key: 'mgr_shift_pnt', levelBadge: 'Level 5', color: 'border-orange-300 bg-orange-50 text-orange-800' },
        { key: 'mgr_morning_pnt', levelBadge: 'Level 5', color: 'border-orange-300 bg-orange-50 text-orange-800' },
        { key: 'staff_sales_pnt', levelBadge: 'Level 6', color: 'border-stone-300 bg-stone-50 text-stone-800' },
      ],
    },
    {
      id: 'TT',
      name: 'CN Thành Thái',
      subtitle: 'Quận 10 • Độc lập vận hành',
      icon: MapPin,
      profiles: [
        { key: 'gm_tt', levelBadge: 'Level 4', color: 'border-amber-300 bg-amber-50 text-amber-800' },
        { key: 'mgr_shift_tt', levelBadge: 'Level 5', color: 'border-orange-300 bg-orange-50 text-orange-800' },
        { key: 'mgr_evening_tt', levelBadge: 'Level 5', color: 'border-orange-300 bg-orange-50 text-orange-800' },
        { key: 'cashier_tt', levelBadge: 'Level 6', color: 'border-stone-300 bg-stone-50 text-stone-800' },
      ],
    },
    {
      id: 'NTB',
      name: 'CN Nguyễn Thái Bình',
      subtitle: 'Tân Bình • Độc lập vận hành',
      icon: MapPin,
      profiles: [
        { key: 'gm_ntb', levelBadge: 'Level 4', color: 'border-amber-300 bg-amber-50 text-amber-800' },
        { key: 'mgr_morning_ntb', levelBadge: 'Level 5', color: 'border-orange-300 bg-orange-50 text-orange-800' },
        { key: 'mgr_shift_ntb', levelBadge: 'Level 5', color: 'border-orange-300 bg-orange-50 text-orange-800' },
        { key: 'staff_sales_ntb', levelBadge: 'Level 6', color: 'border-stone-300 bg-stone-50 text-stone-800' },
      ],
    },
  ];

  const currentBranchGroup = branchGroups.find((g) => g.id === selectedBranchTab) || branchGroups[1];

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo Quê Nhà Thật - Dáng Oval Tự Nhiên, Không Khung Bo Tròn */}
        <div className="flex flex-col items-center justify-center mb-5">
          <img
            src="/logo-oval-transparent.png"
            alt="Ẩm Thực Quê Nhà - Không gian ẩm thực Việt"
            className="h-24 sm:h-28 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300"
          />
          <div className="h-0.5 w-20 bg-[#C58940]/40 my-2" />
          <h1 className="text-xl sm:text-2xl font-black text-[#8B1D24] tracking-tight uppercase">
            Ẩm Thực Quê Nhà
          </h1>
          <p className="mt-0.5 text-xs text-[#6B5E55] font-bold tracking-wider uppercase">
            Hệ Thống Quản Trị Vận Hành & CRM Tiệc
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl sm:px-10 border border-[#E8E2D9]">
          <div className="mb-6 border-b border-[#E8E2D9] pb-4">
            <h2 className="text-base font-bold text-[#231F20]">Đăng Nhập Hệ Thống</h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Dành riêng cho cán bộ, nhân viên thuộc chuỗi nhà hàng Quê Nhà
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-[#FDE8E8] border border-[#9B1C1C] text-xs text-[#9B1C1C] font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Form đăng nhập truyền thống */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6B5E55] uppercase tracking-wider mb-1">
                Tài khoản Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8E82]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tql_pnt@quenha.vn / qlca_sang_pnt@quenha.vn"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#D5C9BC] rounded-lg focus:border-[#8B1D24] focus:outline-none focus:ring-1 focus:ring-[#8B1D24]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B5E55] uppercase tracking-wider mb-1">
                Mật khẩu *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8E82]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#D5C9BC] rounded-lg focus:border-[#8B1D24] focus:outline-none focus:ring-1 focus:ring-[#8B1D24]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] focus:outline-none transition-colors cursor-pointer"
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            </button>
          </form>

          {/* HỘP ĐĂNG NHẬP NHANH THEO CHI NHÁNH & CA TRỰC THỰC TẾ (1-CLICK LOGIN) */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D9]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#8B1D24] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C58940]" />
                <span>Đăng Nhập Thử Nghiệm Đi Theo Chi Nhánh:</span>
              </div>
              <span className="text-[11px] font-semibold text-[#6B5E55]">3 TQL Độc Lập</span>
            </div>

            {/* TAB CHUYỂN ĐỔI 4 KHỐI CHI NHÁNH */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl mb-3">
              {branchGroups.map((g) => {
                const isActive = selectedBranchTab === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedBranchTab(g.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-[#8B1D24] text-white shadow-xs'
                        : 'text-[#6B5E55] hover:text-[#231F20] hover:bg-white/60'
                    }`}
                  >
                    <span>{g.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Danh sách vai trò của Chi nhánh đang chọn */}
            <div className="space-y-1.5 bg-[#FAF7F2]/50 p-2.5 rounded-xl border border-[#E8E2D9]">
              <div className="text-[11px] font-bold text-[#8B1D24] flex items-center justify-between pb-1.5 border-b border-[#E8E2D9]/60">
                <span>{currentBranchGroup.name} — {currentBranchGroup.subtitle}</span>
                <span className="text-[10px] text-[#6B5E55]">Bấm để vào ngay</span>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                {currentBranchGroup.profiles.map((item) => {
                  const prof = TEST_PROFILES[item.key];
                  if (!prof) return null;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleLogin(prof)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#E8E2D9] bg-white hover:border-[#8B1D24] hover:bg-[#FDF6EE] transition-all text-left text-xs group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${item.color}`}>
                          {item.levelBadge}
                        </span>
                        <div className="truncate">
                          <div className="font-bold text-[#231F20] group-hover:text-[#8B1D24] truncate">
                            {prof.job_title_name}
                          </div>
                          <div className="text-[11px] text-[#6B5E55] truncate">
                            {prof.department_name} • {prof.is_all_branches ? 'Toàn chuỗi 3 chi nhánh' : prof.branches[0]?.name}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#9C8E82] group-hover:text-[#8B1D24] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ghi chú cơ chế phân quyền Quê Nhà */}
            <div className="mt-3 p-2.5 rounded-lg bg-[#FDF6EE] border border-[#C58940]/30 text-[11px] text-[#6B5E55] leading-relaxed">
              <strong className="text-[#8B1D24]">📌 Quy tắc vận hành Quê Nhà:</strong> Mỗi nhà hàng có{' '}
              <strong>1 Tổng Quản Lý (Level 4)</strong> toàn quyền quản lý chi nhánh của mình (thêm phòng VIP, sơ đồ bàn, duyệt cọc, duyệt hủy tiệc). Dưới đó là các{' '}
              <strong>Quản Lý (Level 5)</strong> hỗ trợ theo ca sáng/tối và cụm khu vực.
            </div>
          </div>
        </div>

        {/* Footer ghi chú bảo mật */}
        <div className="mt-6 text-center text-xs text-[#9C8E82]">
          Hệ thống bảo mật dữ liệu nội bộ chuỗi Nhà Hàng Ẩm Thực Quê Nhà © 2026
        </div>
      </div>
    </div>
  );
}

