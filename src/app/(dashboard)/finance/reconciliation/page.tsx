'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  Eye,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Building2,
  Calendar,
  Check,
} from 'lucide-react';
import {
  MisaRowRecord,
  ReconciliationBatch,
  INITIAL_MISA_ROWS,
  INITIAL_BATCH,
  financeService,
} from '@/services/financeService';

export default function MisaReconciliationPage() {
  const [batch, setBatch] = useState<ReconciliationBatch>(INITIAL_BATCH);
  const [rows, setRows] = useState<MisaRowRecord[]>(INITIAL_MISA_ROWS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'MATCHED' | 'DEPOSIT_MISMATCH' | 'ORPHAN_MISA'>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Upload File MISA
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Modal Xem chi tiết đối soát & Bằng chứng UNC
  const [viewingRow, setViewingRow] = useState<MisaRowRecord | null>(null);

  // Thông báo xác nhận thành công
  const [successMessage, setSuccessMessage] = useState('');

  // Lọc danh sách dòng đối soát
  const filteredRows = rows.filter((r) => {
    if (selectedFilter !== 'ALL' && r.status !== selectedFilter) return false;
    if (selectedBranch !== 'all' && r.branch_code !== selectedBranch) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase().trim();
      const matchVoucher = r.voucher_no.toLowerCase().includes(q);
      const matchCustomer = r.customer_name.toLowerCase().includes(q);
      const matchPhone = r.customer_phone?.includes(q);
      const matchBooking = r.crm_booking_code?.toLowerCase().includes(q);
      if (!matchVoucher && !matchCustomer && !matchPhone && !matchBooking) return false;
    }
    return true;
  });

  // Tính toán nhanh số liệu
  const matchedCount = rows.filter((r) => r.status === 'MATCHED').length;
  const mismatchCount = rows.filter((r) => r.status === 'DEPOSIT_MISMATCH').length;
  const orphanCount = rows.filter((r) => r.status === 'ORPHAN_MISA').length;

  // Xác nhận đợt đối soát vào Sổ Cái Tài Chính (Chốt chặn 3)
  const handleConfirmBatch = async () => {
    if (batch.batch_status === 'CONFIRMED') return;
    const res = await financeService.confirmBatch(batch.id);
    setBatch({ ...batch, batch_status: 'CONFIRMED' });
    setSuccessMessage(res.message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Giả lập tải file Excel mới
  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      setBatch({
        ...batch,
        file_name: uploadFileName,
        file_hash_md5: '9b71d224bd62f3785d96d4fbda982ced',
        uploaded_at: 'Vừa xong',
        batch_status: 'STAGING',
      });
      setUploadFileName('');
      setSuccessMessage('Đã tải lên và băm mã MD5 thành công! Hệ thống đã tự động chạy thuật toán 3 chốt chặn.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Thông báo Alert thành công */}
      {successMessage && (
        <div className="p-4 bg-[#EAF5EC] border-2 border-[#2A7238] rounded-xl text-xs font-bold text-[#2A7238] flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2A7238]" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-[#2A7238] hover:underline">
            ✕ Đóng
          </button>
        </div>
      )}

      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#231F20] tracking-tight">
              Đối Soát Doanh Thu MISA (Reconciliation Engine)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1D24] text-white">
              Module 7
            </span>
          </div>
          <p className="text-sm text-[#6B5E55] mt-1">
            Kiểm soát 3 chốt chặn tự động giữa Báo cáo Kế toán MISA SME và Phễu Đặt Tiệc CRM Quê Nhà.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5C9BC] bg-white text-[#231F20] font-bold text-xs hover:bg-[#FAF7F2] transition-colors shadow-xs"
          >
            <UploadCloud className="w-4 h-4 text-[#8B1D24]" />
            <span>Nạp File Sao Kê MISA</span>
          </button>

          <button
            onClick={handleConfirmBatch}
            disabled={batch.batch_status === 'CONFIRMED'}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors text-white ${
              batch.batch_status === 'CONFIRMED'
                ? 'bg-emerald-700 cursor-not-allowed opacity-90'
                : 'bg-[#8B1D24] hover:bg-[#72161C]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {batch.batch_status === 'CONFIRMED'
                ? 'Đã Duyệt Vào Sổ Cái'
                : 'Xác Nhận Chốt Đối Soát'}
            </span>
          </button>
        </div>
      </div>

      {/* Thẻ Thông Tin Đợt Nạp & 3 Chốt Chặn */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 border-b border-[#E8E2D9]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F7EAEB] text-[#8B1D24] flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#231F20]">{batch.file_name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    batch.batch_status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {batch.batch_status === 'CONFIRMED' ? 'ĐÃ DUYỆT SỔ CÁI' : 'VÙNG ĐỆM STAGING'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B5E55] mt-1 font-medium">
                <span>Mã đợt: <strong className="font-mono text-[#8B1D24]">{batch.batch_code}</strong></span>
                <span>•</span>
                <span>Người nạp: <strong>{batch.uploaded_by}</strong> ({batch.uploaded_at})</span>
                <span>•</span>
                <span className="font-mono text-[11px] text-[#A09383]" title="Chốt chặn 1: Mã băm MD5 chống nạp trùng file">
                  MD5: {batch.file_hash_md5.slice(0, 12)}...
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-xs">
              <div className="text-[#A09383]">Tổng Doanh Thu Sao Kê:</div>
              <div className="font-mono font-black text-base text-[#231F20]">
                {batch.total_revenue_misa.toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>
        </div>

        {/* 3 Thống kê chốt chặn */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Chốt 1: Khớp 100% */}
          <div
            onClick={() => setSelectedFilter('MATCHED')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedFilter === 'MATCHED'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-[#FAF7F2] border-[#E8E2D9] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>CHỐT 1: KHỚP 100%</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 font-mono">
                {matchedCount} hóa đơn
              </span>
            </div>
            <p className="text-[11px] text-[#6B5E55] mt-1">
              Tiền cọc CRM trùng khớp hoàn toàn với số tiền vào sổ MISA.
            </p>
          </div>

          {/* Chốt 2: Lệch tiền cọc */}
          <div
            onClick={() => setSelectedFilter('DEPOSIT_MISMATCH')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedFilter === 'DEPOSIT_MISMATCH'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-[#FAF7F2] border-[#E8E2D9] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>CHỐT 2: LỆCH TIỀN CỌC</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 font-mono">
                {mismatchCount} hóa đơn
              </span>
            </div>
            <p className="text-[11px] text-[#6B5E55] mt-1">
              CRM ghi nhận cọc nhưng MISA chưa vào hoặc số tiền không khớp.
            </p>
          </div>

          {/* Chốt 3: Tiệc ngoài luồng */}
          <div
            onClick={() => setSelectedFilter('ORPHAN_MISA')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedFilter === 'ORPHAN_MISA'
                ? 'bg-red-50 border-red-500 ring-2 ring-red-500/20'
                : 'bg-[#FAF7F2] border-[#E8E2D9] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-red-800 mb-1">
              <span className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>CHỐT 3: NGOÀI LUỒNG</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 font-mono">
                {orphanCount} nghi vấn
              </span>
            </div>
            <p className="text-[11px] text-[#6B5E55] mt-1">
              MISA xuất hóa đơn tiệc nhưng CRM không hề có dữ liệu booking!
            </p>
          </div>
        </div>
      </div>

      {/* Bộ Lọc & Tìm Kiếm */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-[#8B1D24] text-white'
                : 'bg-[#FAF7F2] text-[#6B5E55] hover:bg-[#F5EFE6]'
            }`}
          >
            Tất Cả ({rows.length})
          </button>
          <button
            onClick={() => setSelectedFilter('MATCHED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              selectedFilter === 'MATCHED'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Khớp 100% ({matchedCount})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('DEPOSIT_MISMATCH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              selectedFilter === 'DEPOSIT_MISMATCH'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Lệch Cọc ({mismatchCount})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('ORPHAN_MISA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              selectedFilter === 'ORPHAN_MISA'
                ? 'bg-red-700 text-white'
                : 'bg-red-50 text-red-800 hover:bg-red-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Nghi Vấn Ngoài Luồng ({orphanCount})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A09383]" />
            <input
              type="text"
              placeholder="Tìm theo số HĐ, tên khách, SĐT, mã tiệc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs border border-[#D5C9BC] rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:border-[#8B1D24]"
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs font-semibold border border-[#D5C9BC] rounded-lg px-2.5 py-1.5 bg-white"
          >
            <option value="all">Tất cả chi nhánh</option>
            <option value="QN_PNT">Phạm Ngọc Thạch (Q3)</option>
            <option value="QN_TT">Thành Thái (Q10)</option>
            <option value="QN_NTB">Nguyễn Thái Bình (Tân Bình)</option>
          </select>
        </div>
      </div>

      {/* Bảng Dữ Liệu Đối Soát Chi Tiết */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E8E2D9] text-left text-xs">
            <thead className="bg-[#FAF7F2] font-bold text-[#6B5E55] uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Số HĐ / Ngày MISA</th>
                <th className="px-4 py-3">Chi Nhánh</th>
                <th className="px-4 py-3">Khách Hàng / SĐT</th>
                <th className="px-4 py-3">Mã Tiệc CRM</th>
                <th className="px-4 py-3 text-right">Doanh Thu MISA</th>
                <th className="px-4 py-3 text-right">Cọc MISA</th>
                <th className="px-4 py-3 text-right">Cọc CRM (UNC)</th>
                <th className="px-4 py-3 text-center">Trạng Thái Đối Soát</th>
                <th className="px-4 py-3 text-center">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9] bg-white">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-xs text-[#A09383]">
                    Không tìm thấy bản ghi đối soát nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#FAF7F2] transition-colors ${
                      row.status === 'ORPHAN_MISA'
                        ? 'bg-red-50/40'
                        : row.status === 'DEPOSIT_MISMATCH'
                        ? 'bg-amber-50/30'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-[#231F20]">
                      <div>{row.voucher_no}</div>
                      <div className="text-[10px] text-[#A09383] font-sans font-normal flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{row.voucher_date}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#8B1D24]">{row.branch_name}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-[#231F20]">{row.customer_name}</div>
                      {row.customer_phone && (
                        <div className="text-[10px] font-mono text-[#6B5E55]">
                          SĐT: {row.customer_phone}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {row.crm_booking_code ? (
                        <span className="font-mono font-bold text-[#8B1D24] bg-[#F7EAEB] px-2 py-0.5 rounded text-[11px]">
                          {row.crm_booking_code}
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-600 font-bold bg-red-100 px-1.5 py-0.5 rounded">
                          Không có trên CRM
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-[#231F20]">
                      {row.total_revenue.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-semibold text-[#6B5E55]">
                      {row.misa_deposited.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-[#2A7238]">
                      {row.crm_deposited.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="px-4 py-3 text-center">
                      {row.status === 'MATCHED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Khớp 100%</span>
                        </span>
                      ) : row.status === 'DEPOSIT_MISMATCH' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800" title={`Lệch ${Math.abs(row.discrepancy_amount).toLocaleString('vi-VN')} đ`}>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Lệch cọc ({row.discrepancy_amount > 0 ? '+' : ''}{(row.discrepancy_amount / 1000000).toFixed(1)}tr)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 animate-pulse">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Nghi Vấn Ngoài Luồng</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setViewingRow(row)}
                        className="p-1.5 text-[#8B1D24] hover:bg-[#F7EAEB] rounded-lg transition-colors"
                        title="Xem chi tiết & đối soát"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐỐI SOÁT & BẰNG CHỨNG UNC */}
      {viewingRow && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#8B1D24]" />
                <h3 className="font-bold text-base text-[#8B1D24]">
                  Chi Tiết Đối Soát Chứng Từ {viewingRow.voucher_no}
                </h3>
              </div>
              <button
                onClick={() => setViewingRow(null)}
                className="text-[#A09383] hover:text-[#231F20] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8E2D9] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6B5E55]">Chi nhánh:</span>
                  <strong className="text-[#8B1D24]">{viewingRow.branch_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5E55]">Khách hàng:</span>
                  <strong>{viewingRow.customer_name} ({viewingRow.customer_phone || 'Không có SĐT'})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5E55]">Mã tiệc CRM liên kết:</span>
                  <strong className="font-mono text-[#8B1D24]">{viewingRow.crm_booking_code || 'Chưa liên kết'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5E55]">Tổng doanh thu MISA:</span>
                  <strong className="font-mono text-sm text-[#231F20]">
                    {viewingRow.total_revenue.toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>

              {/* Bảng so sánh Tiền Cọc */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-[#E8E2D9]">
                <div className="p-2.5 rounded-lg bg-[#FAF7F2]">
                  <div className="text-[10px] uppercase font-bold text-[#6B5E55]">Cọc MISA Đã Vào Sổ:</div>
                  <div className="font-mono text-base font-bold text-[#231F20] mt-1">
                    {viewingRow.misa_deposited.toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#EAF5EC]">
                  <div className="text-[10px] uppercase font-bold text-[#2A7238]">Cọc CRM (Có UNC):</div>
                  <div className="font-mono text-base font-bold text-[#2A7238] mt-1">
                    {viewingRow.crm_deposited.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>

              {/* Nhận xét đối soát */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  viewingRow.status === 'MATCHED'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : viewingRow.status === 'DEPOSIT_MISMATCH'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                <div className="font-bold uppercase text-[11px] mb-1">
                  💡 Nhận xét thuật toán 3 Chốt Chặn:
                </div>
                <div>{viewingRow.note}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setViewingRow(null)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Đóng
                </button>
                {viewingRow.status === 'DEPOSIT_MISMATCH' && (
                  <button
                    onClick={() => {
                      alert('Đã gửi thông báo yêu cầu Kế toán chi nhánh đối chiếu sao kê ngân hàng!');
                      setViewingRow(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                  >
                    Yêu Cầu Rà Soát UNC
                  </button>
                )}
                {viewingRow.status === 'ORPHAN_MISA' && (
                  <button
                    onClick={() => {
                      alert('Đã tạo phiếu kiểm toán khẩn cấp gửi Giám Đốc Chi Nhánh yêu cầu giải trình tiệc ngoài luồng!');
                      setViewingRow(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg"
                  >
                    Báo Cáo BGĐ Khẩn Cấp
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NẠP FILE SAO KÊ MISA */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2D9] animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#8B1D24]" />
                <h3 className="font-bold text-base text-[#8B1D24]">Nạp Dữ Liệu Sao Kê MISA</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#A09383] hover:text-[#231F20] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#6B5E55] uppercase mb-1">
                  Chọn Kỳ Kế Toán Đối Soát *
                </label>
                <input
                  type="month"
                  defaultValue="2026-11"
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6B5E55] uppercase mb-1">
                  Tên File Xuất Từ MISA SME (.xlsx, .csv) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vd: MISA_SME_DoanhThu_202611_Dot2.xlsx"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full text-xs border border-[#D5C9BC] rounded-lg px-3 py-2"
                />
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] text-[11px] text-[#6B5E55] space-y-1">
                <div className="font-bold text-[#8B1D24]">🛡️ Chốt Chặn 1 (Chống Nạp Trùng):</div>
                <div>Hệ thống sẽ băm mã MD5 toàn bộ file. Nếu phát hiện file này đã được đối soát trước đó, hệ thống sẽ từ chối nạp để bảo vệ toàn vẹn tài chính.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B5E55] hover:bg-[#F5EFE6] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#8B1D24] hover:bg-[#72161C] rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Xử Lý & Chạy 3 Chốt...</span>
                    </>
                  ) : (
                    <span>Tải Lên & Chạy Đối Soát</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
