/**
 * contentService.ts
 * Quản lý bài đăng Marketing, Lên lịch xuất bản, Duyệt bài và Xác nhận xuất bản thực tế
 */

export interface ContentRecord {
  id: number;
  campaign_id: number | null;
  campaign_name: string;
  branch_name: string;
  channel: 'FACEBOOK' | 'TIKTOK' | 'YOUTUBE' | 'INSTAGRAM' | 'ZALO';
  pillar: string;
  title: string;
  body_draft: string;
  media_urls: string[];
  scheduled_date: string;
  scheduled_time: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED';
  published_url?: string;
  author_name: string;
}

export const contentService = {
  /**
   * Duyệt bài viết
   */
  async approvePost(postId: number): Promise<{ success: boolean; error?: string }> {
    try {
      // Khi cắm Supabase:
      // const supabase = createClient();
      // await supabase.from('content_posts').update({ content_status: 'APPROVED' }).eq('id', postId);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi duyệt bài';
      return { success: false, error: msg };
    }
  },

  /**
   * Xác nhận đã xuất bản thực tế kèm link (Kích hoạt Trigger DB actual_posts += 1)
   */
  async publishPost(
    postId: number,
    publishedUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Khi cắm Supabase:
      // const supabase = createClient();
      // await supabase.from('content_posts').update({
      //   content_status: 'PUBLISHED',
      //   published_url: publishedUrl,
      //   published_at: new Date().toISOString()
      // }).eq('id', postId);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi xuất bản bài viết';
      return { success: false, error: msg };
    }
  },
};
