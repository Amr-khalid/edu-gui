"use client";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  BarChart3,
  Trash2,
  Edit,
  Loader2,
  TrendingUp,
  ChevronRight,
  Zap,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function TeacherQuizzesCrystalPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/quizzes/teacher/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setQuizzes(res.data);

      // أنيميشن الدخول الزجاجي
      gsap.fromTo(
        ".quiz-card",
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "expo.out",
        },
      );
    } catch (err) {
      toast.error("فشل في جلب سجل الاختبارات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الاختبار نهائياً؟")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(quizzes.filter((q) => q._id !== id));
      toast.success("تم التخلص من الاختبار بنجاح");
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 opacity-20" />
        <p className="text-white/20 font-black tracking-[0.4em] uppercase mt-6 text-[10px]">
          Syncing Command Center...
        </p>
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-950 p-6 md:p-10 space-y-12 font-sans text-white relative overflow-hidden selection:bg-blue-500/30"
    >
      {/* 🌌 Background Elements - تأثير الإضاءة الفضائية */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] z-0" />

      {/* Header HUD */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10 border-b border-white/5 pb-10">
        <div className="text-right space-y-2">
          <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter italic flex items-center gap-5">
            مركز القيادة{" "}
            <Zap className="text-blue-400 w-12 h-12 fill-current shadow-blue-500" />
          </h1>
          <p className="text-white/40 font-bold text-xl max-w-2xl leading-relaxed">
            بث الكوزات، تتبع متوسط الدرجات، وإدارة التقييم الرقمي لطلابك.
          </p>
        </div>
        <Link href="/dashboard/teacher/quizzes/create">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-[30px] h-20 px-12 font-[1000] text-2xl shadow-2xl shadow-blue-600/30 gap-4 transition-all active:scale-95">
            <Plus className="w-8 h-8" /> إنشاء كوز جديد
          </Button>
        </Link>
        <Link href="/dashboard/teacher/quizzes/results">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-[30px] h-20 px-12 font-[1000] text-2xl shadow-2xl shadow-blue-600/30 gap-4 transition-all active:scale-95">
            <Plus className="w-8 h-8" /> Results Overview
          </Button>
        </Link>
        
      </div>

      {/* Quizzes Glass Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="quiz-card bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[55px] shadow-2xl hover:bg-white/10 transition-all duration-700 group relative overflow-hidden"
            >
              {/* تزيين الكارت بخط علوي نيون */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-blue-600/20 rounded-[22px] border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <BarChart3 className="w-9 h-9" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(quiz._id)}
                  className="text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-2xl w-12 h-12 transition-all"
                >
                  <Trash2 className="w-6 h-6" />
                </Button>
              </div>

              <h3 className="text-3xl font-[1000] text-white mb-6 tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                {quiz.title}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white/5 p-5 rounded-[25px] border border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-white/30 uppercase mb-2 tracking-[0.2em] flex items-center gap-2">
                    <Users className="w-3 h-3 text-blue-500" /> المختبرين
                  </p>
                  <p className="text-2xl font-[1000] text-white">
                    {quiz.solvedCount}{" "}
                    <span className="text-xs font-bold text-white/30 tracking-normal">
                      Agent
                    </span>
                  </p>
                </div>
                <div className="bg-white/5 p-5 rounded-[25px] border border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-white/30 uppercase mb-2 tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> المتوسط
                  </p>
                  <p className="text-2xl font-[1000] text-emerald-400">
                    {quiz.avgScore}%
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-white/5">
                <Link
                  href={`/dashboard/teacher/quizzes/results/${quiz._id}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-white hover:bg-blue-600 hover:text-white text-slate-950 rounded-[22px] h-16 font-[1000] text-sm gap-3 shadow-xl transition-all">
                    عرض النتائج <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="rounded-[22px] h-16 w-16 border border-white/10 text-white/20 hover:text-blue-400 hover:bg-white/5"
                >
                  <Edit className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-48 text-center">
            <div className="opacity-10 space-y-4">
              <Sparkles className="w-24 h-24 mx-auto" />
              <h3 className="text-5xl font-[1000] uppercase tracking-widest italic">
                Hub Empty
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* تخصيص الـ Scrollbar ليتناسب مع الشكل الزجاجي */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
