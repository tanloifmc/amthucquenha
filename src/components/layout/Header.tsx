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

  // Danh mục vai trò tổ chức theo 4 Khối Chi Nhánh & Ca Trực Thực Tế
  const branchRoleGroups = [
    {
      groupName: '🏢 Trụ Sở HQ (Toàn Chuỗi)',
      roles: [
        { key: 'hdtv', levelBadge: 'Level 1' },
        { key: 'super_admin', levelBadge: 'Level 2' },
        { key: 'dept_head_mkt', levelBadge: 'Level 3' },
        { key: 'accountant', levelBadge: 'Level 6' },
      ],
    },
    {
      groupName: '📍 Quê Nhà - Phạm Ngọc Thạch (Quận 3)',
      roles: [
        { key: 'gm_pnt', levelBadge: 'Level 4' },
        { key: 'mgr_shift_pnt', levelBadge: 'Level 5' },
        { key: 'mgr_morning_pnt', levelBadge: 'Level 5' },
        { key: 'staff_sales_pnt', levelBadge: 'Level 6' },
      ],
    },
    {
      groupName: '📍 Quê Nhà - Thành Thái (Quận 10)',
      roles: [
        { key: 'gm_tt', levelBadge: 'Level 4' },
        { key: 'mgr_shift_tt', levelBadge: 'Level 5' },
        { key: 'mgr_evening_tt', levelBadge: 'Level 5' },
        { key: 'cashier_tt', levelBadge: 'Level 6' },
      ],
    },
    {
      groupName: '📍 Quê Nhà - Nguyễn Thái Bình (Tân Bình)',
      roles: [
        { key: 'gm_ntb', levelBadge: 'Level 4' },
        { key: 'mgr_morning_ntb', levelBadge: 'Level 5' },
        { key: 'mgr_shift_ntb', levelBadge: 'Level 5' },
        { key: 'staff_sales_ntb', levelBadge: 'Level 6' },
      ],
    },
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
        {/* Nút Chuyển nhanh vai trò để test kiểm tra chéo theo chi nhánh */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#C58940]/40 bg-[#FDF6EE] hover:bg-[#F5EFE6] text-xs font-semibold text-[#8B1D24] transition-colors cursor-pointer"
            title="Đổi vai trò để kiểm tra phân quyền động theo từng chi nhánh"
          >
            <UserCheck className="w-4 h-4 text-[#C58940]" />
            <span className="hidden sm:inline">Thử vai trò:</span>
            <span className="underline font-bold">L{user.level || 1} • {user.role_name}</span>
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-xl bg-white border border-[#E8E2D9] shadow-xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 text-[11px] font-bold text-[#8B1D24] uppercase tracking-wider border-b border-[#E8E2D9] flex items-center justify-between">
                <span>Chọn Vai Trò Theo Chi Nhánh</span>
                <span className="text-[10px] text-[#6B5E55] font-normal">3 TQL Độc Lập</span>
              </div>
              <div className="py-1 space-y-3 max-h-96 overflow-y-auto">
                {branchRoleGroups.map((group) => (
                  <div key={group.groupName} className="space-y-1">
                    <div className="px-2 pt-1 text-[10px] font-bold text-[#6B5E55] uppercase tracking-wider bg-[#FAF7F2] py-0.5 rounded">
                      {group.groupName}
                    </div>
                    {group.roles.map((item) => {
                      const prof = TEST_PROFILES[item.key];
                      if (!prof) return null;
                      const isCurrent = user.role_code === prof.role_code && user.job_title_code === prof.job_title_code;
                      return (
                        <button
                          key={item.key}
                          onClick={() => handleSelectRole(item.key)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                            isCurrent
                              ? 'bg-[#8B1D24] text-white shadow-2xs'
                              : 'hover:bg-[#FBF9F5] text-[#231F20]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold truncate">{prof.job_title_name}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                              isCurrent ? 'bg-white/20 text-white' : 'bg-[#F2ECE3] text-[#8B1D24]'
                            }`}>
                              {item.levelBadge}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] mt-0.5 truncate ${
                              isCurrent ? 'text-white/80' : 'text-[#6B5E55]'
                            }`}
                          >
                            {prof.department_name} • {prof.is_all_branches ? 'Toàn chuỗi' : prof.branches[0]?.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
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
