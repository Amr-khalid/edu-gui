"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Menu, X, Zap, ShieldCheck } from "lucide-react"; // أيقونات بيضاء
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // حماية المسار
  useEffect(() => {
    if (!user && !localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [user, router]);

  // إغلاق القائمة عند تغيير حجم الشاشة للأكبر
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#020617] rtl text-white overflow-hidden">
      {/* 🌌 الـ Sidebar - يظهر دائماً في الشاشات الكبيرة، وبشكل متحرك في الموبايل */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0",
          isMobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0",
        )}
      >
        <Sidebar />

        {/* زر إغلاق القائمة (يظهر فقط في الموبايل عند الفتح) */}
        <Button
          variant="ghost"
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-5 left-5 lg:hidden text-white hover:bg-white/10 rounded-full w-12 h-12"
        >
          <X className="w-8 h-8" />
        </Button>
      </aside>

      {/* 🌫️ خلفية ضبابية عند فتح المنيو في الموبايل */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Header الموبايل الكريستالي */}
        <header className="h-20 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-30 lg:hidden flex items-center justify-between px-6 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <Zap className="w-5 h-5 text-blue-400 fill-blue-400" />
            </div>
            <span className="font-[1000] text-xl tracking-tighter italic">
              EduShield
            </span>
          </div>

          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white hover:bg-white/5 rounded-2xl h-12 w-12 flex items-center justify-center border border-white/5"
          >
            <Menu className="w-7 h-7" />
          </Button>
        </header>

        {/* منطقة المحتوى القابلة للتمرير */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* تأثيرات إضاءة خلفية ثابتة داخل المحتوى */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
          </div>

          <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full">{children}</div>
        </div>

        {/* Footer موبايل بسيط (اختياري) */}
        <footer className="lg:hidden p-4 text-center opacity-10 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase tracking-widest">
            Quantum Secured System
          </span>
        </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
