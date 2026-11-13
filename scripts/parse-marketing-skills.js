const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, 'external', 'marketingskills', 'skills');

if (!fs.existsSync(SKILLS_DIR)) {
  console.error('Không tìm thấy thư mục skills:', SKILLS_DIR);
  process.exit(1);
}

// Bảng ánh xạ phân nhóm Category chuẩn tiếng Việt cho Quê Nhà
const CATEGORY_MAP = {
  'ad-creative': 'Quảng cáo & Sáng tạo Ads (Meta/TikTok)',
  'ads': 'Chiến lược Quảng cáo Đa kênh',
  'copywriting': 'Nghệ thuật Viết bài & Thuyết phục',
  'content-strategy': 'Chiến lược Nội dung & Lịch xuất bản',
  'ab-testing': 'Tối ưu Chuyển đổi & Đo lường A/B',
  'cro': 'Tối ưu Tỷ lệ Chuyển đổi (CRO)',
  'landing-page': 'Tối ưu Trang đích & Ưu đãi',
  'seo': 'SEO & Tìm kiếm Tự nhiên',
  'ai-seo': 'Tối ưu AI Search & Định vị Thương hiệu (GEO)',
  'competitors': 'Nghiên cứu Đối thủ & Thị trường F&B',
  'competitor-profiling': 'Phân tích Đòn bẩy Cạnh tranh',
  'churn-prevention': 'Giữ chân Khách hàng & Tái đặt bàn',
  'customer-journey': 'Hành trình Trải nghiệm Khách hàng',
  'referral': 'Chương trình Giới thiệu & Khách hàng Thân thiết',
  'pricing-strategy': 'Chiến lược Thực đơn & Giá tiệc',
  'cold-email': 'Tiếp cận Khách đoàn & Doanh nghiệp',
  'email-marketing': 'Email & Tin nhắn CSKH Tự động',
  'community-marketing': 'Phát triển Cộng đồng Thực khách',
  'analytics': 'Phân tích Dữ liệu Marketing & Báo cáo',
  'attribution': 'Đo lường Hiệu quả & Phân bổ Ngân sách'
};

function parseSkillFile(folderName) {
  const filePath = path.join(SKILLS_DIR, folderName, 'SKILL.md');
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf8');

  // Parse YAML Frontmatter
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let name = folderName;
  let description = '';

  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];
    const nameMatch = yaml.match(/name:\s*(.+)/);
    if (nameMatch) name = nameMatch[1].trim();

    const descMatch = yaml.match(/description:\s*"([\s\S]*?)"/) || yaml.match(/description:\s*(.+)/);
    if (descMatch) description = descMatch[1].trim();
  }

  // Tách phần thân Markdown sau frontmatter
  const bodyContent = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();

  // Xác định Category
  let category = CATEGORY_MAP[folderName] || 'Chiến lược & Kỹ năng Marketing Quốc tế';

  // Định nghĩa các biến tương tác tiêu chuẩn
  const variables = [
    { key: 'campaign_goal', label: 'Mục tiêu chiến dịch', placeholder: 'Vd: Đẩy mạnh tiệc tất niên doanh nghiệp cuối năm', required: true },
    { key: 'target_audience', label: 'Đối tượng khách hàng', placeholder: 'Vd: Công ty 20-50 khách hoặc gia đình sum vầy', required: true },
    { key: 'branch_name', label: 'Chi nhánh áp dụng', placeholder: 'Vd: 202-204 Nguyễn Thái Bình hoặc Toàn chuỗi', required: false },
    { key: 'offer_details', label: 'Ưu đãi / Điểm nhấn', placeholder: 'Vd: Tặng gói âm thanh karaoke hoặc giảm 10% thực đơn tiệc', required: false }
  ];

  // Tạo Title thân thiện
  const formattedTitle = name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const titleVi = `[Corey Haines] ${formattedTitle} — Khung Chiến Lược Chuẩn Quốc Tế`;

  // Xây dựng Prompt Template chuẩn tích hợp bối cảnh Quê Nhà
  const promptTemplate = `Bạn là Chuyên gia Marketing Cấp cao áp dụng khung kỹ năng "${formattedTitle}" (từ playbook marketing quốc tế của Corey Haines) cho chuỗi nhà hàng "Ẩm Thực Quê Nhà".

MỤC TIÊU VÀ BỐI CẢNH THỰC THI:
- Kỹ năng áp dụng: ${formattedTitle}
- Nguyên tắc cốt lõi: ${description}
- Mục tiêu cụ thể: {campaign_goal}
- Đối tượng thực khách: {target_audience}
- Chi nhánh: {branch_name}
- Ưu đãi / Điểm nhấn: {offer_details}

HƯỚNG DẪN THỰC HIỆN THEO PLAYBOOK QUỐC TẾ:
${bodyContent.slice(0, 3000)}

YÊU CẦU ĐẦU RA:
1. Đưa ra chiến lược thực thi từng bước (Step-by-step action plan) bám sát văn hóa ẩm thực truyền thống Việt Nam.
2. 03 phương án thông điệp / nội dung mẫu đã tối ưu tâm lý khách hàng (Việt hóa phù hợp với Quê Nhà).
3. Đề xuất chỉ số đo lường hiệu quả (KPIs & Metrics) cụ thể.`;

  return {
    source: 'COREY_SKILLS',
    category,
    title: titleVi,
    description: description || `Kỹ năng marketing chuyên sâu ${formattedTitle} từ thư viện Corey Haines.`,
    prompt_template: promptTemplate,
    variables,
    example_output: `Chiến lược hành động và mẫu nội dung theo khung ${formattedTitle} áp dụng cho Quê Nhà.`,
    is_active: true
  };
}

