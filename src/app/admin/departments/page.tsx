'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Network, Plus, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface DepartmentItem {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
}

const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  {
    id: 1,
    code: 'MARKETING',
    name: 'Phòng Marketing & Truyền thông',
    description: 'Chịu trách nhiệm chiến dịch, bài viết fanpage, AI content và lead tổng thể',
    is_active: true,
  },
  {
    id: 2,
    code: 'SALES_BANQUET',
    name: 'Bộ phận Kinh doanh & Đặt tiệc',
    description: 'Tư vấn tiệc, gửi thực đơn, chốt cọc và chăm sóc khách hàng đặt tiệc',
    is_active: true,
  },
  {
    id: 3,
    code: 'MANAGEMENT',
    name: 'Quản lý Vận hành Chi nhánh',
    description: 'Giám sát hoạt động phục vụ, sơ đồ bàn phòng và nhân sự tại từng cơ sở',
    is_active: true,
  },
  {
    id: 4,
    code: 'RECEPTIONIST',
    name: 'Tổ Lễ tân & Đón tiếp',
    description: 'Đón khách, check-in phòng tiệc, sắp xếp bàn sảnh và nhận yêu cầu trực tiếp',
    is_active: true,
  },
  {
    id: 5,
    code: 'KITCHEN',
    name: 'Bộ phận Bếp & Ẩm thực',
    description: 'Chuẩn bị thực đơn tiệc, điều phối ra món đúng giờ cho các đoàn tiệc lớn',
    is_active: true,
  },
  {
    id: 6,
    code: 'ACCOUNTING',
    name: 'Phòng Kế toán & Tài chính',
    description: 'Đối soát doanh thu, nhập số liệu MISA và kiểm soát cọc tiệc chặt chẽ',
    is_active: true,
  },
];

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const newDept: DepartmentItem = {
      id: departments.length + 1,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      is_active: true,
    };

    setDepartments([...departments, newDept]);
    setShowModal(false);
    setCode('');
    setName('');
    setDescription('');
    setNotification(`Đã thêm phòng ban mới: ${newDept.name}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleStatus = (id: number) => {
    setDepartments(
      departments.map((d) => (d.id === id ? { ...d, is_active: !d.is_active } : d))
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#231F20]">
      {/* Header */}
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
                <Network className="w-4 h-4" />
              </span>
              <h1 className="text-lg font-bold text-[#8B1D24]">
                Quản Trị Phòng Ban (Departments)
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#8B1D24] text-white text-xs font-bold hover:bg-[#72161C] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Thêm phòng ban
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div className="mb-6 p-4 rounded-lg bg-[#EAF5EC] border border-[#2A7238] text-[#2A7238] flex items-center justify-between text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-[#E8E2D9] bg-[#FAF7F2]">
            <h2 className="text-base font-bold text-[#231F20]">
              Danh Sách Phòng Ban Chức Năng ({departments.length} đơn vị)
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Phòng ban giúp phân loại nhân sự chính xác và kết hợp ma trận vai trò RBAC linh hoạt.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E2D9] text-left text-sm">
              <thead className="bg-[#FAF7F2] text-xs uppercase font-bold text-[#6B5E55]">
                <tr>
                  <th className="px-6 py-3">Mã</th>
                  <th className="px-6 py-3">Tên Phòng Ban</th>
                  <th className="px-6 py-3">Chức Năng & Mô Tả</th>
                  <th className="px-6 py-3">Trạng Thái</th>
                  <th className="px-6 py-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9] bg-white">
                {departments.map((d) => (
                  <tr
                    key={d.id}
                    className={`hover:bg-[#FBF9F5] transition-colors ${
                      !d.is_active ? 'opacity-60 bg-[#F5EFE6]/40' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#8B1D24]">
                      {d.code}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#231F20]">{d.name}</td>
                    <td className="px-6 py-4 text-xs text-[#6B5E55] max-w-md">
                      {d.description}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          d.is_active
                            ? 'bg-[#EAF5EC] text-[#2A7238]'
                            : 'bg-[#FDE8E8] text-[#9B1C1C]'
                        }`}
                      >
                        {d.is_active ? 'Đang hoạt động' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(d.id)}
                        className="text-xs font-semibold text-[#6B5E55] hover:text-[#8B1D24] inline-flex items-center gap-1"
                      >
                        {d.is_active ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Tạm dừng
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Kích hoạt
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Thêm Phòng Ban */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E8E2D9] shadow-xl max-w-md w-full p-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#8B1D24] mb-1">
              Thêm Phòng Ban Mới
            </h3>
            <p className="text-xs text-[#6B5E55] mb-4">
              Nhập mã và tên phòng ban để phục vụ phân bổ nhân viên.
            </p>

            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Mã phòng ban *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: HUMAN_RESOURCES, LOGISTICS"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md font-mono focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Tên phòng ban *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Phòng Nhân Sự & Đào Tạo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Mô tả chức năng
                </label>
                <textarea
                  rows={2}
                  placeholder="Chức năng, nhiệm vụ chính..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[#6B5E55] hover:bg-[#F5EFE6] rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-md shadow-xs"
                >
                  Lưu phòng ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
