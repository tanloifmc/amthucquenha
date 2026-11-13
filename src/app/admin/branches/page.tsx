'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Plus, ArrowLeft, Phone, MapPin, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface BranchItem {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  hotline: string;
  is_active: boolean;
}

const INITIAL_BRANCHES: BranchItem[] = [
  {
    id: 1,
    code: 'QN_PNT',
    name: 'Ẩm Thực Quê Nhà - Phạm Ngọc Thạch',
    address: '28 Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3',
    city: 'TP. Hồ Chí Minh',
    hotline: '0938 226 166',
    is_active: true,
  },
  {
    id: 2,
    code: 'QN_TT',
    name: 'Ẩm Thực Quê Nhà - Thành Thái',
    address: '52A Thành Thái, Phường 12, Quận 10',
    city: 'TP. Hồ Chí Minh',
    hotline: '0938 226 166',
    is_active: true,
  },
  {
    id: 3,
    code: 'QN_NTB',
    name: 'Ẩm Thực Quê Nhà - Nguyễn Thái Bình',
    address: '202 - 204 Nguyễn Thái Bình, Phường 12, Quận Tân Bình',
    city: 'TP. Hồ Chí Minh',
    hotline: '0938 226 166',
    is_active: true,
  },
];

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [hotline, setHotline] = useState('0938 226 166');
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const newBranch: BranchItem = {
      id: branches.length + 1,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      address: address.trim(),
      city: 'TP. Hồ Chí Minh',
      hotline: hotline.trim(),
      is_active: true,
    };

    setBranches([...branches, newBranch]);
    setShowModal(false);
    setCode('');
    setName('');
    setAddress('');
    setNotification(`Đã thêm chi nhánh mới: ${newBranch.name}`);
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleStatus = (id: number) => {
    setBranches(
      branches.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
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
                <Building2 className="w-4 h-4" />
              </span>
              <h1 className="text-lg font-bold text-[#8B1D24]">
                Quản Trị Chi Nhánh (Branches)
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#8B1D24] text-white text-xs font-bold hover:bg-[#72161C] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Thêm chi nhánh
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
          <div className="px-6 py-4 border-b border-[#E8E2D9] bg-[#FAF7F2] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#231F20]">
                Danh Sách Chi Nhánh Chuỗi Ẩm Thực Quê Nhà ({branches.length} cơ sở)
              </h2>
              <p className="text-xs text-[#6B5E55] mt-0.5">
                Admin tự quản lý và thêm chi nhánh mới mà không cần dev can thiệp mã nguồn.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E2D9] text-left text-sm">
              <thead className="bg-[#FAF7F2] text-xs uppercase font-bold text-[#6B5E55]">
                <tr>
                  <th className="px-6 py-3">Mã</th>
                  <th className="px-6 py-3">Tên Chi Nhánh</th>
                  <th className="px-6 py-3">Địa Chỉ</th>
                  <th className="px-6 py-3">Hotline</th>
                  <th className="px-6 py-3">Trạng Thái</th>
                  <th className="px-6 py-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9] bg-white">
                {branches.map((b) => (
                  <tr
                    key={b.id}
                    className={`hover:bg-[#FBF9F5] transition-colors ${
                      !b.is_active ? 'opacity-60 bg-[#F5EFE6]/40' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#8B1D24]">
                      {b.code}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#231F20]">{b.name}</td>
                    <td className="px-6 py-4 text-xs text-[#6B5E55]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C58940] flex-shrink-0" />
                        <span>{b.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-medium text-[#231F20]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#2A7238] flex-shrink-0" />
                        <span>{b.hotline}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          b.is_active
                            ? 'bg-[#EAF5EC] text-[#2A7238]'
                            : 'bg-[#FDE8E8] text-[#9B1C1C]'
                        }`}
                      >
                        {b.is_active ? 'Đang hoạt động' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(b.id)}
                        className="text-xs font-semibold text-[#6B5E55] hover:text-[#8B1D24] inline-flex items-center gap-1"
                      >
                        {b.is_active ? (
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

      {/* Modal Thêm Chi Nhánh */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E8E2D9] shadow-xl max-w-md w-full p-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#8B1D24] mb-1">
              Thêm Chi Nhánh Mới
            </h3>
            <p className="text-xs text-[#6B5E55] mb-4">
              Toàn bộ hệ thống sẽ tự động nhận diện chi nhánh mới cho sơ đồ bàn phòng và báo cáo.
            </p>

            <form onSubmit={handleAddBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Mã chi nhánh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: QN_Q7, QN_GV"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md font-mono focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Tên chi nhánh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Ẩm Thực Quê Nhà - Quận 7"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường, phường..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D5C9BC] rounded-md focus:border-[#8B1D24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Số Hotline
                </label>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
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
                  Lưu chi nhánh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
