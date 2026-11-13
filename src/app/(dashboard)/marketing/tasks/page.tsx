'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  ExternalLink,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  History,
  Building2,
  Send,
  RotateCcw,
  Sparkles,
  GripVertical,
} from 'lucide-react';

interface TaskItem {
  id: number;
  campaign_id: number | null;
  campaign_name?: string;
  is_adhoc: boolean;
  title: string;
  description: string;
  assignee_name: string;
  assignee_id: string;
  reviewer_name: string;
  branch_name: string;
  due_date: string;
  original_due_date?: string;
  delay_reason?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  proof_url?: string;
}

interface VarianceRecord {
  id: number;
  task_title: string;
  changed_by: string;
  old_date: string;
  new_date: string;
  reason: string;
  created_at: string;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 1,
    campaign_id: 1,
    campaign_name: 'Mùa Tiệc Tất Niên & Tân Niên 2026',
    is_adhoc: false,
    title: 'Chụp bộ ảnh không gian phòng VIP & set thực đơn tiệc tất niên',
    description: 'Chụp hình 5 món tiệc signature (Gà ta hấp lá chúc, Heo mẹt đồng quê, Lẩu riêu cua đồng) và không gian tiệc',
    assignee_name: 'Lê Thu Trang',
    assignee_id: 'user-mkt-01',
    reviewer_name: 'Trưởng phòng Marketing',
    branch_name: 'Toàn chuỗi',
    due_date: '2026-11-13', // Đến hạn hôm nay
    status: 'IN_PROGRESS',
  },
  {
    id: 2,
    campaign_id: 1,
    campaign_name: 'Mùa Tiệc Tất Niên & Tân Niên 2026',
    is_adhoc: false,
    title: 'Viết bài & lên lịch 5 bài đăng Facebook giới thiệu gói ưu đãi tiệc công ty',
    description: 'Sử dụng AI Skill Tiệc tất niên để sinh 3 hook hấp dẫn, nhắm đối tượng phòng nhân sự, công đoàn các công ty',
    assignee_name: 'Lê Thu Trang',
    assignee_id: 'user-mkt-01',
    reviewer_name: 'Trưởng phòng Marketing',
    branch_name: 'Toàn chuỗi',
    due_date: '2026-11-12',
    status: 'IN_REVIEW',
    proof_url: 'https://drive.google.com/drive/folders/que-nha-bai-dang-tet-2026',
  },
  {
    id: 3,
    campaign_id: null,
    campaign_name: undefined,
    is_adhoc: true, // Việc phát sinh đột xuất
    title: 'Thiết kế standee đặt tại sảnh thông báo ưu đãi rượu vang mừng 20/11',
    description: 'Việc gấp BGĐ giao trực tiếp lúc sáng để đặt tại sảnh 4 chi nhánh',
    assignee_name: 'Lê Thu Trang',
    assignee_id: 'user-mkt-01',
    reviewer_name: 'Ban Giám Đốc',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    due_date: '2026-11-14',
    status: 'TODO',
  },
  {
    id: 4,
    campaign_id: 2,
    campaign_name: 'Không Gian Phòng VIP & Cá Kho Niêu',
    is_adhoc: false,
    title: 'Sản xuất video ngắn TikTok (45s) trải nghiệm món cá kho niêu niêu đất',
    description: 'Quay cảnh khói nghi ngút và niêu cá sôi bùng vị quê dân dã',
    assignee_name: 'Nguyễn Văn Minh',
    assignee_id: 'user-mkt-02',
    reviewer_name: 'Trưởng phòng Marketing',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    due_date: '2026-11-10', // Đã trễ hạn
    original_due_date: '2026-11-08',
    delay_reason: 'Chờ chi nhánh sắp xếp giờ quay vắng khách',
    status: 'IN_PROGRESS',
  },
  {
    id: 5,
    campaign_id: 1,
    campaign_name: 'Mùa Tiệc Tất Niên & Tân Niên 2026',
    is_adhoc: false,
    title: 'Dựng bảng giá chi tiết set thực đơn tiệc gửi đội Sales Đặt Tiệc',
    description: 'Bản PDF đẹp định dạng A4 gửi Zalo cho khách hỏi tiệc đoàn từ 20 đến 100 khách',
    assignee_name: 'Phạm Thị Lan',
    assignee_id: 'user-mkt-03',
    reviewer_name: 'Trưởng phòng Marketing',
    branch_name: 'Toàn chuỗi',
    due_date: '2026-11-09',
    status: 'DONE',
    proof_url: 'https://drive.google.com/file/d/menu-tiec-tat-nien-que-nha-2026/view',
  },
];

