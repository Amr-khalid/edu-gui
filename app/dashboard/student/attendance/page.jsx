"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Loader2,
  Award,
  BrainCircuit,
  FileText,
  Target,
  Trophy,
  Zap,
  Activity,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function StudentUltimateDashboard() {
  const [attendance, setAttendance] = useState ([]);
  const [exams, setExams] = useState ([]);
  const [quizzes, setQuizzes] = useState ([]);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // السنترال لينك - تأكد أنه لا ينتهي بـ /api لأننا سنضيفها يدوياً
  const API_ROOT =
    process.env.NEXT_PUBLIC_API_URL || "https://edu-back-chi.vercel.app";
  const API_BASE = `${API_ROOT}/api`;

  const fetchUltimateData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. جلب التقرير الكامل ودرجات الكوزات في وقت واحد
      const [reportRes, quizzesRes] = await Promise.all([
        axios.get(`${API_BASE}/stats/student/full-report`, { headers }),
        axios.get(`${API_BASE}/quizzes/student`, { headers }),
      ]);

      // 2. توزيع بيانات التقرير (بناءً على الهيكل الذي ذكرته)
      const report = reportRes.data;

      // جلب سجل الحضور الفعلي (الأيام)
      setAttendance(report.attendanceRecords || []);

      // جلب إجمالي عدد الحضور للمربع العلوي
      setAttendanceCount(
        report.profile?.attendanceCount ||
          report.attendanceRecords?.length ||
          0,
      );

      // جلب الدرجات الورقية (الامتحانات)
      setExams(report.manualGrades || []);

      // 3. جلب الكوزات المكتملة فقط
      const completedQuizzes = (quizzesRes.data || []).filter(
        (q ) => q.isCompleted,
      );
      setQuizzes(completedQuizzes);

      // أنيميشن الظهور الكريستالي
      gsap.fromTo(
        ".reveal-node",
        { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
        },
      );
    } catch (err) {
      toast.error("فشل في استلام التقرير الشامل من السيرفر");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchUltimateData();
  }, [fetchUltimateData]);

  // منطق الحساب الموحد
  const stats = useMemo(() => {
    const quizAvg =
      quizzes.length > 0
        ? (quizzes.reduce(
            (acc, q) => acc + q.score / (q.questions?.length || 1),
            0,
          ) /
            quizzes.length) *
          100
        : 0;

    const examAvg =
      exams.length > 0
        ? (exams.reduce((acc, e) => acc + e.score / (e.maxScore || 100), 0) /
            exams.length) *
          100
        : 0;

    return {
      academicRate:
        Math.round(
          (quizAvg + examAvg) / (quizzes.length && exams.length ? 2 : 1),
        ) || 0,
      totalPoints: Math.round(
        quizzes.reduce((acc, q) => acc + q.score, 0) +
          exams.reduce((acc, e) => acc + e.score, 0),
      ),
    };
  }, [exams, quizzes]);

  if (loading)
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 opacity-20" />
        <p className="text-white/20 font-black tracking-[0.5em] uppercase text-[10px] italic">
          Syncing Full Report...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-10 font-sans text-white relative overflow-hidden rtl selection:bg-blue-500/30">
      {/* 🌌 تأثيرات الخلفية */}
      <div className="fixed top-[-5%] right-[-5%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] z-0" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[140px] z-0" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header HUD - هنا سيظهر الرقم 2 بشكل صحيح */}
        <div className="reveal-node flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
          <div className="text-right space-y-3">
            <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter italic flex items-center gap-5">
              رادار الأداء <Award className="text-blue-400 w-12 h-12" />
            </h1>
            <p className="text-white/40 font-bold text-xl italic max-w-xl leading-relaxed">
              تحليل البيانات المستخرجة من التقرير الشامل للمنصة.
            </p>
          </div>

          <div className="flex gap-6">
            <StatHUD
              label="معدل النجاح"
              value={`${stats.academicRate}%`}
              color="text-emerald-400"
              icon={Target}
            />
            <StatHUD
              label="إجمالي الحضور"
              value={attendanceCount}
              color="text-blue-400"
              icon={UserCheck}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* كوزات المنصة */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="flex items-center gap-3 font-[1000] text-white/30 uppercase text-xs tracking-[0.3em] px-4 italic">
              <BrainCircuit className="w-4 h-4 text-purple-400" /> كوزات المنصة
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="reveal-node group bg-white/[0.03] backdrop-blur-3xl p-6 rounded-[35px] border border-white/10 hover:bg-white/[0.08] transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-1 h-full bg-purple-500/40" />
                    <h4 className="text-lg font-[1000] text-white mb-5 italic">
                      {quiz.title}
                    </h4>
                    <div className="flex justify-between items-end">
                      <p className="text-4xl font-[1000] text-white italic">
                        {quiz.score}
                        <span className="text-sm text-white/20">
                          /{quiz.questions?.length}
                        </span>
                      </p>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyData icon={Zap} text="لا توجد نتائج كوزات" />
              )}
            </div>
          </div>

          {/* الدرجات الورقية */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="flex items-center gap-3 font-[1000] text-white/30 uppercase text-xs tracking-[0.3em] px-4 italic">
              <FileText className="w-4 h-4 text-blue-400" /> السجل الورقي
            </h3>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <div
                    key={exam._id}
                    className="reveal-node group bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-[45px] flex justify-between items-center hover:bg-white/[0.08] transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                    <div>
                      <h4 className="text-2xl font-[1000] text-white italic">
                        {exam.examTitle}
                      </h4>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">
                        {new Date(exam.date).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-5xl font-[1000] text-white italic">
                        {exam.score}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyData icon={FileText} text="لا توجد درجات ورقية" />
              )}
            </div>
          </div>

          {/* سجل الحضور - هنا تظهر الأيام المذكورة في الـ full-report */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="flex items-center gap-3 font-[1000] text-white/30 uppercase text-xs tracking-[0.3em] px-4 italic">
              <Clock className="w-4 h-4 text-emerald-400" /> سجل الحضور
            </h3>
            <div className="space-y-3">
              {attendance.length > 0 ? (
                attendance.map((record, i) => (
                  <div
                    key={i}
                    className="reveal-node bg-white/[0.04] backdrop-blur-2xl p-4 rounded-[25px] border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 fill-emerald-500" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white italic">
                        {new Date(
                          record.scannedAt || record.date,
                        ).toLocaleDateString("ar-EG", { weekday: "long" })}
                      </p>
                      <p className="text-[10px] font-bold text-white/20 uppercase">
                        {new Date(
                          record.scannedAt || record.date,
                        ).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyData icon={Clock} text="لا يوجد سجل حضور" />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        body {
          background-color: #020617;
        }
      `}</style>
    </div>
  );
}

// مكونات HUD
function StatHUD({ icon: Icon, label, value, color } ) {
  return (
    <div className="reveal-node bg-white/[0.04] backdrop-blur-3xl border border-white/10 px-8 py-6 rounded-[40px] text-center shadow-2xl group hover:bg-white/10 transition-all">
      <div
        className={cn(
          "w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-white/5 shadow-inner transition-transform group-hover:scale-110",
          color,
        )}
      >
        <Icon className="w-7 h-7" />
      </div>
      <p className="text-[10px] font-[1000] text-white/20 uppercase tracking-[0.2em] mb-1 italic">
        {label}
      </p>
      <p className={cn("text-4xl font-[1000] italic tracking-tighter", color)}>
        {value}
      </p>
    </div>
  );
}

function EmptyData({ icon: Icon, text } ) {
  return (
    <div className="reveal-node p-16 rounded-[45px] border-2 border-dashed border-white/5 text-center space-y-4 opacity-30">
      <Icon className="w-12 h-12 mx-auto text-white/40" />
      <p className="text-xs font-black uppercase tracking-[0.4em] text-white/40 italic">
        {text}
      </p>
    </div>
  );
}
