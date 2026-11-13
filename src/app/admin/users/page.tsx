'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Plus, ArrowLeft, CheckCircle, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { TEST_PROFILES } from '@/lib/auth/permissions';

interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role_name: string;
  department_name: string;
  branch_names: string[];
  is_active: boolean;
}

const INITIAL_USERS: UserRecord[] = Object.values(TEST_PROFILES).map((p, idx) => ({
  id: p.id,
  full_name: p.full_name,
  email: p.email || `nhanvien${idx + 1}@quenha.vn`,
  phone: '0903.xxx.xxx',
  role_name: p.role_name,
  department_name: p.department_name || 'Vận hành',
  branch_names: p.is_all_branches ? ['Toàn chuỗi (3 chi nhánh)'] : p.branches.map((b) => b.name),
  is_active: true,
}));

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState<UserRecord[]>(INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleName, setRoleName] = useState('Chuyên viên Marketing');
  const [departmentName, setDepartmentName] = useState('Phòng Marketing & Truyền thông');
  const [branchOption, setBranchOption] = useState('Quê Nhà - Phạm Ngọc Thạch');
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newUser: UserRecord = {
      id: `user-${Date.now()}`,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || '0903.xxx.xxx',
      role_name: roleName,
      department_name: departmentName,
      branch_names: [branchOption],
      is_active: true,
    };

    setUsersList([...usersList, newUser]);
    setShowModal(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotification(`Đã tạo tài khoản nhân viên: ${newUser.full_name} (${newUser.role_name})`);
    setTimeout(() => setNotification(null), 4000);
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
                <Users className="w-4 h-4" />
              </span>
              <h1 className="text-lg font-bold text-[#8B1D24]">
                Quản Trị Người Dùng & Phân Quyền (Users & RBAC)
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#8B1D24] text-white text-xs font-bold hover:bg-[#72161C] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Thêm nhân viên
          </button>
        </div>
      </header>

      {/* Main Content */}
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
              Danh Sách Nhân Viên & Ma Trận Phân Quyền ({usersList.length} tài khoản)
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Mỗi nhân viên được gán 1 Phòng ban, 1 Vai trò cốt lõi và các Chi nhánh phụ trách cụ thể.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E2D9] text-left text-sm">
              <thead className="bg-[#FAF7F2] text-xs uppercase font-bold text-[#6B5E55]">
                <tr>
                  <th className="px-6 py-3">Nhân Viên</th>
                  <th className="px-6 py-3">Phòng Ban</th>
                  <th className="px-6 py-3">Vai Trò</th>
                  <th className="px-6 py-3">Chi Nhánh Phụ Trách</th>
                  <th className="px-6 py-3">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9] bg-white">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#231F20]">{u.full_name}</div>
                      <div className="text-xs text-[#6B5E55] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-[#9C8E82]" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-[#6B5E55]">
                      {u.department_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F7EAEB] text-[#8B1D24] border border-[#8B1D24]/10">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {u.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#231F20]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C58940] flex-shrink-0" />
                        <span>{u.branch_names.join(', ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EAF5EC] text-[#2A7238]">
                        Đang làm việc
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Thêm Nhân Viên */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E8E2D9] shadow-xl max-w-md w-full p-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#8B1D24] mb-1">
              Thêm Nhân Viên & Phân Quyền
            </h3>
            <p className="text-xs text-[#6B5E55] mb-4">
              Tạo tài khoản và gán phạm vi quyền hạn trong hệ thống Quê Nhà.
            </p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn Hoàng"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Email đăng nhập *
                </label>
                <input
                  type="email"
                  required
                  placeholder="hoang.nv@quenha.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="09xx.xxx.xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Phòng ban
                </label>
                <select
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="Phòng Marketing & Truyền thông">Phòng Marketing & Truyền thông</option>
                  <option value="Bộ phận Kinh doanh & Đặt tiệc">Bộ phận Kinh doanh & Đặt tiệc</option>
                  <option value="Quản lý Vận hành Chi nhánh">Quản lý Vận hành Chi nhánh</option>
                  <option value="Tổ Lễ tân & Đón tiếp">Tổ Lễ tân & Đón tiếp</option>
                  <option value="Bộ phận Bếp & Ẩm thực">Bộ phận Bếp & Ẩm thực</option>
                  <option value="Phòng Kế toán & Tài chính">Phòng Kế toán & Tài chính</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Vai trò (Role)
                </label>
                <select
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none bg-white cursor-pointer font-semibold text-[#8B1D24]"
                >
                  <option value="Hội Đồng Thành Viên (Level 1)">Hội Đồng Thành Viên (Level 1 - HDTV)</option>
                  <option value="Super Admin / CTO (Level 2)">Super Admin / CTO (Level 2 - SUPER_ADMIN)</option>
                  <option value="Trưởng Phòng HQ (Level 3)">Trưởng Phòng HQ (Level 3 - DEPARTMENT_HEAD)</option>
                  <option value="Tổng Quản Lý Chuỗi (Level 4)">Tổng Quản Lý Chuỗi (Level 4 - GENERAL_MANAGER)</option>
                  <option value="Quản lý Chi Nhánh (Level 5)">Quản lý Chi Nhánh (Level 5 - BRANCH_MANAGER)</option>
                  <option value="Nhân Viên Vận Hành (Level 6)">Nhân Viên Vận Hành (Level 6 - STAFF)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Chi nhánh phụ trách
                </label>
                <select
                  value={branchOption}
                  onChange={(e) => setBranchOption(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="Quê Nhà - Phạm Ngọc Thạch">Quê Nhà - Phạm Ngọc Thạch</option>
                  <option value="Quê Nhà - Thành Thái">Quê Nhà - Thành Thái</option>
                  <option value="Quê Nhà - Nguyễn Thái Bình">Quê Nhà - Nguyễn Thái Bình</option>
                  <option value="Toàn chuỗi (3 chi nhánh)">Toàn chuỗi (3 chi nhánh)</option>
                </select>
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
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