const DELAY_REASONS = [
  'Chờ chi nhánh cung cấp hình ảnh / món ăn thực tế',
  'Chờ duyệt điều chỉnh thực đơn / ưu đãi từ BGĐ',
  'Thay đổi lịch sự kiện / thời tiết',
  'Nhân sự quá tải việc phát sinh đột xuất',
  'Lý do đối tác quay dựng / in ấn',
  'Khác (ghi chú cụ thể)',
];

function DroppableColumn({
  id,
  title,
  color,
  count,
  children,
}: {
  id: string;
  title: string;
  color: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`bg-[#FAF7F2] rounded-xl border p-3 border-t-4 ${color} min-h-[520px] flex flex-col transition-all ${
        isOver
          ? 'bg-[#F2EAE0] border-[#8B1D24] ring-2 ring-[#8B1D24]/20 shadow-sm'
          : 'border-[#E8E2D9]'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9] mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#231F20]">
          {title}
        </h3>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-[#8B1D24] border border-[#E8E2D9]">
          {count}
        </span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

function DraggableTaskCard({
  task,
  children,
}: {
  task: TaskItem;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(task.id),
    data: task,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-30' : ''}`}
    >
      {/* Nút Handle Kéo Thả Chuẩn Jira */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 p-1 rounded hover:bg-[#F3EFEA] text-[#9C8E82] hover:text-[#8B1D24] cursor-grab active:cursor-grabbing z-20 touch-none"
        title="Kéo thả sang cột khác"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      {children}
    </div>
  );
}

export default function MarketingTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<'KANBAN' | 'FOCUS' | 'VARIANCE'>('KANBAN');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [activeDragTask, setActiveDragTask] = useState<TaskItem | null>(null);

  // Cấu hình Sensors kéo thả (Pointer constraint 5px + Touch delay 150ms chuẩn mobile)
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const [varianceLogs, setVarianceLogs] = useState<VarianceRecord[]>([
    {
      id: 1,
      task_title: 'Sản xuất video ngắn TikTok (45s) trải nghiệm món cá kho niêu niêu đất',
      changed_by: 'Nguyễn Văn Minh',
      old_date: '2026-11-08',
      new_date: '2026-11-10',
      reason: 'Chờ chi nhánh sắp xếp giờ quay vắng khách',
      created_at: '2026-11-08 14:30',
    },
  ]);

interface CampaignOption {
  id: number;
  name: string;
  code: string;
}

const AVAILABLE_CAMPAIGNS: CampaignOption[] = [
  { id: 1, name: 'Mùa Tiệc Tất Niên & Tân Niên 2026', code: 'CAMP_TET2026' },
  { id: 2, name: 'Không Gian Phòng VIP & Cá Kho Niêu', code: 'CAMP_VIP_CAKHO' },
  { id: 3, name: 'Quảng Bá Tiệc Sinh Nhật & Thôi Nôi Quê Nhà', code: 'CAMP_SINHNHAT' },
];

  // Modal tạo việc mới
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newIsAdhoc, setNewIsAdhoc] = useState(false);
  const [newCampaignId, setNewCampaignId] = useState<number>(1);
  const [newAssignee, setNewAssignee] = useState('Lê Thu Trang');
  const [newBranch, setNewBranch] = useState('Toàn chuỗi');

  // Modal nộp duyệt bắt buộc proof_url
  const [submitTaskTarget, setSubmitTaskTarget] = useState<TaskItem | null>(null);
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [proofError, setProofError] = useState('');

  // Modal dời deadline bắt buộc delay_reason
  const [delayTaskTarget, setDelayTaskTarget] = useState<TaskItem | null>(null);
  const [newDeadlineInput, setNewDeadlineInput] = useState('');
  const [delayReasonInput, setDelayReasonInput] = useState(DELAY_REASONS[0]);

  // Kéo thả Kanban: Bắt đầu & Kết thúc
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => String(t.id) === event.active.id);
    if (task) setActiveDragTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragTask(null);
    if (!over) return;

    const taskId = Number(active.id);
    const targetStatus = over.id as TaskItem['status'];
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    handleMoveStatus(task, targetStatus);
  };

  // Đổi trạng thái việc
  const handleMoveStatus = (task: TaskItem, newStatus: TaskItem['status']) => {
    // Nếu chuyển sang IN_REVIEW hoặc DONE mà chưa có proof_url thì BẮT BUỘC hiện modal nhập bằng chứng
    if ((newStatus === 'IN_REVIEW' || newStatus === 'DONE') && !task.proof_url) {
      setSubmitTaskTarget(task);
      setProofUrlInput('');
      setProofError('');
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
  };

  // Xác nhận nộp duyệt kèm Proof URL
  const handleConfirmSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrlInput.trim()) {
      setProofError('⚠️ Tiêu chuẩn hoàn thành: Bắt buộc đính kèm link Drive/ảnh bằng chứng!');
      return;
    }

    if (submitTaskTarget) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === submitTaskTarget.id
            ? { ...t, status: 'IN_REVIEW', proof_url: proofUrlInput.trim() }
            : t
        )
      );
      setSubmitTaskTarget(null);
    }
  };

  // Xác nhận dời deadline kèm Variance Log
  const handleConfirmDelayDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadlineInput || !delayTaskTarget) return;

    // Ghi vào Variance Log
    const newLog: VarianceRecord = {
      id: Date.now(),
      task_title: delayTaskTarget.title,
      changed_by: delayTaskTarget.assignee_name,
      old_date: delayTaskTarget.due_date,
      new_date: newDeadlineInput,
      reason: delayReasonInput,
      created_at: new Date().toLocaleString('vi-VN'),
    };

    setVarianceLogs([newLog, ...varianceLogs]);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === delayTaskTarget.id
          ? {
              ...t,
              original_due_date: t.original_due_date || t.due_date,
              due_date: newDeadlineInput,
              delay_reason: delayReasonInput,
            }
          : t
      )
    );

    setDelayTaskTarget(null);
  };

  // Tạo việc mới
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedCamp = AVAILABLE_CAMPAIGNS.find((c) => c.id === newCampaignId);

    const newTask: TaskItem = {
      id: Date.now(),
      campaign_id: newIsAdhoc ? null : newCampaignId,
      campaign_name: newIsAdhoc ? undefined : selectedCamp?.name,
      is_adhoc: newIsAdhoc,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Chưa có mô tả chi tiết',
      assignee_name: newAssignee,
      assignee_id: 'user-mkt-01',
      reviewer_name: 'Trưởng phòng Marketing',
      branch_name: newBranch,
      due_date: newDueDate || new Date().toISOString().split('T')[0],
      status: 'TODO',
    };

    setTasks([newTask, ...tasks]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Lọc việc
  const todayStr = '2026-11-13'; // Ngày hiện tại mô phỏng
  const overdueCount = tasks.filter((t) => t.status !== 'DONE' && t.due_date < todayStr).length;

  const filteredTasks = tasks.filter((t) => {
    if (selectedBranch !== 'all' && t.branch_name !== selectedBranch) return false;
    if (viewMode === 'FOCUS') {
      // My Focus: việc của user đến hạn hôm nay hoặc quá hạn
      return (
        t.status !== 'DONE' &&
        (t.due_date <= todayStr || t.due_date === '2026-11-13')
      );
    }
    return true;
  });

  const columns: { key: TaskItem['status']; title: string; color: string }[] = [
    { key: 'TODO', title: 'Cần Làm', color: 'border-t-[#9C8E82]' },
    { key: 'IN_PROGRESS', title: 'Đang Thực Hiện', color: 'border-t-[#C58940]' },
    { key: 'IN_REVIEW', title: 'Chờ Duyệt (Có Proof)', color: 'border-t-[#2B6CB0]' },
    { key: 'DONE', title: 'Đã Hoàn Thành', color: 'border-t-[#2A7238]' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8B1D24] uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4 text-[#C58940]" />
            <span>Phân hệ Marketing • Module 2</span>
          </div>
          <h1 className="text-2xl font-black text-[#231F20] tracking-tight">
            Điều Hành Đầu Việc Marketing (Task Engine)
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Khóa chặt kỷ luật: Bắt buộc bằng chứng khi nộp duyệt, bắt buộc lý do khi dời hạn chót.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {overdueCount > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDE8E8] border border-[#9B1C1C]/30 text-xs font-bold text-[#9B1C1C]">
              <AlertTriangle className="w-4 h-4" />
              <span>{overdueCount} việc trễ hạn</span>
            </div>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#8B1D24] text-white text-xs font-bold hover:bg-[#72161C] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Giao Việc Mới</span>
          </button>
        </div>
      </div>

      {/* Chuyển Đổi Tab Chế Độ Xem */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#E8E2D9]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('KANBAN')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'KANBAN'
                ? 'bg-[#8B1D24] text-white shadow-xs'
                : 'text-[#6B5E55] hover:bg-[#FAF7F2]'
            }`}
          >
            Bảng Kanban 4 Cột
          </button>
          <button
            onClick={() => setViewMode('FOCUS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'FOCUS'
                ? 'bg-[#8B1D24] text-white shadow-xs'
                : 'text-[#6B5E55] hover:bg-[#FAF7F2]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C58940]" />
            <span>Việc Hôm Nay (My Focus)</span>
          </button>
          <button
            onClick={() => setViewMode('VARIANCE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'VARIANCE'
                ? 'bg-[#8B1D24] text-white shadow-xs'
                : 'text-[#6B5E55] hover:bg-[#FAF7F2]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Nhật Ký Sai Lệch (Variance Log)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF7F2] text-[#8B1D24] font-mono">
              {varianceLogs.length}
            </span>
          </button>
        </div>

        {/* Lọc chi nhánh */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#6B5E55]" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs rounded-lg border border-[#D5C9BC] px-2.5 py-1 bg-[#FAF7F2] font-semibold text-[#231F20] focus:outline-none"
          >
            <option value="all">Tất cả chi nhánh</option>
            <option value="Toàn chuỗi">Toàn chuỗi</option>
            <option value="Quê Nhà - Phạm Ngọc Thạch">Phạm Ngọc Thạch</option>
            <option value="Quê Nhà - Thành Thái">Thành Thái</option>
            <option value="Quê Nhà - Nguyễn Thái Bình">Nguyễn Thái Bình</option>
          </select>
        </div>
      </div>

      {/* NỘI DUNG 1: BẢNG KANBAN 4 CỘT KÉO THẢ CHUẨN @DND-KIT (PATTERN JIRA CLONE) */}
      {viewMode === 'KANBAN' && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.key);

              return (
                <DroppableColumn
                  key={col.key}
                  id={col.key}
                  title={col.title}
                  color={col.color}
                  count={colTasks.length}
                >
                  {colTasks.map((task) => {
                    const isOverdue = task.status !== 'DONE' && task.due_date < todayStr;

                    return (
                      <DraggableTaskCard key={task.id} task={task}>
                        <div className="bg-white rounded-lg p-3.5 border border-[#E8E2D9] shadow-xs hover:border-[#8B1D24]/40 transition-all space-y-2.5">
                          {/* Tags */}
                          <div className="flex items-center justify-between gap-1 flex-wrap pr-6">
                            {task.is_adhoc ? (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#FEEBC8] text-[#C05621] uppercase">
                                ⚡ Phát sinh (Ad-hoc)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F7EAEB] text-[#8B1D24] truncate max-w-[150px]">
                                {task.campaign_name}
                              </span>
                            )}

                            <span className="text-[10px] text-[#9C8E82] font-semibold flex items-center gap-1">
                              <Building2 className="w-2.5 h-2.5" />
                              {task.branch_name}
                            </span>
                          </div>

                          {/* Title & Desc */}
                          <div>
                            <h4 className="text-xs font-bold text-[#231F20] leading-snug group-hover:text-[#8B1D24] transition-colors pr-4">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-[#6B5E55] mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          </div>

                          {/* Bằng chứng Proof URL nếu có */}
                          {task.proof_url && (
                            <div className="p-2 rounded bg-[#EAF5EC] border border-[#2A7238]/20 flex items-center justify-between text-[11px] text-[#2A7238]">
                              <span className="font-semibold truncate max-w-[160px]">
                                ✓ Bằng chứng hoàn thành
                              </span>
                              <a
                                href={task.proof_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] underline font-bold"
                              >
                                <span>Xem</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          {/* Hạn chót & Cảnh báo */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#F5EFE6] text-[11px]">
                            <div className="flex items-center gap-1 text-[#6B5E55]">
                              <Clock className={`w-3 h-3 ${isOverdue ? 'text-[#9B1C1C]' : ''}`} />
                              <span className={isOverdue ? 'text-[#9B1C1C] font-bold' : ''}>
                                {task.due_date}
                              </span>
                            </div>
                            <span className="font-bold text-[#8B1D24] text-[10px]">
                              {task.assignee_name}
                            </span>
                          </div>

                          {/* Thao tác chuyển trạng thái nhanh */}
                          <div className="flex items-center justify-between pt-1 text-[11px] gap-1">
                            <button
                              onClick={() => {
                                setDelayTaskTarget(task);
                                setNewDeadlineInput(task.due_date);
                              }}
                              className="text-[10px] font-semibold text-[#6B5E55] hover:text-[#C58940] underline"
                            >
                              Dời hạn
                            </button>

                            <div className="flex items-center gap-1">
                              {col.key === 'TODO' && (
                                <button
                                  onClick={() => handleMoveStatus(task, 'IN_PROGRESS')}
                                  className="px-2 py-0.5 rounded bg-[#F5EFE6] hover:bg-[#C58940] hover:text-white text-[10px] font-bold text-[#4A3525] transition-colors"
                                >
                                  Làm ngay $\rightarrow$
                                </button>
                              )}

                              {col.key === 'IN_PROGRESS' && (
                                <button
                                  onClick={() => handleMoveStatus(task, 'IN_REVIEW')}
                                  className="px-2 py-0.5 rounded bg-[#F7EAEB] hover:bg-[#8B1D24] hover:text-white text-[10px] font-bold text-[#8B1D24] transition-colors"
                                >
                                  Nộp duyệt $\rightarrow$
                                </button>
                              )}

                              {col.key === 'IN_REVIEW' && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleMoveStatus(task, 'DONE')}
                                    className="px-2 py-0.5 rounded bg-[#EAF5EC] hover:bg-[#2A7238] hover:text-white text-[10px] font-bold text-[#2A7238] transition-colors"
                                  >
                                    Duyệt ✓
                                  </button>
                                  <button
                                    onClick={() => handleMoveStatus(task, 'IN_PROGRESS')}
                                    className="p-1 rounded bg-[#FDE8E8] text-[#9B1C1C] hover:bg-[#9B1C1C] hover:text-white text-[10px]"
                                    title="Trả lại yêu cầu làm lại"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </button>
                                </div>
                              )}

                              {col.key === 'DONE' && (
                                <span className="text-[10px] text-[#2A7238] font-bold flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Hoàn tất
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </DraggableTaskCard>
                    );
                  })}
                </DroppableColumn>
              );
            })}
          </div>

          <DragOverlay>
            {activeDragTask ? (
              <div className="bg-white rounded-lg p-3.5 border-2 border-[#8B1D24] shadow-2xl opacity-95 rotate-1 scale-105 pointer-events-none w-[270px]">
                <div className="text-[10px] font-bold text-[#8B1D24] mb-1">
                  {activeDragTask.title}
                </div>
                <p className="text-[11px] text-[#6B5E55] line-clamp-2">
                  {activeDragTask.description}
                </p>
                <div className="mt-2 text-[10px] text-[#2A7238] font-bold">
                  Đang kéo sang cột mới...
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* NỘI DUNG 2: MY FOCUS - VIỆC HÔM NAY CỦA TÔI */}
      {viewMode === 'FOCUS' && (
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#231F20] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C58940]" />
                Màn hình Tiêu Điểm Hôm Nay (My Focus)
              </h2>
              <p className="text-xs text-[#6B5E55] mt-0.5">
                Chỉ hiển thị các đầu việc của bạn cần hoàn tất trong ngày hôm nay hoặc đang bị trễ hạn.
              </p>
            </div>
            <div className="text-xs font-bold text-[#8B1D24] bg-[#F7EAEB] px-3 py-1.5 rounded-lg border border-[#8B1D24]/20">
              Hôm nay: 13/11/2026
            </div>
          </div>

          <div className="divide-y divide-[#E8E2D9]">
            {filteredTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9C8E82]">
                Tuyệt vời! Bạn không có việc nào bị trễ hạn hoặc đến hạn hôm nay.
              </div>
            ) : (
              filteredTasks.map((t) => (
                <div key={t.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8B1D24]">
                        {t.campaign_name || 'Phát sinh'}
                      </span>
                      <span className="text-xs text-[#9B1C1C] font-bold">
                        Hạn: {t.due_date}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-[#231F20]">{t.title}</div>
                    <p className="text-xs text-[#6B5E55] mt-0.5">{t.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveStatus(t, 'IN_REVIEW')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#8B1D24] text-white text-xs font-bold hover:bg-[#72161C] transition-colors"
                    >
                      Nộp duyệt kết quả
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* NỘI DUNG 3: VARIANCE LOG - NHẬT KÝ DỜI HẠN */}
      {viewMode === 'VARIANCE' && (
        <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-[#E8E2D9] bg-[#FAF7F2]">
            <h2 className="text-base font-bold text-[#231F20] flex items-center gap-2">
              <History className="w-5 h-5 text-[#8B1D24]" />
              Nhật Ký Sai Lệch Deadline (Variance Log)
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Hệ thống lưu vết mọi lần dời hạn kèm lý do chuẩn hóa để Trưởng phòng & BGĐ nhìn rõ điểm nghẽn thực thi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E2D9] text-left text-sm">
              <thead className="bg-[#FAF7F2] text-xs uppercase font-bold text-[#6B5E55]">
                <tr>
                  <th className="px-6 py-3">Công Việc</th>
                  <th className="px-6 py-3">Người Thực Hiện</th>
                  <th className="px-6 py-3">Hạn Gốc $\rightarrow$ Hạn Mới</th>
                  <th className="px-6 py-3">Lý Do Chuẩn Hóa</th>
                  <th className="px-6 py-3">Thời Điểm Sửa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9] bg-white text-xs">
                {varianceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FBF9F5]">
                    <td className="px-6 py-3.5 font-bold text-[#231F20] max-w-sm">
                      {log.task_title}
                    </td>
                    <td className="px-6 py-3.5 text-[#8B1D24] font-semibold">{log.changed_by}</td>
                    <td className="px-6 py-3.5 font-mono">
                      <span className="line-through text-[#9C8E82]">{log.old_date}</span>{' '}
                      $\rightarrow${' '}
                      <span className="text-[#9B1C1C] font-bold">{log.new_date}</span>
                    </td>
                    <td className="px-6 py-3.5 text-[#4A3525] font-medium">{log.reason}</td>
                    <td className="px-6 py-3.5 text-[#9C8E82]">{log.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: NỘP DUYỆT BẮT BUỘC PROOF_URL */}
      {submitTaskTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center gap-2 text-[#8B1D24] font-bold text-base mb-1">
              <Send className="w-5 h-5" />
              <span>Nộp Duyệt Bằng Chứng Hoàn Thành</span>
            </div>
            <p className="text-xs text-[#6B5E55] mb-4">
              Công việc: <strong className="text-[#231F20]">{submitTaskTarget.title}</strong>
            </p>

            <form onSubmit={handleConfirmSubmitProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Link Google Drive / Bài đăng / Bằng chứng *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={proofUrlInput}
                  onChange={(e) => setProofUrlInput(e.target.value)}
                  className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
                <span className="text-[10px] text-[#9C8E82] mt-1 block">
                  Bắt buộc đính kèm link sản phẩm thực tế để Trưởng phòng nghiệm thu.
                </span>
              </div>

              {proofError && (
                <div className="p-2.5 rounded bg-[#FDE8E8] text-[#9B1C1C] text-xs font-bold">
                  {proofError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setSubmitTaskTarget(null)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg shadow-xs"
                >
                  Xác Nhận Nộp Duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DỜI DEADLINE BẮT BUỘC CHỌN LÝ DO */}
      {delayTaskTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center gap-2 text-[#C58940] font-bold text-base mb-1">
              <Clock className="w-5 h-5" />
              <span>Dời Hạn Chót (Cập Nhật Variance Log)</span>
            </div>
            <p className="text-xs text-[#6B5E55] mb-4">
              Công việc: <strong className="text-[#231F20]">{delayTaskTarget.title}</strong>
            </p>

            <form onSubmit={handleConfirmDelayDeadline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Hạn chót mới *
                </label>
                <input
                  type="date"
                  required
                  value={newDeadlineInput}
                  onChange={(e) => setNewDeadlineInput(e.target.value)}
                  className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
                <span className="text-[10px] text-[#9C8E82] mt-0.5 block">
                  Hạn cũ: {delayTaskTarget.due_date}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Lý do dời hạn chuẩn hóa *
                </label>
                <select
                  value={delayReasonInput}
                  onChange={(e) => setDelayReasonInput(e.target.value)}
                  className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#8B1D24]"
                >
                  {DELAY_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setDelayTaskTarget(null)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#C58940] hover:bg-[#B07833] rounded-lg shadow-xs"
                >
                  Lưu & Ghi Nhật Ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: GIAO VIỆC MỚI */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <h3 className="text-lg font-bold text-[#8B1D24] mb-1">Giao Việc Marketing Mới</h3>
            <p className="text-xs text-[#6B5E55] mb-4">
              Phân bổ công việc rõ ràng, bám sát chiến dịch hoặc đánh dấu phát sinh đột xuất.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Tiêu đề đầu việc *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Thiết kế banner tiệc công ty 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D9]">
                  <input
                    type="checkbox"
                    id="adhocCheck"
                    checked={newIsAdhoc}
                    onChange={(e) => setNewIsAdhoc(e.target.checked)}
                    className="rounded text-[#8B1D24] focus:ring-[#8B1D24]"
                  />
                  <label htmlFor="adhocCheck" className="text-xs font-bold text-[#C05621] cursor-pointer">
                    Đây là việc phát sinh đột xuất ngoài kế hoạch (Ad-hoc)
                  </label>
                </div>

                {!newIsAdhoc ? (
                  <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#D5C9BC] animate-in fade-in">
                    <label className="block text-xs font-bold text-[#8B1D24] uppercase mb-1">
                      Chiến dịch trực thuộc *
                    </label>
                    <select
                      value={newCampaignId}
                      onChange={(e) => setNewCampaignId(Number(e.target.value))}
                      required={!newIsAdhoc}
                      className="w-full text-xs font-bold text-[#231F20] border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#8B1D24]"
                    >
                      {AVAILABLE_CAMPAIGNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.code}] {c.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-[#6B5E55] mt-1 font-medium">
                      📌 Theo quy định DB: Việc không phát sinh bắt buộc gắn vào Chiến dịch để theo dõi tiến độ và kích hoạt báo cáo KPI.
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#FEF3C7]/40 rounded-lg border border-[#F59E0B]/30 text-[11px] text-[#B45309] font-medium">
                    ⚡ Việc phát sinh đột xuất (Ad-hoc) không cần thuộc Chiến dịch nào, nhưng vẫn phải có người duyệt và hạn chót hoàn thành.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Mô tả chi tiết & Tiêu chuẩn nghiệm thu
                </label>
                <textarea
                  rows={2}
                  placeholder="Yêu cầu cụ thể, kích thước, định dạng..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Người phụ trách
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-2.5 py-2 bg-white"
                  >
                    <option value="Lê Thu Trang">Lê Thu Trang (MKT Content)</option>
                    <option value="Nguyễn Văn Minh">Nguyễn Văn Minh (MKT Media)</option>
                    <option value="Phạm Thị Lan">Phạm Thị Lan (MKT Designer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Hạn chót hoàn thành *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-2.5 py-2"
                  />
                </div>
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
                  Lưu & Giao Việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
