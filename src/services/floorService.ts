/**
 * floorService.ts
 * Quản lý Sơ đồ Bàn / Phòng VIP theo Chi nhánh, Ngày & Ca tiệc
 * Tích hợp logic chốt chặn chống trùng phòng toàn diện (Collision Check)
 */

export interface RoomTableItem {
  id: number;
  branch_id: number;
  code: string;
  name: string;
  room_type: 'VIP' | 'HALL' | 'GARDEN';
  room_type_label: string;
  capacity_min: number;
  capacity_max: number;
  is_combinable: boolean;
  combined_with?: string;
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  shape: 'RECT' | 'CIRCLE';
  current_status: 'AVAILABLE' | 'HOLD' | 'CONFIRMED';
  booking_info?: {
    booking_id: number;
    customer_name: string;
    customer_phone: string;
    guest_count: number;
    time_slot: 'LUNCH' | 'DINNER' | 'FULL_DAY';
  };
}

export interface RoomLockRecord {
  id: number;
  table_room_id: number;
  booking_id: number;
  booking_date: string; // YYYY-MM-DD
  time_slot: 'LUNCH' | 'DINNER' | 'FULL_DAY';
  lock_status: 'HOLD' | 'CONFIRMED' | 'SEATED';
  customer_name: string;
  guest_count: number;
}

// DANH MỤC PHÒNG / BÀN MẪU TẠI CÁC CHI NHÁNH QUÊ NHÀ
export const INITIAL_ROOMS_TABLES: RoomTableItem[] = [
  // 1. Quê Nhà - Phạm Ngọc Thạch (Quận 3)
  {
    id: 1,
    branch_id: 1,
    code: 'PNT_VIP01',
    name: 'Phòng VIP Sen Trắng (VIP 01)',
    room_type: 'VIP',
    room_type_label: 'Phòng VIP máy lạnh riêng',
    capacity_min: 8,
    capacity_max: 16,
    is_combinable: true,
    combined_with: 'Phòng VIP 02',
    pos_x: 50,
    pos_y: 50,
    width: 140,
    height: 100,
    shape: 'RECT',
    current_status: 'AVAILABLE',
  },
  {
    id: 2,
    branch_id: 1,
    code: 'PNT_VIP02',
    name: 'Phòng VIP Sen Vàng (VIP 02)',
    room_type: 'VIP',
    room_type_label: 'Phòng VIP máy lạnh riêng',
    capacity_min: 10,
    capacity_max: 20,
    is_combinable: true,
    combined_with: 'Phòng VIP 01',
    pos_x: 220,
    pos_y: 50,
    width: 150,
    height: 100,
    shape: 'RECT',
    current_status: 'CONFIRMED',
    booking_info: {
      booking_id: 1,
      customer_name: 'Nguyễn Thanh Tùng (An Phong)',
      customer_phone: '0903 889 912',
      guest_count: 35,
      time_slot: 'DINNER',
    },
  },
  {
    id: 3,
    branch_id: 1,
    code: 'PNT_VIP03',
    name: 'Phòng VIP Hoa Cúc (VIP 03)',
    room_type: 'VIP',
    room_type_label: 'Phòng VIP tiếp khách cao cấp',
    capacity_min: 6,
    capacity_max: 12,
    is_combinable: false,
    pos_x: 400,
    pos_y: 50,
    width: 120,
    height: 100,
    shape: 'RECT',
    current_status: 'HOLD',
    booking_info: {
      booking_id: 5,
      customer_name: 'Võ Quốc Anh (Đang giữ phòng trưa)',
      customer_phone: '0912 345 678',
      guest_count: 10,
      time_slot: 'LUNCH',
    },
  },
  {
    id: 4,
    branch_id: 1,
    code: 'PNT_SANH01',
    name: 'Sảnh Trúc Sân Vườn - Bàn 01',
    room_type: 'GARDEN',
    room_type_label: 'Bàn sân vườn thoáng mát',
    capacity_min: 4,
    capacity_max: 8,
    is_combinable: false,
    pos_x: 100,
    pos_y: 200,
    width: 90,
    height: 90,
    shape: 'CIRCLE',
    current_status: 'AVAILABLE',
  },
  {
    id: 5,
    branch_id: 1,
    code: 'PNT_SANH02',
    name: 'Sảnh Trúc Sân Vườn - Bàn 02',
    room_type: 'GARDEN',
    room_type_label: 'Bàn sân vườn thoáng mát',
    capacity_min: 4,
    capacity_max: 8,
    is_combinable: false,
    pos_x: 230,
    pos_y: 200,
    width: 90,
    height: 90,
    shape: 'CIRCLE',
    current_status: 'AVAILABLE',
  },
  {
    id: 6,
    branch_id: 1,
    code: 'PNT_HOATIEP',
    name: 'Đại Sảnh Hoa Mai (Tiệc lớn)',
    room_type: 'HALL',
    room_type_label: 'Sảnh tiệc công ty 50 - 120 khách',
    capacity_min: 40,
    capacity_max: 120,
    is_combinable: false,
    pos_x: 360,
    pos_y: 190,
    width: 250,
    height: 140,
    shape: 'RECT',
    current_status: 'AVAILABLE',
  },

  // 2. Quê Nhà - Thành Thái (Quận 10)
  {
    id: 7,
    branch_id: 2,
    code: 'TT_VIP01',
    name: 'Phòng VIP Trúc Xanh 01',
    room_type: 'VIP',
    room_type_label: 'Phòng VIP sang trọng máy lạnh',
    capacity_min: 8,
    capacity_max: 16,
    is_combinable: true,
    pos_x: 60,
    pos_y: 60,
    width: 140,
    height: 100,
    shape: 'RECT',
    current_status: 'AVAILABLE',
  },
  {
    id: 8,
    branch_id: 2,
    code: 'TT_VIP02',
    name: 'Phòng VIP Mai Vàng 02',
    room_type: 'VIP',
    room_type_label: 'Phòng VIP tiệc gia đình & đối tác',
    capacity_min: 10,
    capacity_max: 20,
    is_combinable: true,
    pos_x: 230,
    pos_y: 60,
    width: 140,
    height: 100,
    shape: 'RECT',
    current_status: 'CONFIRMED',
    booking_info: {
      booking_id: 2,
      customer_name: 'Trần Thị Mai Lan',
      customer_phone: '0918 334 556',
      guest_count: 12,
      time_slot: 'LUNCH',
    },
  },
];

