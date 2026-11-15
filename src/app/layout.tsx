import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["vietnamese", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["vietnamese", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ẩm Thực Quê Nhà - Hệ Thống Tiệc & Phòng VIP Sang Trọng (Từ 2010)",
  description: "Chuỗi nhà hàng Ẩm Thực Quê Nhà (Thành lập từ 2010) - Không gian ẩm thực ba miền tinh hoa, 45 phòng VIP sang trọng, sân vườn thoáng mát tại TP. Hồ Chí Minh.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-[#231F20] bg-[#FDFBF7]">
        {children}
      </body>
    </html>
  );
}
