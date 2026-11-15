'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  Users,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Filter,
  CheckCircle2,
  Building2,
  Phone,
  FileText,
  CreditCard,
  Image as ImageIcon,
  GripVertical,
  Sparkles,
  XCircle,
  RotateCcw,
  ShieldAlert,
  Eye,
  Copy,
  Check,
  RefreshCw,
  Printer,
} from 'lucide-react';
import {
  BookingRecord,
  DepositRecord,
  CustomerRecord,
  INITIAL_BOOKINGS,
  INITIAL_DEPOSITS,
  INITIAL_CUSTOMERS,
  formatCustomerCode,
  generateBookingCode,
} from '@/services/crmService';
import {
  floorService,
  INITIAL_ROOMS_TABLES,
} from '@/services/floorService';

const STAGES = [
  { id: 'NEW', label: '1. Mới Nhận', color: 'border-blue-500', bgHeader: 'bg-blue-50 text-blue-700' },
  { id: 'QUOTED', label: '2. Đã Báo Giá', color: 'border-amber-500', bgHeader: 'bg-amber-50 text-amber-700' },
  { id: 'DEPOSITED', label: '3. Đã Cọc Tiệc', color: 'border-emerald-600', bgHeader: 'bg-emerald-50 text-emerald-800' },
  { id: 'COMPLETED', label: '4. Hoàn Tất', color: 'border-purple-500', bgHeader: 'bg-purple-50 text-purple-700' },
] as const;

