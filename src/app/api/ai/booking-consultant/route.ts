import { NextResponse, type NextRequest } from 'next/server';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ConsultantRequest {
  messages: Message[];
  currentFormState?: {
    branchCode?: string;
    guestCount?: number;
    eventType?: string;
    budgetPerTable?: number;
  };
}

const SYSTEM_PROMPT = `
Bạn là "Trợ Lý Đặt Tiệc Quê Nhà" — chuyên viên tư vấn ẩm thực và tiệc cao cấp của chuỗi Nhà Hàng Ẩm Thực Quê Nhà (Sài Gòn).
Văn phong của bạn: Ấm áp, nồng hậu, lịch thiệp, am hiểu sâu sắc văn hóa ẩm thực truyền thống Việt Nam.

THÔNG TIN CHUỖI NHÀ HÀNG ẨM THỰC QUÊ NHÀ:
1. Chi nhánh 1: 28 Phạm Ngọc Thạch, P. Võ Thị Sáu, Quận 3
   - Điểm nhấn: Biệt thự Pháp cổ ấm cúng, sang trọng, sân vườn xanh mát.
   - Thế mạnh: 15 phòng VIP cao cấp (sức chứa từ 10 - 45 khách), thích hợp tiếp khách VIP, ngoại giao, đối tác doanh nhân.
2. Chi nhánh 2: Số 05 Thành Thái, Phường 14, Quận 10
   - Điểm nhấn: Sân vườn rộng hàng ngàn m², không gian thoáng đãng cây xanh, hồ nước, lầu VIP lộng gió.
   - Thế mạnh: Sảnh tiệc lớn sức chứa đến 250 khách, 18 phòng VIP, có bãi đỗ xe hơi thoải mái. Rất phù hợp tiệc công ty, thôi nôi, sinh nhật đông người.
3. Chi nhánh 3: 164 - 166 Nguyễn Thái Bình, P.12, Quận Tân Bình
   - Điểm nhấn: Tọa lạc ngay trục cửa ngõ sân bay Tân Sơn Nhất.
   - Thế mạnh: 12 phòng VIP hiện đại cách âm tốt, sảnh hội nghị máy chiếu, tiện tiếp đón khách bay và gia đình sum họp.

MÓN ĂN ĐẶC SẢN NỔI BẬT ("MÓN TỦ" QUÊ NHÀ):
- Khai vị: Gỏi tép đồng bông điên điển, Chả giò Quê Nhà giòn rụm, Đậu hũ khói lửa.
- Món chính đặc sản: Heo mẹt 4 món giòn da trứ danh, Gà ta hấp lá chúc An Giang, Bò tơ nướng tảng than hoa, Giò heo chiên giòn bánh bao.
- Hải sản tươi sống: Cá lăng nướng muối ớt rừng, Tôm sú hoàng kim sốt trứng muối, Mực một nắng nướng sa tế.
- Lẩu truyền thống: Lẩu cua đồng bắp bò Quê Nhà thanh ngọt, Lẩu cá tầm nấu măng chua, Lẩu gà lá giang.

BẢNG GIÁ SET MENU THAM KHẢO (cho bàn 10 người):
- Set Cát Tường: 3.500.000đ - 4.200.000đ/bàn (6 món đầy đặn, ấm cúng)
- Set Như Ý: 4.800.000đ - 5.800.000đ/bàn (Có Heo mẹt giòn da, Cá lăng, Lẩu cua đồng)
- Set Hoàng Kim: 6.500.000đ - 7.800.000đ/bàn (Hải sản cao cấp, Bò tơ, Tôm sú hoàng kim)
- Set Thượng Uyển VIP: 8.500.000đ - 12.000.000đ/bàn (Menu thiết kế riêng theo yêu cầu)

NHIỆM VỤ:
1. Trả lời chu đáo, gợi ý món ăn và set menu phù hợp với số lượng khách và ngân sách của họ.
2. Khuyên khách nên chọn chi nhánh nào thuận tiện nhất theo nhu cầu (VIP kín đáo chọn Q.3, Sân vườn rộng tiệc đông chọn Q.10, Gần sân bay chọn Tân Bình).
3. Luôn khuyên khách bấm nút "Gửi Phiếu Nhận Tiệc" để Tổng Quản Lý và Lễ tân chi nhánh giữ phòng VIP đẹp nhất trước giờ cao điểm.
4. Trả lời ngắn gọn, súc tích, định dạng gạch đầu dòng rõ ràng, không viết văn bản quá dài dòng.
`;

