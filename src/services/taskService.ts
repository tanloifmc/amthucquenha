/**
 * taskService.ts
 * Quản lý công việc Marketing, Kéo thả Kanban, Nộp duyệt bằng chứng và Ghi vết dời hạn
 */

export interface TaskRecord {
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

export interface TaskVarianceLogRecord {
  id?: number;
  task_id: number;
  task_title: string;
  changed_by: string;
  old_date: string;
  new_date: string;
  reason: string;
  created_at?: string;
}

export const taskService = {
  /**
   * Cập nhật trạng thái task (Hỗ trợ nộp duyệt kèm Proof URL)
   */
  async updateStatus(
    taskId: number,
    status: TaskRecord['status'],
    proofUrl?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Khi cắm Supabase:
      // const supabase = createClient();
      // await supabase.from('tasks').update({ task_status: status, proof_url: proofUrl }).eq('id', taskId);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật task';
      return { success: false, error: msg };
    }
  },

  /**
   * Dời deadline task kèm ghi vết vào task_variance_logs
   */
  async delayDeadline(
    variance: TaskVarianceLogRecord
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Khi cắm Supabase:
      // 1. Update task due_date & delay_reason
      // 2. Insert into task_variance_logs
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi dời hạn task';
      return { success: false, error: msg };
    }
  },
};
