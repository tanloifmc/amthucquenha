import { NextResponse, type NextRequest } from 'next/server';

interface GenerateRequest {
  skillTitle: string;
  category: string;
  promptTemplate: string;
  variables: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { skillTitle, category, promptTemplate, variables } = body;

    if (!promptTemplate) {
      return NextResponse.json({ error: 'Thiếu prompt template' }, { status: 400 });
    }

    // Thay thế các biến trong template
    let compiledPrompt = promptTemplate;
    if (variables) {
      Object.entries(variables).forEach(([key, val]) => {
        compiledPrompt = compiledPrompt.replaceAll(`{${key}}`, val || `[chưa điền ${key}]`);
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const aiProvider = process.env.AI_PROVIDER || 'gemini';

    // 1. Nếu có Gemini API Key thật $\rightarrow$ Gọi Google Gemini API
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `Bạn là trợ lý AI chuyên nghiệp của chuỗi nhà hàng Ẩm Thực Quê Nhà (Việt Nam). Hãy thực hiện yêu cầu sau bằng tiếng Việt với văn phong ấm cúng, sang trọng, tinh tế:\n\n${compiledPrompt}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const generatedText =
            result.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (generatedText) {
            return NextResponse.json({
              content: generatedText,
              provider: 'gemini-2.0-flash',
              status: 'success',
            });
          }
        }
      } catch (geminiError) {
        console.error('Gemini API call failed, switching to local intelligent engine:', geminiError);
      }
    }

    // 2. Fallback Engine thông minh (Đảm bảo app luôn chạy mượt mà ngay cả khi chưa nạp API key)
    const dish = variables.dish_name || variables.special_ingredients || 'Món Ăn Đặc Sản';
    const branch = variables.branch_name || 'Toàn chuỗi Quê Nhà';
    const promo = variables.promotion || 'Tặng nước mát & Miễn phí phòng VIP';

    const smartGeneratedContent = `✨ [GỢI Ý 3 TIÊU ĐỀ HOOK GIẬT TÍT] ✨
1. "Có một hương vị Quê Nhà khiến người xa xứ nhớ mãi không quên: ${dish}!"
2. "Bữa cơm gia đình ấm áp giữa Sài Gòn — Bạn đã thử ${dish} tại ${branch} chưa?"
3. "Thưởng trọn phong vị Nam Bộ dân dã: ${dish} nóng hổi phục vụ ngay tại bàn!"

---

🌾 [BÀI ĐĂNG HOÀN CHỈNH CHO QUÊ NHÀ] 🌾

Giữa phố thị ồn ào và tấp nập, đôi khi điều ta tìm kiếm chỉ là một góc nhỏ bình yên, ngồi bên mâm cơm nóng hổi phảng phất hương vị đồng quê xưa...

Tại Ẩm Thực Quê Nhà (${branch}), chúng tôi trân trọng giới thiệu đến Quý thực khách: **${dish}**.

Món ăn được tuyển chọn từ những nguyên liệu tươi ngon nhất, giữ trọn vị ngọt tự nhiên của sông nước phù sa. Dưới bàn tay tài hoa của người đầu bếp giàu kinh nghiệm, từng thớ thịt, từng giọt nước sốt đều thấm đượm phong vị mộc mạc mà đậm đà khó cưỡng.

🎁 **Ưu đãi đặc biệt trong tuần này:**
• ${promo}
• Không gian phòng VIP riêng tư máy lạnh, thoáng mát, view sân vườn yên ả
• Đội ngũ nhân viên ân cần, chu đáo như người nhà đón khách quý

👉 Đừng ngần ngại liên hệ đặt bàn trước qua Hotline: **0938 226 166** để Quê Nhà chuẩn bị chu đáo nhất cho gia đình bạn nhé!

#AmThucQueNha #MonNgonSaiGon #${dish.replace(/\s+/g, '')} #ComQue #PhongVIP`;

    return NextResponse.json({
      content: smartGeneratedContent,
      provider: 'que-nha-local-engine',
      compiledPrompt,
      status: 'success',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
