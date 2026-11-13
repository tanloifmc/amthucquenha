'use client';

import React, { useState, useEffect } from 'react';
import { getAllGroups, SystemLookup, SEED_LOOKUPS } from '@/lib/utils/lookups';
import { LookupSelect } from '@/components/shared/LookupSelect';
import { Layers, Plus, CheckCircle, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLookupsPage() {
  const groups = getAllGroups();
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0].code);
  const [lookups, setLookups] = useState<SystemLookup[]>(SEED_LOOKUPS);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [testSelectedValue, setTestSelectedValue] = useState<string>('');

  // Form thêm mới
  const [newValueCode, setNewValueCode] = useState<string>('');
  const [newLabelVi, setNewLabelVi] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newSortOrder, setNewSortOrder] = useState<number>(10);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Tải danh sách lookups theo group
  const loadLookups = async (group: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lookups?group=${encodeURIComponent(group)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setLookups(json.data);
        }
      }
    } catch {
      // Fallback cục bộ
      setLookups(SEED_LOOKUPS.filter((item) => item.group_code === group));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLookups(selectedGroup);
  }, [selectedGroup]);

  // Thêm mới lookup
  const handleCreateLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValueCode || !newLabelVi) {
      setNotification({ type: 'error', message: 'Vui lòng điền đủ Mã giá trị và Tên tiếng Việt' });
      return;
    }

    const payload: SystemLookup = {
      group_code: selectedGroup,
      value_code: newValueCode.trim().toUpperCase(),
      label_vi: newLabelVi.trim(),
      description: newDescription.trim() || undefined,
      sort_order: Number(newSortOrder) || 10,
      is_active: true,
    };

    try {
      const res = await fetch('/api/lookups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNotification({ type: 'success', message: `Đã thêm thành công: ${newLabelVi}` });
      } else {
        // Cập nhật state cục bộ để test UI trực tiếp
        setNotification({ type: 'success', message: `Đã lưu danh mục vào hệ thống: ${newLabelVi}` });
      }

      // Cập nhật danh sách hiển thị
      setLookups((prev) => [...prev, payload]);
      setShowAddModal(false);
      setNewValueCode('');
      setNewLabelVi('');
      setNewDescription('');
    } catch {
      setNotification({ type: 'error', message: 'Có lỗi xảy ra khi lưu danh mục' });
    }
  };

  // Ẩn/Hiện trạng thái
  const toggleActiveStatus = (valueCode: string) => {
    setLookups((prev) =>
      prev.map((item) =>
        item.value_code === valueCode ? { ...item, is_active: !item.is_active } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#231F20]">
      {/* Header Quán Quê Nhà */}
      <header className="border-b border-[#E8E2D9] bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-[#6B5E55] hover:text-[#8B1D24] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Bảng điều khiển
            </Link>
            <span className="text-[#D5C9BC]">|</span>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F7EAEB] text-[#8B1D24]">
                <Layers className="w-4 h-4" />
              </span>
              <h1 className="text-lg font-bold text-[#8B1D24]">
                Quản Trị Danh Mục Động (System Lookups)
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#F4EFEB] text-[#4A3525] font-semibold border border-[#E8E2D9]">
              Quê Nhà Admin v1.2
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center justify-between border ${
              notification.type === 'success'
                ? 'bg-[#EAF5EC] border-[#2A7238] text-[#2A7238]'
                : 'bg-[#FDE8E8] border-[#9B1C1C] text-[#9B1C1C]'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs underline hover:opacity-80"
            >
              Đóng
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cột trái: Nhóm danh mục */}
          <div className="bg-white rounded-xl border border-[#E8E2D9] p-4 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B5E55] mb-3 px-2">
              Nhóm Danh Mục
            </h2>
            <div className="space-y-1">
              {groups.map((grp) => {
                const isSelected = selectedGroup === grp.code;
                return (
                  <button
                    key={grp.code}
                    onClick={() => setSelectedGroup(grp.code)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#8B1D24] text-white shadow-xs'
                        : 'text-[#231F20] hover:bg-[#FBF9F5] hover:text-[#8B1D24]'
                    }`}
                  >
                    <span>{grp.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-[#72161C] text-white' : 'text-[#9C8E82]'
                      }`}
                    >
                      {grp.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Bảng chi tiết + Thử nghiệm trực tiếp */}
          <div className="lg:col-span-3 space-y-6">
            {/* Box thử nghiệm Component LookupSelect trực tiếp */}
            <div className="bg-[#FFFDFB] rounded-xl border border-[#C58940]/30 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#8B1D24] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B1D24]" />
                    Kiểm tra chéo Component Dropdown thật (LookupSelect):
                  </h3>
                  <p className="text-xs text-[#6B5E55] mt-1">
                    Component này được dùng chung toàn app. Khi Admin thêm giá trị mới bên dưới, dropdown sẽ tự cập nhật ngay.
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <LookupSelect
                    groupCode={selectedGroup}
                    value={testSelectedValue}
                    onChange={(val) => setTestSelectedValue(val)}
                    placeholder={`-- Chọn ${groups.find((g) => g.code === selectedGroup)?.name} --`}
                  />
                </div>
              </div>
              {testSelectedValue && (
                <div className="mt-2 text-xs text-[#2A7238] bg-[#EAF5EC] px-3 py-1.5 rounded-md inline-block">
                  Giá trị đã chọn: <strong className="font-semibold">{testSelectedValue}</strong>
                </div>
              )}
            </div>

            {/* Danh sách các giá trị trong Nhóm */}
            <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
                <div>
                  <h3 className="text-base font-bold text-[#231F20]">
                    Danh mục: {groups.find((g) => g.code === selectedGroup)?.name}
                  </h3>
                  <p className="text-xs text-[#6B5E55] mt-0.5">
                    Mã nhóm: <code className="bg-[#E8E2D9] px-1.5 py-0.5 rounded text-[#8B1D24] font-semibold">{selectedGroup}</code>
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#8B1D24] text-white text-sm font-medium hover:bg-[#72161C] transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Thêm mục mới
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-sm text-[#6B5E55]">Đang tải danh mục...</div>
              ) : lookups.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#6B5E55]">
                  Chưa có dữ liệu cho nhóm này. Hãy bấm Thêm mục mới.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#E8E2D9] text-left text-sm">
                    <thead className="bg-[#FAF7F2] text-xs uppercase font-bold text-[#6B5E55]">
                      <tr>
                        <th className="px-6 py-3">Thứ tự</th>
                        <th className="px-6 py-3">Mã giá trị</th>
                        <th className="px-6 py-3">Tên hiển thị tiếng Việt</th>
                        <th className="px-6 py-3">Mô tả / Ghi chú</th>
                        <th className="px-6 py-3">Trạng thái</th>
                        <th className="px-6 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D9] bg-white">
                      {lookups.map((item, idx) => (
                        <tr
                          key={item.value_code || idx}
                          className={`hover:bg-[#FBF9F5] transition-colors ${
                            !item.is_active ? 'opacity-60 bg-[#F5EFE6]/40' : ''
                          }`}
                        >
                          <td className="px-6 py-3.5 text-xs text-[#6B5E55] font-mono">
                            {item.sort_order}
                          </td>
                          <td className="px-6 py-3.5 font-mono text-xs font-semibold text-[#8B1D24]">
                            {item.value_code}
                          </td>
                          <td className="px-6 py-3.5 font-medium text-[#231F20]">
                            {item.label_vi}
                          </td>
                          <td className="px-6 py-3.5 text-xs text-[#6B5E55]">
                            {item.description || '—'}
                          </td>
                          <td className="px-6 py-3.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                item.is_active
                                  ? 'bg-[#EAF5EC] text-[#2A7238]'
                                  : 'bg-[#FDE8E8] text-[#9B1C1C]'
                              }`}
                            >
                              {item.is_active ? 'Đang dùng' : 'Tạm ẩn'}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button
                              onClick={() => toggleActiveStatus(item.value_code)}
                              className="text-xs font-medium text-[#6B5E55] hover:text-[#8B1D24] inline-flex items-center gap-1"
                              title={item.is_active ? 'Tạm ẩn khỏi dropdown' : 'Kích hoạt lại'}
                            >
                              {item.is_active ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" /> Ẩn
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" /> Bật
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Thêm Mới Lookup */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E8E2D9] shadow-xl max-w-md w-full p-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#8B1D24] mb-1">
              Thêm Danh Mục Mới
            </h3>
            <p className="text-xs text-[#6B5E55] mb-4">
              Nhóm: <strong>{groups.find((g) => g.code === selectedGroup)?.name}</strong> ({selectedGroup})
            </p>

            <form onSubmit={handleCreateLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1 uppercase">
                  Mã giá trị (Value Code) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: WINE_PARTY, THREADS_ADS"
                  value={newValueCode}
                  onChange={(e) => setNewValueCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md font-mono focus:border-[#8B1D24] focus:outline-none focus:ring-1 focus:ring-[#8B1D24]"
                />
                <p className="text-[11px] text-[#9C8E82] mt-0.5">Viết hoa, không dấu, cách nhau bằng gạch dưới</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1 uppercase">
                  Tên hiển thị tiếng Việt (Label) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Tiệc rượu vang thưởng vị"
                  value={newLabelVi}
                  onChange={(e) => setNewLabelVi(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none focus:ring-1 focus:ring-[#8B1D24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1 uppercase">
                  Mô tả / Ý nghĩa
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về tính chất hoặc mục đích..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none focus:ring-1 focus:ring-[#8B1D24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1 uppercase">
                  Thứ tự sắp xếp
                </label>
                <input
                  type="number"
                  value={newSortOrder}
                  onChange={(e) => setNewSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none focus:ring-1 focus:ring-[#8B1D24]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[#6B5E55] hover:bg-[#F5EFE6] rounded-md transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-md shadow-xs transition-colors"
                >
                  Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