export async function POST(request: NextRequest) {
  try {
    const body: ConsultantRequest = await request.json();
    const { messages, currentFormState } = body;

    const apiKey = process.env.DEEPSEEK_API_KEY;

    // 1. Nếu có DEEPSEEK_API_KEY thật -> Gọi DeepSeek Chat API
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_deepseek_api_key_here') {
      try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              content: reply,
              provider: 'deepseek-chat',
            });
          }
        } else {
          console.error('[DEEPSEEK API FAILED]', await response.text());
        }
      } catch (err: any) {
        console.error('[DEEPSEEK API ERROR]', err.message);
      }
    }

    // 2. Local Smart Fallback Engine: Trợ lý chuyên sâu F&B Quê Nhà nội bộ (không phụ thuộc mạng ngoại vi)
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';
    const fallbackResponse = generateLocalConsultantResponse(lastUserMessage, currentFormState);

    return NextResponse.json({
      content: fallbackResponse,
      provider: 'quenha-smart-local-engine',
    });
  } catch (error: any) {
    console.error('[AI CONSULTANT HANDLER ERROR]', error);
    return NextResponse.json(
      {
        content:
          'Dạ em chào quý thực khách! Hiện tại hệ thống đang tiếp nhận nhiều lượt đặt tiệc. Quý khách vui lòng điền thông tin vào Phiếu Nhận Tiệc bên dưới hoặc gọi hotline trực tiếp 0938 226 166 để Tổng Quản Lý chi nhánh hỗ trợ ngay ạ!',
        provider: 'fallback',
      },
      { status: 200 }
    );
  }
}

