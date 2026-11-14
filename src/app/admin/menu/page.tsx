'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  Sparkles,
  ShieldCheck,
  Building2,
  Eye,
  EyeOff,
  DollarSign,
  Layers,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import {
  SET_MENUS_DATA,
  DISHES_DATA,
  SetMenu,
  DishItem,
} from '@/data/landingMenuData';

export default function AdminMenuPage() {
  const [activeTab, setActiveTab] = useState<'SET' | 'DISH'>('SET');

  // State Quản lý Set Menu
  const [setMenus, setSetMenus] = useState<SetMenu[]>(SET_MENUS_DATA);
  const [editingSet, setEditingSet] = useState<SetMenu | null>(null);
  const [isAddSetModalOpen, setIsAddSetModalOpen] = useState(false);

  // State Quản lý Món Ăn
  const [dishes, setDishes] = useState<DishItem[]>(DISHES_DATA);
  const [dishSearch, setDishSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);

  // Modal Form Món Mới
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<'KHAI_VI' | 'MON_CHINH' | 'HAI_SAN' | 'LAU' | 'TRANG_MIENG'>('MON_CHINH');
  const [newDishPrice, setNewDishPrice] = useState<number>(350000);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishBadge, setNewDishBadge] = useState('ĐẶC SẢN');

  // Modal Form Set Mới
  const [newSetName, setNewSetName] = useState('');
  const [newSetPrice, setNewSetPrice] = useState<number>(4500000);
  const [newSetBadge, setNewSetBadge] = useState('MỚI');
  const [newSetDesc, setNewSetDesc] = useState('');
  const [newSetDishes, setNewSetDishes] = useState<string>('Gỏi khai vị, Heo mẹt giòn da, Cá nướng, Lẩu cua đồng, Tráng miệng');

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    if (editingDish) {
      setDishes(
        dishes.map((d) =>
          d.id === editingDish.id
            ? {
                ...d,
                name: newDishName,
                category: newDishCategory,
                price: Number(newDishPrice),
                description: newDishDesc,
                badge: newDishBadge,
              }
            : d
        )
      );
      setEditingDish(null);
    } else {
      const newItem: DishItem = {
        id: `dish-custom-${Date.now()}`,
        name: newDishName,
        category: newDishCategory,
        price: Number(newDishPrice),
        description: newDishDesc,
        badge: newDishBadge,
        isSignature: newDishBadge.includes('SIGNATURE') || newDishBadge.includes('ĐẶC SẢN'),
      };
      setDishes([newItem, ...dishes]);
    }

    setNewDishName('');
    setNewDishDesc('');
    setIsAddDishModalOpen(false);
  };

  const handleDeleteDish = (id: string) => {
    if (confirm('Anh/chị có chắc muốn xóa món này khỏi danh mục thực đơn?')) {
      setDishes(dishes.filter((d) => d.id !== id));
    }
  };

  const handleSaveSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSetName.trim()) return;

    const dishList = newSetDishes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingSet) {
      setSetMenus(
        setMenus.map((s) =>
          s.id === editingSet.id
            ? {
                ...s,
                name: newSetName,
                pricePerTable: Number(newSetPrice),
                badge: newSetBadge,
                description: newSetDesc,
                dishes: dishList,
              }
            : s
        )
      );
      setEditingSet(null);
    } else {
      const newSet: SetMenu = {
        id: `set-custom-${Date.now()}`,
        code: `CUSTOM_${Date.now()}`,
        name: newSetName,
        pricePerTable: Number(newSetPrice),
        badge: newSetBadge,
        description: newSetDesc,
        suitableFor: 'Tiệc họp mặt / Liên hoan (Bàn 10 người)',
        dishes: dishList,
      };
      setSetMenus([...setMenus, newSet]);
    }

    setNewSetName('');
    setNewSetDesc('');
    setIsAddSetModalOpen(false);
  };

  const handleDeleteSet = (id: string) => {
    if (confirm('Anh/chị có chắc muốn xóa Set Menu này khỏi trang Đặt Tiệc?')) {
      setSetMenus(setMenus.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a150e] text-amber-50 p-6 md:p-8">
      {/* Header Điều Hướng */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay Lại Bảng Điều Khiển</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-amber-100 flex items-center gap-2">
                <span>Quản Trị Thực Đơn & Menu Tiệc Quê Nhà</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans font-normal">
                  Cấp Quyền: Tổng Quản Lý Trở Lên (Level 1 - 4)
                </span>
              </h1>
              <p className="text-xs text-amber-300/70">
                Tùy chỉnh danh mục món ăn và Set Menu tiệc mẫu hiển thị trên Trang Đặt Tiệc Trực Tuyến & Bot AI DeepSeek.
              </p>
            </div>
          </div>
        </div>

        {/* Nút Thêm Mới */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700/40 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Xem Trang Đặt Tiệc Thực Tế</span>
          </Link>

          {activeTab === 'SET' ? (
            <button
              onClick={() => {
                setEditingSet(null);
                setNewSetName('');
                setNewSetPrice(4800000);
                setNewSetBadge('MỚI');
                setNewSetDesc('');
                setNewSetDishes('Gỏi khai vị, Heo mẹt nổ cốm, Cá lăng nướng, Tôm sú hoàng kim, Lẩu cua đồng, Tráng miệng');
                setIsAddSetModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 text-xs font-bold shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Set Menu Mới</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingDish(null);
                setNewDishName('');
                setNewDishPrice(350000);
                setNewDishDesc('');
                setNewDishBadge('ĐẶC SẢN');
                setIsAddDishModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 text-xs font-bold shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Món Ăn Mới</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tabs Chuyển Đổi */}
        <div className="flex items-center gap-3 border-b border-amber-900/40 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('SET')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'SET'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-[#102318] text-amber-300 border border-amber-900/40 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Set Menu Tiệc Mẫu ({setMenus.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('DISH')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'DISH'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-[#102318] text-amber-300 border border-amber-900/40 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Món Ăn Tự Chọn ({dishes.length})</span>
          </button>
        </div>

        {/* TAB 1: QUẢN TRỊ SET MENU */}
        {activeTab === 'SET' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setMenus.map((set) => (
              <div
                key={set.id}
                className="rounded-2xl p-6 bg-[#0f2418] border border-amber-900/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {set.badge || 'SET TIỆC'}
                    </span>
                    <span className="text-xs text-amber-400 font-bold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        set.pricePerTable
                      )}
                      /bàn
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-amber-100 mb-1">{set.name}</h3>
                  <p className="text-xs text-amber-300/70 mb-4 font-light">{set.description}</p>

                  <div className="border-t border-amber-900/30 pt-3 space-y-1.5 mb-6">
                    <span className="text-[11px] text-amber-400 font-semibold uppercase block">
                      Các Món Trong Set ({set.dishes.length} món):
                    </span>
                    {set.dishes.map((dish, i) => (
                      <div key={i} className="text-xs text-amber-200/80 flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-amber-900/30">
                  <button
                    onClick={() => {
                      setEditingSet(set);
                      setNewSetName(set.name);
                      setNewSetPrice(set.pricePerTable);
                      setNewSetBadge(set.badge || '');
                      setNewSetDesc(set.description);
                      setNewSetDishes(set.dishes.join(', '));
                      setIsAddSetModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-950 border border-amber-700/40 text-amber-300 hover:bg-emerald-900 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa Set</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSet(set.id)}
                    className="p-2 rounded-xl bg-red-950/60 border border-red-800/40 text-red-300 hover:bg-red-900 text-xs"
                    title="Xóa Set"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: QUẢN TRỊ MÓN ĂN TỰ CHỌN */}
        {activeTab === 'DISH' && (
          <div>
            {/* Thanh Tìm Kiếm & Lọc */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tên món ăn..."
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0e2115] border border-amber-900/50 text-xs text-amber-100 placeholder:text-amber-500/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {[
                  { id: 'ALL', label: 'Tất Cả' },
                  { id: 'KHAI_VI', label: 'Khai Vị' },
                  { id: 'MON_CHINH', label: 'Món Chính' },
                  { id: 'HAI_SAN', label: 'Hải Sản' },
                  { id: 'LAU', label: 'Lẩu' },
                  { id: 'TRANG_MIENG', label: 'Tráng Miệng' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === c.id
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-[#102318] border border-amber-900/40 text-amber-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bảng Món Ăn */}
            <div className="rounded-2xl border border-amber-900/40 overflow-hidden bg-[#0c1c12]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#11261a] border-b border-amber-900/40 text-amber-300 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Tên Món Ăn</th>
                    <th className="p-4">Phân Loại</th>
                    <th className="p-4">Đơn Giá</th>
                    <th className="p-4">Nhãn Nổi Bật</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-950/60">
                  {dishes
                    .filter((d) => selectedCategory === 'ALL' || d.category === selectedCategory)
                    .filter((d) => d.name.toLowerCase().includes(dishSearch.toLowerCase()))
                    .map((dish) => (
                      <tr key={dish.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-amber-100">{dish.name}</div>
                          <div className="text-[11px] text-amber-400/60 font-light truncate max-w-md">
                            {dish.description}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                            {dish.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-amber-400">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            dish.price
                          )}
                        </td>
                        <td className="p-4">
                          {dish.badge ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              {dish.badge}
                            </span>
                          ) : (
                            <span className="text-amber-500/40 text-[11px]">Tiêu chuẩn</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingDish(dish);
                                setNewDishName(dish.name);
                                setNewDishCategory(dish.category);
                                setNewDishPrice(dish.price);
                                setNewDishDesc(dish.description);
                                setNewDishBadge(dish.badge || '');
                                setIsAddDishModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-emerald-950 text-amber-300 hover:bg-emerald-900 border border-amber-800/40"
                              title="Sửa món"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDish(dish.id)}
                              className="p-1.5 rounded-lg bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800/40"
                              title="Xóa món"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL THÊM / SỬA MÓN ĂN */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f2317] border border-amber-500/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40 mb-4">
              <h3 className="text-lg font-serif font-bold text-amber-100">
                {editingDish ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
              </h3>
              <button
                onClick={() => setIsAddDishModalOpen(false)}
                className="text-amber-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-300 font-semibold mb-1">Tên Món Ăn (*)</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="Ví dụ: Gà Ta Hấp Muối Ớt"
                  className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Phân Loại</label>
                  <select
                    value={newDishCategory}
                    onChange={(e: any) => setNewDishCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="KHAI_VI">Khai Vị</option>
                    <option value="MON_CHINH">Món Chính (Heo / Gà / Bò)</option>
                    <option value="HAI_SAN">Hải Sản</option>
                    <option value="LAU">Lẩu Truyền Thống</option>
                    <option value="TRANG_MIENG">Tráng Miệng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Đơn Giá (VNĐ) (*)</label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Huy Hiệu / Điểm Nhấn</label>
                <input
                  type="text"
                  value={newDishBadge}
                  onChange={(e) => setNewDishBadge(e.target.value)}
                  placeholder="Ví dụ: BÁN CHẠY, SIGNATURE 🏆, VIP..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Mô Tả Hương Vị & Nguyên Liệu</label>
                <textarea
                  rows={3}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Mô tả tóm tắt sức hấp dẫn của món ăn..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold shadow-lg"
                >
                  Lưu Món Ăn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM / SỬA SET MENU */}
      {isAddSetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f2317] border border-amber-500/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40 mb-4">
              <h3 className="text-lg font-serif font-bold text-amber-100">
                {editingSet ? 'Chỉnh Sửa Set Menu' : 'Thêm Set Menu Tiệc Mới'}
              </h3>
              <button
                onClick={() => setIsAddSetModalOpen(false)}
                className="text-amber-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSet} className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-300 font-semibold mb-1">Tên Set Menu (*)</label>
                <input
                  type="text"
                  required
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  placeholder="Ví dụ: Set Tiệc Kim Ngân"
                  className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Giá / Bàn 10 người (VNĐ) (*)</label>
                  <input
                    type="number"
                    required
                    value={newSetPrice}
                    onChange={(e) => setNewSetPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Huy Hiệu Nhãn</label>
                  <input
                    type="text"
                    value={newSetBadge}
                    onChange={(e) => setNewSetBadge(e.target.value)}
                    placeholder="Ví dụ: BÁN CHẠY, VIP..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Danh Sách Món (Phân tách bởi dấu phẩy)</label>
                <textarea
                  rows={3}
                  required
                  value={newSetDishes}
                  onChange={(e) => setNewSetDishes(e.target.value)}
                  placeholder="Gỏi tép, Heo mẹt, Cá nướng, Tôm sú hoàng kim, Lẩu cua đồng, Tráng miệng"
                  className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Mô Tả Set Tiệc</label>
                <input
                  type="text"
                  value={newSetDesc}
                  onChange={(e) => setNewSetDesc(e.target.value)}
                  placeholder="Tóm tắt sự phù hợp của set tiệc này..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0a160f] border border-amber-900/50 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => setIsAddSetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold shadow-lg"
                >
                  Lưu Set Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
