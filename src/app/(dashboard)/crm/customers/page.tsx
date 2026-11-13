'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Building2,
  Mail,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  Heart,
  Calendar,
  DollarSign,
  Tag,
  Edit3,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { CustomerRecord, INITIAL_CUSTOMERS, formatCustomerCode } from '@/services/crmService';

export default function CustomersDirectoryPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  // Modal Chi tiết / Cập nhật Gu ẩm thực
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const [dietaryNotesInput, setDietaryNotesInput] = useState('');

  // Modal Thêm khách mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBranchName, setNewBranchName] = useState('Quê Nhà - Phạm Ngọc Thạch');
  const [newDietary, setNewDietary] = useState('');
  const [newTag, setNewTag] = useState('VIP');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sao chép Mã khách hàng 1 chạm
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Lọc danh sách khách (hỗ trợ tìm cả Tên, SĐT, Mã KH và Công ty)
  const filteredCustomers = customers.filter((c) => {
    if (selectedBranch !== 'all' && c.preferred_branch_name !== selectedBranch) return false;
    if (selectedTag !== 'all' && !c.tags.includes(selectedTag)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase().trim();
      const qCleaned = q.replace(/\s+/g, '');
      const matchName = c.full_name.toLowerCase().includes(q);
      const matchPhone = c.phone.replace(/\s+/g, '').includes(qCleaned);
      const matchCode = c.customer_code.toLowerCase().includes(q);
      const matchCompany = c.company_name?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCode && !matchCompany) return false;
    }
    return true;
  });

  // Mở modal sửa gu ẩm thực
  const handleOpenEdit = (customer: CustomerRecord) => {
    setEditingCustomer(customer);
    setDietaryNotesInput(customer.dietary_and_notes);
  };

  // Lưu cập nhật gu ẩm thực
  const handleSaveDietary = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, dietary_and_notes: dietaryNotesInput.trim() }
            : c
        )
      );
      setEditingCustomer(null);
    }
  };

  // Thêm khách mới - Tự động định danh customer_code theo SĐT
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const generatedCode = formatCustomerCode(newPhone.trim());

    const newCust: CustomerRecord = {
      id: Date.now(),
      customer_code: generatedCode,
      full_name: newName.trim(),
      phone: newPhone.trim(),
      company_name: newCompany.trim() || undefined,
      email: newEmail.trim() || undefined,
      preferred_branch_id: 1,
      preferred_branch_name: newBranchName,
      total_bookings: 0,
      total_spent: 0,
      tags: [newTag],
      dietary_and_notes: newDietary.trim() || 'Chưa có ghi chú đặc biệt',
      created_at: new Date().toISOString().split('T')[0],
    };

    setCustomers([newCust, ...customers]);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewCompany('');
    setNewDietary('');
  };

  return (
    <div className="space-y-6">
      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#231F20] tracking-tight">
              Hồ Sơ Khách Hàng 360° (CRM Directory)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1D24] text-white">
              Module 5.2
            </span>
          </div>
          <p className="text-sm text-[#6B5E55] mt-1">
            Quản trị danh bạ khách tiệc VIP, ghi nhớ gu ẩm thực, phòng quen và sở thích phục vụ cá nhân hóa.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B1D24] text-white font-bold text-sm shadow-xs hover:bg-[#72161C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khách Mới</span>
        </button>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A09383]" />
            <input
              type="text"
              placeholder="Tìm theo tên khách, số điện thoại, công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs border border-[#D5C9BC] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#8B1D24]"
            />
          </div>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="text-xs font-semibold border border-[#D5C9BC] rounded-lg px-2.5 py-2 bg-white"
          >
            <option value="all">Tất cả phân loại</option>
            <option value="VIP">Khách VIP</option>
            <option value="DOANH_NGHIEP">Doanh Nghiệp</option>
            <option value="KHACH_QUEN">Khách Quen</option>
          </select>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs font-semibold border border-[#D5C9BC] rounded-lg px-2.5 py-2 bg-white"
          >
            <option value="all">Tất cả chi nhánh</option>
            <option value="Quê Nhà - Phạm Ngọc Thạch">Phạm Ngọc Thạch (Q3)</option>
            <option value="Quê Nhà - Thành Thái">Thành Thái (Q10)</option>
            <option value="Quê Nhà - Nguyễn Thái Bình">Nguyễn Thái Bình (Tân Bình)</option>
          </select>
        </div>

        <div className="text-xs text-[#6B5E55] font-medium">
          Hiển thị: <strong className="text-[#231F20] font-bold">{filteredCustomers.length}</strong> khách hàng
        </div>
      </div>

      {/* Danh sách thẻ hồ sơ khách hàng 360 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header khách hàng */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      onClick={() => handleCopyCode(customer.customer_code)}
                      title="Nhấn để sao chép Mã Khách Hàng (SĐT)"
                      className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#8B1D24] bg-[#F7EAEB] px-2 py-0.5 rounded border border-[#8B1D24]/20 cursor-pointer hover:bg-[#F0D5D7] transition-colors"
                    >
                      {customer.customer_code}
                      {copiedCode === customer.customer_code ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-[#8B1D24]/70" />
                      )}
                    </span>
                    <h3 className="text-base font-bold text-[#231F20]">{customer.full_name}</h3>
                    <div className="flex items-center gap-1">
                      {customer.tags.map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t === 'VIP'
                              ? 'bg-[#8B1D24] text-white'
                              : t === 'DOANH_NGHIEP'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {customer.company_name && (
                    <p className="text-xs text-[#6B5E55] flex items-center gap-1.5 mt-0.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#A09383]" />
                      <span>{customer.company_name}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleOpenEdit(customer)}
                  className="p-1.5 text-[#A09383] hover:text-[#8B1D24] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                  title="Cập nhật gu ẩm thực & ghi chú"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Thông tin liên hệ & Chỉ số đặt tiệc */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D9]/70 mb-3">
                <div>
                  <div className="text-[11px] text-[#A09383] flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Điện thoại:</span>
                  </div>
                  <div className="font-bold text-[#231F20] mt-0.5">{customer.phone}</div>
                </div>

                <div>
                  <div className="text-[11px] text-[#A09383] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Chi nhánh quen:</span>
                  </div>
                  <div className="font-semibold text-[#8B1D24] truncate mt-0.5">
                    {customer.preferred_branch_name}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E2D9]/50">
                  <div className="text-[11px] text-[#A09383]">Tổng số tiệc:</div>
                  <div className="font-bold text-[#231F20]">{customer.total_bookings} tiệc</div>
                </div>

                <div className="pt-2 border-t border-[#E8E2D9]/50">
                  <div className="text-[11px] text-[#A09383]">Tổng chi tiêu:</div>
                  <div className="font-mono font-bold text-[#2A7238]">
                    {customer.total_spent.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>

              {/* KHỐI ĐẶC BIỆT: GU ẨM THỰC & LƯU Ý VIP THEO LỆNH CTO */}
              <div className="p-3.5 bg-[#FFF9F0] rounded-xl border border-[#C58940]/30 text-xs">
                <div className="flex items-center gap-1.5 text-[#8B1D24] font-bold uppercase text-[11px] mb-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#C58940]" />
                  <span>Gu Ẩm Thực & Lưu Ý VIP (Phục Vụ Quán Quen):</span>
                </div>
                <p className="text-[#554A41] leading-relaxed italic">
                  &ldquo;{customer.dietary_and_notes}&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-[11px] text-[#A09383]">
              <span>Khách hàng từ: {customer.created_at}</span>
              <button
                onClick={() => handleOpenEdit(customer)}
                className="text-[#8B1D24] font-bold hover:underline flex items-center gap-1"
              >
                <span>Chỉnh sửa sở thích</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CẬP NHẬT GU ẨM THỰC & LƯU Ý VIP */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center gap-2 text-[#8B1D24] font-bold text-base mb-1">
              <UtensilsCrossed className="w-5 h-5 text-[#C58940]" />
              <span>Cập Nhật Gu Ẩm Thực & Lưu Ý VIP</span>
            </div>
            <p className="text-xs text-[#6B5E55] mb-4">
              Mã KH: <strong className="font-mono text-[#8B1D24]">{editingCustomer.customer_code}</strong> • Khách hàng: <strong className="text-[#231F20]">{editingCustomer.full_name}</strong> ({editingCustomer.phone})
            </p>

            <form onSubmit={handleSaveDietary} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Gu ẩm thực, phòng quen, dị ứng & yêu cầu phục vụ *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Vd: Thích ngồi phòng VIP 01 view sân trước. Thích ăn heo mẹt giòn da, lẩu cua đồng không hành sống. Tiếp khách hay mang rượu vang riêng, cần ly pha lê..."
                  value={dietaryNotesInput}
                  onChange={(e) => setDietaryNotesInput(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg p-3 focus:outline-none focus:border-[#8B1D24] leading-relaxed"
                />
                <p className="text-[11px] text-[#A09383] mt-1.5">
                  📌 Thông tin này sẽ hiển thị trực tiếp cho Lễ tân và Quản lý phòng tiệc khi khách đặt phòng.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg shadow-xs"
                >
                  Lưu Thông Tin VIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM KHÁCH HÀNG MỚI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#8B1D24]">Thêm Khách Hàng Tiệc Mới</h3>
                <p className="text-xs text-[#6B5E55]">Khởi tạo hồ sơ khách hàng vào danh bạ CRM (Định danh theo SĐT)</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#A09383] hover:text-[#231F20] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              {/* Xem trước Mã Khách Hàng tự sinh */}
              <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8E2D9] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#6B5E55] uppercase">Mã Khách Hàng (Tự sinh theo SĐT):</span>
                <span className="font-mono text-xs font-bold text-[#8B1D24] bg-white px-2 py-0.5 rounded border border-[#D5C9BC]">
                  {formatCustomerCode(newPhone) || 'KH-[Số điện thoại]'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Họ tên khách hàng *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Nguyễn Thanh Tùng"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0909 xxx xxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Phân loại
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="VIP">Khách VIP</option>
                    <option value="DOANH_NGHIEP">Doanh Nghiệp</option>
                    <option value="KHACH_QUEN">Khách Quen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Công ty (nếu có)
                </label>
                <input
                  type="text"
                  placeholder="Tên công ty hoặc cơ quan..."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Gu ẩm thực & Lưu ý đặc biệt
                </label>
                <textarea
                  rows={3}
                  placeholder="Sở thích món ăn, chỗ ngồi, yêu cầu phục vụ..."
                  value={newDietary}
                  onChange={(e) => setNewDietary(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg shadow-xs"
                >
                  Lưu Hồ Sơ Khách
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
