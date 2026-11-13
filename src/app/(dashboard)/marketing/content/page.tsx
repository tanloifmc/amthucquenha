'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  PenTool,
  Plus,
  Calendar as CalendarIcon,
  List,
  Copy,
  Check,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

const locales = {
  vi: vi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(2026, 0, 1), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface ContentPostItem {
  id: number;
  campaign_id: number | null;
  campaign_name: string;
  branch_name: string;
  channel: 'FACEBOOK' | 'TIKTOK' | 'YOUTUBE' | 'INSTAGRAM' | 'ZALO';
  pillar: string;
  title: string;
  body_draft: string;
  media_urls: string[];
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:mm
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED';
  published_url?: string;
  author_name: string;
}

const INITIAL_POSTS: ContentPostItem[] = [
  {
    id: 1,
    campaign_id: 1,
    campaign_name: 'Mùa Tiệc Tất Niên & Tân Niên 2026',
    branch_name: 'Toàn chuỗi',
    channel: 'FACEBOOK',
    pillar: 'Tiệc & Sự Kiện',
    title: 'Gợi Ý Thực Đơn Tiệc Tất Niên Đậm Đà Hương Vị Quê Nhà',
    body_draft: `🌾 TIỆC TẤT NIÊN CÔNG TY — ẤM ÁP TÌNH THÂN, ĐẬM ĐÀ HƯƠNG VỊ QUÊ NHÀ 🌾

Những ngày cuối năm bận rộn, còn gì quý hơn khoảnh khắc các thành viên cùng nâng ly chúc mừng một năm đã qua trong không gian mộc mạc, gần gũi như gian nhà quê ấm cúng!

✨ Ẩm Thực Quê Nhà hân hạnh mang đến set thực đơn Tiệc Cuối Năm đặc sắc:
🍗 Gà ta hấp lá chúc thơm lừng trứ danh
🥩 Heo mẹt đồng quê giòn bì chấm mắm tôm chuẩn vị
🍲 Lẩu riêu cua đồng bắp bò ngọt thanh mát lành
🐟 Cá lăng nướng muối ớt cay nồng đậm đà

🎁 Ưu đãi độc quyền cho đoàn tiệc đặt cọc sớm:
• Miễn phí gói trang trí backdrop hoa tươi & âm thanh
• Tặng gói bia tươi cao cấp cho bàn tiệc từ 30 khách
• Phòng VIP riêng tư máy lạnh sức chứa 10 - 100 khách

👉 Inbox Quê Nhà ngay hôm nay hoặc gọi Hotline 0938 226 166 để nhận dự toán chi tiết!

#AmThucQueNha #TiecTatNien #TiecCongTy #MonNgonSaiGon #PhongVIP`,
    media_urls: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'],
    scheduled_date: '2026-11-13',
    scheduled_time: '11:30',
    status: 'APPROVED',
    author_name: 'Lê Thu Trang',
  },
  {
    id: 2,
    campaign_id: 2,
    campaign_name: 'Không Gian Phòng VIP & Cá Kho Niêu',
    branch_name: 'Quê Nhà - Phạm Ngọc Thạch',
    channel: 'TIKTOK',
    pillar: 'Món Ngon Đặc Sản',
    title: 'Kịch Bản Video: Niêu Cá Kho Nghi Ngút Khói Giữa Lòng Quận 3',
    body_draft: `[HOOK 0-3s]: "Bạn có tin giữa lòng Quận 3 có niêu cá kho 8 tiếng ngon như mẹ nấu ở quê không?"
[THÂN BÀI 4-30s]:
- Cảnh 1: Cận cảnh mở nắp niêu đất, khói bốc nghi ngút, cá kho màu cánh gián đậm đà.
- Cảnh 2: Tiếng xèo xèo của niêu cơm cháy chấm quẹt sốt kho cá béo ngậy.
- Cảnh 3: Không gian phòng VIP rợp bóng cây xanh mát, tách biệt hoàn toàn tiếng còi xe bên ngoài.
[KÊU GỌI 31-45s]:
- "Ghé ngay Quê Nhà 28 Phạm Ngọc Thạch để tìm lại vị cơm nhà xưa nhé!"

#TiktokFood #CaKhoNieu #AmThucQueNha #ReviewQuan3`,
    media_urls: [],
    scheduled_date: '2026-11-14',
    scheduled_time: '18:00',
    status: 'PENDING_APPROVAL',
    author_name: 'Lê Thu Trang',
  },
  {
    id: 3,
    campaign_id: 1,
    campaign_name: 'Mùa Tiệc Tất Niên & Tân Niên 2026',
    branch_name: 'Quê Nhà - Thành Thái',
    channel: 'FACEBOOK',
    pillar: 'Không Gian & Phòng VIP',
    title: 'Review 8 Phòng VIP Riêng Tư Tại Chi Nhánh Thành Thái Cho Buổi Tiếp Khách Đẳng Cấp',
    body_draft: `🌿 TIẾP ĐỐI TÁC VIP TRONG KHÔNG GIAN SÂN VƯỜN THOÁNG ĐÃNG TẠI QUẬN 10 🌿

Một bữa tiệc tiếp khách trang trọng đòi hỏi sự riêng tư tuyệt đối, món ăn vừa miệng và phong cách phục vụ chu đáo tận tình.

Tọa lạc tại 52A Thành Thái, Quê Nhà sở hữu hệ thống phòng VIP khép kín với phong cách mộc ấm cúng:
- Sức chứa từ 8 đến 40 khách
- Trang bị máy lạnh công suất lớn, âm thanh hiện đại
- Set menu hải sản tươi sống chế biến nóng hổi

Liên hệ ngay để giữ phòng VIP view đẹp nhất hôm nay!`,
    media_urls: [],
    scheduled_date: '2026-11-15',
    scheduled_time: '09:00',
    status: 'DRAFT',
    author_name: 'Lê Thu Trang',
  },
  {
    id: 4,
    campaign_id: 1,
    campaign_name: 'Mùa Tiệc Tất Niên & Tân Niên 2026',
    branch_name: 'Toàn chuỗi',
    channel: 'YOUTUBE',
    pillar: 'Hậu Trường & Đầu Bếp',
    title: 'Bí Quyết Nấu Nước Dùng Lẩu Riêu Cua Đồng Của Bếp Trưởng Quê Nhà',
    body_draft: `Video dài 8 phút hướng dẫn chọn cua đồng tươi và công thức nước dùng thanh mát từ giấm bỗng truyền thống. Đăng YouTube Shorts trích đoạn 60s.`,
    media_urls: [],
    scheduled_date: '2026-11-18',
    scheduled_time: '19:30',
    status: 'DRAFT',
    author_name: 'Nguyễn Văn Minh',
  },
];

const CHANNEL_CONFIG = {
  FACEBOOK: {
    name: 'Facebook',
    badgeClass: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30',
    dotClass: 'bg-[#1877F2]',
  },
  TIKTOK: {
    name: 'TikTok',
    badgeClass: 'bg-black/10 text-black border-black/30',
    dotClass: 'bg-black',
  },
  YOUTUBE: {
    name: 'YouTube',
    badgeClass: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30',
    dotClass: 'bg-[#FF0000]',
  },
  INSTAGRAM: {
    name: 'Instagram',
    badgeClass: 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/30',
    dotClass: 'bg-[#E1306C]',
  },
  ZALO: {
    name: 'Zalo OA',
    badgeClass: 'bg-[#0068FF]/10 text-[#0068FF] border-[#0068FF]/30',
    dotClass: 'bg-[#0068FF]',
  },
};

export default function MarketingContentPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [posts, setPosts] = useState<ContentPostItem[]>(INITIAL_POSTS);
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Modal tạo bài
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState<ContentPostItem['channel']>('FACEBOOK');
  const [newPillar, setNewPillar] = useState('Món Ngon Đặc Sản');
  const [newBody, setNewBody] = useState('');
  const [newDate, setNewDate] = useState('2026-11-16');
  const [newTime, setNewTime] = useState('11:30');
  const [newBranch, setNewBranch] = useState('Toàn chuỗi');

  // Preview bài
  const [previewPost, setPreviewPost] = useState<ContentPostItem | null>(null);

  // Modal xác nhận xuất bản kèm link thật (published_url)
  const [publishingPost, setPublishingPost] = useState<ContentPostItem | null>(null);
  const [publishedUrlInput, setPublishedUrlInput] = useState('');
  const [publishError, setPublishError] = useState('');

  // Copy bài 1-chạm
  const handleCopyCleanText = (post: ContentPostItem) => {
    navigator.clipboard.writeText(post.body_draft);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Duyệt bài
  const handleApprovePost = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p))
    );
  };

  // Mở modal xác nhận đã xuất bản
  const handleOpenPublishModal = (post: ContentPostItem) => {
    setPublishingPost(post);
    setPublishedUrlInput(post.published_url || '');
    setPublishError('');
  };

  // Xác nhận đã xuất bản thật (Kích hoạt Trigger Database actual_posts += 1)
  const handleConfirmPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishedUrlInput.trim()) {
      setPublishError('⚠️ Bắt buộc dán link bài đăng thực tế (Facebook / TikTok / YouTube)!');
      return;
    }

    if (publishingPost) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === publishingPost.id
            ? {
                ...p,
                status: 'PUBLISHED',
                published_url: publishedUrlInput.trim(),
              }
            : p
        )
      );
      if (previewPost && previewPost.id === publishingPost.id) {
        setPreviewPost({
          ...previewPost,
          status: 'PUBLISHED',
          published_url: publishedUrlInput.trim(),
        });
      }
      setPublishingPost(null);
      setPublishedUrlInput('');
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const newPost: ContentPostItem = {
      id: Date.now(),
      campaign_id: 1,
      campaign_name: 'Mùa Tiệc Tất Niên & Tân Niên 2026',
      branch_name: newBranch,
      channel: newChannel,
      pillar: newPillar,
      title: newTitle.trim(),
      body_draft: newBody.trim(),
      media_urls: [],
      scheduled_date: newDate,
      scheduled_time: newTime,
      status: 'PENDING_APPROVAL',
      author_name: 'Lê Thu Trang',
    };

    setPosts([newPost, ...posts]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewBody('');
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedChannel !== 'all' && p.channel !== selectedChannel) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    return true;
  });

  // Calendar Days (Tháng 11/2026 mô phỏng từ ngày 09 đến 22)
  const calendarDays = [
    '2026-11-09',
    '2026-11-10',
    '2026-11-11',
    '2026-11-12',
    '2026-11-13',
    '2026-11-14',
    '2026-11-15',
    '2026-11-16',
    '2026-11-17',
    '2026-11-18',
    '2026-11-19',
    '2026-11-20',
    '2026-11-21',
    '2026-11-22',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8B1D24] uppercase tracking-wider mb-1">
            <PenTool className="w-4 h-4 text-[#C58940]" />
            <span>Phân hệ Marketing • Module 3</span>
          </div>
          <h1 className="text-2xl font-black text-[#231F20] tracking-tight">
            Xưởng Content & Lịch Xuất Bản Đa Kênh
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Soạn thảo tinh gọn, phân lịch trực quan, duyệt 1 chạm và sao chép văn bản sạch đăng ngay trong 10 giây.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#8B1D24] text-white text-xs font-bold hover:bg-[#72161C] transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Soạn Bài Viết Mới</span>
        </button>
      </div>

      {/* Bộ Lọc & Chuyển Đổi View */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#E8E2D9]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('CALENDAR')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'CALENDAR'
                ? 'bg-[#8B1D24] text-white shadow-xs'
                : 'text-[#6B5E55] hover:bg-[#FAF7F2]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Lịch Xuất Bản (Calendar)</span>
          </button>
          <button
            onClick={() => setViewMode('LIST')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'LIST'
                ? 'bg-[#8B1D24] text-white shadow-xs'
                : 'text-[#6B5E55] hover:bg-[#FAF7F2]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Danh Sách Bài Đăng</span>
          </button>
        </div>

        {/* Lọc Kênh & Trạng Thái */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#6B5E55]" />
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="text-xs rounded-lg border border-[#D5C9BC] px-2.5 py-1 bg-[#FAF7F2] font-semibold text-[#231F20] focus:outline-none"
          >
            <option value="all">Tất cả kênh MXH</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="TIKTOK">TikTok</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="ZALO">Zalo OA</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs rounded-lg border border-[#D5C9BC] px-2.5 py-1 bg-[#FAF7F2] font-semibold text-[#231F20] focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="DRAFT">Bản nháp</option>
            <option value="PENDING_APPROVAL">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt (Sẵn sàng đăng)</option>
            <option value="PUBLISHED">Đã xuất bản</option>
          </select>
        </div>
      </div>

      {/* CHẾ ĐỘ 1: CALENDAR VIEW (CHUẨN POSTIZ VỚI REACT-BIG-CALENDAR) */}
      {viewMode === 'CALENDAR' && (
        <div className="bg-white rounded-xl border border-[#E8E2D9] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3 flex-wrap gap-2">
            <div>
              <div className="font-bold text-sm text-[#231F20]">
                Lịch Xuất Bản Đa Kênh (Tháng 11 / 2026)
              </div>
              <p className="text-[11px] text-[#6B5E55]">
                Bấm vào bài viết để xem chi tiết / duyệt / copy 1 chạm. Bấm vào ô ngày để lên lịch bài mới.
              </p>
            </div>

            {/* Chú thích màu kênh */}
            <div className="flex items-center gap-3 text-xs flex-wrap">
              {Object.entries(CHANNEL_CONFIG).map(([k, cfg]) => (
                <div key={k} className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                  <span>{cfg.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[680px]">
            {isMounted ? (
              <Calendar
                localizer={localizer}
                events={filteredPosts.map((post) => {
                  const [year, month, day] = post.scheduled_date.split('-').map(Number);
                  const [hour, minute] = post.scheduled_time.split(':').map(Number);
                  const startDate = new Date(year, month - 1, day, hour || 9, minute || 0);
                  const endDate = new Date(year, month - 1, day, (hour || 9) + 1, minute || 0);
                  return {
                    id: post.id,
                    title: post.title,
                    start: startDate,
                    end: endDate,
                    resource: post,
                  };
                })}
                defaultDate={new Date(2026, 10, 13)}
                views={['month', 'week', 'agenda']}
                defaultView={Views.MONTH}
                selectable
                onSelectEvent={(event: any) => setPreviewPost(event.resource)}
                onSelectSlot={(slotInfo: any) => {
                  setNewDate(format(slotInfo.start, 'yyyy-MM-dd'));
                  setShowCreateModal(true);
                }}
                messages={{
                  today: 'Hôm nay',
                  previous: 'Trước',
                  next: 'Sau',
                  month: 'Tháng',
                  week: 'Tuần',
                  agenda: 'Danh sách bài đăng',
                  noEventsInRange: 'Không có bài đăng nào trong khoảng thời gian này.',
                }}
                components={{
                  event: (props: any) => {
                    const post: ContentPostItem = props.event.resource;
                    const cfg = CHANNEL_CONFIG[post.channel] || CHANNEL_CONFIG.FACEBOOK;
                    return (
                      <div
                        className={`p-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer shadow-2xs hover:shadow-xs transition-all ${cfg.badgeClass}`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5 text-[9px] uppercase tracking-wider font-black">
                          <span>{cfg.name}</span>
                          <span className="opacity-75">{post.scheduled_time}</span>
                        </div>
                        <div className="truncate font-bold text-[#231F20] leading-tight">
                          {post.title}
                        </div>
                      </div>
                    );
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#9C8E82] font-semibold">
                Đang tải lịch xuất bản đa kênh...
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHẾ ĐỘ 2: LIST VIEW */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden shadow-xs">
          <div className="divide-y divide-[#E8E2D9]">
            {filteredPosts.map((post) => {
              const cfg = CHANNEL_CONFIG[post.channel];
              return (
                <div key={post.id} className="p-5 hover:bg-[#FBF9F5] transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.badgeClass}`}
                      >
                        {cfg.name}
                      </span>
                      <span className="text-xs font-semibold text-[#6B5E55]">
                        Trụ cột: <strong>{post.pillar}</strong>
                      </span>
                      <span className="text-xs text-[#9C8E82]">• {post.branch_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-[#6B5E55]">
                        Hẹn giờ: <strong>{post.scheduled_date} {post.scheduled_time}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          post.status === 'PUBLISHED'
                            ? 'bg-[#EAF5EC] text-[#2A7238] border border-[#2A7238]/30'
                            : post.status === 'APPROVED'
                            ? 'bg-[#EBF8FF] text-[#2B6CB0] border border-[#2B6CB0]/30'
                            : post.status === 'PENDING_APPROVAL'
                            ? 'bg-[#FEEBC8] text-[#C05621]'
                            : 'bg-[#F5EFE6] text-[#6B5E55]'
                        }`}
                      >
                        {post.status === 'PUBLISHED'
                          ? 'Đã xuất bản ✓'
                          : post.status === 'APPROVED'
                          ? 'Đã duyệt (Sẵn sàng đăng)'
                          : post.status === 'PENDING_APPROVAL'
                          ? 'Chờ duyệt'
                          : 'Bản nháp'}
                      </span>
                    </div>
                  </div>

                  {/* Tiêu đề & trích đoạn */}
                  <div>
                    <h3 className="text-sm font-bold text-[#231F20]">{post.title}</h3>
                    <p className="text-xs text-[#6B5E55] mt-1 line-clamp-2 whitespace-pre-line font-mono bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8E2D9]/70">
                      {post.body_draft}
                    </p>
                  </div>

                  {/* Nút Hành Động 1-Chạm */}
                  <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                    <div className="text-[11px] text-[#9C8E82]">
                      Tác giả: <strong>{post.author_name}</strong> • Thuộc chiến dịch:{' '}
                      <span className="text-[#8B1D24] font-semibold">{post.campaign_name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewPost(post)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D5C9BC] hover:border-[#8B1D24] text-xs font-bold text-[#6B5E55] hover:text-[#8B1D24] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>

                      {post.status === 'PENDING_APPROVAL' && (
                        <button
                          onClick={() => handleApprovePost(post.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2A7238] text-white text-xs font-bold hover:bg-[#235d2e] shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Duyệt Bài Viết</span>
                        </button>
                      )}

                      {/* NÚT COPY SẠCH 1-CHẠM (Q5) */}
                      <button
                        onClick={() => handleCopyCleanText(post)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                          copiedId === post.id
                            ? 'bg-[#2A7238] text-white'
                            : 'bg-[#8B1D24] text-white hover:bg-[#72161C]'
                        }`}
                      >
                        {copiedId === post.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Đã sao chép!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy bài đăng</span>
                          </>
                        )}
                      </button>

                      {/* NÚT XÁC NHẬN ĐÃ ĐĂNG BÀI (KÍCH HOẠT TRIGGER ACTUAL_POSTS) */}
                      {post.status === 'APPROVED' && (
                        <button
                          onClick={() => handleOpenPublishModal(post)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B6CB0] text-white text-xs font-bold hover:bg-[#23568c] shadow-xs transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xác nhận đã đăng</span>
                        </button>
                      )}

                      {post.status === 'PUBLISHED' && post.published_url && (
                        <a
                          href={post.published_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF5EC] text-[#2A7238] border border-[#2A7238]/30 text-xs font-bold hover:bg-[#2A7238] hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xem bài thật ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DRAWER / MODAL XEM CHI TIẾT & COPY BÀI */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8E2D9] max-h-[90vh] flex flex-col animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${CHANNEL_CONFIG[previewPost.channel].badgeClass}`}
                  >
                    {CHANNEL_CONFIG[previewPost.channel].name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      previewPost.status === 'PUBLISHED'
                        ? 'bg-[#EAF5EC] text-[#2A7238]'
                        : previewPost.status === 'APPROVED'
                        ? 'bg-[#EBF8FF] text-[#2B6CB0]'
                        : 'bg-[#FEEBC8] text-[#C05621]'
                    }`}
                  >
                    {previewPost.status === 'PUBLISHED' ? 'Đã xuất bản' : previewPost.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#231F20] mt-1">{previewPost.title}</h3>
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="text-[#9C8E82] hover:text-[#8B1D24] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="text-xs font-bold text-[#6B5E55] uppercase block mb-1">
                  Nội dung bài viết (Text thuần sạch — sẵn sàng paste):
                </label>
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] text-xs font-mono whitespace-pre-wrap leading-relaxed text-[#231F20]">
                  {previewPost.body_draft}
                </div>
              </div>

              {previewPost.published_url && (
                <div className="p-3 bg-[#EAF5EC] rounded-xl border border-[#2A7238]/30 flex items-center justify-between">
                  <span className="text-xs text-[#2A7238] font-bold">
                    ✓ Link bài đăng thực tế:
                  </span>
                  <a
                    href={previewPost.published_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#2A7238] underline font-bold flex items-center gap-1"
                  >
                    <span>Mở link bài viết</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="text-xs text-[#6B5E55] flex items-center justify-between bg-[#F5EFE6]/50 p-3 rounded-lg">
                <span>Hẹn giờ xuất bản: <strong>{previewPost.scheduled_date} lúc {previewPost.scheduled_time}</strong></span>
                <span>Chi nhánh: <strong>{previewPost.branch_name}</strong></span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between gap-3 mt-2">
              <div>
                {previewPost.status === 'APPROVED' && (
                  <button
                    onClick={() => {
                      const p = previewPost;
                      setPreviewPost(null);
                      handleOpenPublishModal(p);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2B6CB0] text-white text-xs font-bold hover:bg-[#23568c] shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Xác nhận đã đăng bài</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewPost(null)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleCopyCleanText(previewPost)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                    copiedId === previewPost.id
                      ? 'bg-[#2A7238] text-white'
                      : 'bg-[#8B1D24] text-white hover:bg-[#72161C]'
                  }`}
                >
                  {copiedId === previewPost.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã sao chép vào bộ nhớ tạm!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép toàn bộ văn bản</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN ĐÃ XUẤT BẢN THỰC TẾ (BẮT BUỘC PUBLISHED_URL) */}
      {publishingPost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center gap-2 text-[#2B6CB0] font-bold text-base mb-1">
              <ExternalLink className="w-5 h-5" />
              <span>Xác Nhận Đã Xuất Bản Thực Tế</span>
            </div>
            <p className="text-xs text-[#6B5E55] mb-4">
              Bài viết: <strong className="text-[#231F20]">{publishingPost.title}</strong>
            </p>

            <div className="p-3 bg-[#EBF8FF] rounded-xl border border-[#2B6CB0]/20 text-[11px] text-[#2B6CB0] font-medium mb-4">
              ℹ️ Thao tác này sẽ chuyển bài viết sang trạng thái <strong>PUBLISHED</strong> và tự động kích hoạt Trigger cập nhật chỉ tiêu bài đăng thực tế của Chiến dịch.
            </div>

            <form onSubmit={handleConfirmPublish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Link bài đăng thực tế (Facebook / TikTok / YouTube) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://facebook.com/amthucquenha/posts/..."
                  value={publishedUrlInput}
                  onChange={(e) => {
                    setPublishedUrlInput(e.target.value);
                    setPublishError('');
                  }}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#2B6CB0]"
                />
                {publishError && (
                  <p className="text-[11px] text-[#9B1C1C] font-bold mt-1.5">{publishError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setPublishingPost(null)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2B6CB0] hover:bg-[#23568c] rounded-lg shadow-xs"
                >
                  Xác Nhận & Cập Nhật Số Liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TẠO BÀI VIẾT MỚI (Dùng Textarea gọn theo Q5) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E8E2D9] max-h-[92vh] flex flex-col animate-in fade-in">
            <h3 className="text-lg font-bold text-[#8B1D24] mb-1">Soạn Thảo Bài Viết Mới</h3>
            <p className="text-xs text-[#6B5E55] mb-4">
              Soạn thảo văn bản thuần túy theo quyết định Q5 để dễ dàng sao chép dán trực tiếp lên Facebook/TikTok.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Ưu Đãi Tiệc Tân Niên 2027 Tại Ẩm Thực Quê Nhà"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-sm border border-[#D5C9BC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#8B1D24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Kênh xuất bản
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as ContentPostItem['channel'])}
                    className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="FACEBOOK">Facebook</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="ZALO">Zalo OA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Trụ cột nội dung
                  </label>
                  <select
                    value={newPillar}
                    onChange={(e) => setNewPillar(e.target.value)}
                    className="w-full text-xs font-semibold border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Món Ngon Đặc Sản">Món Ngon Đặc Sản</option>
                    <option value="Tiệc & Sự Kiện">Tiệc & Sự Kiện</option>
                    <option value="Không Gian & Phòng VIP">Không Gian & Phòng VIP</option>
                    <option value="Ưu Đãi Khuyến Mãi">Ưu Đãi Khuyến Mãi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                  Nội dung bài viết (Textarea sạch theo Q5) *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Nhập nội dung bài viết, emoji, hashtag..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full text-xs font-mono border border-[#D5C9BC] rounded-lg p-3 focus:outline-none focus:border-[#8B1D24] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Ngày hẹn đăng
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase mb-1">
                    Giờ đăng
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-end gap-2">
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
                  Lưu & Chờ Duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
