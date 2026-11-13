'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  PenTool,
  Sparkles,
  Users,
  Grid,
  FileSpreadsheet,
  Settings,
  X,
  Layers,
} from 'lucide-react';
import { UserProfile, checkPermission } from '@/lib/auth/permissions';

interface SidebarProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  module: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  subItems?: { title: string; href: string }[];
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const allMenuItems: MenuItem[] = [
    {
      title: 'Bảng Điều Khiển',
      module: 'dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Quản Lý Chiến Dịch',
      module: 'marketing',
      href: '/marketing/campaigns',
      icon: Calendar,
      subItems: [
        { title: 'Chiến dịch', href: '/marketing/campaigns' },
        { title: 'Đầu việc (Tasks)', href: '/marketing/tasks' },
      ],
    },
    {
      title: 'Xưởng Content',
      module: 'content',
      href: '/marketing/content',
      icon: PenTool,
    },
    {
      title: 'Kỹ Năng AI (Skills)',
      module: 'skills',
      href: '/marketing/skills',
      icon: Sparkles,
      badge: 'M4',
    },
    {
      title: 'CRM & Phễu Tiệc',
      module: 'crm',
      href: '/crm/bookings',
      icon: Users,
      badge: 'M5',
      subItems: [
        { title: 'Phễu Tiệc (Kanban)', href: '/crm/bookings' },
        { title: 'Hồ sơ Khách 360°', href: '/crm/customers' },
      ],
    },
    {
      title: 'Sơ Đồ Bàn / Phòng',
      module: 'floor',
      href: '/operations/floor-map',
      icon: Grid,
      badge: 'M6',
      subItems: [
        { title: 'Sơ đồ theo Ca & Canvas', href: '/operations/floor-map' },
      ],
    },
    {
      title: 'Đối Soát MISA (3 Chốt)',
      module: 'misa',
      href: '/finance/reconciliation',
      icon: FileSpreadsheet,
      badge: 'M7',
    },
    {
      title: 'Cấu Hình Danh Mục',
      module: 'admin',
      href: '/admin/lookups',
      icon: Layers,
    },
    {
      title: 'Quản Trị Hệ Thống',
      module: 'admin',
      href: '/admin/branches',
      icon: Settings,
      subItems: [
        { title: 'Chi nhánh', href: '/admin/branches' },
        { title: 'Phòng ban', href: '/admin/departments' },
        { title: 'Người dùng', href: '/admin/users' },
        { title: 'Phân quyền & Chức danh', href: '/admin/roles' },
      ],
    },
  ];

  // Lọc menu theo quyền người dùng thực tế (có fallback an toàn khi render tĩnh & hỗ trợ kiêm nhiệm)
  const userRole = user?.role_code || 'BGD';
  const visibleMenuItems = allMenuItems.filter((item) =>
    checkPermission(userRole, item.module, user?.secondary_roles)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8E2D9] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-[#E8E2D9] px-4 flex items-center justify-between bg-[#FAF7F2]">
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            {/* Real Official Brand Logo - Dáng Oval Tự Nhiên Không Bo Tròn */}
            <img
              src="/logo-oval-transparent.png"
              alt="Logo Ẩm Thực Quê Nhà"
              className="h-9 sm:h-10 w-auto object-contain shrink-0 drop-shadow-xs"
            />
            <div>
              <div className="text-xs font-black text-[#8B1D24] tracking-tight leading-none uppercase">
                ẨM THỰC QUÊ NHÀ
              </div>
              <div className="text-[9px] text-[#6B5E55] font-bold tracking-wider uppercase mt-1">
                CRM & Quản Trị Nội Bộ
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-[#6B5E55] hover:text-[#8B1D24]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#9C8E82]">
            Phân hệ theo quyền ({user.role_name})
          </div>

          {visibleMenuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#8B1D24] text-white shadow-xs'
                      : 'text-[#231F20] hover:bg-[#FBF9F5] hover:text-[#8B1D24]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8B1D24]'}`} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white text-[#8B1D24]'
                          : 'bg-[#F7EAEB] text-[#8B1D24]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Subitems if active */}
                {isActive && item.subItems && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onClose}
                          className={`block px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                            isSubActive
                              ? 'text-[#8B1D24] font-bold bg-[#F7EAEB]'
                              : 'text-[#6B5E55] hover:text-[#8B1D24]'
                          }`}
                        >
                          • {sub.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Card footer - Chỉ hiển thị Chức Danh & Cấp Bậc (Không để tên cá nhân) */}
        <div className="p-3 border-t border-[#E8E2D9] bg-[#FAF7F2]">
          <div className="flex items-center space-x-2.5 px-1 py-1">
            <div className="w-8 h-8 rounded-lg bg-[#8B1D24] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              L{user.level || 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#231F20] truncate">
                {user.job_title_name || user.role_name}
              </div>
              <div className="text-[10px] text-[#6B5E55] truncate font-medium">
                {user.role_name} • {user.department_name}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
