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
    router.push('/login');
  };

  const handleSelectRole = (roleKey: string) => {
    const selected = TEST_PROFILES[roleKey];
    if (selected) {
      localStorage.setItem('quenha_current_user', JSON.stringify(selected));
      if (onSwitchUser) {
        onSwitchUser(selected);
      } else {
        window.location.reload();
      }
    }
    setShowRoleSwitcher(false);
  };

  return (
    <header className="h-16 bg-white border-b border-[#E8E2D9] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-[#6B5E55] hover:bg-[#FBF9F5] hover:text-[#8B1D24]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <img
          src="/logo-round.png"
          alt="Quê Nhà"
          className="w-8 h-8 rounded-full border border-[#C58940]/50 lg:hidden shadow-xs shrink-0"
        />

        {/* Branch Selector */}
        <BranchSelector user={user} />
      </div>

      <div className="flex items-center space-x-3">
        {/* Nút Chuyển nhanh vai trò để test kiểm tra chéo */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#C58940]/40 bg-[#FDF6EE] hover:bg-[#F5EFE6] text-xs font-semibold text-[#8B1D24] transition-colors"
            title="Đổi vai trò để kiểm tra phân quyền động"
          >
            <UserCheck className="w-4 h-4 text-[#C58940]" />
            <span className="hidden sm:inline">Thử vai trò:</span>
            <span className="underline">{user.role_name}</span>
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-[#E8E2D9] shadow-xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 text-[11px] font-bold text-[#6B5E55] uppercase tracking-wider border-b border-[#E8E2D9]">
                Chọn vai trò để test phân quyền
              </div>
              <div className="py-1 space-y-1">
                {Object.entries(TEST_PROFILES).map(([key, prof]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectRole(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                      user.role_code === prof.role_code
                        ? 'bg-[#8B1D24] text-white'
                        : 'hover:bg-[#FBF9F5] text-[#231F20]'
                    }`}
                  >
                    <span className="font-bold">{prof.full_name}</span>
                    <span
                      className={`text-[10px] ${
                        user.role_code === prof.role_code ? 'text-white/80' : 'text-[#6B5E55]'
                      }`}
                    >
                      {prof.department_name} ({prof.role_code})
                    </span>
                  </button>
                ))}
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
