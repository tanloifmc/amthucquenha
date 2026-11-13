-- ==============================================================================
-- 0002_marketing.sql: Phân hệ Quản lý Chiến dịch, Đầu việc, Content & AI Skills
-- Phiên bản v1.1 - Ràng buộc chặt chẽ, hỗ trợ đo lường Plan vs Actual
-- ==============================================================================

-- 1. CHIẾN DỊCH MARKETING (Campaigns)
CREATE TABLE IF NOT EXISTS campaigns (
  id                   BIGSERIAL PRIMARY KEY,
  branch_id            BIGINT REFERENCES branches(id),  -- NULL = Áp dụng toàn chuỗi 4 chi nhánh
  name                 TEXT NOT NULL,
  objective            TEXT,
  start_date           DATE,
  end_date             DATE,
  target_posts         INT DEFAULT 0,
  target_leads         INT DEFAULT 0,
  planned_budget       NUMERIC(15,0) DEFAULT 0,
  actual_posts         INT DEFAULT 0,     -- Trigger cập nhật khi content PUBLISHED
  actual_leads         INT DEFAULT 0,     -- Trigger cập nhật khi booking link chiến dịch
  actual_budget        NUMERIC(15,0) DEFAULT 0,  -- Từ đối soát financial_records
  campaign_status      VARCHAR(30) DEFAULT 'PLANNING', -- Ref system_lookups group=CAMPAIGN_STATUS
  created_by           UUID REFERENCES profiles(id),
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- 2. ĐẦU VIỆC MARKETING (Tasks - Task Engine)
CREATE TABLE IF NOT EXISTS tasks (
  id                BIGSERIAL PRIMARY KEY,
  campaign_id       BIGINT REFERENCES campaigns(id) ON DELETE SET NULL,
  is_adhoc          BOOLEAN DEFAULT false,  -- true nếu là việc phát sinh đột xuất không theo chiến dịch
  title             TEXT NOT NULL,
  description       TEXT,
  assignee_id       UUID REFERENCES profiles(id),
  reviewer_id       UUID REFERENCES profiles(id),
  branch_id         BIGINT REFERENCES branches(id),
  due_date          DATE,
  original_due_date DATE,  -- Lưu hạn gốc khi có dời deadline
  delay_reason      TEXT,  -- Bắt buộc điền khi dời due_date
  task_status       VARCHAR(30) DEFAULT 'TODO', -- Ref system_lookups group=TASK_STATUS
  proof_url         TEXT,  -- Link sản phẩm / bằng chứng khi nộp duyệt
  created_by        UUID REFERENCES profiles(id),
  created_at        TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_adhoc_campaign CHECK (
    is_adhoc = true OR campaign_id IS NOT NULL
  )
);

-- 2.1 BẢNG LƯU VẾT DỜI HẠN TASK (Task Variance Logs - Phục vụ kiểm soát kỷ luật & KPI)
CREATE TABLE IF NOT EXISTS task_variance_logs (
  id             BIGSERIAL PRIMARY KEY,
  task_id        BIGINT REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  changed_by     UUID REFERENCES profiles(id),
  old_due_date   DATE NOT NULL,
  new_due_date   DATE NOT NULL,
  delay_reason   TEXT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- 3. XƯỞNG CONTENT & BÀI ĐĂNG (Content Posts)
CREATE TABLE IF NOT EXISTS content_posts (
  id             BIGSERIAL PRIMARY KEY,
  campaign_id    BIGINT REFERENCES campaigns(id) ON DELETE SET NULL,
  task_id        BIGINT REFERENCES tasks(id) ON DELETE SET NULL,
  branch_id      BIGINT REFERENCES branches(id),  -- NULL = Bài đăng toàn chuỗi
  channel        VARCHAR(30) NOT NULL,            -- Ref system_lookups group=CHANNEL
  pillar         VARCHAR(100),                    -- Trụ cột nội dung (Món ngon, Không gian, Ưu đãi...)
  title          TEXT,
  body_draft     TEXT,
  media_links    JSONB DEFAULT '[]'::jsonb,      -- Danh sách hình ảnh, video [{url, type, drive_id}]
  scheduled_at   TIMESTAMPTZ,
  published_at   TIMESTAMPTZ,
  published_url  TEXT,
  content_status VARCHAR(30) DEFAULT 'DRAFT',     -- Ref system_lookups group=CONTENT_STATUS
  approved_by    UUID REFERENCES profiles(id),
  approved_at    TIMESTAMPTZ,
  created_by     UUID REFERENCES profiles(id),
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- 4. THƯ VIỆN KỸ NĂNG AI (AI Marketing Skills - Module 4 tách riêng)
CREATE TABLE IF NOT EXISTS marketing_skills (
  id               BIGSERIAL PRIMARY KEY,
  source           VARCHAR(30) NOT NULL DEFAULT 'CUSTOM',  -- CUSTOM | PROMPTS_CHAT | COREY_SKILLS
  category         VARCHAR(100),                          -- Nhóm kỹ năng (Viết bài, Ý tưởng, Khuyến mãi...)
  title            TEXT NOT NULL,
  description      TEXT,
  prompt_template  TEXT NOT NULL,
  variables        JSONB DEFAULT '[]'::jsonb,             -- [{key, label, placeholder, required}]
  example_output   TEXT,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Index truy vấn nhanh
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(task_status);
CREATE INDEX IF NOT EXISTS idx_variance_task ON task_variance_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content_posts(content_status);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(campaign_status);

-- ★ TRIGGER: Tự động cập nhật campaigns.actual_posts khi bài viết PUBLISHED
CREATE OR REPLACE FUNCTION update_campaign_actual_posts()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.content_status = 'PUBLISHED' AND NEW.campaign_id IS NOT NULL) THEN
    UPDATE campaigns
    SET actual_posts = actual_posts + 1
    WHERE id = NEW.campaign_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.content_status != 'PUBLISHED' AND NEW.content_status = 'PUBLISHED' AND NEW.campaign_id IS NOT NULL) THEN
      UPDATE campaigns
      SET actual_posts = actual_posts + 1
      WHERE id = NEW.campaign_id;
    ELSIF (OLD.content_status = 'PUBLISHED' AND NEW.content_status != 'PUBLISHED' AND OLD.campaign_id IS NOT NULL) THEN
      UPDATE campaigns
      SET actual_posts = GREATEST(0, actual_posts - 1)
      WHERE id = OLD.campaign_id;
    END IF;
  ELSIF (TG_OP = 'DELETE' AND OLD.content_status = 'PUBLISHED' AND OLD.campaign_id IS NOT NULL) THEN
    UPDATE campaigns
    SET actual_posts = GREATEST(0, actual_posts - 1)
    WHERE id = OLD.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_content_published ON content_posts;
CREATE TRIGGER trg_content_published
AFTER INSERT OR UPDATE OR DELETE ON content_posts
FOR EACH ROW EXECUTE FUNCTION update_campaign_actual_posts();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — CHUẨN HÓA CẤP TOÀN CHUỖI & THEO CHI NHÁNH
-- ==============================================================================

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_variance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY p_variance_select ON task_variance_logs FOR SELECT USING (true);
CREATE POLICY p_variance_insert ON task_variance_logs FOR INSERT WITH CHECK (true);

-- 1. CAMPAIGNS: Xem được nếu bản ghi cấp chuỗi (branch_id IS NULL) hoặc có quyền chi nhánh
CREATE POLICY p_campaigns_select ON campaigns
  FOR SELECT USING (
    branch_id IS NULL OR can_access_branch(auth.uid(), branch_id)
  );

CREATE POLICY p_campaigns_write ON campaigns
  FOR ALL USING (
    has_permission(auth.uid(), 'MARKETING', 'MANAGE_CAMPAIGNS')
    AND (branch_id IS NULL OR can_access_branch(auth.uid(), branch_id))
  );

-- 2. TASKS: Xem được nếu task toàn chuỗi, hoặc thuộc chi nhánh được phân công, hoặc là người được giao việc
CREATE POLICY p_tasks_select ON tasks
  FOR SELECT USING (
    branch_id IS NULL 
    OR can_access_branch(auth.uid(), branch_id)
    OR assignee_id = auth.uid()
  );

CREATE POLICY p_tasks_write ON tasks
  FOR ALL USING (
    has_permission(auth.uid(), 'MARKETING', 'MANAGE_TASKS')
    OR assignee_id = auth.uid()
  );

-- 3. CONTENT POSTS: Xem bài viết nếu thuộc toàn chuỗi hoặc chi nhánh được gán
CREATE POLICY p_content_posts_select ON content_posts
  FOR SELECT USING (
    branch_id IS NULL OR can_access_branch(auth.uid(), branch_id)
  );

CREATE POLICY p_content_posts_write ON content_posts
  FOR ALL USING (
    has_permission(auth.uid(), 'MARKETING', 'MANAGE_CONTENT')
    AND (branch_id IS NULL OR can_access_branch(auth.uid(), branch_id))
  );

-- 4. MARKETING SKILLS: Thư viện trí tuệ nội bộ dùng chung cho toàn bộ nhân viên active
CREATE POLICY p_marketing_skills_select ON marketing_skills
  FOR SELECT USING (
    is_active = true
  );

CREATE POLICY p_marketing_skills_write ON marketing_skills
  FOR ALL USING (
    has_permission(auth.uid(), 'MARKETING', 'MANAGE_SKILLS')
  );


