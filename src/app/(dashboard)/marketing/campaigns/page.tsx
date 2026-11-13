'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Plus,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  FileText,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface CampaignItem {
  id: number;
  branch_id: number | null; // null = Toàn chuỗi
  branch_name: string;
  name: string;
  objective: string;
  start_date: string;
  end_date: string;
  target_posts: number;
  actual_posts: number;
  target_leads: number;
  actual_leads: number;
  planned_budget: number;
  actual_budget: number;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: 1,
    branch_id: null,
    branch_name: 'Toàn chuỗi (4 chi nhánh)',
    name: 'Mùa Tiệc Tất Niên & Tân Niên 2026 — Đậm Đà Vị Quê',
    objective: 'Thu hút 120 đoàn tiệc công ty và gia đình cuối năm, quảng bá gói thực đơn tiệc đặc sắc',
    start_date: '2026-11-01',
    end_date: '2026-12-31',
    target_posts: 40,
    actual_posts: 28,
    target_leads: 150,
    actual_leads: 112,
    planned_budget: 45000000,
    actual_budget: 32500000,
    status: 'ACTIVE',
  },
  {
    id: 2,
    branch_id: 1,
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    name: 'Giới Thiệu Không Gian Phòng VIP Mới & Đặc Sản Cá Kho Niêu',
    objective: 'Quảng bá chuỗi 8 phòng VIP phong cách Nam Bộ mới nâng cấp tại chi nhánh trung tâm Q3',
    start_date: '2026-11-05',
    end_date: '2026-11-25',
    target_posts: 15,
    actual_posts: 12,
    target_leads: 45,
    actual_leads: 38,
    planned_budget: 15000000,
    actual_budget: 11800000,
    status: 'ACTIVE',
  },
  {
    id: 3,
    branch_id: 2,
    branch_name: 'Quê Nhà - Thành Thái',
    name: 'Combo Trưa Đồng Quê Cho Giới Văn Phòng Khu Quận 10',
    objective: 'Gia tăng công suất phục vụ ca trưa (11:00 - 14:00) tại chi nhánh Thành Thái',
    start_date: '2026-11-10',
    end_date: '2026-11-20',
    target_posts: 10,
    actual_posts: 4,
    target_leads: 30,
    actual_leads: 12,
    planned_budget: 8000000,
    actual_budget: 3500000,
    status: 'ACTIVE', // Cận deadline mà chưa đạt 50%
  },
  {
    id: 4,
    branch_id: 3,
    branch_name: 'Quê Nhà - Nguyễn Thái Bình',
    name: 'Tuần Lễ Khai Trương Tân Trang Chi Nhánh Tân Bình',
    objective: 'Đón tiếp thực khách thân thiết khu vực Tân Bình - Phú Nhuận với ưu đãi tặng món khai vị',
    start_date: '2026-10-15',
    end_date: '2026-10-31',
    target_posts: 20,
    actual_posts: 20,
    target_leads: 60,
    actual_leads: 68,
    planned_budget: 20000000,
    actual_budget: 19500000,
    status: 'COMPLETED',
  },
];

const BRANCH_OPTIONS = [
  { id: 'all', name: 'Toàn bộ chi nhánh' },
  { id: 'null', name: 'Chung toàn chuỗi' },
  { id: '1', name: 'Quê Nhà - Phạm Ngọc Thạch' },
  { id: '2', name: 'Quê Nhà - Thành Thái' },
  { id: '3', name: 'Quê Nhà - Nguyễn Thái Bình' },
];