export const INITIAL_LOCKS: RoomLockRecord[] = [
  {
    id: 1,
    table_room_id: 2,
    booking_id: 1,
    booking_date: '2026-11-20',
    time_slot: 'DINNER',
    lock_status: 'CONFIRMED',
    customer_name: 'Nguyễn Thanh Tùng (An Phong)',
    guest_count: 35,
  },
  {
    id: 2,
    table_room_id: 3,
    booking_id: 5,
    booking_date: '2026-11-13',
    time_slot: 'LUNCH',
    lock_status: 'HOLD',
    customer_name: 'Võ Quốc Anh',
    guest_count: 10,
  },
  {
    id: 3,
    table_room_id: 8,
    booking_id: 2,
    booking_date: '2026-11-16',
    time_slot: 'LUNCH',
    lock_status: 'CONFIRMED',
    customer_name: 'Trần Thị Mai Lan',
    guest_count: 12,
  },
];

declare global {
  var quenha_locks: RoomLockRecord[] | undefined;
}

if (!globalThis.quenha_locks) {
  globalThis.quenha_locks = [...INITIAL_LOCKS];
}

export const floorService = {
  // Lấy danh sách phòng theo chi nhánh
  async getRoomsByBranch(branchId: number): Promise<RoomTableItem[]> {
    return INITIAL_ROOMS_TABLES.filter((r) => r.branch_id === branchId);
  },

  // Lấy toàn bộ danh sách locks hiện tại (từ memory/global)
  getLocks(): RoomLockRecord[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('quenha_room_locks');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {}
    }
    return globalThis.quenha_locks || INITIAL_LOCKS;
  },

  // Thêm một lock phòng mới
  addLock(lock: Omit<RoomLockRecord, 'id'>): RoomLockRecord {
    const newRecord: RoomLockRecord = {
      ...lock,
      id: Date.now(),
    };
    if (!globalThis.quenha_locks) {
      globalThis.quenha_locks = [...INITIAL_LOCKS];
    }
    globalThis.quenha_locks.push(newRecord);

    if (typeof window !== 'undefined') {
      try {
        const current = this.getLocks();
        const updated = [...current.filter(l => l.id !== newRecord.id), newRecord];
        localStorage.setItem('quenha_room_locks', JSON.stringify(updated));
      } catch {}
    }

    return newRecord;
  },

  // Giải phóng phòng ma khi tiệc bị HỦY (CRITICAL BUSINESS FLOW)
  releaseLocksByBookingId(bookingId: number): { releasedCount: number; releasedLocks: RoomLockRecord[] } {
    let currentLocks = this.getLocks();
    const toRelease = currentLocks.filter((l) => l.booking_id === bookingId);
    const remaining = currentLocks.filter((l) => l.booking_id !== bookingId);

    if (globalThis.quenha_locks) {
      globalThis.quenha_locks = globalThis.quenha_locks.filter((l) => l.booking_id !== bookingId);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('quenha_room_locks', JSON.stringify(remaining));
      } catch {}
    }

    return {
      releasedCount: toRelease.length,
      releasedLocks: toRelease,
    };
  },

  // Kiểm tra va chạm phòng theo ca (Mô phỏng Trigger check_room_lock_collision)
  checkCollision(
    roomId: number,
    date: string,
    slot: 'LUNCH' | 'DINNER' | 'FULL_DAY',
    existingLocks?: RoomLockRecord[]
  ): { isConflict: boolean; reason?: string } {
    const locksToCheck = existingLocks || this.getLocks();
    const activeLocks = locksToCheck.filter(
      (l) => l.table_room_id === roomId && l.booking_date === date && l.lock_status !== 'HOLD'
    );

    if (slot === 'FULL_DAY') {
      const anyConflict = activeLocks.find((l) => ['LUNCH', 'DINNER', 'FULL_DAY'].includes(l.time_slot));
      if (anyConflict) {
        return {
          isConflict: true,
          reason: `Phòng này đã có tiệc đặt trong ca ${anyConflict.time_slot} bởi ${anyConflict.customer_name}. Không thể bao trọn ngày (FULL_DAY)!`,
        };
      }
    } else {
      const fullDayConflict = activeLocks.find((l) => l.time_slot === 'FULL_DAY');
      if (fullDayConflict) {
        return {
          isConflict: true,
          reason: `Phòng này đã được bao trọn ngày (FULL_DAY) bởi ${fullDayConflict.customer_name}. Không thể nhận thêm ca ${slot}!`,
        };
      }

      const sameSlotConflict = activeLocks.find((l) => l.time_slot === slot);
      if (sameSlotConflict) {
        return {
          isConflict: true,
          reason: `Phòng này đã được chốt giữ chỗ trong ca ${slot} bởi ${sameSlotConflict.customer_name}!`,
        };
      }
    }

    return { isConflict: false };
  },

  // Thêm phòng VIP / Bàn mới cho chi nhánh
  async addNewRoom(roomData: Omit<RoomTableItem, 'id'>): Promise<RoomTableItem> {
    const newId = Date.now();
    const newRoom: RoomTableItem = {
      ...roomData,
      id: newId,
    };
    INITIAL_ROOMS_TABLES.push(newRoom);
    return newRoom;
  },

  // Chuyển trạng thái phòng (ví dụ bảo trì / tạm đóng)
  async toggleRoomStatus(roomId: number, status: 'AVAILABLE' | 'HOLD' | 'CONFIRMED'): Promise<boolean> {
    const target = INITIAL_ROOMS_TABLES.find((r) => r.id === roomId);
    if (target) {
      target.current_status = status;
      return true;
    }
    return false;
  },
};
