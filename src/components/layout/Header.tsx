'use client';

import React, { useState } from 'react';
import { Menu, LogOut, UserCheck } from 'lucide-react';
import { UserProfile, TEST_PROFILES } from '@/lib/auth/permissions';
import { BranchSelector } from './BranchSelector';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: UserProfile;
  onOpenSidebar: () => void;
  onSwitchUser?: (newUser: UserProfile) => void;
}

export function Header({ user, onOpenSidebar, onSwitchUser }: HeaderProps) {
  const router = useRouter();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('quenha_current_user');
    document.cookie = 'quenha_mock_user=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    window.location.href = '/login';
  };

  const handleSelectRole = (roleKey: string) => {
    const selected = TEST_PROFILES[roleKey];
    if (selected) {
      localStorage.setItem('quenha_current_user', JSON.stringify(selected));
      document.cookie = `quenha_mock_user=${encodeURIComponent(
        JSON.stringify({ id: selected.id, role_code: selected.role_code, level: selected.level })
      )}; path=/; max-age=86400; SameSite=Lax`;
      if (onSwitchUser) {
        onSwitchUser(selected);
      } else {
        window.location.reload();
      }
    }
    setShowRoleSwitcher(false);
  };

  // Lọc danh sách vai trò theo 6 Cấp Bậc (Loại bỏ các key alias trùng)
  const distinctRoles = [
    { key: 'hdtv', levelBadge: 'Level 1' },
    { key: 'super_admin', levelBadge: 'Level 2' },
    { key: 'dept_head_mkt', levelBadge: 'Level 3' },
    { key: 'general_manager', levelBadge: 'Level 4' },
    { key: 'branch_manager', levelBadge: 'Level 5' },
    { key: 'staff_sales', levelBadge: 'Level 6' },
    { key: 'accountant', levelBadge: 'Level 6' },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E8E2D9] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-[#6B5E55] hover:bg-[#FBF9F5] hover:text-[#8B1D24]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo Quê Nhà Dáng Oval Tự Nhiên Không Khung Bo Tròn */}
        <img
          src="/logo-oval-transparent.png"
          alt="Quê Nhà"
          className="h-8 w-auto object-contain lg:hidden drop-shadow-xs shrink-0"
        />

        {/* Branch Selector */}
        <BranchSelector user={user} />
      </div>

      <div className="flex items-center space-x-3">
        {/* Nút Chuyển nhanh vai trò để test kiểm tra chéo */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#C58940]/40 bg-[#FDF6EE] hover:bg-[#F5EFE6] text-xs font-semibold text-[#8B1D24] transition-colors cursor-pointer"
            title="Đổi vai trò để kiểm tra phân quyền động"
          >
            <UserCheck className="w-4 h-4 text-[#C58940]" />
            <span className="hidden sm:inline">Thử vai trò:</span>
            <span className="underline font-bold">L{user.level || 1} • {user.role_name}</span>
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-[#E8E2D9] shadow-xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 text-[11px] font-bold text-[#6B5E55] uppercase tracking-wider border-b border-[#E8E2D9]">
                Chọn Chức Danh Để Thử Phân Quyền
              </div>
              <div className="py-1 space-y-1 max-h-80 overflow-y-auto">
                {distinctRoles.map((item) => {
                  const prof = TEST_PROFILES[item.key];
                  if (!prof) return null;
                  const isCurrent = user.role_code === prof.role_code && user.job_title_code === prof.job_title_code;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleSelectRole(item.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                        isCurrent
                          ? 'bg-[#8B1D24] text-white'
                          : 'hover:bg-[#FBF9F5] text-[#231F20]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{prof.job_title_name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-[#F2ECE3] text-[#8B1D24]'
                        }`}>
                          {item.levelBadge}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] mt-0.5 ${
                          isCurrent ? 'text-white/80' : 'text-[#6B5E55]'
                        }`}
                      >
                        {prof.department_name} • {prof.is_all_branches ? 'Toàn chuỗi' : prof.branches[0]?.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Nút Đăng xuất */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-[#6B5E55] hover:bg-[#FDE8E8] hover:text-[#9B1C1C] transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
