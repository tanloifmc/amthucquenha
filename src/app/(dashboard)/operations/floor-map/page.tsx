'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Grid,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  Layers,
  Sparkles,
  Phone,
  ShieldAlert,
  Building2,
  Settings2,
  Wrench,
} from 'lucide-react';
import {
  RoomTableItem,
  RoomLockRecord,
  INITIAL_ROOMS_TABLES,
  INITIAL_LOCKS,
  floorService,
} from '@/services/floorService';
import { CustomerRecord, INITIAL_CUSTOMERS } from '@/services/crmService';
import { TableRoomShape } from '@/components/floor/FloorCanvas';

// Load FloorCanvas dynamically để tránh lỗi SSR với HTML5 Canvas
const FloorCanvas = dynamic(() => import('@/components/floor/FloorCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-[#FAF7F2] rounded-xl flex items-center justify-center text-xs text-[#A09383] border border-[#E8E2D9]">
      Đang tải sơ đồ mặt bằng Canvas 2D...
    </div>
  ),
});

export default function FloorMapOperationsPage() {
  const [selectedBranchId, setSelectedBranchId] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-20');
  const [selectedShift, setSelectedShift] = useState<'LUNCH' | 'DINNER' | 'FULL_DAY'>('DINNER');
  const [viewMode, setViewMode] = useState<'GRID' | 'CANVAS'>('GRID');

  const [rooms, setRooms] = useState<RoomTableItem[]>(INITIAL_ROOMS_TABLES);
  const [locks, setLocks] = useState<RoomLockRecord[]>(INITIAL_LOCKS);

  // Modal Đặt phòng nhanh
  const [bookingTargetRoom, setBookingTargetRoom] = useState<RoomTableItem | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [guestCount, setGuestCount] = useState<number>(10);
  const [collisionWarning, setCollisionWarning] = useState<string>('');
  const [detectedVipCustomer, setDetectedVipCustomer] = useState<CustomerRecord | null>(null);

  // Modal Quản Lý & Thêm Phòng VIP Mới (Dành cho Tổng Quản Lý Chi Nhánh & BGĐ)
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'VIP' | 'HALL' | 'GARDEN'>('VIP');
  const [newCapacityMin, setNewCapacityMin] = useState<number>(8);
  const [newCapacityMax, setNewCapacityMax] = useState<number>(20);
  const [newIsCombinable, setNewIsCombinable] = useState<boolean>(false);
  const [newCombinedWith, setNewCombinedWith] = useState<string>('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Tự động nhận diện VIP khi gõ SĐT
  const handlePhoneInputChange = (phoneInput: string) => {
    setCustomerPhone(phoneInput);
    const cleaned = phoneInput.replace(/\s+/g, '');

    if (cleaned.length >= 10) {
      const found = INITIAL_CUSTOMERS.find((c) => c.phone.replace(/\s+/g, '') === cleaned);
      if (found) {
        setCustomerName(found.full_name);
        setDetectedVipCustomer(found);
        return;
      }
    }
    setDetectedVipCustomer(null);
  };

  // Lấy danh sách phòng theo chi nhánh đã chọn
  const branchRooms = rooms.filter((r) => r.branch_id === selectedBranchId);

  // Tính trạng thái phòng dựa trên ngày và ca đang chọn
  const computedRooms = branchRooms.map((room) => {
    // Kiểm tra xem phòng có lock nào trong ngày và ca này không
    const matchedLock = locks.find((l) => {
      if (l.table_room_id !== room.id || l.booking_date !== selectedDate) return false;
      if (selectedShift === 'FULL_DAY') return true; // Cả ngày quét trúng mọi lock
      return l.time_slot === selectedShift || l.time_slot === 'FULL_DAY';
    });

    let status: RoomTableItem['current_status'] = 'AVAILABLE';
    let booking_info = undefined;

    if (matchedLock) {
      status = matchedLock.lock_status === 'CONFIRMED' ? 'CONFIRMED' : 'HOLD';
      booking_info = {
        booking_id: matchedLock.booking_id,
        customer_name: matchedLock.customer_name,
        customer_phone: '0903 xxx xxx',
        guest_count: matchedLock.guest_count,
        time_slot: matchedLock.time_slot,
      };
    }

    return {
      ...room,
      current_status: status,
      booking_info,
    };
  });

  // Thống kê nhanh trạng thái phòng
  const availableCount = computedRooms.filter((r) => r.current_status === 'AVAILABLE').length;
  const holdCount = computedRooms.filter((r) => r.current_status === 'HOLD').length;
  const confirmedCount = computedRooms.filter((r) => r.current_status === 'CONFIRMED').length;

  // Xử lý khi nhấn vào phòng để đặt chỗ nhanh
  const handleRoomClick = (room: RoomTableItem) => {
    if (room.current_status === 'CONFIRMED') {
      alert(`⚠️ Phòng [${room.name}] đã được chốt cọc tiệc bởi ${room.booking_info?.customer_name}. Không thể đặt đè!`);
      return;
    }

    // Kiểm tra va chạm xung đột theo Trigger
    const collisionCheck = floorService.checkCollision(room.id, selectedDate, selectedShift, locks);
    if (collisionCheck.isConflict) {
      setCollisionWarning(collisionCheck.reason || 'Xung đột lịch phòng!');
    } else {
      setCollisionWarning('');
    }

    setBookingTargetRoom(room);
    setGuestCount(room.capacity_min);
    setCustomerName('');
    setCustomerPhone('');
    setDetectedVipCustomer(null);
  };

  // Xác nhận khóa phòng / đặt chỗ
  const handleConfirmLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTargetRoom || !customerName.trim()) return;

    // Kiểm tra lại chốt chặn Trigger chống trùng phòng FULL_DAY vs LUNCH/DINNER
    const collisionCheck = floorService.checkCollision(
      bookingTargetRoom.id,
      selectedDate,
      selectedShift,
      locks
    );

    if (collisionCheck.isConflict) {
      setCollisionWarning(collisionCheck.reason || 'Xung đột phòng không thể vượt qua!');
      return;
    }

    const newLock: RoomLockRecord = {
      id: Date.now(),
      table_room_id: bookingTargetRoom.id,
      booking_id: Date.now(),
      booking_date: selectedDate,
      time_slot: selectedShift,
      lock_status: 'CONFIRMED',
      customer_name: customerName.trim(),
      guest_count: Number(guestCount),
    };

    setLocks([...locks, newLock]);
    setBookingTargetRoom(null);
    setCustomerName('');
    setCustomerPhone('');
    setCollisionWarning('');
    setDetectedVipCustomer(null);
  };

  // Chuẩn bị dữ liệu cho Canvas 2D
  const canvasTables: TableRoomShape[] = computedRooms.map((r) => ({
    id: r.id,
    code: r.code,
    name: r.name,
    shape: r.shape,
    roomType: r.room_type,
    x: r.pos_x,
    y: r.pos_y,
    width: r.width,
    height: r.height,
    capacityMax: r.capacity_max,
    status: r.current_status,
  }));

  // Xử lý Tổng Quản Lý tạo phòng mới
  const handleCreateNewRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomCode.trim() || !newRoomName.trim()) return;

    const labelMap: Record<string, string> = {
      VIP: 'Phòng VIP máy lạnh riêng',
      HALL: 'Sảnh tiệc chung trung tâm',
      GARDEN: 'Khu vực sân vườn thoáng mát',
    };

    const created = await floorService.addNewRoom({
      branch_id: selectedBranchId,
      code: newRoomCode.trim().toUpperCase(),
      name: newRoomName.trim(),
      room_type: newRoomType,
      room_type_label: labelMap[newRoomType],
      capacity_min: Number(newCapacityMin),
      capacity_max: Number(newCapacityMax),
      is_combinable: newIsCombinable,
      combined_with: newIsCombinable ? newCombinedWith : undefined,
      pos_x: 50 + Math.floor(Math.random() * 200),
      pos_y: 60 + Math.floor(Math.random() * 150),
      width: newRoomType === 'HALL' ? 220 : 140,
      height: 90,
      shape: 'RECT',
      current_status: 'AVAILABLE',
    });

    setRooms([...rooms, created]);
    setShowAddRoomModal(false);
    setNewRoomCode('');
    setNewRoomName('');
    setNewCombinedWith('');
    setNotificationMsg(`Đã tạo thành công "${created.name}" (${created.code}) cho chi nhánh!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Xử lý Tổng Quản Lý bật/tắt bảo trì phòng
  const handleToggleRoomMaintenance = (e: React.MouseEvent, roomId: number, currentStatus: string) => {
    e.stopPropagation();
    const nextStatus = currentStatus === 'HOLD' ? 'AVAILABLE' : 'HOLD';
    floorService.toggleRoomStatus(roomId, nextStatus);
    setRooms(rooms.map((r) => (r.id === roomId ? { ...r, current_status: nextStatus } : r)));
    setNotificationMsg(
      nextStatus === 'HOLD'
        ? `Đã khóa tạm ngưng/bảo trì phòng #${roomId}`
        : `Đã mở phòng #${roomId} về trạng thái sẵn sàng đón khách`
    );
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#231F20] tracking-tight">
              Sơ Đồ Phòng / Bàn Theo Ca (Floor Operations)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1D24] text-white">
              Module 6
            </span>
          </div>
          <p className="text-sm text-[#6B5E55] mt-1">
            Kiểm soát mặt bằng phòng tiệc theo thời gian thực, khóa phòng chống trùng ca và ghép thông phòng.
          </p>
        </div>

        {/* Nút thao tác chuyển chế độ và Thêm Phòng mới */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-[#FAF7F2] border border-[#D5C9BC] rounded-xl self-start sm:self-auto shadow-xs">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'GRID'
                  ? 'bg-[#8B1D24] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#231F20]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Lưới Thẻ (Tablet)</span>
            </button>
            <button
              onClick={() => setViewMode('CANVAS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'CANVAS'
                  ? 'bg-[#8B1D24] text-white shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#231F20]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bản Đồ 2D Canvas</span>
            </button>
          </div>

          {/* Nút Thêm Phòng VIP Dành Riêng Cho Tổng Quản Lý Chi Nhánh & BGĐ */}
          <button
            onClick={() => {
              const prefix = selectedBranchId === 1 ? 'PNT' : selectedBranchId === 2 ? 'TT' : 'NTB';
              setNewRoomCode(`${prefix}_VIP0${branchRooms.length + 1}`);
              setShowAddRoomModal(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#8B1D24] hover:bg-[#72161C] text-white transition-all flex items-center gap-1.5 shadow-xs"
            title="Tổng Quản Lý có toàn quyền thêm và cơ cấu phòng VIP/bàn của chi nhánh mình"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Phòng VIP / Bàn</span>
          </button>
        </div>
      </div>

      {/* THÔNG BÁO PHẢN HỒI THAO TÁC CỦA TỔNG QUẢN LÝ */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notificationMsg}</span>
          </div>
          <button
            onClick={() => setNotificationMsg(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* THANH BỘ LỌC ĐIỀU KHIỂN CA TIỆC THEO CHỈ THỊ CTO */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* 1. Chọn Chi nhánh */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#8B1D24]" />
            <span className="text-xs font-bold text-[#6B5E55] uppercase">Chi nhánh:</span>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(Number(e.target.value))}
              className="text-xs font-bold text-[#231F20] border border-[#D5C9BC] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#8B1D24]"
            >
              <option value={1}>Quê Nhà - Phạm Ngọc Thạch (Q3)</option>
              <option value={2}>Quê Nhà - Thành Thái (Q10)</option>
              <option value={3}>Quê Nhà - Nguyễn Thái Bình (Tân Bình)</option>
            </select>
          </div>

          {/* 2. Chọn Ngày */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8B1D24]" />
            <span className="text-xs font-bold text-[#6B5E55] uppercase">Ngày:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold border border-[#D5C9BC] rounded-lg px-2.5 py-1.5"
            />
          </div>

          {/* 3. Chọn Ca tiệc */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8B1D24]" />
            <span className="text-xs font-bold text-[#6B5E55] uppercase">Ca tiệc:</span>
            <div className="flex items-center bg-[#F5EFE6] p-1 rounded-lg border border-[#D5C9BC]/60">
              <button
                onClick={() => setSelectedShift('LUNCH')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  selectedShift === 'LUNCH'
                    ? 'bg-white text-[#8B1D24] shadow-xs'
                    : 'text-[#6B5E55] hover:text-[#231F20]'
                }`}
              >
                Ca Trưa (10:30 - 14:00)
              </button>
              <button
                onClick={() => setSelectedShift('DINNER')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  selectedShift === 'DINNER'
                    ? 'bg-white text-[#8B1D24] shadow-xs'
                    : 'text-[#6B5E55] hover:text-[#231F20]'
                }`}
              >
                Ca Tối (17:00 - 22:00)
              </button>
              <button
                onClick={() => setSelectedShift('FULL_DAY')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  selectedShift === 'FULL_DAY'
                    ? 'bg-[#8B1D24] text-white shadow-xs'
                    : 'text-[#6B5E55] hover:text-[#231F20]'
                }`}
              >
                Cả Ngày (FULL_DAY)
              </button>
            </div>
          </div>
        </div>

        {/* 3 Badge thống kê nhanh */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF5EC] text-[#2A7238] border border-[#2A7238]/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A7238]" />
            <span>Trống: {availableCount}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span>Giữ chỗ: {holdCount}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEE2E2] text-[#991B1B] border border-[#EF4444]/30">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <span>Đã khóa: {confirmedCount}</span>
          </div>
        </div>
      </div>

      {/* HIỂN THỊ CHẾ ĐỘ 1: LƯỚI THẺ (TABLET / MOBILE CHO LỄ TÂN) */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {computedRooms.map((room) => {
            const isAvailable = room.current_status === 'AVAILABLE';
            const isHold = room.current_status === 'HOLD';
            const isConfirmed = room.current_status === 'CONFIRMED';

            return (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className={`rounded-2xl p-5 border-2 transition-all cursor-pointer relative shadow-xs hover:shadow-md flex flex-col justify-between min-h-[190px] ${
                  isAvailable
                    ? 'bg-white border-[#2A7238]/30 hover:border-[#2A7238]'
                    : isHold
                    ? 'bg-[#FFFBEB] border-[#F59E0B]/50 hover:border-[#F59E0B]'
                    : 'bg-[#FEF2F2] border-[#EF4444]/50 hover:border-[#EF4444]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#6B5E55] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E2D9]">
                        {room.code}
                      </span>
                      <h3 className="font-bold text-base text-[#231F20] mt-1.5 leading-snug">
                        {room.name}
                      </h3>
                      <p className="text-xs text-[#6B5E55] mt-0.5">{room.room_type_label}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${
                          isAvailable
                            ? 'bg-[#EAF5EC] text-[#2A7238] border-[#2A7238]/30'
                            : isHold
                            ? 'bg-[#FEF3C7] text-[#B45309] border-[#F59E0B]/30'
                            : 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]/30'
                        }`}
                      >
                        {isAvailable ? '✓ Còn Trống' : isHold ? '⏳ Đang Giữ Chỗ' : '🔒 Đã Khóa / Cọc'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleToggleRoomMaintenance(e, room.id, room.current_status)}
                        className="text-[10px] text-[#6B5E55] hover:text-[#8B1D24] hover:bg-white px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#D5C9BC]/60 shadow-2xs transition-colors"
                        title="Tổng Quản Lý: Tạm khóa bảo trì hoặc mở lại phòng này"
                      >
                        <Wrench className="w-3 h-3 text-[#A09383]" />
                        <span>{room.current_status === 'HOLD' ? 'Mở đón khách' : 'Tạm khóa bảo trì'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Thông tin sức chứa & ghép phòng */}
                  <div className="flex items-center gap-3 text-xs text-[#554A41] mt-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-[#A09383]" />
                      <span>{room.capacity_min} - {room.capacity_max} khách</span>
                    </span>
                    {room.is_combinable && (
                      <span className="text-[11px] px-2 py-0.5 bg-[#FAF7F2] text-[#8B1D24] border border-[#D5C9BC] rounded font-medium">
                        Ghép thông: {room.combined_with}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thông tin khách đang giữ / cọc */}
                <div className="mt-4 pt-3 border-t border-[#E8E2D9]/70">
                  {isAvailable ? (
                    <div className="text-xs text-[#2A7238] font-bold flex items-center justify-between">
                      <span>Bấm vào để khóa phòng / nhận tiệc</span>
                      <Plus className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-[#231F20] truncate">
                        Khách: {room.booking_info?.customer_name}
                      </div>
                      <div className="text-[11px] text-[#6B5E55] flex justify-between">
                        <span>Số lượng: {room.booking_info?.guest_count} khách</span>
                        <span className="font-bold text-[#8B1D24]">Ca {room.booking_info?.time_slot}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* HIỂN THỊ CHẾ ĐỘ 2: BẢN ĐỒ 2D CANVAS (KONVA) */
        <div className="space-y-3">
          <FloorCanvas
            tables={canvasTables}
            onSelectTable={(table) => {
              const r = branchRooms.find((x) => x.id === table.id);
              if (r) handleRoomClick(r);
            }}
          />
          <p className="text-xs text-[#6B5E55] italic text-center">
            💡 Nhấp chuột vào bất kỳ phòng VIP hoặc bàn nào trên Canvas để xem chi tiết hoặc mở form nhận tiệc.
          </p>
        </div>
      )}

      {/* MODAL KHÓA PHÒNG / NHẬN TIỆC NHANH (CÓ CHỐT CHẶN TRIGGER) */}
      {bookingTargetRoom && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center gap-2 text-[#8B1D24] font-bold text-base mb-1">
              <Lock className="w-5 h-5" />
              <span>Khóa Phòng Tiệc & Giữ Chỗ</span>
            </div>
            <p className="text-xs text-[#6B5E55] mb-4">
              Phòng: <strong className="text-[#231F20]">{bookingTargetRoom.name}</strong> ({bookingTargetRoom.room_type_label})
            </p>

            {collisionWarning ? (
              <div className="p-3 bg-[#FEF2F2] border border-[#EF4444]/30 rounded-xl text-xs text-[#991B1B] font-semibold mb-4 flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-[#DC2626] shrink-0" />
                <div>
                  <div className="font-bold uppercase text-[11px]">Chốt Chặn Trùng Phòng (Trigger Alert):</div>
                  <div className="mt-0.5">{collisionWarning}</div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#EAF5EC] border border-[#2A7238]/30 rounded-xl text-xs text-[#2A7238] font-medium mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2A7238] shrink-0" />
                <span>Phòng sẵn sàng khóa trong ngày <strong>{selectedDate}</strong> ca <strong>{selectedShift}</strong>.</span>
              </div>
            )}

            <form onSubmit={handleConfirmLock} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Số điện thoại khách *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Nhập 10 số (Vd: 0903 889 912)"
                    value={customerPhone}
                    onChange={(e) => handlePhoneInputChange(e.target.value)}
                    className="w-full text-xs font-mono font-bold border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Số lượng khách *
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={bookingTargetRoom.capacity_max * 2}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* KHUNG VÀNG BẮN THÔNG TIN VIP THEO SĐT THEO CHỈ THỊ CTO */}
              {detectedVipCustomer && (
                <div className="p-3 bg-[#FFF9F0] border-2 border-[#C58940] rounded-xl text-xs shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-[#8B1D24]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C58940]" />
                    <span>Khách Quen VIP: <span className="font-mono">{detectedVipCustomer.customer_code}</span> • {detectedVipCustomer.full_name} ({detectedVipCustomer.tags.join(', ')})</span>
                  </div>
                  <p className="text-[#554A41] mt-1 leading-relaxed font-medium italic">
                    💡 <strong>Gu ẩm thực & Lưu ý:</strong> &ldquo;{detectedVipCustomer.dietary_and_notes}&rdquo;
                  </p>
                  <div className="text-[11px] text-[#A09383] mt-1 pt-1 border-t border-[#C58940]/20">
                    Phòng quen: <strong>{detectedVipCustomer.preferred_branch_name}</strong> • Tổng tiệc: {detectedVipCustomer.total_bookings}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Họ tên khách hàng / Công ty *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Nguyễn Thanh Tùng"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                />
              </div>

              <div className="text-[11px] text-[#A09383] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8E2D9]">
                ℹ️ Thao tác này sẽ ghi nhận bản ghi vào bảng <code>booking_room_locks</code> và kích hoạt Trigger kiểm tra chéo tự động.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => {
                    setBookingTargetRoom(null);
                    setCollisionWarning('');
                    setCustomerName('');
                    setCustomerPhone('');
                    setDetectedVipCustomer(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={Boolean(collisionWarning)}
                  className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-colors ${
                    collisionWarning
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#8B1D24] hover:bg-[#72161C]'
                  }`}
                >
                  Xác Nhận Khóa Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM PHÒNG VIP / BÀN MỚI (TOÀN QUYỀN TỔNG QUẢN LÝ CHI NHÁNH & BGĐ) */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9] mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#8B1D24]" />
                <div>
                  <h3 className="font-bold text-base text-[#231F20]">
                    Thêm Phòng VIP / Bàn Tiệc Mới
                  </h3>
                  <p className="text-xs text-[#6B5E55]">
                    Quyền Tổng Quản Lý Chi Nhánh • Tự chủ 100% cơ cấu mặt bằng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="text-[#A09383] hover:text-[#231F20] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Mã phòng / bàn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Vd: PNT_VIP07"
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value)}
                    className="w-full text-xs font-mono font-bold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Loại không gian *
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as 'VIP' | 'HALL' | 'GARDEN')}
                    className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="VIP">Phòng VIP máy lạnh riêng</option>
                    <option value="HALL">Sảnh tiệc lớn trung tâm</option>
                    <option value="GARDEN">Khu sân vườn thoáng mát</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Tên phòng hiển thị *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Phòng VIP Mai Vàng (VIP 07)"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Khách tối thiểu
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newCapacityMin}
                    onChange={(e) => setNewCapacityMin(Number(e.target.value))}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Khách tối đa
                  </label>
                  <input
                    type="number"
                    min={newCapacityMin}
                    value={newCapacityMax}
                    onChange={(e) => setNewCapacityMax(Number(e.target.value))}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#231F20]">
                  <input
                    type="checkbox"
                    checked={newIsCombinable}
                    onChange={(e) => setNewIsCombinable(e.target.checked)}
                    className="rounded text-[#8B1D24] focus:ring-[#8B1D24] w-4 h-4"
                  />
                  <span>Cho phép thông vách / ghép với phòng khác khi tiệc đông</span>
                </label>

                {newIsCombinable && (
                  <input
                    type="text"
                    placeholder="Vd: Thông vách với VIP 08 (Sức chứa gộp 40 khách)"
                    value={newCombinedWith}
                    onChange={(e) => setNewCombinedWith(e.target.value)}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-1.5 bg-white mt-1"
                  />
                )}
              </div>

              <div className="text-[11px] text-[#A09383] italic">
                💡 Phòng mới tạo sẽ lập tức xuất hiện trên sơ đồ mặt bằng và có thể nhận đặt tiệc ngay.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg shadow-xs"
                >
                  Lưu & Đưa Vào Vận Hành
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
