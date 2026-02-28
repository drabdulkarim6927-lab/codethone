import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "كود ثون - مسابقة البرمجة الوطنية",
  description: "منصة تسجيل مسابقة كود ثون للبرمجة والتقنية للطلاب",
  keywords: "كود ثون, مسابقة برمجة, طلاب, تقنية, برمجة",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "Cairo, sans-serif",
              direction: "rtl",
              fontSize: "14px",
              borderRadius: "10px",
            },
            success: { style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" } },
            error: { style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" } },
          }}
        />
        {children}
      </body>
    </html>
  );
}