const folders = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log(`Bắt đầu xử lý ${folders.length} thư mục skills từ Corey Haines...`);

const parsedSkills = [];
for (const folder of folders) {
  const skill = parseSkillFile(folder);
  if (skill) {
    parsedSkills.push(skill);
  }
}

console.log(`Đã parse thành công ${parsedSkills.length} marketing skills!`);

// 1. Xuất file JSON để Client / SSR dùng ngay lập tức
const outputJsonPath = path.join(__dirname, '..', 'src', 'data', 'corey_marketing_skills.json');
fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
fs.writeFileSync(outputJsonPath, JSON.stringify(parsedSkills, null, 2), 'utf8');
console.log(`✓ Đã lưu file JSON tại: ${outputJsonPath}`);

// 2. Xuất file SQL Seed để nạp vào Supabase
function escapeSql(str) {
  if (!str) return "''";
  return "'" + str.replace(/'/g, "''") + "'";
}

const sqlStatements = [
  '-- ==============================================================================',
  '-- 05_corey_marketingskills.sql: Nạp 53 AI Marketing Skills từ Corey Haines',
  '-- Tự động bóc tách và tích hợp bối cảnh chuỗi Ẩm Thực Quê Nhà',
  '-- ==============================================================================\n',
  'INSERT INTO marketing_skills (source, category, title, description, prompt_template, variables, example_output, is_active)',
  'VALUES'
];

const valueRows = parsedSkills.map(s => {
  const varsJson = JSON.stringify(s.variables);
  return `(${escapeSql(s.source)}, ${escapeSql(s.category)}, ${escapeSql(s.title)}, ${escapeSql(s.description)}, ${escapeSql(s.prompt_template)}, ${escapeSql(varsJson)}::jsonb, ${escapeSql(s.example_output)}, true)`;
});

sqlStatements.push(valueRows.join(',\n') + ';');

const outputSqlPath = path.join(__dirname, '..', 'supabase', 'seed', '05_corey_marketingskills.sql');
fs.writeFileSync(outputSqlPath, sqlStatements.join('\n'), 'utf8');
console.log(`✓ Đã tạo file SQL Seed tại: ${outputSqlPath} (${fs.statSync(outputSqlPath).size} bytes)`);