// Component Droppable Column
function KanbanColumn({
  stage,
  bookings,
  onOpenDepositModal,
  onOpenCancelModal,
  onViewDetails,
}: {
  stage: (typeof STAGES)[number];
  bookings: BookingRecord[];
  onOpenDepositModal: (booking: BookingRecord) => void;
  onOpenCancelModal: (booking: BookingRecord) => void;
  onViewDetails: (booking: BookingRecord) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  const totalBudget = bookings.reduce((sum, b) => sum + b.estimated_budget, 0);
  const totalDeposit = bookings.reduce((sum, b) => sum + b.total_deposited, 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-[#F9F6F0] rounded-2xl border-2 transition-colors duration-200 min-h-[580px] ${
        isOver ? 'border-[#8B1D24] bg-[#F5EFE6]' : 'border-[#E8E2D9]'
      }`}
    >
      {/* Header cột */}
      <div className={`p-4 rounded-t-2xl border-b border-[#E8E2D9] ${stage.bgHeader}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm tracking-wide">{stage.label}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/80 shadow-xs">
            {bookings.length}
          </span>
        </div>
        <div className="mt-2 text-[11px] space-y-0.5 font-medium opacity-90">
          <div className="flex justify-between">
            <span>Dự toán:</span>
            <strong className="font-mono">{totalBudget.toLocaleString('vi-VN')} đ</strong>
          </div>
          {stage.id === 'DEPOSITED' && (
            <div className="flex justify-between text-[#2A7238] font-bold">
              <span>Đã cọc:</span>
              <strong className="font-mono">{totalDeposit.toLocaleString('vi-VN')} đ</strong>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách thẻ đặt tiệc */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        {bookings.length === 0 ? (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-[#D5C9BC] rounded-xl text-xs text-[#A09383]">
            Kéo thả tiệc vào đây
          </div>
        ) : (
          bookings.map((booking) => (
            <KanbanCard
              key={booking.id}
              booking={booking}
              onOpenDepositModal={onOpenDepositModal}
              onOpenCancelModal={onOpenCancelModal}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Component Draggable Card
function KanbanCard({
  booking,
  onOpenDepositModal,
  onOpenCancelModal,
  onViewDetails,
}: {
  booking: BookingRecord;
  onOpenDepositModal: (booking: BookingRecord) => void;
  onOpenCancelModal: (booking: BookingRecord) => void;
  onViewDetails: (booking: BookingRecord) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(booking.id),
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl p-3.5 border border-[#E8E2D9] shadow-xs hover:shadow-md transition-shadow relative group ${
        isDragging ? 'opacity-40 shadow-xl border-[#8B1D24]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="cursor-pointer" onClick={() => onViewDetails(booking)}>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[11px] font-mono font-bold text-[#8B1D24] bg-[#F7EAEB] px-2 py-0.5 rounded border border-[#8B1D24]/20 hover:bg-[#8B1D24] hover:text-white transition-colors"
              title="Click xem chi tiết tiệc"
            >
              {booking.booking_code}
            </span>
            <span
              className="text-[10px] font-mono font-bold text-[#6B5E55] bg-[#F0EAE1] px-1.5 py-0.5 rounded"
              title="Mã Khách Hàng (Định danh theo SĐT)"
            >
              {booking.customer_code || `KH-${booking.customer_phone.replace(/\D/g, '')}`}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#231F20] mt-1 leading-snug hover:text-[#8B1D24] transition-colors">
            {booking.customer_name}
          </h4>
          {booking.company_name && (
            <p className="text-[11px] text-[#6B5E55] font-medium flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#A09383]" />
              <span className="truncate">{booking.company_name}</span>
            </p>
          )}
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-[#A09383] hover:text-[#231F20]"
          title="Kéo thả chuyển trạng thái"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div
        className="space-y-1.5 text-xs text-[#554A41] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8E2D9]/70 mb-2.5 cursor-pointer hover:border-[#8B1D24]/40 transition-colors"
        onClick={() => onViewDetails(booking)}
      >
        <div className="flex items-center justify-between font-semibold">
          <span className="text-[#8B1D24]">{booking.room_name}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-white border border-[#D5C9BC] font-bold">
            {booking.guest_count} khách
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#6B5E55]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#A09383]" />
            {booking.booking_date}
          </span>
          <span className="font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px]">
            {booking.time_slot === 'LUNCH' ? 'Ca Trưa' : booking.time_slot === 'DINNER' ? 'Ca Tối' : 'Cả Ngày'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[#F0EAE1] text-xs">
        <div>
          <div className="text-[10px] text-[#A09383]">Dự toán:</div>
          <div className="font-mono font-bold text-[#231F20]">
            {booking.estimated_budget.toLocaleString('vi-VN')} đ
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Nút Xem Chi Tiết Tiệc Nhanh */}
          <button
            onClick={() => onViewDetails(booking)}
            className="p-1 rounded text-[#6B5E55] hover:text-[#8B1D24] hover:bg-[#FAF7F2] transition-colors"
            title="Xem chi tiết tiệc & thực đơn"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {booking.stage === 'DEPOSITED' ? (
            <div className="text-right">
              <div className="text-[10px] text-[#2A7238] font-bold">Đã cọc:</div>
              <div className="font-mono font-bold text-[#2A7238]">
                {booking.total_deposited.toLocaleString('vi-VN')} đ
              </div>
            </div>
          ) : (
            <button
              onClick={() => onOpenDepositModal(booking)}
              className="text-[11px] font-bold text-[#8B1D24] hover:text-[#72161C] underline flex items-center gap-1"
            >
              <CreditCard className="w-3 h-3" />
              <span>Ghi cọc</span>
            </button>
          )}

          {/* Nút Hủy tiệc / Giải phóng phòng ma (Chỉ thị CTO) */}
          <button
            onClick={() => onOpenCancelModal(booking)}
            className="text-[11px] font-bold text-[#991B1B] hover:bg-[#FEE2E2] px-1.5 py-1 rounded transition-colors"
            title="Hủy tiệc & Nhả phòng"
          >
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPipelinePage() {
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [deposits, setDeposits] = useState<DepositRecord[]>(INITIAL_DEPOSITS);
  const [activeDragBooking, setActiveDragBooking] = useState<BookingRecord | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal Chi Tiết Tiệc 360°
  const [selectedDetailBooking, setSelectedDetailBooking] = useState<BookingRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Bộ lọc
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchPhone, setSearchPhone] = useState('');
  const [filterView, setFilterView] = useState<'ACTIVE' | 'CANCELLED'>('ACTIVE');

  // Chốt chặn 1: Bảng tính tiền cọc minh bạch 3 dòng tài chính
  const [depositTargetBooking, setDepositTargetBooking] = useState<BookingRecord | null>(null);
  const [updatedBudget, setUpdatedBudget] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(5000000);
  const [depositStage, setDepositStage] = useState<DepositRecord['deposit_stage']>('COC_1_GIU_CHO');
  const [paymentMethod, setPaymentMethod] = useState<DepositRecord['payment_method']>('CHUYEN_KHOAN');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [depositNote, setDepositNote] = useState('');
  const [depositError, setDepositError] = useState('');

  // Chốt chặn 2: Modal Hủy tiệc giải phóng phòng ma
  const [cancelTargetBooking, setCancelTargetBooking] = useState<BookingRecord | null>(null);
  const [cancelReason, setCancelReason] = useState('Khách đổi kế hoạch đột xuất');
  const [refundOption, setRefundOption] = useState<'BAO_LUU' | 'HOAN_COC' | 'MAT_COC'>('BAO_LUU');

  // Chốt chặn 3: Modal tạo tiệc mới + Tự động bắn thông tin VIP theo SĐT
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newBranch, setNewBranch] = useState('Quê Nhà - Phạm Ngọc Thạch');
  const [newEventDate, setNewEventDate] = useState('2026-11-25');
  const [newTimeSlot, setNewTimeSlot] = useState<'LUNCH' | 'DINNER' | 'FULL_DAY'>('DINNER');
  const [newGuestCount, setNewGuestCount] = useState(25);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(1);
  const [newRoomName, setNewRoomName] = useState('Phòng VIP Sen Trắng (VIP 01)');
  const [newEstimatedBudget, setNewEstimatedBudget] = useState(20000000);
  const [createBookingError, setCreateBookingError] = useState<string>('');
  const [detectedVipCustomer, setDetectedVipCustomer] = useState<CustomerRecord | null>(null);

  // Tải và đồng bộ hóa danh sách tiệc từ API & localStorage
  const fetchBookings = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/bookings');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        let localBookings: BookingRecord[] = [];
        try {
          const stored = localStorage.getItem('quenha_crm_bookings');
          if (stored) localBookings = JSON.parse(stored);
        } catch (e) {}

        const map = new Map<string, BookingRecord>();
        json.data.forEach((b: BookingRecord) => map.set(b.booking_code, b));
        localBookings.forEach((b: BookingRecord) => {
          if (!map.has(b.booking_code)) map.set(b.booking_code, b);
        });
        setBookings(Array.from(map.values()));
      }
    } catch (err) {
      console.warn('Lỗi đồng bộ danh sách tiệc:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Xử lý tự động nhận diện VIP khi gõ SĐT
  const handlePhoneInputChange = (phoneInput: string) => {
    setNewCustomerPhone(phoneInput);
    const cleaned = phoneInput.replace(/\s+/g, '');

    if (cleaned.length >= 10) {
      const found = INITIAL_CUSTOMERS.find((c) => c.phone.replace(/\s+/g, '') === cleaned);
      if (found) {
        setNewCustomerName(found.full_name);
        setNewCompanyName(found.company_name || '');
        setDetectedVipCustomer(found);
        return;
      }
    }
    setDetectedVipCustomer(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const booking = bookings.find((b) => String(b.id) === event.active.id);
    if (booking) setActiveDragBooking(booking);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragBooking(null);
    if (!over) return;

    const bookingId = Number(active.id);
    const targetStage = over.id as BookingRecord['stage'];
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || booking.stage === targetStage) return;

    // Chốt chặn tiền cọc bắt buộc: Khi chuyển sang DEPOSITED, bắt buộc mở Modal nộp cọc
    if (targetStage === 'DEPOSITED' && booking.total_deposited === 0) {
      setDepositTargetBooking(booking);
      setUpdatedBudget(booking.estimated_budget);
      setDepositAmount(Math.round(booking.estimated_budget * 0.3)); // Gợi ý 30% dự toán
      setReceiptUrl('');
      setDepositError('');
      return;
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, stage: targetStage } : b))
    );
  };

  // Mở modal cọc có bảng tính minh bạch
  const handleOpenDepositModal = (booking: BookingRecord) => {
    setDepositTargetBooking(booking);
    setUpdatedBudget(booking.estimated_budget);
    setDepositAmount(Math.round(booking.estimated_budget * 0.3));
    setReceiptUrl('');
    setDepositError('');
  };

  // Xác nhận ghi cọc minh bạch
  const handleConfirmDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptUrl.trim()) {
      setDepositError('⚠️ Chốt chặn tài chính: Bắt buộc đính kèm link ảnh biên nhận / UNC chuyển khoản!');
      return;
    }

    if (depositTargetBooking) {
      const newDeposit: DepositRecord = {
        id: Date.now(),
        booking_id: depositTargetBooking.id,
        amount: Number(depositAmount),
        deposit_stage: depositStage,
        payment_method: paymentMethod,
        receipt_image_url: receiptUrl.trim(),
        note: depositNote.trim(),
        created_by: 'Nhân viên Sales Tiệc',
        created_at: new Date().toLocaleString('vi-VN'),
      };

      setDeposits([...deposits, newDeposit]);

      // Tự động cộng dồn total_deposited, cập nhật estimated_budget mới và chuyển sang DEPOSITED
      setBookings((prev) =>
        prev.map((b) =>
          b.id === depositTargetBooking.id
            ? {
                ...b,
                stage: 'DEPOSITED',
                estimated_budget: Number(updatedBudget),
                total_deposited: b.total_deposited + Number(depositAmount),
              }
            : b
        )
      );

      // Cập nhật selectedDetailBooking nếu đang xem chi tiết tiệc này
      if (selectedDetailBooking && selectedDetailBooking.id === depositTargetBooking.id) {
        setSelectedDetailBooking({
          ...selectedDetailBooking,
          stage: 'DEPOSITED',
          estimated_budget: Number(updatedBudget),
          total_deposited: selectedDetailBooking.total_deposited + Number(depositAmount),
        });
      }

      setDepositTargetBooking(null);
    }
  };

  // Xác nhận HỦY TIỆC & GIẢI PHÓNG PHÒNG MA
  const handleConfirmCancelBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (cancelTargetBooking) {
      // 1. GIẢI PHÓNG PHÒNG MA TRÊN SƠ ĐỒ MẶT BẰNG NGAY LẬP TỨC
      floorService.releaseLocksByBookingId(cancelTargetBooking.id);

      const updated = bookings.map((b) =>
        b.id === cancelTargetBooking.id
          ? {
              ...b,
              stage: 'CANCELLED' as const,
              cancel_reason: `${cancelReason} (${refundOption === 'BAO_LUU' ? 'Bảo lưu cọc dời ngày' : refundOption === 'HOAN_COC' ? 'Hoàn cọc' : 'Mất cọc theo quy định'})`,
            }
          : b
      );

      setBookings(updated);
      try {
        localStorage.setItem('quenha_crm_bookings', JSON.stringify(updated));
      } catch (e) {}

      if (selectedDetailBooking && selectedDetailBooking.id === cancelTargetBooking.id) {
        setSelectedDetailBooking({
          ...selectedDetailBooking,
          stage: 'CANCELLED',
          cancel_reason: `${cancelReason} (${refundOption === 'BAO_LUU' ? 'Bảo lưu cọc dời ngày' : refundOption === 'HOAN_COC' ? 'Hoàn cọc' : 'Mất cọc theo quy định'})`,
        });
      }

      setCancelTargetBooking(null);
    }
  };

  // Tạo đặt tiệc mới với Mã Tiệc chuẩn: [Mã chi nhánh]-[ddmmyyyy]-[001]
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) return;

    // 1. Kiểm tra va chạm phòng theo ca (Collision Check chống trùng phòng)
    const collision = floorService.checkCollision(selectedRoomId, newEventDate, newTimeSlot);
    if (collision.isConflict) {
      setCreateBookingError(collision.reason || 'Phòng đã có tiệc trong ca này!');
      return;
    }
    setCreateBookingError('');

    const branchId = newBranch.includes('Thành Thái') ? 2 : newBranch.includes('Nguyễn Thái Bình') ? 3 : 1;
    const generatedCode = generateBookingCode(newBranch, newEventDate, bookings);

    const newBooking: BookingRecord = {
      id: Date.now(),
      booking_code: generatedCode,
      customer_id: Date.now(),
      customer_code: formatCustomerCode(newCustomerPhone.trim()),
      customer_name: newCustomerName.trim(),
      customer_phone: newCustomerPhone.trim(),
      company_name: newCompanyName.trim() || undefined,
      branch_id: branchId,
      branch_name: newBranch,
      event_type: 'TIEC_CONG_TY',
      event_type_label: 'Tiệc Đặt Mới',
      booking_date: newEventDate,
      time_slot: newTimeSlot,
      guest_count: Number(newGuestCount),
      room_name: newRoomName,
      table_room_id: selectedRoomId,
      estimated_budget: Number(newEstimatedBudget),
      total_deposited: 0,
      stage: 'NEW',
      sales_rep_name: 'Lễ Tân / Sales Tiếp Nhận',
      created_at: new Date().toISOString().split('T')[0],
    };

    // 2. Tự động giữ phòng trên sơ đồ mặt bằng
    floorService.addLock({
      table_room_id: selectedRoomId,
      booking_id: newBooking.id,
      booking_date: newEventDate,
      time_slot: newTimeSlot,
      lock_status: 'HOLD',
      customer_name: newCustomerName.trim(),
      guest_count: Number(newGuestCount),
    });

    const updatedList = [newBooking, ...bookings];
    setBookings(updatedList);
    try {
      localStorage.setItem('quenha_crm_bookings', JSON.stringify(updatedList));
    } catch (e) {}

    setShowCreateModal(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setDetectedVipCustomer(null);
  };

  // Sao chép mã tiệc nhanh vào clipboard
  const handleCopyBookingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Lọc tiệc theo bộ lọc và chế độ Active/Cancelled
  const filteredBookings = bookings.filter((b) => {
    if (filterView === 'ACTIVE' && b.stage === 'CANCELLED') return false;
    if (filterView === 'CANCELLED' && b.stage !== 'CANCELLED') return false;
    if (selectedBranch !== 'all' && b.branch_name !== selectedBranch) return false;
    if (searchPhone) {
      const q = searchPhone.trim().toLowerCase();
      const qCleaned = q.replace(/\s+/g, '');
      const matchPhone = b.customer_phone.replace(/\s+/g, '').includes(qCleaned);
      const matchName = b.customer_name.toLowerCase().includes(q);
      const matchCode = b.customer_code?.toLowerCase().includes(q);
      const matchBookingCode = b.booking_code.toLowerCase().includes(q);
      if (!matchPhone && !matchName && !matchCode && !matchBookingCode) {
        return false;
      }
    }
    return true;
  });

  const cancelledCount = bookings.filter((b) => b.stage === 'CANCELLED').length;

  return (
    <div className="space-y-6">
      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#231F20] tracking-tight">
              Phễu Quản Lý Đặt Tiệc (Kanban Pipeline)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1D24] text-white">
              Module 5
            </span>
          </div>
          <p className="text-sm text-[#6B5E55] mt-1">
            Quy chuẩn mã tiệc: <code className="bg-[#FAF7F2] text-[#8B1D24] font-bold px-1.5 py-0.5 rounded border border-[#E8E2D9]">[MãCN]-[ddmmyyyy]-[001]</code> (PNT: Q.3, TT: Q.10, NTB: Tân Bình).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBookings}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#D5C9BC] bg-white text-[#6B5E55] hover:text-[#8B1D24] hover:bg-[#FAF7F2] text-xs font-bold transition-all shadow-xs"
            title="Đồng bộ danh sách tiệc từ hệ thống"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#8B1D24]' : ''}`} />
            <span>Làm Mới</span>
          </button>

          <button
            onClick={() => {
              setShowCreateModal(true);
              setDetectedVipCustomer(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B1D24] text-white font-bold text-sm shadow-xs hover:bg-[#72161C] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tiếp Nhận Đặt Tiệc Mới</span>
          </button>
        </div>
      </div>

      {/* Thanh bộ lọc & Thống kê nhanh */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab chuyển đổi Đang xử lý vs Đã hủy */}
          <div className="flex items-center bg-[#F5EFE6] p-1 rounded-lg border border-[#D5C9BC]">
            <button
              onClick={() => setFilterView('ACTIVE')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                filterView === 'ACTIVE'
                  ? 'bg-white text-[#8B1D24] shadow-xs'
                  : 'text-[#6B5E55] hover:text-[#231F20]'
              }`}
            >
              Phễu Tiệc Hoạt Động
            </button>
            <button
              onClick={() => setFilterView('CANCELLED')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                filterView === 'CANCELLED'
                  ? 'bg-[#991B1B] text-white shadow-xs'
                  : 'text-[#991B1B] hover:text-[#7f1d1d]'
              }`}
            >
              <span>Đã Hủy / Nhả Phòng</span>
              {cancelledCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                  {cancelledCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#A09383]" />
            <span className="text-xs font-bold text-[#6B5E55] uppercase">Chi nhánh:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs font-semibold border border-[#D5C9BC] rounded-lg px-2.5 py-1.5 bg-white"
            >
              <option value="all">Toàn bộ 3 chi nhánh</option>
              <option value="Quê Nhà - Phạm Ngọc Thạch">Phạm Ngọc Thạch (Q3)</option>
              <option value="Quê Nhà - Thành Thái">Thành Thái (Q10)</option>
              <option value="Quê Nhà - Nguyễn Thái Bình">Nguyễn Thái Bình (Tân Bình)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm theo Mã tiệc (PNT-..., TT-...), Tên, SĐT..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="text-xs border border-[#D5C9BC] rounded-lg px-3 py-1.5 w-72 focus:outline-none focus:border-[#8B1D24]"
            />
            {searchPhone && (
              <button
                onClick={() => setSearchPhone('')}
                className="text-xs text-[#A09383] hover:text-[#231F20]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-[#6B5E55]">
          <div>
            Số tiệc: <strong className="text-[#231F20] font-bold">{filteredBookings.length}</strong>
          </div>
          <div>
            Tổng dự toán:{' '}
            <strong className="text-[#8B1D24] font-bold font-mono">
              {filteredBookings
                .reduce((sum, b) => sum + b.estimated_budget, 0)
                .toLocaleString('vi-VN')}{' '}
              đ
            </strong>
          </div>
        </div>
      </div>

      {/* HIỂN THỊ CHẾ ĐỘ PHỄU TIỆC HOẶC DANH SÁCH TIỆC ĐÃ HỦY */}
      {filterView === 'ACTIVE' ? (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                bookings={filteredBookings.filter((b) => b.stage === stage.id)}
                onOpenDepositModal={handleOpenDepositModal}
                onOpenCancelModal={(b) => setCancelTargetBooking(b)}
                onViewDetails={(b) => setSelectedDetailBooking(b)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeDragBooking ? (
              <KanbanCard
                booking={activeDragBooking}
                onOpenDepositModal={() => {}}
                onOpenCancelModal={() => {}}
                onViewDetails={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        /* DANH SÁCH TIỆC ĐÃ HỦY (GIẢI PHÓNG PHÒNG MA) */
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#991B1B]">
            <ShieldAlert className="w-4 h-4" />
            <span>Danh Sách Tiệc Đã Hủy / Giải Phóng Khóa Phòng</span>
          </div>
          <p className="text-xs text-[#6B5E55]">
            Toàn bộ các tiệc dưới đây đã tự động nhả phòng trên Sơ đồ Bàn / Phòng (Floor Map) để chi nhánh đón khách khác.
          </p>

          <div className="divide-y divide-[#E8E2D9]/70">
            {filteredBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#A09383]">Chưa có tiệc nào bị hủy</div>
            ) : (
              filteredBookings.map((b) => (
                <div key={b.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#8B1D24]">{b.booking_code}</span>
                      <strong className="text-[#231F20] text-sm">{b.customer_name}</strong>
                      <span className="text-[#6B5E55]">({b.customer_phone})</span>
                    </div>
                    <div className="text-[11px] text-[#A09383] mt-1">
                      Phòng: <strong>{b.room_name}</strong> • Ngày: <strong>{b.booking_date} (Ca {b.time_slot})</strong> • Dự toán: {b.estimated_budget.toLocaleString('vi-VN')} đ
                    </div>
                    {b.cancel_reason && (
                      <p className="text-[11px] text-[#991B1B] font-medium mt-1">
                        ⚠️ Lý do hủy: {b.cancel_reason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#EAF5EC] text-[#2A7238] font-bold text-[11px] border border-[#2A7238]/30">
                      ✓ Đã nhả phòng
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: BẢNG TÍNH TIỀN CỌC MINH BẠCH (3 DÒNG TÀI CHÍNH THEO CHỈ THỊ CTO) */}
      {depositTargetBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center gap-2 text-[#2A7238] font-bold text-base mb-1">
              <CreditCard className="w-5 h-5" />
              <span>Bảng Tính Tiền Cọc Minh Bạch (Quyết Định E1)</span>
            </div>
            <p className="text-xs text-[#6B5E55] mb-4">
              Tiệc: <strong className="text-[#231F20]">{depositTargetBooking.customer_name}</strong> — {depositTargetBooking.room_name} ({depositTargetBooking.booking_date})
            </p>

            <form onSubmit={handleConfirmDeposit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* KHỐI 3 DÒNG TÀI CHÍNH MINH BẠCH THEO CHỈ THỊ CTO */}
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#D5C9BC] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B5E55] font-semibold">1. Tổng dự toán tiệc mới:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step={500000}
                      value={updatedBudget}
                      onChange={(e) => setUpdatedBudget(Number(e.target.value))}
                      className="w-36 text-right font-mono font-bold text-sm border border-[#D5C9BC] rounded px-2.5 py-1 bg-white focus:outline-none focus:border-[#8B1D24]"
                    />
                    <span className="font-bold text-[#231F20]">đ</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#6B5E55]">
                  <span>2. Đã cọc tích lũy các đợt trước:</span>
                  <span className="font-mono font-bold text-[#2A7238]">
                    {depositTargetBooking.total_deposited.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#8B1D24] font-semibold">
                  <span>3. Số tiền cọc đợt này:</span>
                  <span className="font-mono font-bold">
                    + {Number(depositAmount).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="pt-2.5 border-t border-[#E8E2D9] flex items-center justify-between">
                  <span className="font-bold text-[#231F20]">👉 Còn lại thu tại quầy khi tàn tiệc:</span>
                  <span className="font-mono font-bold text-[#C05621] text-base">
                    {Math.max(0, updatedBudget - depositTargetBooking.total_deposited - Number(depositAmount)).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Số tiền cọc đợt này (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100000}
                    step={100000}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold border border-[#D5C9BC] rounded-lg px-3 py-2 text-[#2A7238]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Đợt cọc
                  </label>
                  <select
                    value={depositStage}
                    onChange={(e) => setDepositStage(e.target.value as DepositRecord['deposit_stage'])}
                    className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="COC_1_GIU_CHO">Cọc Đợt 1 (Giữ chỗ/Phòng)</option>
                    <option value="COC_2_THUC_DON">Cọc Đợt 2 (Chốt thực đơn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Hình thức thanh toán
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as DepositRecord['payment_method'])}
                  className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                >
                  <option value="CHUYEN_KHOAN">Chuyển khoản Ngân hàng (VCB / BIDV)</option>
                  <option value="TIEN_MAT">Tiền mặt tại quầy thu ngân</option>
                  <option value="QUET_THE_POS">Quẹt thẻ máy POS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8B1D24] uppercase mb-1">
                  Link ảnh biên nhận / UNC chuyển khoản (Bắt buộc) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/... hoặc https://i.imgur.com/..."
                  value={receiptUrl}
                  onChange={(e) => {
                    setReceiptUrl(e.target.value);
                    setDepositError('');
                  }}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
                {depositError && (
                  <p className="text-[11px] text-[#9B1C1C] font-bold mt-1">{depositError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Ghi chú kế toán
                </label>
                <input
                  type="text"
                  placeholder="Vd: VCB mã giao dịch 9942, khách chuyển lúc 10h..."
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setDepositTargetBooking(null)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2A7238] hover:bg-[#235d2e] rounded-lg shadow-xs"
                >
                  Xác Nhận Cọc & Khóa Chỗ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: HỦY TIỆC & GIẢI PHÓNG PHÒNG MA THEO CHỈ THỊ CTO */}
      {cancelTargetBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center gap-2 text-[#991B1B] font-bold text-base mb-1">
              <XCircle className="w-5 h-5 text-[#DC2626]" />
              <span>Hủy Tiệc & Giải Phóng Phòng Khóa</span>
            </div>
            <p className="text-xs text-[#6B5E55] mb-4">
              Tiệc: <strong className="text-[#231F20]">{cancelTargetBooking.customer_name}</strong> — {cancelTargetBooking.room_name}
            </p>

            <form onSubmit={handleConfirmCancelBooking} className="space-y-4">
              <div className="p-3 bg-[#FEF2F2] border border-[#EF4444]/30 rounded-xl text-xs text-[#991B1B]">
                ⚡ <strong>Cơ chế tự động:</strong> Khi bấm xác nhận hủy, hệ thống sẽ tự động giải phóng phòng trong bảng <code>booking_room_locks</code> về <strong>AVAILABLE</strong> để sảnh đón đoàn khách khác ngay lập tức.
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Lý do hủy tiệc *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Khách đổi kế hoạch đột xuất">Khách đổi kế hoạch đột xuất</option>
                  <option value="Công ty hoãn họp / dời lịch tiệc">Công ty hoãn họp / dời lịch tiệc</option>
                  <option value="Không thỏa thuận được thực đơn">Không thỏa thuận được thực đơn</option>
                  <option value="Khách chuyển sang địa điểm khác">Khách chuyển sang địa điểm khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Phương án xử lý tiền cọc ({cancelTargetBooking.total_deposited.toLocaleString('vi-VN')} đ)
                </label>
                <select
                  value={refundOption}
                  onChange={(e) => setRefundOption(e.target.value as 'BAO_LUU' | 'HOAN_COC' | 'MAT_COC')}
                  className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                >
                  <option value="BAO_LUU">Bảo lưu tiền cọc cho lần sau (Dời lịch)</option>
                  <option value="HOAN_COC">Hoàn cọc (Trường hợp khách báo sớm theo quy định)</option>
                  <option value="MAT_COC">Không hoàn cọc (Hủy cận ngày tiệc)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setCancelTargetBooking(null)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#991B1B] hover:bg-[#7f1d1d] rounded-lg shadow-xs"
                >
                  Xác Nhận Hủy & Nhả Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TIẾP NHẬN ĐẶT TIỆC MỚI + BẮN THÔNG TIN VIP THEO SĐT */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#8B1D24]">Tiếp Nhận Đặt Tiệc Mới</h3>
                <p className="text-xs text-[#6B5E55]">Ghi nhận thông tin khách hàng và tự động nhận diện VIP</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#A09383] hover:text-[#231F20] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Số điện thoại khách *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Nhập 10 số (Vd: 0903 889 912)"
                    value={newCustomerPhone}
                    onChange={(e) => handlePhoneInputChange(e.target.value)}
                    className="w-full text-xs font-mono font-bold border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Họ tên khách hàng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Vd: Nguyễn Thanh Tùng"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* KHUNG VÀNG BẮN THÔNG TIN VIP THEO SĐT THEO CHỈ THỊ CTO */}
              {detectedVipCustomer && (
                <div className="p-3.5 bg-[#FFF9F0] border-2 border-[#C58940] rounded-xl text-xs shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-[#8B1D24]">
                    <Sparkles className="w-4 h-4 text-[#C58940]" />
                    <span>Phát Hiện Khách Quen VIP: <span className="font-mono">{detectedVipCustomer.customer_code}</span> • {detectedVipCustomer.full_name} ({detectedVipCustomer.tags.join(', ')})</span>
                  </div>
                  <p className="text-[#554A41] mt-1.5 leading-relaxed font-medium italic">
                    💡 <strong>Gu ẩm thực & Lưu ý VIP:</strong> &ldquo;{detectedVipCustomer.dietary_and_notes}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-[#6B5E55] mt-2 pt-2 border-t border-[#C58940]/20">
                    <span>Chi nhánh quen: <strong>{detectedVipCustomer.preferred_branch_name}</strong></span>
                    <span>Đã đặt: <strong>{detectedVipCustomer.total_bookings} tiệc</strong></span>
                    <span>Tổng chi: <strong className="font-mono text-[#2A7238]">{detectedVipCustomer.total_spent.toLocaleString('vi-VN')} đ</strong></span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Tên công ty (nếu là tiệc doanh nghiệp)
                </label>
                <input
                  type="text"
                  placeholder="Vd: Tập đoàn Xây dựng An Phong..."
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                />
              </div>

              {createBookingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <span>{createBookingError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Chi nhánh nhận tiệc
                  </label>
                  <select
                    value={newBranch}
                    onChange={(e) => {
                      const branch = e.target.value;
                      setNewBranch(branch);
                      const bId = branch.includes('Thành Thái') ? 2 : branch.includes('Nguyễn Thái Bình') ? 3 : 1;
                      const branchRooms = INITIAL_ROOMS_TABLES.filter((r) => r.branch_id === bId);
                      if (branchRooms.length > 0) {
                        setSelectedRoomId(branchRooms[0].id);
                        setNewRoomName(branchRooms[0].name);
                      }
                      setCreateBookingError('');
                    }}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Quê Nhà - Phạm Ngọc Thạch">Phạm Ngọc Thạch (Q3)</option>
                    <option value="Quê Nhà - Thành Thái">Thành Thái (Q10)</option>
                    <option value="Quê Nhà - Nguyễn Thái Bình">Nguyễn Thái Bình (Tân Bình)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Ca tiệc
                  </label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => {
                      setNewTimeSlot(e.target.value as 'LUNCH' | 'DINNER' | 'FULL_DAY');
                      setCreateBookingError('');
                    }}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="LUNCH">Ca Trưa (10:30 - 14:00)</option>
                    <option value="DINNER">Ca Tối (17:00 - 22:00)</option>
                    <option value="FULL_DAY">Bao Cả Ngày (FULL_DAY)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Ngày tổ chức *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => {
                      setNewEventDate(e.target.value);
                      setCreateBookingError('');
                    }}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Số lượng khách
                  </label>
                  <input
                    type="number"
                    min={2}
                    value={newGuestCount}
                    onChange={(e) => setNewGuestCount(Number(e.target.value))}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Dự toán (VNĐ)
                  </label>
                  <input
                    type="number"
                    step={1000000}
                    value={newEstimatedBudget}
                    onChange={(e) => setNewEstimatedBudget(Number(e.target.value))}
                    className="w-full text-xs font-mono border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Chọn Phòng VIP / Bàn / Sảnh Tổ Chức *
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => {
                    const rId = Number(e.target.value);
                    setSelectedRoomId(rId);
                    const r = INITIAL_ROOMS_TABLES.find((room) => room.id === rId);
                    if (r) setNewRoomName(r.name);
                    setCreateBookingError('');
                  }}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                >
                  {INITIAL_ROOMS_TABLES.filter((r) => {
                    const bId = newBranch.includes('Thành Thái') ? 2 : newBranch.includes('Nguyễn Thái Bình') ? 3 : 1;
                    return r.branch_id === bId;
                  }).map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.room_type_label} - Sức chứa: {room.capacity_min}-{room.capacity_max} khách)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg shadow-xs"
                >
                  Lưu & Đưa Vào Phễu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CHI TIẾT TIỆC KHÁCH HÀNG 360° (THEO CHỈ ĐẠO CỦA ANH LỢI: NHÌN MÃ SEARCH RA VÀ XEM CHI TIẾT) */}
      {selectedDetailBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in max-h-[92vh] flex flex-col">
            {/* Header Modal Chi Tiết */}
            <div className="flex items-start justify-between border-b border-[#E8E2D9] pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-base font-black text-[#8B1D24] bg-[#F7EAEB] px-3 py-1 rounded-lg border border-[#8B1D24]/30 flex items-center gap-2">
                    <span>{selectedDetailBooking.booking_code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyBookingCode(selectedDetailBooking.booking_code)}
                      className="p-1 hover:bg-[#8B1D24]/10 rounded transition-colors text-xs text-[#8B1D24]"
                      title="Sao chép mã tiệc"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </span>

                  <span className="text-xs font-mono font-bold text-[#6B5E55] bg-[#F0EAE1] px-2 py-1 rounded">
                    {selectedDetailBooking.customer_code || `KH-${selectedDetailBooking.customer_phone.replace(/\D/g, '')}`}
                  </span>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedDetailBooking.stage === 'DEPOSITED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedDetailBooking.stage === 'QUOTED'
                        ? 'bg-amber-100 text-amber-800'
                        : selectedDetailBooking.stage === 'COMPLETED'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedDetailBooking.stage === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedDetailBooking.stage === 'NEW'
                      ? '1. Mới Nhận'
                      : selectedDetailBooking.stage === 'QUOTED'
                      ? '2. Đã Báo Giá'
                      : selectedDetailBooking.stage === 'DEPOSITED'
                      ? '3. Đã Cọc Tiệc'
                      : selectedDetailBooking.stage === 'COMPLETED'
                      ? '4. Hoàn Tất'
                      : 'Đã Hủy'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#231F20]">
                  {selectedDetailBooking.customer_name}{' '}
                  {selectedDetailBooking.company_name && (
                    <span className="text-xs font-normal text-[#6B5E55]">
                      ({selectedDetailBooking.company_name})
                    </span>
                  )}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDetailBooking(null)}
                className="text-[#A09383] hover:text-[#231F20] text-sm font-bold p-1 rounded-lg hover:bg-[#F5EFE6]"
              >
                ✕
              </button>
            </div>

            {/* Nội dung chi tiết cuộn */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Lưới 4 ô tóm tắt chính */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9]">
                  <div className="text-[10px] uppercase font-bold text-[#A09383]">Chi Nhánh</div>
                  <div className="text-xs font-bold text-[#8B1D24] mt-0.5 truncate">
                    {selectedDetailBooking.branch_name}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9]">
                  <div className="text-[10px] uppercase font-bold text-[#A09383]">Ngày & Ca Tiệc</div>
                  <div className="text-xs font-bold text-[#231F20] mt-0.5">
                    {selectedDetailBooking.booking_date} (
                    {selectedDetailBooking.time_slot === 'LUNCH'
                      ? 'Trưa'
                      : selectedDetailBooking.time_slot === 'DINNER'
                      ? 'Tối'
                      : 'Cả ngày'}
                    )
                  </div>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9]">
                  <div className="text-[10px] uppercase font-bold text-[#A09383]">Phòng / Sảnh</div>
                  <div className="text-xs font-bold text-[#231F20] mt-0.5 truncate">
                    {selectedDetailBooking.room_name}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9]">
                  <div className="text-[10px] uppercase font-bold text-[#A09383]">Quy Mô</div>
                  <div className="text-xs font-bold text-[#231F20] mt-0.5">
                    {selectedDetailBooking.guest_count} khách
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ & người phụ trách */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E8E2D9] space-y-2">
                <div className="font-bold text-[#8B1D24] uppercase text-[11px] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Thông Tin Liên Hệ & Phụ Trách</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#6B5E55]">Số điện thoại: </span>
                    <strong className="font-mono text-[#231F20] text-sm">
                      {selectedDetailBooking.customer_phone}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#6B5E55]">Nhân viên phụ trách: </span>
                    <strong className="text-[#231F20]">
                      {selectedDetailBooking.sales_rep_name || 'Lễ Tân Chi Nhánh'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Thực đơn & Yêu cầu của khách */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] space-y-2">
                <div className="font-bold text-[#8B1D24] uppercase text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Thực Đơn, Khẩu Vị & Yêu Cầu Đặc Biệt</span>
                </div>
                <p className="text-xs leading-relaxed text-[#231F20] bg-white p-2.5 rounded-lg border border-[#D5C9BC]">
                  {selectedDetailBooking.special_requests || 'Khách chưa để lại yêu cầu thực đơn cụ thể. Nhân viên phụ trách sẽ gọi điện tư vấn trực tiếp.'}
                </p>
              </div>

              {/* Bảng Tài Chính & Cọc */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C9BC] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#2A7238] uppercase text-[11px] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Tài Chính & Cọc Tiệc</span>
                  </div>
                  {selectedDetailBooking.stage !== 'DEPOSITED' && selectedDetailBooking.stage !== 'COMPLETED' && selectedDetailBooking.stage !== 'CANCELLED' && (
                    <button
                      onClick={() => {
                        handleOpenDepositModal(selectedDetailBooking);
                      }}
                      className="px-2.5 py-1 rounded bg-[#2A7238] text-white font-bold text-[11px] hover:bg-[#235d2e] transition-colors"
                    >
                      + Ghi Cọc Đợt Mới
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAF7F2] rounded-lg text-center">
                  <div>
                    <div className="text-[10px] text-[#A09383] uppercase">Tổng Dự Toán</div>
                    <div className="font-mono font-bold text-sm text-[#231F20] mt-0.5">
                      {selectedDetailBooking.estimated_budget.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#2A7238] uppercase font-bold">Đã Cọc Tích Lũy</div>
                    <div className="font-mono font-bold text-sm text-[#2A7238] mt-0.5">
                      {selectedDetailBooking.total_deposited.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#C05621] uppercase font-bold">Còn Phải Thu</div>
                    <div className="font-mono font-bold text-sm text-[#C05621] mt-0.5">
                      {Math.max(0, selectedDetailBooking.estimated_budget - selectedDetailBooking.total_deposited).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>

                {/* Danh sách phiếu cọc của tiệc */}
                {deposits.filter((d) => d.booking_id === selectedDetailBooking.id).length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E8E2D9]">
                    <div className="text-[11px] font-bold text-[#6B5E55]">Lịch sử nộp cọc:</div>
                    {deposits
                      .filter((d) => d.booking_id === selectedDetailBooking.id)
                      .map((dep) => (
                        <div
                          key={dep.id}
                          className="flex items-center justify-between text-[11px] p-2 bg-white rounded border border-[#E8E2D9]"
                        >
                          <div>
                            <span className="font-bold text-[#2A7238]">
                              +{dep.amount.toLocaleString('vi-VN')} đ
                            </span>{' '}
                            <span className="text-[#6B5E55]">({dep.payment_method})</span> — {dep.note}
                          </div>
                          <div className="text-[10px] text-[#A09383]">{dep.created_at}</div>
                        </div>
                      ))}
                  </div>
                )}

                {selectedDetailBooking.cancel_reason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                    <strong>⚠️ Lý do hủy tiệc:</strong> {selectedDetailBooking.cancel_reason}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal Chi Tiết */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9] mt-3">
              <div className="text-[11px] text-[#A09383]">
                Khách tạo lúc: {selectedDetailBooking.created_at}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Đã gửi thông tin tiệc ${selectedDetailBooking.booking_code} cho Bếp & Phục vụ chi nhánh ${selectedDetailBooking.branch_name}`);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-[#6B5E55] border border-[#D5C9BC] hover:bg-[#FAF7F2] rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Bàn Giao Bếp</span>
                </button>

                {selectedDetailBooking.stage !== 'CANCELLED' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCancelTargetBooking(selectedDetailBooking);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-[#991B1B] hover:bg-rose-50 rounded-lg"
                  >
                    Hủy Tiệc & Nhả Phòng
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedDetailBooking(null)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
