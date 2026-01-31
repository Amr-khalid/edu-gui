"use client";
import { useEffect, useState, useRef } from "react";
import NotificationCard from "./../../../components/dashboard/NotificationCard";
import { Button } from "@/components/ui/button";
import {
  BellRing,
  CheckCheck,
  Loader2,
  Star,
  Zap,
  LayoutGrid,
  Sparkles,
  Radio,
} from "lucide-react";
import gsap from "gsap";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NotificationsCrystalPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // جلب التنبيهات من الـ API
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/notifications/student`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications(res.data);

      // أنيميشن "كريستالي" للدخول
      gsap.fromTo(
        ".notif-item",
        { opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
        },
      );
    } catch (err) {
      toast.error("فشل الاتصال ببرج البث المركزي");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-6 md:p-10 space-y-12 bg-slate-950 text-white font-sans selection:bg-blue-500/30 relative overflow-hidden rtl"
    >
      {/* 🌌 Background Decoration - سحب ضوئية لتعزيز تأثير الزجاج */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] z-0" />

      <div className="max-w-5xl bg-white/5 mx-auto space-y-12 relative z-10">
        {/* --- Header HUD: Glass Interface --- */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-3xl p-10 rounded-[55px] border border-white/10 shadow-2xl transition-all duration-700 hover:bg-white/[0.08]">
          {/* توهج داخلي */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-30" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-50 transition-opacity" />
                <div className="bg-blue-600/20 p-6 rounded-[30px] text-blue-400 border border-blue-500/30 shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <BellRing className="w-10 h-10 animate-ring" />
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-5xl font-[1000] text-white tracking-tighter italic flex items-center gap-3">
                  مركز البث{" "}
                  <Sparkles className="w-6 h-6 text-blue-400 fill-current" />
                </h1>
                <p className="text-white/40 font-bold mt-2 flex items-center gap-2 text-lg tracking-tight">
                  <Radio className="w-4 h-4 text-blue-500 animate-pulse" />
                  لديك
                  <span className="text-blue-400 font-black px-2 text-2xl">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                  إشارات جديدة في المدار الحالي
                </p>
              </div>
            </div>

            <Button
              onClick={() => toast.success("تمت مزامنة جميع الإشارات")}
              className="rounded-[25px] bg-white hover:bg-blue-600 text-slate-950 hover:text-white h-20 px-10 gap-4 font-[1000] text-xl shadow-2xl transition-all active:scale-95 group"
            >
              <CheckCheck className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />{" "}
              تعليم الكل كمقروء
            </Button>
          </div>
        </div>

        {/* --- Notifications Stream --- */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-48 gap-8">
              <div className="relative">
                <Loader2 className="w-20 h-20 animate-spin text-blue-500 opacity-20" />
                <Zap className="w-10 h-10 text-blue-500 absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="text-white/20 font-black tracking-[0.5em] uppercase text-xs">
                Decoding Incoming Frequencies...
              </p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {notifications.map((note) => (
                <div key={note._id} className="notif-item">
                  <NotificationCard
                    {...note}
                    className="bg-white/5 backdrop-blur-2xl hover:bg-white/[0.08] border-white/10 shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 rounded-[40px] p-8"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-48 bg-white/[0.02] backdrop-blur-xl rounded-[80px] border-4 border-dashed border-white/5">
              <div className="bg-white/5 p-10 rounded-full mb-8 shadow-inner">
                <Star className="w-20 h-20 text-white/5" />
              </div>
              <p className="text-white/10 text-4xl font-[1000] uppercase tracking-widest italic">
                Signal Lost
              </p>
              <p className="text-white/5 font-bold mt-4 text-xl">
                لا توجد تنبيهات نشطة في هذا القطاع حالياً
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ring {
          0%,
          100% {
            transform: rotate(0);
          }
          25% {
            transform: rotate(10deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }
        .animate-ring {
          animation: ring 2s ease-in-out infinite;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
