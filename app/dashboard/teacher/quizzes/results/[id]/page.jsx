"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  FileDown,
  Search,
  ArrowLeft,
  BarChart3,
  GraduationCap,
  Loader2,
  Calendar,
  UserCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";
import gsap from "gsap";

export default function QuizResultsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchResults = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/quizzes/results/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);

      // أنيميشن الظهور الكريستالي
      gsap.fromTo(
        ".glass-node",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
        },
      );
    } catch (err) {
      toast.error("فشل في تحميل سجل النتائج");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const exportToExcel = () => {
    const excelData = data.results.map((r) => ({
      "اسم الطالب": r.studentId?.name,
      "كود الطالب": r.studentId?.studentId,
      السكشن: r.studentId?.section,
      الدرجة: r.score,
      من: r.total,
      النسبة: `${Math.round((r.score / r.total) * 100)}%`,
      "تاريخ الحل": new Date(r.completedAt).toLocaleString("ar-EG"),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "نتائج الاختبار");
    XLSX.writeFile(wb, `نتائج_${data.quizTitle}.xlsx`);
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 opacity-20" />
        <p className="text-white/20 font-black tracking-widest text-[10px] uppercase italic">
          Decrypting Results...
        </p>
      </div>
    );

  const filteredResults = data?.results.filter(
    (r) =>
      r.studentId?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId?.studentId.includes(search),
  );

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-12 space-y-12 font-sans text-white relative overflow-hidden selection:bg-blue-500/30 rtl">
      {/* 🌌 Background Decoration */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] z-0" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header HUD */}
        <div className="glass-node flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4 text-right">
            <div className="flex items-center gap-3 text-blue-400 font-black uppercase text-[10px] tracking-[0.3em] italic">
              <BarChart3 className="w-5 h-5" /> رادار التحليل الأكاديمي
            </div>
            <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter italic">
              نتائج: {data?.quizTitle}
            </h1>
          </div>
          <Button
            onClick={exportToExcel}
            className="bg-white text-black hover:bg-emerald-600 hover:text-white rounded-2xl h-16 px-10 font-black text-lg gap-3 shadow-2xl transition-all active:scale-95 group shadow-white/5"
          >
            تصدير التقرير{" "}
            <FileDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "إجمالي المختبرين",
              val: `${data?.results.length} طالب`,
              icon: Users,
              col: "text-blue-400",
              bg: "bg-blue-600/10",
            },
            {
              label: "أعلى درجة مرصودة",
              val: data?.results[0]?.score || 0,
              icon: Trophy,
              col: "text-amber-400",
              bg: "bg-amber-600/10",
            },
            {
              label: "متوسط الأداء العام",
              val: `${Math.round(data?.results.reduce((a, b) => a + b.score, 0) / data?.results.length || 0)}%`,
              icon: GraduationCap,
              col: "text-emerald-400",
              bg: "bg-emerald-600/10",
            },
          ].map((s, i) => (
            <Card
              key={i}
              className="glass-node bg-white/[0.03] backdrop-blur-3xl border-white/5 p-8 rounded-[40px] shadow-2xl flex items-center gap-6 group hover:bg-white/[0.06] transition-all"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-[22px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500",
                  s.bg,
                )}
              >
                <s.icon className={cn("w-8 h-8", s.col)} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 italic">
                  {s.label}
                </p>
                <p className="text-4xl font-[1000] text-white italic tracking-tighter">
                  {s.val}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Search & Results List */}
        <div className="space-y-8">
          <div className="glass-node relative max-w-md group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="ابحث باسم الطالب أو الكود..."
              className="w-full h-16 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl pr-14 font-bold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredResults?.map((res, idx ) => (
              <Card
                key={idx}
                className="glass-node bg-white/[0.02] backdrop-blur-3xl border-white/5 p-8 rounded-[45px] shadow-2xl hover:bg-white/[0.05] transition-all flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />

                <div className="flex items-center gap-8 text-right w-full md:w-1/2">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-[1000] text-white/20 text-2xl border border-white/5 italic">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-2xl font-[1000] text-white italic group-hover:text-blue-400 transition-colors">
                      {res.studentId?.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest flex items-center gap-1">
                        <UserCircle className="w-3 h-3" />{" "}
                        {res.studentId?.studentId}
                      </span>
                      <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> SEC{" "}
                        {res.studentId?.section}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-around w-full md:w-1/2">
                  <div className="text-center">
                    <p className="text-[10px] text-white/20 font-black uppercase mb-1 italic tracking-widest">
                      تحصيل الدرجات
                    </p>
                    <p className="text-4xl font-[1000] text-white tracking-tighter italic">
                      {res.score}{" "}
                      <span className="text-sm text-white/10">
                        / {res.total}
                      </span>
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-20 w-20 rounded-[28px] flex items-center justify-center font-[1000] text-xl border-2 transition-all duration-700",
                      res.score / res.total >= 0.5
                        ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        : "border-red-500/20 text-red-400 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
                    )}
                  >
                    {Math.round((res.score / res.total) * 100)}%
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
