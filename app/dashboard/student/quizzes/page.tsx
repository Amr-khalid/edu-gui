"use client";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowLeft,
  BrainCircuit,
  Star,
  AlertCircle,
  Loader2,
  Zap,
  Sparkles,
  Trophy,
  Lock,
  CalendarClock,
  Hourglass,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import gsap from "gsap";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StudentQuizzesCrystalPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchQuizzes();
    // تحديث الوقت كل دقيقة للتحقق من الاختبارات المجدولة
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/quizzes/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data);

      gsap.fromTo(
        ".quiz-card",
        { opacity: 0, scale: 0.9, y: 20 },
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
      toast.error("فشل في تحميل مهامك الدراسية");
    } finally {
      setLoading(false);
    }
  };

  // --- منطق الفلترة المطور ---

  // 1. الاختبارات المتاحة حالياً (Active أو Scheduled وحان وقتها)
  const activeQuizzes = useMemo(
    () =>
      quizzes.filter((q) => {
        const isTimeReached =
          !q.scheduledAt || new Date(q.scheduledAt) <= currentTime;
        return !q.isCompleted && q.status !== "paused" && isTimeReached;
      }),
    [quizzes, currentTime],
  );

  // 2. الاختبارات القادمة (Scheduled ولم يحن وقتها بعد)
  const scheduledQuizzes = useMemo(
    () =>
      quizzes.filter((q) => {
        const isFuture = q.scheduledAt && new Date(q.scheduledAt) > currentTime;
        return !q.isCompleted && (q.status === "scheduled" || isFuture);
      }),
    [quizzes, currentTime],
  );

  // 3. الاختبارات المنجزة
  const completedQuizzes = useMemo(
    () => quizzes.filter((q) => q.isCompleted),
    [quizzes],
  );

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 opacity-20" />
        <p className="text-white/20 font-black tracking-[0.5em] mt-6 uppercase text-[10px]">
          Accessing Portal...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 space-y-12 font-sans text-white relative overflow-hidden selection:bg-blue-500/30 rtl">
      {/* 🌌 Background Decoration */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] z-0" />

      {/* --- Header HUD --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10 border-b border-white/5 pb-10">
        <div className="text-right space-y-2">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter italic flex items-center gap-4">
            مركز الاختبارات{" "}
            <Zap className="text-blue-400 w-10 h-10 fill-current" />
          </h1>
          <p className="text-white/40 font-bold text-xl max-w-xl">
            تحدى قدراتك، حقق أعلى الدرجات، وابنِ مستقبلك الأكاديمي.
          </p>
        </div>

        <div className="flex gap-6">
          <StatHUD
            icon={<Star className="text-orange-400" />}
            label="المعدل التراكمي"
            value="85%"
          />
          <StatHUD
            icon={<Trophy className="text-emerald-400" />}
            label="المهمات المنجزة"
            value={completedQuizzes.length.toString()}
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full relative z-10" dir="rtl">
        <TabsList className="bg-white/5 backdrop-blur-2xl p-2 rounded-[25px] h-20 border border-white/10 w-full md:w-fit flex gap-2 mb-10 overflow-x-auto">
          <TabsTrigger
            value="active"
            className="rounded-[18px] px-8 font-black text-white/40 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all h-full gap-3 shrink-0"
          >
            <Sparkles className="w-5 h-5" /> المتاحة حالياً (
            {activeQuizzes.length})
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="rounded-[18px] px-8 font-black text-white/40 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all h-full gap-3 shrink-0"
          >
            <CalendarClock className="w-5 h-5" /> القادمة (
            {scheduledQuizzes.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-[18px] px-8 font-black text-white/40 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all h-full gap-3 shrink-0"
          >
            <CheckCircle2 className="w-5 h-5" /> السجل الدراسي
          </TabsTrigger>
        </TabsList>

        {/* التبويب 1: الاختبارات النشطة */}
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activeQuizzes.length > 0 ? (
              activeQuizzes.map((quiz) => (
                <QuizGlassCard key={quiz._id} quiz={quiz} type="active" />
              ))
            ) : (
              <EmptyState message="لا توجد اختبارات متاحة الآن" />
            )}
          </div>
        </TabsContent>

        {/* التبويب 2: الاختبارات القادمة (الجديد) */}
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {scheduledQuizzes.length > 0 ? (
              scheduledQuizzes.map((quiz) => (
                <QuizGlassCard key={quiz._id} quiz={quiz} type="scheduled" />
              ))
            ) : (
              <EmptyState message="لا توجد اختبارات مجدولة قريباً" />
            )}
          </div>
        </TabsContent>

        {/* التبويب 3: السجل الدراسي */}
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {completedQuizzes.length > 0 ? (
              completedQuizzes.map((quiz) => (
                <QuizGlassCard key={quiz._id} quiz={quiz} type="completed" />
              ))
            ) : (
              <EmptyState message="ابدأ رحلتك التعليمية الآن.." />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- المكونات الفرعية ---

function QuizGlassCard({
  quiz,
  type,
}: {
  quiz: any;
  type: "active" | "completed" | "scheduled";
}) {
  return (
    <Card className="quiz-card group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[50px] overflow-hidden hover:bg-white/[0.08] transition-all duration-700 shadow-2xl">
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-1.5 opacity-50",
          type === "active"
            ? "bg-blue-500 shadow-[0_0_15px_#3b82f6]"
            : type === "scheduled"
              ? "bg-orange-500 shadow-[0_0_15px_#f59e0b]"
              : "bg-emerald-500 shadow-[0_0_15px_#10b981]",
        )}
      />

      <CardContent className="p-10 space-y-8">
        <div className="flex justify-between items-start">
          <div
            className={cn(
              "p-5 rounded-[22px] border transition-all duration-500 group-hover:scale-110",
              type === "active"
                ? "bg-blue-600/20 border-blue-500/30 text-blue-400"
                : type === "scheduled"
                  ? "bg-orange-600/20 border-orange-500/30 text-orange-400"
                  : "bg-emerald-600/20 border-emerald-500/30 text-emerald-400",
            )}
          >
            {type === "scheduled" ? (
              <Lock className="w-8 h-8" />
            ) : (
              <BrainCircuit className="w-8 h-8" />
            )}
          </div>

          {type === "completed" && (
            <div className="text-left bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
              <p className="text-[10px] text-white/30 font-black uppercase mb-1">
                Score
              </p>
              <p className="text-3xl font-[1000] text-emerald-400 tracking-tighter">
                {quiz.score}
                <span className="text-xs text-white/20">
                  /{quiz.questions?.length || 0}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl font-[1000] text-white leading-tight tracking-tight group-hover:text-blue-400 transition-colors">
            {quiz.title}
          </h3>

          {type === "scheduled" ? (
            <div className="flex items-center gap-3 text-orange-400 bg-orange-400/10 px-4 py-2 rounded-2xl border border-orange-400/20 w-fit">
              <Hourglass className="w-4 h-4 animate-spin-slow" />
              <span className="text-xs font-black italic">
                يفتح في: {new Date(quiz.scheduledAt).toLocaleString("ar-EG")}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                <Clock className="w-3 h-3 text-blue-500" /> {quiz.duration} Min
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                <BookOpen className="w-3 h-3 text-purple-500" />{" "}
                {quiz.questions?.length || 0} Items
              </span>
            </div>
          )}
        </div>

        {type === "active" ? (
          <Link href={`/dashboard/student/quiz/${quiz._id}`} className="block">
            <Button className="w-full h-18 bg-white hover:bg-blue-600 text-slate-950 hover:text-white rounded-[25px] font-[1000] text-xl gap-4 shadow-2xl transition-all active:scale-95 group/btn">
              بدء المهمة{" "}
              <ArrowLeft className="w-6 h-6 group-hover/btn:translate-x-[-8px] transition-transform rotate-180" />
            </Button>
          </Link>
        ) : type === "scheduled" ? (
          <div className="w-full h-16 rounded-[25px] border border-white/5 bg-white/[0.02] flex items-center justify-center gap-3 text-orange-400/40 font-black italic uppercase tracking-widest">
            Access Denied
          </div>
        ) : (
          <div className="w-full h-16 rounded-[25px] border border-white/5 bg-white/[0.02] flex items-center justify-center gap-3 text-emerald-400/40 font-black italic uppercase tracking-widest">
            <CheckCircle2 className="w-5 h-5" /> Mission Secured
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full py-40 bg-white/5 backdrop-blur-xl rounded-[60px] text-center border-2 border-dashed border-white/5">
      <AlertCircle className="w-20 h-20 text-white/5 mx-auto mb-6" />
      <p className="text-2xl font-black text-white/20 italic">{message}</p>
    </div>
  );
}

function StatHUD({ icon, label, value }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] px-8 py-4 flex items-center gap-5 shadow-xl group hover:bg-white/10 transition-all">
      <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-right">
        <p className="text-[10px] font-[1000] text-white/30 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-[1000] text-white tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}
