/**
 * lookupService.ts
 * Quản lý nạp danh mục động từ /api/lookups hoặc Supabase trực tiếp
 * Tuyệt đối không hardcode danh mục vào UI/logic
 */

export interface SystemLookupItem {
  id?: number;
  group_code: string;
  value_code: string;
  label_vi: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

export interface BranchItem {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
}

export interface CampaignLookupItem {
  id: number;
  code: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
}

// Fallback Branches chuẩn 3 chi nhánh chính thức của Quê Nhà
export const FALLBACK_BRANCHES: BranchItem[] = [
  {
    id: 1,
    code: 'QN_PNT',
    name: 'Quê Nhà - Phạm Ngọc Thạch',
    address: '28 Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    phone: '0938 226 166',
    is_active: true,
  },
  {
    id: 2,
    code: 'QN_TT',
    name: 'Quê Nhà - Thành Thái',
    address: '01 Thành Thái, Phường 14, Quận 10, TP.HCM',
    phone: '0968 226 166',
    is_active: true,
  },
  {
    id: 3,
    code: 'QN_NTB',
    name: 'Quê Nhà - Nguyễn Thái Bình',
    address: '52A Nguyễn Thái Bình, Phường 4, Tân Bình, TP.HCM',
    phone: '0901 026 026',
    is_active: true,
  },
];

export const FALLBACK_CAMPAIGNS: CampaignLookupItem[] = [
  {
    id: 1,
    code: 'CAMP_TET2026',
    name: 'Mùa Tiệc Tất Niên & Tân Niên 2026',
    status: 'ACTIVE',
    start_date: '2026-11-01',
    end_date: '2027-01-25',
  },
  {
    id: 2,
    code: 'CAMP_VIP_CAKHO',
    name: 'Không Gian Phòng VIP & Cá Kho Niêu',
    status: 'ACTIVE',
    start_date: '2026-11-10',
    end_date: '2026-12-31',
  },
  {
    id: 3,
    code: 'CAMP_SINHNHAT',
    name: 'Quảng Bá Tiệc Sinh Nhật & Thôi Nôi Quê Nhà',
    status: 'PLANNING',
    start_date: '2026-12-01',
    end_date: '2027-02-28',
  },
];

export const lookupService = {
  /**
   * Lấy danh mục theo group_code từ API /api/lookups
   */
  async getLookupsByGroup(groupCode: string): Promise<SystemLookupItem[]> {
    try {
      const res = await fetch(`/api/lookups?group=${encodeURIComponent(groupCode)}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Lấy danh sách chi nhánh (Hỗ trợ fallback 3 chi nhánh chuẩn)
   */
  async getBranches(): Promise<BranchItem[]> {
    return FALLBACK_BRANCHES;
  },

  /**
   * Lấy danh sách chiến dịch đang chạy để gắn vào task / content
   */
  async getActiveCampaigns(): Promise<CampaignLookupItem[]> {
    return FALLBACK_CAMPAIGNS;
  },
};