function generateLocalConsultantResponse(input: string, state?: any): string {
  // Nhận diện chi nhánh
  if (input.includes('thành thái') || input.includes('quận 10') || input.includes('q10')) {
    return `Dạ chi nhánh **05 Thành Thái (Quận 10)** là lựa chọn tuyệt vời cho tiệc công ty và liên hoan gia đình!
🌿 **Không gian:** Sân vườn xanh mát hàng ngàn m², có lầu VIP và sảnh lớn sức chứa tới 250 khách, bãi đậu xe hơi rộng rãi.
🍲 **Món gợi ý:** Heo mẹt 4 món giòn da, Gà ta hấp lá chúc, Lẩu cua đồng bắp bò Quê Nhà.
👉 Anh/chị có thể chọn **CN Thành Thái** trên phiếu đặt tiệc, nhân viên lễ tân sẽ ưu tiên giữ phòng VIP hoặc bàn sân vườn đẹp nhất cho mình ạ!`;
  }

  if (input.includes('phạm ngọc thạch') || input.includes('quận 3') || input.includes('q3')) {
    return `Dạ chi nhánh **28 Phạm Ngọc Thạch (Quận 3)** sở hữu kiến trúc biệt thự Pháp cổ kính và sang trọng bậc nhất chuỗi Quê Nhà!
🏛️ **Không gian:** 15 phòng VIP máy lạnh riêng tư, cách âm tốt, phong cách trang nhã rất phù hợp tiếp khách VIP, ký kết hợp đồng hoặc tiệc gia đình cần không gian kín đáo.
🍲 **Món gợi ý:** Cá lăng nướng muối ớt rừng, Bò tơ nướng than hoa, Chả giò Quê Nhà, Lẩu cá tầm măng chua.
👉 Quý khách có thể điền số khách dự kiến, Tổng Quản Lý cơ sở Phạm Ngọc Thạch sẽ chuẩn bị phòng VIP riêng biệt kèm ly vang chu đáo ạ!`;
  }

  if (input.includes('nguyễn thái bình') || input.includes('tân bình') || input.includes('sân bay')) {
    return `Dạ chi nhánh **164 - 166 Nguyễn Thái Bình (Tân Bình)** tọa lạc ngay cửa ngõ sân bay Tân Sơn Nhất, cực kỳ tiện lợi!
✈️ **Không gian:** 12 phòng VIP hiện đại, sảnh hội nghị có trang bị máy chiếu, âm thanh chuyên nghiệp cho tiệc tổng kết công ty.
🍲 **Món gợi ý:** Heo mẹt giòn da, Gỏi tép đồng bông điên điển, Tôm sú sốt trứng muối, Lẩu gà lá giang.
👉 Anh/chị hãy bấm gửi phiếu, lễ tân chi nhánh Nguyễn Thái Bình sẽ gọi xác nhận và đón đoàn chu đáo ạ!`;
  }

  // Nhận diện ngân sách / giá tiền
  if (input.includes('ngân sách') || input.includes('giá') || input.includes('triệu') || input.includes('bao nhiêu')) {
    return `Dạ tại Ẩm Thực Quê Nhà, các set menu tiệc được thiết kế rất đa dạng và đầy đặn (mỗi bàn 10 khách):
1. **Set Cát Tường (3.5 - 4.2 triệu/bàn):** 6 món đậm đà hương vị đồng quê (Gỏi tép bông điên điển, Chả giò, Gà hấp lá chúc, Lẩu cua đồng...).
2. **Set Như Ý (4.8 - 5.8 triệu/bàn - ĐƯỢC CHỌN NHIỀU NHẤT):** Có Heo mẹt 4 món giòn da, Cá lăng nướng muối ớt, Tôm sú hoàng kim, Lẩu cá tầm măng chua.
3. **Set Hoàng Kim VIP (6.5 - 8.5 triệu/bàn):** Thực đơn sơn hào hải vị cao cấp, tặng kèm gói trang trí tiệc tiêu chuẩn.
👉 Anh/chị dự kiến đoàn mình khoảng bao nhiêu người để em tư vấn set món chi tiết nhất ạ?`;
  }

  // Món ăn / Món ngon
  if (input.includes('món gì') || input.includes('món ngon') || input.includes('đặc sản') || input.includes('thực đơn')) {
    return `Dạ tiệc tại Quê Nhà thì không thể bỏ qua các "Món Tủ" trứ danh này ạ:
🌟 **Heo mẹt 4 món giòn da:** Da nổ cốm giòn tan, thịt mềm thơm ăn kèm rau rừng và mắm tôm bánh tráng.
🌟 **Gà ta hấp lá chúc An Giang:** Gà thả vườn thịt săn chắc, thoang thoảng mùi tinh dầu lá chúc miền Tây độc đáo.
🌟 **Cá lăng nướng muối ớt rừng:** Cá lăng tươi ngọt nướng trên than hồng thơm lừng.
🌟 **Lẩu riêu cua bắp bò Quê Nhà:** Nước dùng thanh ngọt nấu từ cua đồng tươi nguyên chất.
👉 Anh/chị có thể tích chọn các món này trực tiếp trên bảng **Chọn Món Tiệc** bên dưới để hệ thống tự tính tổng ngân sách nhé!`;
  }

  // Tư vấn chung mặc định
  return `Dạ em chào quý thực khách! Rất vui được hỗ trợ anh/chị lên kế hoạch cho bữa tiệc ấm cúng tại **Ẩm Thực Quê Nhà**.
Anh/chị có thể cho em biết:
1. Đoàn mình dự kiến **khoảng bao nhiêu khách**?
2. Anh/chị muốn đặt tiệc tại chi nhánh nào (**Q.3 Phạm Ngọc Thạch**, **Q.10 Thành Thái** hay **Tân Bình**)?
3. Anh/chị thích không gian **Phòng VIP máy lạnh riêng tư** hay **Sân vườn cây xanh** thoáng đãng?
Em sẽ gợi ý ngay set menu ưng ý và ngân sách tối ưu nhất cho mình ạ!`;
}
