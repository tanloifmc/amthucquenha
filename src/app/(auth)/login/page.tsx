'use client';

import React, { useState } from 'react';
import { TEST_PROFILES, UserProfile } from '@/lib/auth/permissions';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  // Danh mục 6 Cấp Bậc chuẩn F&B để kiểm thử (Chỉ hiển thị Chức danh, không để tên nhân vật)
  const sampleProfiles = [
    { key: 'hdtv', levelBadge: 'Level 1', color: 'border-red-300 bg-red-50 text-red-800' },
    { key: 'super_admin', levelBadge: 'Level 2', color: 'border-indigo-300 bg-indigo-50 text-indigo-800' },
    { key: 'dept_head_mkt', levelBadge: 'Level 3', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
    { key: 'general_manager', levelBadge: 'Level 4', color: 'border-amber-300 bg-amber-50 text-amber-800' },
    { key: 'branch_manager', levelBadge: 'Level 5', color: 'border-orange-300 bg-orange-50 text-orange-800' },
    { key: 'staff_sales', levelBadge: 'Level 6', color: 'border-stone-300 bg-stone-50 text-stone-800' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo Quê Nhà Thật - Dáng Oval Tự Nhiên, Không Khung Bo Tròn */}
        <div className="flex flex-col items-center justify-center mb-5">
          <img
            src="/logo-badge.png"
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

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
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
                  placeholder="hdtv@quenha.vn / ql_pnt@quenha.vn"
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

          {/* Hộp Đăng Nhập Nhanh Theo 6 Cấp Bậc (Chỉ hiển thị Chức danh & Cấp bậc, không để tên cá nhân) */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D9]">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#8B1D24] uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-[#C58940]" />
              <span>Đăng Nhập Thử Nghiệm Theo Cấp Bậc (1-Click Login):</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {sampleProfiles.map((item) => {
                const prof = TEST_PROFILES[item.key];
                if (!prof) return null;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleLogin(prof)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#E8E2D9] hover:border-[#8B1D24] hover:bg-[#FDF6EE] transition-all text-left text-xs group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.color}`}>
                        {item.levelBadge}
                      </span>
                      <div>
                        <div className="font-bold text-[#231F20] group-hover:text-[#8B1D24]">
                          {prof.job_title_name}
                        </div>
                        <div className="text-[11px] text-[#6B5E55]">
                          {prof.department_name} • {prof.is_all_branches ? 'Toàn chuỗi 3 chi nhánh' : prof.branches[0]?.name}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9C8E82] group-hover:text-[#8B1D24] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                );
              })}
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
