'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TEST_PROFILES, UserProfile } from '@/lib/auth/permissions';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (profile: UserProfile) => {
    setLoading(true);
    setErrorMessage('');

    // Lưu session giả lập chuẩn
    localStorage.setItem('quenha_current_user', JSON.stringify(profile));

    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    // Kiểm tra email test
    const matched = Object.values(TEST_PROFILES).find(
      (p) => p.email?.toLowerCase() === email.toLowerCase()
    );

    if (matched) {
      handleLogin(matched);
    } else {
      // Mặc định đăng nhập với quyền BGD
      handleLogin(TEST_PROFILES.bgd);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo Quê Nhà */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8B1D24] text-white font-black text-2xl shadow-md mb-4 border border-[#72161C]">
          QN
        </div>
        <h1 className="text-2xl font-black text-[#8B1D24] tracking-tight uppercase">
          Ẩm Thực Quê Nhà
        </h1>
        <p className="mt-1 text-xs text-[#6B5E55] font-semibold tracking-wide uppercase">
          Hệ Thống Quản Trị Vận Hành & CRM Tiệc
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
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
                  placeholder="nhanvien@quenha.vn"
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
              className="w-full mt-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] focus:outline-none transition-colors"
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            </button>
          </form>

          {/* Hộp Đăng Nhập Nhanh Để Kiểm Thử Nghiệm Thu (Anh Lợi & CTO kiểm tra) */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D9]">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#8B1D24] uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-[#C58940]" />
              <span>Đăng nhập thử nghiệm theo 5 vai trò (Sprint 0 QA):</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {Object.entries(TEST_PROFILES).map(([key, prof]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleLogin(prof)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#E8E2D9] hover:border-[#8B1D24] hover:bg-[#FDF6EE] transition-all text-left text-xs group"
                >
                  <div>
                    <div className="font-bold text-[#231F20] group-hover:text-[#8B1D24]">
                      {prof.full_name}
                    </div>
                    <div className="text-[11px] text-[#6B5E55]">
                      {prof.role_name} — {prof.department_name}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#9C8E82] group-hover:text-[#8B1D24] group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
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