export default function MarketingCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [branchId, setBranchId] = useState<string>('null');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetPosts, setTargetPosts] = useState('20');
  const [targetLeads, setTargetLeads] = useState('50');
  const [plannedBudget, setPlannedBudget] = useState('20000000');

  useEffect(() => {
    const saved = localStorage.getItem('quenha_campaigns');
    if (saved) {
      try {
        setCampaigns(JSON.parse(saved));
      } catch {
        setCampaigns(INITIAL_CAMPAIGNS);
      }
    }
  }, []);

  const saveCampaigns = (newList: CampaignItem[]) => {
    setCampaigns(newList);
    localStorage.setItem('quenha_campaigns', JSON.stringify(newList));
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const branchName =
      branchId === 'null'
        ? 'Toàn chuỗi (4 chi nhánh)'
        : BRANCH_OPTIONS.find((b) => b.id === branchId)?.name || 'Chi nhánh';

    const newCamp: CampaignItem = {
      id: Date.now(),
      branch_id: branchId === 'null' ? null : Number(branchId),
      branch_name: branchName,
      name: name.trim(),
      objective: objective.trim() || 'Thúc đẩy thương hiệu và thu hút khách tiệc',
      start_date: startDate || new Date().toISOString().split('T')[0],
      end_date: endDate || '2026-12-31',
      target_posts: Number(targetPosts) || 0,
      actual_posts: 0,
      target_leads: Number(targetLeads) || 0,
      actual_leads: 0,
      planned_budget: Number(plannedBudget) || 0,
      actual_budget: 0,
      status: 'ACTIVE',
    };

    saveCampaigns([newCamp, ...campaigns]);
    setShowAddModal(false);
    setName('');
    setObjective('');
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (selectedBranch !== 'all') {
      if (selectedBranch === 'null' && c.branch_id !== null) return false;
      if (selectedBranch !== 'null' && String(c.branch_id) !== selectedBranch) return false;
    }
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    return true;
  });

  // Tính tổng chỉ số
  const totalTargetPosts = filteredCampaigns.reduce((acc, c) => acc + c.target_posts, 0);
  const totalActualPosts = filteredCampaigns.reduce((acc, c) => acc + c.actual_posts, 0);
  const totalTargetLeads = filteredCampaigns.reduce((acc, c) => acc + c.target_leads, 0);
  const totalActualLeads = filteredCampaigns.reduce((acc, c) => acc + c.actual_leads, 0);
  const totalPlannedBudget = filteredCampaigns.reduce((acc, c) => acc + c.planned_budget, 0);
  const totalActualBudget = filteredCampaigns.reduce((acc, c) => acc + c.actual_budget, 0);

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút Tạo Chiến Dịch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8B1D24] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-[#C58940]" />
            <span>Phân hệ Marketing • Module 2</span>
          </div>
          <h1 className="text-2xl font-black text-[#231F20] tracking-tight">
            Quản Lý Kế Hoạch & Chiến Dịch (Campaigns)
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Theo dõi song song Kế hoạch vs. Thực tế (Plan vs. Actual), chống đứt gãy giữa mục tiêu và sản xuất nội dung.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#8B1D24] text-white text-xs font-bold hover:bg-[#72161C] transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Chiến Dịch Mới</span>
        </button>
      </div>

      {/* 4 Thẻ Thống Kê Plan vs. Actual Tổng Quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Số chiến dịch */}
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#6B5E55] mb-2">
            <span>Chiến dịch đang chạy</span>
            <Calendar className="w-4 h-4 text-[#8B1D24]" />
          </div>
          <div className="text-2xl font-black text-[#231F20]">
            {filteredCampaigns.filter((c) => c.status === 'ACTIVE').length}{' '}
            <span className="text-xs font-normal text-[#9C8E82]">/ {filteredCampaigns.length} tổng</span>
          </div>
          <div className="text-[11px] text-[#2A7238] font-medium mt-1">
            Tất cả chiến dịch bám sát thực đơn Quê Nhà
          </div>
        </div>

        {/* Bài viết Content */}
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#6B5E55] mb-2">
            <span>Bài Đăng: Thực Tế / Kế Hoạch</span>
            <FileText className="w-4 h-4 text-[#C58940]" />
          </div>
          <div className="text-2xl font-black text-[#231F20]">
            {totalActualPosts}{' '}
            <span className="text-sm font-semibold text-[#6B5E55]">/ {totalTargetPosts} bài</span>
          </div>
          <div className="w-full bg-[#F5EFE6] rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-[#C58940] h-2 rounded-full transition-all"
              style={{
                width: `${totalTargetPosts > 0 ? Math.min(100, Math.round((totalActualPosts / totalTargetPosts) * 100)) : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Lead Tiệc Thu Về */}
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#6B5E55] mb-2">
            <span>Lead Tiệc: Thực Tế / Mục Tiêu</span>
            <Users className="w-4 h-4 text-[#2A7238]" />
          </div>
          <div className="text-2xl font-black text-[#2A7238]">
            {totalActualLeads}{' '}
            <span className="text-sm font-semibold text-[#6B5E55]">/ {totalTargetLeads} lead</span>
          </div>
          <div className="w-full bg-[#F5EFE6] rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-[#2A7238] h-2 rounded-full transition-all"
              style={{
                width: `${totalTargetLeads > 0 ? Math.min(100, Math.round((totalActualLeads / totalTargetLeads) * 100)) : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Ngân Sách Marketing */}
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#6B5E55] mb-2">
            <span>Ngân Sách: Thực Chi / Kế Hoạch</span>
            <DollarSign className="w-4 h-4 text-[#8B1D24]" />
          </div>
          <div className="text-lg font-black text-[#231F20]">
            {(totalActualBudget / 1000000).toFixed(1)}Tr{' '}
            <span className="text-xs font-semibold text-[#6B5E55]">
              / {(totalPlannedBudget / 1000000).toFixed(1)}Tr đ
            </span>
          </div>
          <div className="text-[11px] text-[#6B5E55] mt-1 flex items-center justify-between">
            <span>Tỷ lệ giải ngân</span>
            <span className="font-bold text-[#8B1D24]">
              {totalPlannedBudget > 0
                ? Math.round((totalActualBudget / totalPlannedBudget) * 100)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Thanh Lọc Chiến Dịch */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E8E2D9]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#6B5E55]" />
          <span className="text-xs font-bold uppercase text-[#6B5E55]">Lọc theo:</span>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs rounded-lg border border-[#D5C9BC] px-3 py-1.5 bg-[#FAF7F2] font-semibold text-[#231F20] focus:outline-none focus:border-[#8B1D24]"
          >
            {BRANCH_OPTIONS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs rounded-lg border border-[#D5C9BC] px-3 py-1.5 bg-[#FAF7F2] font-semibold text-[#231F20] focus:outline-none focus:border-[#8B1D24]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="PLANNING">Đang lên kế hoạch</option>
            <option value="COMPLETED">Đã kết thúc</option>
            <option value="PAUSED">Tạm dừng</option>
          </select>
        </div>

        <div className="text-xs text-[#9C8E82]">
          Hiển thị <strong>{filteredCampaigns.length}</strong> chiến dịch
        </div>
      </div>

      {/* Danh Sách Chiến Dịch — Thẻ So Sánh Plan vs. Actual Trực Quan */}
      <div className="space-y-4">
        {filteredCampaigns.map((camp) => {
          const postPct =
            camp.target_posts > 0
              ? Math.round((camp.actual_posts / camp.target_posts) * 100)
              : 0;
          const leadPct =
            camp.target_leads > 0
              ? Math.round((camp.actual_leads / camp.target_leads) * 100)
              : 0;
          const budgetPct =
            camp.planned_budget > 0
              ? Math.round((camp.actual_budget / camp.planned_budget) * 100)
              : 0;

          // Cảnh báo đỏ nếu actual < 70% plan và còn dưới 5 ngày
          const isWarning = camp.status === 'ACTIVE' && postPct < 60;

          return (
            <div
              key={camp.id}
              className={`bg-white rounded-xl border transition-all p-5 shadow-xs ${
                isWarning ? 'border-[#E53E3E]/60 bg-[#FFF5F5]/20' : 'border-[#E8E2D9]'
              }`}
            >
              {/* Header card */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E8E2D9] pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#8B1D24] border border-[#E8E2D9] flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#C58940]" />
                      {camp.branch_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        camp.status === 'ACTIVE'
                          ? 'bg-[#EAF5EC] text-[#2A7238]'
                          : camp.status === 'COMPLETED'
                          ? 'bg-[#EBF8FF] text-[#2B6CB0]'
                          : 'bg-[#F5EFE6] text-[#6B5E55]'
                      }`}
                    >
                      {camp.status === 'ACTIVE'
                        ? 'Đang triển khai'
                        : camp.status === 'COMPLETED'
                        ? 'Đã hoàn thành'
                        : 'Lên kế hoạch'}
                    </span>
                    {isWarning && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FED7D7] text-[#9B1C1C] flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Cảnh báo: Tốc độ ra bài & lead chưa đạt tiến độ
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#231F20] mt-1.5">{camp.name}</h3>
                  <p className="text-xs text-[#6B5E55] mt-0.5 max-w-3xl">{camp.objective}</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#6B5E55] lg:self-start">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#9C8E82]" />
                    <span>
                      {camp.start_date} $\rightarrow$ {camp.end_date}
                    </span>
                  </div>
                  <Link
                    href={`/marketing/tasks?campaignId=${camp.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D5C9BC] hover:border-[#8B1D24] hover:bg-[#FDF6EE] text-xs font-bold text-[#8B1D24] transition-colors"
                  >
                    <span>Xem việc liên kết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* So sánh Plan vs. Actual 3 Cột */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* 1. Bài viết */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B5E55] font-semibold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#C58940]" />
                      Bài đăng MXH:
                    </span>
                    <span className="font-bold text-[#231F20]">
                      {camp.actual_posts} / {camp.target_posts} bài ({postPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F5EFE6] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        postPct >= 100 ? 'bg-[#2A7238]' : 'bg-[#C58940]'
                      }`}
                      style={{ width: `${Math.min(100, postPct)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#9C8E82] flex justify-between">
                    <span>Thực tế: {camp.actual_posts}</span>
                    <span>Kế hoạch: {camp.target_posts}</span>
                  </div>
                </div>

                {/* 2. Lead tiệc */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B5E55] font-semibold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#2A7238]" />
                      Lead đặt tiệc:
                    </span>
                    <span className="font-bold text-[#2A7238]">
                      {camp.actual_leads} / {camp.target_leads} lead ({leadPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F5EFE6] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#2A7238] h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, leadPct)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#9C8E82] flex justify-between">
                    <span>Về CRM: {camp.actual_leads}</span>
                    <span>Mục tiêu: {camp.target_leads}</span>
                  </div>
                </div>

                {/* 3. Ngân sách */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B5E55] font-semibold flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#8B1D24]" />
                      Ngân sách Marketing:
                    </span>
                    <span className="font-bold text-[#8B1D24]">
                      {(camp.actual_budget / 1000000).toFixed(1)}Tr /{' '}
                      {(camp.planned_budget / 1000000).toFixed(1)}Tr ({budgetPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F5EFE6] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#8B1D24] h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, budgetPct)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#9C8E82] flex justify-between">
                    <span>Đã chi (MISA): {camp.actual_budget.toLocaleString('vi-VN')} đ</span>
                    <span>Kế hoạch: {camp.planned_budget.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tạo Chiến Dịch Mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <h3 className="text-lg font-bold text-[#8B1D24] mb-1">Tạo Chiến Dịch Marketing Mới</h3>
            <p className="text-xs text-[#6B5E55] mb-4">
              Mọi đầu việc và bài viết sau này sẽ được liên kết trực tiếp vào chiến dịch này.
            </p>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Tên chiến dịch *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vd: Mùa Tiệc Tân Niên Quê Nhà 2027"
                  className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Phạm vi áp dụng chi nhánh
                </label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24] bg-white"
                >
                  <option value="null">Toàn chuỗi (3 chi nhánh)</option>
                  <option value="1">Quê Nhà - Phạm Ngọc Thạch</option>
                  <option value="2">Quê Nhà - Thành Thái</option>
                  <option value="3">Quê Nhà - Nguyễn Thái Bình</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Mục tiêu trọng tâm
                </label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Vd: Tiếp cận 50 đoàn khách doanh nghiệp, lấp đầy phòng VIP ca tối"
                  className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                  />
                </div>
              </div>

              {/* Chỉ tiêu định lượng */}
              <div className="grid grid-cols-3 gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9]">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B5E55] uppercase mb-1">
                    Chỉ tiêu bài
                  </label>
                  <input
                    type="number"
                    value={targetPosts}
                    onChange={(e) => setTargetPosts(e.target.value)}
                    className="w-full text-sm font-bold border border-[#D5C9BC] rounded-lg px-2 py-1.5 bg-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6B5E55] uppercase mb-1">
                    Chỉ tiêu Lead
                  </label>
                  <input
                    type="number"
                    value={targetLeads}
                    onChange={(e) => setTargetLeads(e.target.value)}
                    className="w-full text-sm font-bold border border-[#D5C9BC] rounded-lg px-2 py-1.5 bg-white text-center text-[#2A7238]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6B5E55] uppercase mb-1">
                    Ngân sách (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={plannedBudget}
                    onChange={(e) => setPlannedBudget(e.target.value)}
                    className="w-full text-sm font-bold border border-[#D5C9BC] rounded-lg px-2 py-1.5 bg-white text-center text-[#8B1D24]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg shadow-xs transition-colors"
                >
                  Lưu Chiến Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
