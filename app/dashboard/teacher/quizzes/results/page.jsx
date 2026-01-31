"use client";
import { useEffect, useState, useCallback } from "react";
import {
  BookOpen,
  Users,
  Trophy,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  GraduationCap,
  Calendar,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function ExamsAndResultsPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      // جلب الكوزات مع نتائج الطلاب المدمجة
      const res = await axios.get(`${API_BASE}/api/teacher/quizzes-with-results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data);

      gsap.fromTo(
        ".quiz-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 },
      );
    } catch (err) {
      toast.error("فشل في مزامنة سجلات الاختبارات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // تصفية الكوزات حسب البحث
  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 opacity-20" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-12 space-y-10 rtl text-white font-sans overflow-hidden relative">
      {/* 🌌 Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
          <div className="text-right space-y-3">
            <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter italic drop-shadow-2xl">
              إدارة <span className="text-blue-500">النتائج</span>
            </h1>
            <p className="text-white/40 font-bold text-lg italic">
              استعراض كافة الاختبارات المنشورة وتحليل درجات الطلاب المشاركين.
            </p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-500" />
            <Input
              placeholder="ابحث عن اسم الكوز..."
              className="h-14 pr-12 bg-white/5 border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Quizzes List */}
        <div className="space-y-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card group">
              <div
                className={cn(
                  "bg-white/[0.02] backdrop-blur-3xl border rounded-[35px] p-8 transition-all duration-500 cursor-pointer hover:bg-white/[0.05]",
                  expandedId === quiz._id
                    ? "border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                    : "border-white/10",
                )}
                onClick={() =>
                  setExpandedId(expandedId === quiz._id ? null : quiz._id)
                }
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-white/40 group-hover:text-white" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-[1000] italic">
                        {quiz.title}
                      </h3>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {new Date(quiz.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-white/20 uppercase mb-1 italic">
                        المشاركون
                      </p>
                      <p className="text-xl font-[1000] italic flex items-center gap-2">
                        <Users className="w-4 h-4" />{" "}
                        {quiz.results?.length || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-white/20 uppercase mb-1 italic">
                        متوسط الدرجات
                      </p>
                      <p className="text-xl font-[1000] text-emerald-400 italic">
                        %{quiz.avgScore || 0}
                      </p>
                    </div>
                    {expandedId === quiz._id ? (
                      <ChevronUp className="text-blue-500" />
                    ) : (
                      <ChevronDown className="text-white/20" />
                    )}
                  </div>
                </div>

                {/* Expanded Results Table */}
                {expandedId === quiz._id && (
                  <div className="mt-10 pt-10 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <table className="w-full text-right">
                      <thead>
                        <tr className="text-[10px] font-black uppercase text-white/20 tracking-widest border-b border-white/5">
                          <th className="pb-4 pr-4">الطالب</th>
                          <th className="pb-4 text-center">الدرجة</th>
                          <th className="pb-4 text-center">الوقت</th>
                          <th className="pb-4 text-left pl-4">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {quiz.results?.map((res , i ) => (
                          <tr
                            key={i}
                            className="group/row hover:bg-white/[0.02]"
                          >
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                  <GraduationCap className="w-4 h-4 text-white/30" />
                                </div>
                                <span className="font-bold text-sm text-white/80 group-hover/row:text-blue-400">
                                  {res.studentName}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-center font-[1000] text-emerald-400">
                              %{res.score}
                            </td>
                            <td className="py-4 text-center text-[10px] text-white/20 font-black">
                              {res.timeTaken} MIN
                            </td>
                            <td className="py-4 text-left pl-4">
                              <span
                                className={cn(
                                  "px-3 py-1 rounded-full text-[9px] font-black uppercase italic",
                                  res.score >= 50
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400",
                                )}
                              >
                                {res.score >= 50 ? "Passed" : "Failed"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredQuizzes.length === 0 && (
            <div className="py-20 text-center opacity-20 italic font-black uppercase tracking-[0.5em]">
              No Exams Detected In Grid
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
