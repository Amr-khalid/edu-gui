import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // تأكد من المسار الصحيح
import { Toaster } from "sonner"; // إذا كنت تستخدم Sonner للتنبيهات

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body >
        {/* هُنا يكمن الحل: يجب أن يحيط الـ Provider بكل شيء */}
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}