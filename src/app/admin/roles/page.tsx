'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowLeft,
  Check,
  Lock,
  BookOpen,
  Settings2,
  Users,
  Building2,
  Printer,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  Filter,
  MapPin,
} from 'lucide-react';
import {
  ROLE_HIERARCHY,
  MODULE_PERMISSIONS_MATRIX,
  INITIAL_JOB_TITLES,
  JobTitleRecord,
  RoleLevel,
} from '@/lib/auth/permissions';

export default function AdminRolesPage() {
  const [activeTab, setActiveTab] = useState<'GUIDE' | 'MANAGEMENT'>('GUIDE');
  const [jobTitles, setJobTitles] = useState<JobTitleRecord[]>(INITIAL_JOB_TITLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('all');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');

  // Modal Thêm Chức Danh Mới
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJobName, setNewJobName] = useState('');
  const [newJobCode, setNewJobCode] = useState('');
  const [newJobDept, setNewJobDept] = useState('FOH_MANAGEMENT');
  const [newJobLevel, setNewJobLevel] = useState<RoleLevel>(6);
  const [newJobBranch, setNewJobBranch] = useState<'HQ' | 'QN_PNT' | 'QN_TT' | 'QN_NTB'>('QN_PNT');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Bộ lọc danh mục chức danh
  const filteredJobTitles = jobTitles.filter((job) => {
    const matchesSearch =
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDeptFilter === 'all' || job.department_code === selectedDeptFilter;
    const matchesLevel = selectedLevelFilter === 'all' || job.level === Number(selectedLevelFilter);
    const matchesBranch =
      selectedBranchFilter === 'all' ||
      job.branch_code === selectedBranchFilter ||
      (!job.branch_code && selectedBranchFilter === 'HQ');

    return matchesSearch && matchesDept && matchesLevel && matchesBranch;
  });

  // Xử lý tạo chức danh mới
  const handleCreateJobTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobName.trim() || !newJobCode.trim()) return;

    const deptMap: Record<string, string> = {
      BGD_HDTV: 'Ban Giám Đốc & HĐTV',
      MARKETING: 'Phòng Marketing & Truyền Thông',
      ACCOUNTING: 'Phòng Tài Chính - Kế Toán',
      HR: 'Phòng Nhân Sự & Đào Tạo',
      PURCHASING: 'Phòng Thu Mua & Cung Ứng',
      FOH_MANAGEMENT: 'Bộ Phận Quản Lý Sảnh & Vận Hành',
      RECEPTION_CSKH: 'Bộ Phận Đón Tiếp & CSKH',
      SERVICE_BAR: 'Bộ Phận Phục Vụ & Pha Chế',
      CASHIER: 'Bộ Phận Thu Ngân',
      KITCHEN_BOH: 'Bộ Phận Bếp & Bar (BOH)',
      SECURITY_MAINTENANCE: 'Bộ Phận Bảo Vệ & Kỹ Thuật',
    };

    const branchNameMap: Record<string, string> = {
      HQ: 'Trụ Sở Điều Hành (HQ)',
      QN_PNT: 'Quê Nhà - Phạm Ngọc Thạch',
      QN_TT: 'Quê Nhà - Thành Thái',
      QN_NTB: 'Quê Nhà - Nguyễn Thái Bình',
    };

    const roleMap: Record<number, string> = {
      1: 'HDTV',
      2: 'SUPER_ADMIN',
      3: 'DEPARTMENT_HEAD',
      4: 'GENERAL_MANAGER',
      5: 'BRANCH_MANAGER',
      6: 'STAFF',
    };

    const newRecord: JobTitleRecord = {
      id: Date.now(),
      name: newJobName.trim(),
      code: newJobCode.trim().toUpperCase(),
      department_code: newJobDept,
      department_name: deptMap[newJobDept] || newJobDept,
      level: newJobLevel,
      role_code: roleMap[newJobLevel] || 'STAFF',
      branch_code: newJobBranch,
      branch_name: branchNameMap[newJobBranch] || 'Chi Nhánh Quê Nhà',
      description: newJobDesc.trim() || 'Chức vụ vận hành tại Chuỗi Quê Nhà',
      is_active: true,
    };

    setJobTitles([newRecord, ...jobTitles]);
    setShowAddJobModal(false);
    setNewJobName('');
    setNewJobCode('');
    setNewJobDesc('');
    setNotification(`Đã tạo thành công chức danh "${newRecord.name}" (Level ${newRecord.level} - ${newRecord.branch_name})!`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Toggle trạng thái kích hoạt chức danh
  const handleToggleJobStatus = (id: number) => {
    setJobTitles(
      jobTitles.map((j) => (j.id === id ? { ...j, is_active: !j.is_active } : j))
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER ĐIỀU HÀNH */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#8B1D24] hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#231F20] tracking-tight">
              Hệ Thống Phân Quyền & Danh Mục Chức Danh F&B
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1D24] text-white">
              6 Cấp Bậc (RBAC)
            </span>
          </div>
          <p className="text-sm text-[#6B5E55] mt-1">
            Chuẩn hóa 6 Cấp bậc Hierarchy, phạm vi chi nhánh (HQ vs Store) và ma trận phân quyền 7 phân hệ nghiệp vụ.
          </p>
        </div>

        {/* NÚT CHUYỂN TAB & NÚT IN TÀI LIỆU */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-[#FAF7F2] border border-[#D5C9BC] rounded-xl shadow-xs">
            <button
              onClick={() => setActiveTab('GUIDE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'GUIDE'
                  ? 'bg-[#8B1D24] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#231F20]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tài Liệu Ma Trận (Nội Bộ)</span>
            </button>

            <button
              onClick={() => setActiveTab('MANAGEMENT')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'MANAGEMENT'
                  ? 'bg-[#8B1D24] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#231F20]'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Quản Trị Chức Danh ({jobTitles.length})</span>
            </button>
          </div>

          {activeTab === 'GUIDE' && (
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#D5C9BC] bg-white text-[#6B5E55] hover:text-[#8B1D24] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 shadow-xs"
              title="In bản hướng dẫn phân quyền lưu hành nội bộ"
            >
              <Printer className="w-4 h-4 text-[#8B1D24]" />
              <span>In Tài Liệu</span>
            </button>
          )}
        </div>
      </div>

      {/* THÔNG BÁO HOÀN TẤT THAO TÁC */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: 📖 TÀI LIỆU MA TRẬN PHÂN QUYỀN NỘI BỘ                             */}
      {/* ========================================================================= */}
      {activeTab === 'GUIDE' && (
        <div className="space-y-6">
          {/* BANNER NGUYÊN TẮC KIẾN TRÚC 3 CHIỀU */}
          <div className="bg-gradient-to-r from-[#8B1D24] via-[#72161C] to-[#5C1116] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-4xl space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#C58940]" />
                <span>Kiến Trúc Phân Quyền Đa Tầng Quê Nhà</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Mô Hình Kết Hợp 3 Chiều Độc Lập
              </h2>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                Hệ thống kết hợp đồng thời: <strong>(1) Cấp Bậc (Role Level 1 - 6)</strong> quyết định độ rộng quyền;{' '}
                <strong>(2) Phạm Vi Chi Nhánh (Branch Scope)</strong> bảo đảm tính phân lập dữ liệu (Data Isolation); và{' '}
                <strong>(3) Phòng Ban Chuyên Môn</strong> bảo mật dữ liệu nhạy cảm giữa các bộ phận.
              </p>
            </div>

            {/* Watermark Logo Quê Nhà Thật */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none hidden md:block">
              <img
                src="/logo-oval-transparent.png"
                alt="Logo Quê Nhà"
                className="w-56 object-contain brightness-200 contrast-125"
              />
            </div>
          </div>

          {/* SƠ ĐỒ KIM TỰ THÁP 6 CẤP BẬC HIERARCHY */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#8B1D24]" />
                <h3 className="font-bold text-sm text-[#231F20] uppercase">
                  Sơ Đồ Kim Tự Tháp 6 Cấp Bậc (Level 1 Đến Level 6)
                </h3>
              </div>
              <span className="text-xs text-[#6B5E55]">Tra cứu thẩm quyền chức danh</span>
            </div>

            <div className="space-y-3">
              {ROLE_HIERARCHY.map((role) => (
                <div
                  key={role.id}
                  className="p-4 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] hover:bg-white hover:border-[#8B1D24]/40 transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ${role.badge_class}`}
                    >
                      L{role.level}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-[#231F20]">{role.title}</h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#D5C9BC] text-[#6B5E55] font-semibold">
                          {role.code}
                        </span>
                        <span className="text-[11px] font-semibold text-[#8B1D24] bg-[#FDF6EE] px-2 py-0.5 rounded border border-[#E8E2D9]">
                          Phạm vi: {role.scope_description}
                        </span>
                      </div>
                      <p className="text-xs text-[#554A41] mt-1 leading-relaxed">
                        {role.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        role.scope_type === 'ALL_BRANCHES'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {role.scope_type === 'ALL_BRANCHES' ? 'Toàn Chuỗi 3 CN' : 'Cục Bộ 1 Chi Nhánh'}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                        role.can_approve
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {role.can_approve ? '✓ Có Quyền Ký Duyệt' : 'Thực Thi'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CƠ CHẾ VẬN HÀNH THỰC TẾ: 3 TỔNG QUẢN LÝ CHO 3 CHI NHÁNH & QUẢN LÝ THEO CA / KHU VỰC */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#E8E2D9] gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#8B1D24]" />
                  <h3 className="font-bold text-sm text-[#231F20] uppercase">
                    Cơ Chế Phân Cấp Đi Theo Chi Nhánh: 3 Tổng Quản Lý & Quản Lý Ca / Khu Vực
                  </h3>
                </div>
                <p className="text-xs text-[#6B5E55] mt-0.5">
                  Mỗi nhà hàng có 1 Tổng Quản Lý toàn quyền điều hành cơ sở. Dưới đó là các Quản lý hỗ trợ theo Ca (Sáng/Tối) và Khu vực (Sảnh/Phòng VIP).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDF6EE] text-[#8B1D24] border border-[#E8E2D9] self-start sm:self-auto">
                3 Chi Nhánh Độc Lập
              </span>
            </div>

            {/* GRID 4 CỘT CHI NHÁNH */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* CỘT 1: TRỤ SỞ HQ */}
              <div className="rounded-xl border border-[#D5C9BC] bg-[#FAF7F2] p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
                    <span className="font-extrabold text-xs text-[#8B1D24] uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#8B1D24]" />
                      Trụ Sở HQ
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Toàn Chuỗi</span>
                  </div>
                  <div className="text-[11px] text-[#554A41] font-medium leading-relaxed">
                    Điều hành chiến lược, kiểm toán tài chính & marketing chuỗi
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#8B1D24]">HĐTV / Chủ Đầu Tư</strong>
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">L1</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Giám sát tối cao, xem toàn bộ báo cáo doanh thu & P&L</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#2B6CB0]">Super Admin / CTO</strong>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">L2</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Quản trị hệ thống, cấp quyền, API AI và nhật ký</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#2A7238]">Trưởng Phòng Chuyên Môn</strong>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">L3</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">TP MKT duyệt chiến dịch; Kế toán trưởng đối soát MISA</p>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-[#8B1D24] font-semibold bg-white/80 p-2 rounded border border-[#E8E2D9]">
                  ✓ Xem dữ liệu hợp nhất 3 chi nhánh
                </div>
              </div>

              {/* CỘT 2: CHI NHÁNH PHẠM NGỌC THẠCH */}
              <div className="rounded-xl border border-amber-300/80 bg-[#FFFDF9] p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <span className="font-extrabold text-xs text-[#8B1D24] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C58940]" />
                      CN Phạm Ngọc Thạch
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Quận 3</span>
                  </div>
                  <div className="text-[11px] text-[#554A41] font-medium leading-relaxed">
                    28 Phạm Ngọc Thạch, P. Võ Thị Sáu, Quận 3
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-900">Tổng Quản Lý Cơ Sở</strong>
                        <span className="text-[10px] font-bold text-white bg-amber-600 px-1.5 py-0.5 rounded">L4</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Toàn quyền cơ sở PNT: sơ đồ bàn Canvas 2D, thêm phòng VIP, duyệt cọc, hủy tiệc</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#231F20]">Quản Lý Ca Tối & Cụm VIP</strong>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">L5</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Ca tối 16:30 - 23:00, kiểm soát phòng VIP riêng tư</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#231F20]">Quản Lý Ca Sáng & Sảnh Trệt</strong>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">L5</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Ca sáng 09:00 - 16:30, tiếp khách ăn trưa & sảnh trệt</p>
                    </div>
                    <div className="p-1.5 rounded bg-[#FAF7F2] text-[10px] text-[#6B5E55]">
                      <strong>Nhân viên (L6):</strong> Sales tiệc, Lễ tân đón tiếp, Thu ngân PNT
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-amber-800 font-semibold bg-amber-50 p-2 rounded border border-amber-200">
                  🔒 Phân lập dữ liệu chi nhánh Quận 3
                </div>
              </div>

              {/* CỘT 3: CHI NHÁNH THÀNH THÁI */}
              <div className="rounded-xl border border-amber-300/80 bg-[#FFFDF9] p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <span className="font-extrabold text-xs text-[#8B1D24] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C58940]" />
                      CN Thành Thái
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Quận 10</span>
                  </div>
                  <div className="text-[11px] text-[#554A41] font-medium leading-relaxed">
                    05 Thành Thái, Phường 14, Quận 10
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-900">Tổng Quản Lý Cơ Sở</strong>
                        <span className="text-[10px] font-bold text-white bg-amber-600 px-1.5 py-0.5 rounded">L4</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Toàn quyền cơ sở TT: sơ đồ sân vườn, thêm phòng VIP, duyệt cọc, hủy tiệc</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#231F20]">Quản Lý Ca Sáng & Sân Vườn</strong>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">L5</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Ca sáng 09:00 - 16:30, sảnh sân vườn cây xanh thoáng đãng</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#231F20]">Quản Lý Ca Tối & Lầu VIP</strong>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">L5</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Ca tối 16:30 - 23:00, tiệc gia đình, tiếp khách lầu VIP</p>
                    </div>
                    <div className="p-1.5 rounded bg-[#FAF7F2] text-[10px] text-[#6B5E55]">
                      <strong>Nhân viên (L6):</strong> Thu ngân chính, Sales tiệc, Đón tiếp TT
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-amber-800 font-semibold bg-amber-50 p-2 rounded border border-amber-200">
                  🔒 Phân lập dữ liệu chi nhánh Quận 10
                </div>
              </div>

              {/* CỘT 4: CHI NHÁNH NGUYỄN THÁI BÌNH */}
              <div className="rounded-xl border border-amber-300/80 bg-[#FFFDF9] p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <span className="font-extrabold text-xs text-[#8B1D24] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C58940]" />
                      CN Nguyễn Thái Bình
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Tân Bình</span>
                  </div>
                  <div className="text-[11px] text-[#554A41] font-medium leading-relaxed">
                    01 Nguyễn Thái Bình, Phường 4, Tân Bình
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-900">Tổng Quản Lý Cơ Sở</strong>
                        <span className="text-[10px] font-bold text-white bg-amber-600 px-1.5 py-0.5 rounded">L4</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Toàn quyền cơ sở NTB: sơ đồ hội nghị, thêm phòng VIP, duyệt cọc, hủy tiệc</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#231F20]">Quản Lý Ca Sáng & Hội Nghị</strong>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">L5</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Ca sáng 09:00 - 16:30, khách đoàn sân bay, đối tác công ty</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#231F20]">Quản Lý Ca Tối & Sảnh Tiệc</strong>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">L5</span>
                      </div>
                      <p className="text-[10px] text-[#6B5E55]">Ca tối 16:30 - 23:00, tiệc liên hoan, sinh nhật, tất niên</p>
                    </div>
                    <div className="p-1.5 rounded bg-[#FAF7F2] text-[10px] text-[#6B5E55]">
                      <strong>Nhân viên (L6):</strong> Sales tiệc, Thu ngân, Tổ trưởng sảnh NTB
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-amber-800 font-semibold bg-amber-50 p-2 rounded border border-amber-200">
                  🔒 Phân lập dữ liệu chi nhánh Tân Bình
                </div>
              </div>
            </div>

            {/* 3 NGUYÊN TẮC VẬN HÀNH BẤT BIẾN CỦA QUÊ NHÀ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] text-xs leading-relaxed">
                <strong className="text-[#8B1D24] block mb-1">1. Ba Tổng Quản Lý Độc Lập (Branch Autonomy)</strong>
                Mỗi nhà hàng do 1 Tổng Quản Lý toàn quyền cai quản. Dữ liệu phòng bàn, cọc tiệc và nhân sự của chi nhánh này được phân lập bảo mật, chi nhánh khác không thể can thiệp.
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] text-xs leading-relaxed">
                <strong className="text-[#C58940] block mb-1">2. Quản Lý Theo Ca Trực & Phân Khu</strong>
                Quản lý cấp dưới (Level 5) chia ca (Sáng / Tối) và theo khu vực (Sảnh / Phòng VIP / Sân vườn) đảm bảo luôn có người có thẩm quyền đón khách VIP và giải quyết sự cố tại chỗ.
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] text-xs leading-relaxed">
                <strong className="text-[#2A7238] block mb-1">3. Toàn Quyền Sơ Đồ Bàn Phòng Canvas 2D</strong>
                Khi cần thêm phòng VIP mới, điều chỉnh sức chứa bàn hoặc tạm khóa bảo trì, Tổng Quản Lý tự thao tác trực tiếp trên giao diện của mình mà không cần xin duyệt qua bộ phận IT.
              </div>
            </div>
          </div>

          {/* BẢNG MA TRẬN PHÂN QUYỀN 7 MODULE CHI TIẾT */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-xs">
            <div className="p-4 bg-[#FAF7F2] border-b border-[#E8E2D9] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#231F20] uppercase">
                  Ma Trận Phân Quyền 7 Phân Hệ Nghiệp Vụ
                </h3>
                <p className="text-xs text-[#6B5E55] mt-0.5">
                  Quy định chi tiết quyền hạn của từng cấp bậc trên từng màn hình chức năng
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#8B1D24]">
                CRM Quê Nhà v2.2
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E8E2D9] text-left text-xs">
                <thead className="bg-[#FAF7F2] font-bold text-[#6B5E55] uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-3 min-w-[200px]">Phân Hệ / Nghiệp Vụ</th>
                    <th className="px-3 py-3 text-center bg-[#8B1D24]/10 text-[#8B1D24]">L1: HĐTV</th>
                    <th className="px-3 py-3 text-center bg-blue-50 text-blue-800">L2: Super Admin</th>
                    <th className="px-3 py-3 text-center bg-emerald-50 text-emerald-800">L3: Trưởng Phòng</th>
                    <th className="px-3 py-3 text-center bg-amber-50 text-amber-800">L4: Tổng Quản Lý</th>
                    <th className="px-3 py-3 text-center bg-orange-50 text-orange-800">L5: Quản Lý CN</th>
                    <th className="px-3 py-3 text-center bg-stone-100 text-stone-800">L6: Nhân Viên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9] font-medium">
                  {MODULE_PERMISSIONS_MATRIX.map((m) => (
                    <tr key={m.module_id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <strong className="text-[#231F20] block text-xs font-bold">{m.module_name}</strong>
                        <span className="text-[11px] text-[#6B5E55] leading-relaxed block mt-0.5">
                          {m.description}
                        </span>
                      </td>

                      {/* L1: HĐTV */}
                      <td className="px-3 py-3.5 text-center font-bold text-[11px]">
                        <span className="px-2 py-1 rounded-md bg-[#FDF6EE] text-[#8B1D24] border border-[#E8E2D9]">
                          {m.level_1}
                        </span>
                      </td>

                      {/* L2: Super Admin */}
                      <td className="px-3 py-3.5 text-center font-bold text-[11px]">
                        <span className="px-2 py-1 rounded-md bg-blue-100/70 text-blue-800 border border-blue-200">
                          {m.level_2}
                        </span>
                      </td>

                      {/* L3: Trưởng Phòng */}
                      <td className="px-3 py-3.5 text-center font-bold text-[11px]">
                        <span className="px-2 py-1 rounded-md bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                          {m.level_3}
                        </span>
                      </td>

                      {/* L4: Tổng Quản Lý */}
                      <td className="px-3 py-3.5 text-center font-bold text-[11px]">
                        <span className="px-2 py-1 rounded-md bg-amber-100/70 text-amber-800 border border-amber-200">
                          {m.level_4}
                        </span>
                      </td>

                      {/* L5: Quản Lý CN */}
                      <td className="px-3 py-3.5 text-center font-bold text-[11px]">
                        <span className="px-2 py-1 rounded-md bg-orange-100/70 text-orange-800 border border-orange-200">
                          {m.level_5}
                        </span>
                      </td>

                      {/* L6: Nhân Viên */}
                      <td className="px-3 py-3.5 text-center font-bold text-[11px]">
                        <span
                          className={`px-2 py-1 rounded-md ${
                            m.level_6.includes('❌')
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-stone-200/70 text-stone-800 border border-stone-300'
                          }`}
                        >
                          {m.level_6}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QUY TRÌNH PHỐI HỢP & THẨM QUYỀN KÝ DUYỆT (CHỐT CHẶN VẬN HÀNH) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#E8E2D9] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B1D24] uppercase">
                <CheckCircle2 className="w-4 h-4 text-[#8B1D24]" />
                <span>1. Thẩm Quyền Duyệt Cọc & Hủy Tiệc</span>
              </div>
              <p className="text-xs text-[#554A41] leading-relaxed">
                Chỉ <strong>Level 4 (Tổng Quản Lý)</strong> và <strong>Level 5 (Quản Lý CN)</strong> mới có quyền bấm duyệt nhận cọc hoặc hủy tiệc (nhả phòng ma). Nhân viên lễ tân/sales chỉ có quyền tiếp nhận và đính kèm ảnh UNC.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E8E2D9] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2B6CB0] uppercase">
                <Lock className="w-4 h-4 text-[#2B6CB0]" />
                <span>2. Đóng / Mở Phòng VIP & Bảo Trì</span>
              </div>
              <p className="text-xs text-[#554A41] leading-relaxed">
                <strong>Quản Lý Chi Nhánh (Level 5)</strong> có toàn quyền thêm phòng mới, đổi sức chứa hoặc tạm khóa bảo trì phòng tại cơ sở mình trực tiếp trên sơ đồ Canvas 2D mà không cần xin phê duyệt từ IT.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E8E2D9] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2A7238] uppercase">
                <ShieldCheck className="w-4 h-4 text-[#2A7238]" />
                <span>3. Chốt Đối Soát Sổ Cái MISA</span>
              </div>
              <p className="text-xs text-[#554A41] leading-relaxed">
                Chỉ <strong>Kế Toán Trưởng (Level 3)</strong> và <strong>Super Admin (Level 2)</strong> được kích hoạt nút <em>&ldquo;Xác Nhận Chốt Đối Soát&rdquo;</em> để kết chuyển tiền cọc vào Sổ Cái Tài Chính chính thức của Quê Nhà.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ⚙️ QUẢN TRỊ VAI TRÒ & DANH MỤC CHỨC DANH (SUPER ADMIN)          */}
      {/* ========================================================================= */}
      {activeTab === 'MANAGEMENT' && (
        <div className="space-y-4">
          {/* THANH TÌM KIẾM & BỘ LỌC CHỨC DANH */}
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1 max-w-2xl">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-[#A09383] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên chức danh, mã hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
              </div>

              {/* Lọc theo Chi Nhánh */}
              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="text-xs font-semibold border border-[#D5C9BC] rounded-lg px-2.5 py-2 bg-white"
              >
                <option value="all">Tất cả chi nhánh</option>
                <option value="HQ">🏢 Trụ Sở HQ (Toàn Chuỗi)</option>
                <option value="QN_PNT">📍 Quê Nhà - Phạm Ngọc Thạch (Q.3)</option>
                <option value="QN_TT">📍 Quê Nhà - Thành Thái (Q.10)</option>
                <option value="QN_NTB">📍 Quê Nhà - Nguyễn Thái Bình (Tân Bình)</option>
              </select>

              {/* Lọc theo Phòng Ban */}
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="text-xs font-semibold border border-[#D5C9BC] rounded-lg px-2.5 py-2 bg-white"
              >
                <option value="all">Tất cả phòng ban ({jobTitles.length})</option>
                <option value="BGD_HDTV">Ban Giám Đốc & HĐTV</option>
                <option value="MARKETING">Marketing & Truyền Thông</option>
                <option value="ACCOUNTING">Tài Chính - Kế Toán</option>
                <option value="HR">Nhân Sự & Đào Tạo</option>
                <option value="PURCHASING">Thu Mua & Cung Ứng</option>
                <option value="FOH_MANAGEMENT">Quản Lý Sảnh & Vận Hành</option>
                <option value="RECEPTION_CSKH">Đón Tiếp & CSKH</option>
                <option value="CASHIER">Thu Ngân</option>
                <option value="KITCHEN_BOH">Bếp & Bar (BOH)</option>
                <option value="SERVICE_BAR">Phục Vụ & Pha Chế</option>
                <option value="SECURITY_MAINTENANCE">Bảo Vệ & Kỹ Thuật</option>
              </select>

              {/* Lọc theo Level */}
              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="text-xs font-semibold border border-[#D5C9BC] rounded-lg px-2.5 py-2 bg-white"
              >
                <option value="all">Tất cả cấp bậc</option>
                <option value="1">Level 1 - HĐTV</option>
                <option value="2">Level 2 - Super Admin</option>
                <option value="3">Level 3 - Trưởng Phòng HQ</option>
                <option value="4">Level 4 - Tổng Quản Lý Chi Nhánh</option>
                <option value="5">Level 5 - Quản Lý Ca & Khu Vực</option>
                <option value="6">Level 6 - Nhân Viên Thực Thi</option>
              </select>
            </div>

            {/* Nút Thêm Chức Danh Mới */}
            <button
              onClick={() => setShowAddJobModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#8B1D24] hover:bg-[#72161C] text-white transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Chức Danh Mới</span>
            </button>
          </div>

          {/* BẢNG QUẢN LÝ CHỨC DANH ĐỘNG */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E8E2D9] text-left text-xs">
                <thead className="bg-[#FAF7F2] font-bold text-[#6B5E55] uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Cấp Bậc</th>
                    <th className="px-4 py-3">Chi Nhánh</th>
                    <th className="px-4 py-3">Chức Danh F&B</th>
                    <th className="px-4 py-3">Mã Chức Vụ</th>
                    <th className="px-4 py-3">Phòng Ban Phụ Trách</th>
                    <th className="px-4 py-3">Mô Tả & Trách Nhiệm</th>
                    <th className="px-4 py-3 text-center">Trạng Thái</th>
                    <th className="px-4 py-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {filteredJobTitles.map((job) => {
                    const levelDef = ROLE_HIERARCHY.find((r) => r.level === job.level);

                    return (
                      <tr key={job.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-block shadow-2xs ${
                              levelDef?.badge_class || 'bg-gray-700 text-white'
                            }`}
                          >
                            Level {job.level}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${
                            job.branch_code === 'HQ'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {job.branch_name || 'Toàn chuỗi'}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-bold text-[#231F20]">
                          {job.name}
                        </td>

                        <td className="px-4 py-3 font-mono font-semibold text-[#8B1D24]">
                          {job.code}
                        </td>

                        <td className="px-4 py-3 text-[#554A41]">
                          <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#D5C9BC] font-medium">
                            {job.department_name}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-[#6B5E55] max-w-xs truncate">
                          {job.description}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              job.is_active
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            {job.is_active ? 'Đang hoạt động' : 'Tạm ngưng'}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleJobStatus(job.id)}
                            className="text-xs font-semibold text-[#8B1D24] hover:underline cursor-pointer"
                          >
                            {job.is_active ? 'Tạm ẩn' : 'Kích hoạt'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredJobTitles.length === 0 && (
              <div className="p-8 text-center text-[#A09383] text-xs">
                Không tìm thấy chức danh nào phù hợp với bộ lọc tìm kiếm.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL THÊM CHỨC DANH F&B MỚI (DÀNH CHO SUPER ADMIN)                      */}
      {/* ========================================================================= */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9] mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#8B1D24]" />
                <div>
                  <h3 className="font-bold text-base text-[#231F20]">
                    Thêm Chức Danh F&B Mới
                  </h3>
                  <p className="text-xs text-[#6B5E55]">
                    Gắn phòng ban chuyên môn, chi nhánh và gán bậc phân quyền Hierarchy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="text-[#A09383] hover:text-[#231F20] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJobTitle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Tên chức danh hiển thị *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Quản Lý Tiệc Cưới Sân Vườn"
                  value={newJobName}
                  onChange={(e) => {
                    setNewJobName(e.target.value);
                    if (!newJobCode) {
                      const slug = e.target.value
                        .toUpperCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^A-Z0-9]/g, '_');
                      setNewJobCode(`JOB_${slug}`);
                    }
                  }}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Chi nhánh áp dụng *
                </label>
                <select
                  value={newJobBranch}
                  onChange={(e) => setNewJobBranch(e.target.value as any)}
                  className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                >
                  <option value="HQ">🏢 Trụ Sở Điều Hành (HQ - Toàn Chuỗi)</option>
                  <option value="QN_PNT">📍 Quê Nhà - Phạm Ngọc Thạch (Quận 3)</option>
                  <option value="QN_TT">📍 Quê Nhà - Thành Thái (Quận 10)</option>
                  <option value="QN_NTB">📍 Quê Nhà - Nguyễn Thái Bình (Tân Bình)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Mã chức vụ (Code) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Vd: JOB_BANQUET_MANAGER"
                    value={newJobCode}
                    onChange={(e) => setNewJobCode(e.target.value)}
                    className="w-full text-xs font-mono font-bold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Cấp Bậc Phân Quyền (Level) *
                  </label>
                  <select
                    value={newJobLevel}
                    onChange={(e) => setNewJobLevel(Number(e.target.value) as RoleLevel)}
                    className="w-full text-xs font-bold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                  >
                    <option value={1}>Level 1 - HĐTV / Chủ Đầu Tư</option>
                    <option value={2}>Level 2 - Super Admin / CTO</option>
                    <option value={3}>Level 3 - Trưởng Phòng HQ</option>
                    <option value={4}>Level 4 - Tổng Quản Lý Chi Nhánh</option>
                    <option value={5}>Level 5 - Quản Lý Ca & Khu Vực</option>
                    <option value={6}>Level 6 - Nhân Viên Thực Thi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Phòng ban trực thuộc *
                </label>
                <select
                  value={newJobDept}
                  onChange={(e) => setNewJobDept(e.target.value)}
                  className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                >
                  <optgroup label="Khối Văn Phòng HQ">
                    <option value="BGD_HDTV">Ban Giám Đốc & HĐTV</option>
                    <option value="MARKETING">Phòng Marketing & Truyền Thông</option>
                    <option value="ACCOUNTING">Phòng Tài Chính - Kế Toán</option>
                    <option value="HR">Phòng Nhân Sự & Đào Tạo</option>
                    <option value="PURCHASING">Phòng Thu Mua & Cung Ứng</option>
                  </optgroup>
                  <optgroup label="Khối Chi Nhánh Store">
                    <option value="FOH_MANAGEMENT">Bộ Phận Quản Lý Sảnh & Vận Hành</option>
                    <option value="RECEPTION_CSKH">Bộ Phận Đón Tiếp & CSKH</option>
                    <option value="CASHIER">Bộ Phận Thu Ngân</option>
                    <option value="KITCHEN_BOH">Bộ Phận Bếp & Bar (BOH)</option>
                    <option value="SERVICE_BAR">Bộ Phận Phục Vụ & Pha Chế</option>
                    <option value="SECURITY_MAINTENANCE">Bộ Phận Bảo Vệ & Kỹ Thuật</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Mô tả trách nhiệm công việc
                </label>
                <textarea
                  rows={2}
                  placeholder="Vd: Chịu trách nhiệm tư vấn tiệc lớn trên 100 khách và điều phối sảnh tiệc"
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg shadow-xs cursor-pointer"
                >
                  Lưu Chức Danh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
