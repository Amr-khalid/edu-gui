"use client";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CheckCircle2,
  Trophy,
  Clock,
  ArrowRight,
  Sparkles,
  Bell,
  Loader2,
  Target,
  Zap,
  SortDesc, // 👈 تم إضافة أيقونة الترتيب
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import gsap from "gsap";
import { toast } from "sonner";

export default function StudentCrystalDashboard() {
  const [report, setReport] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [isReversed, setIsReversed] = useState(false); // 👈 State للتحكم في الترتيب

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [reportRes, quizzesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/stats/student/full-report`, { headers }),
        axios.get(`${API_BASE}/api/quizzes/student`, { headers }),
      ]);

      setReport(reportRes.data);
      setQuizzes(quizzesRes.data);
      setAttendanceCount(reportRes.data.profile.attendanceCount);

      gsap.fromTo(
        ".reveal",
        { opacity: 0, y: 30, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
        },
      );
    } catch (err) {
      toast.error("حدث خطأ أثناء مزامنة بياناتك");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 👈 منطق الترتيب: نقوم بإنشاء مصفوفة مرتبة بناءً على الـ State
  const displayedQuizzes = useMemo(() => {
    return isReversed ? [...quizzes].reverse() : quizzes;
  }, [quizzes, isReversed]);

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 opacity-30" />
        <p className="text-white/20 font-white tracking-[0.5em] uppercase mt-6 text-[10px]">
          Crystalizing Hub...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 space-y-10 font-sans text-white relative overflow-hidden selection:bg-blue-500/30">
      {/* 🌌 Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] z-0" />

      {/* --- ترحيب ملكي زجاجي --- */}
      <div className="reveal relative overflow-hidden bg-white/5 backdrop-blur-3xl p-10 rounded-[50px] border border-white/10 shadow-2xl z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter flex items-center gap-4">
              مرحباً بك، {report?.profile?.name?.split(" ")[0] || "يا بطل"}{" "}
              <Sparkles className="text-yellow-400 fill-yellow-400 w-10 h-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </h1>
            <p className="text-white/50 font-bold text-xl italic">
              أنت الآن في الرتبة{" "}
              <span className="text-blue-400">
                #{report?.summary?.rank || "0"}
              </span>
              . استمر في التحليق!
            </p>
          </div>
          <div className="bg-blue-600/20 backdrop-blur-xl px-10 py-6 rounded-[35px] border border-white/10 text-center">
            <p className="text-[10px] font-white text-blue-400 uppercase tracking-widest mb-1">
              Group ID
            </p>
            <p className="text-3xl font-[1000] text-white italic">
              SECTION {report?.profile?.section}
            </p>
          </div>
        </div>
      </div>

      {/* --- كروت الإحصائيات الكريستالية --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {[
          {
            title: "متوسط درجاتي",
            value: report?.summary?.averageScore  ,
            icon: Target,
            color: "text-emerald-400",
          },
          {
            title: "أيام الحضور",
            value: attendanceCount,
            icon: CheckCircle2,
            color: "text-blue-400",
          },
          {
            title: "كويزات مكتملة",
            value: report?.summary?.quizzesCompleted ,
            icon: Trophy,
            color: "text-amber-400",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="reveal bg-white/5 backdrop-blur-2xl p-8 rounded-[45px] border border-white/10 hover:bg-white/10 transition-all group shadow-xl"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}
            >
              <item.icon className="w-8 h-8" />
            </div>
            <p className="text-[11px] font-white text-white/30 uppercase tracking-widest mb-1">
              {item.title}
            </p>
            <h2 className="text-5xl font-[1000] tracking-tighter text-white">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* --- قائمة الاختبارات - واجهة زجاجية --- */}
        <div className="lg:col-span-8 space-y-8 text-right">
          <div className="flex flex-row-reverse items-center justify-between px-4">
            <h3 className="text-2xl font-[1000] text-white tracking-tight flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-500 fill-current shadow-blue-500" />{" "}
              المهام المتاحة الآن
            </h3>

            {/* 👈 زر الترتيب الجديد */}
            <Button
              onClick={() => setIsReversed(!isReversed)}
              variant="ghost"
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-6 h-auto hover:bg-white/10 transition-all gap-3 text-white/50 hover:text-white"
            >
              <SortDesc
                className={cn(
                  "w-5 h-5 transition-transform duration-500",
                  isReversed && "rotate-180",
                )}
              />
              <span className="font-white text-[10px] uppercase tracking-widest">
                {isReversed ? "الأقدم أولاً" : "الأحدث أولاً"}
              </span>
            </Button>
          </div>

          <div className="space-y-6">
            {displayedQuizzes.length > 0 ? (
              displayedQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="reveal group bg-white/5 backdrop-blur-2xl p-8 rounded-[50px] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/[0.08] transition-all duration-500"
                >
                  <div className="flex gap-8 items-center">
                    <div
                      className={cn(
                        "w-20 h-20 rounded-[30px] flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105",
                        quiz.isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-blue-500/10 border-blue-500/20 text-blue-400",
                      )}
                    >
                      {quiz.isCompleted ? (
                        <CheckCircle2 className="w-10 h-10" />
                      ) : (
                        <BookOpen className="w-10 h-10" />
                      )}
                    </div>
                    <div className="text-right">
                      <h4 className="text-2xl font-[1000] text-white tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                        {quiz.title}
                      </h4>
                      <div className="flex gap-4 mt-3">
                        <span className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-white text-white/40 uppercase tracking-widest leading-none">
                          <Clock className="w-3 h-3" /> {quiz.duration} MIN
                        </span>
                        {quiz.isCompleted && (
                          <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-white">
                            SCORE: {quiz.score}/{quiz.questions?.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!quiz.isCompleted ? (
                    <Link href={`/dashboard/student/quiz/${quiz._id}`}>
                      <Button className="rounded-[25px] bg-white hover:bg-blue-600 text-slate-950 hover:text-white h-18 px-12 font-[1000] text-xl gap-3 shadow-2xl transition-all active:scale-95">
                        بدء الرحلة <ArrowRight className="w-6 h-6" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="bg-white/5 border border-white/10 text-white/20 px-10 py-5 rounded-[25px] font-[1000] uppercase italic tracking-[0.2em]">
                      MISSION DONE
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white/5 backdrop-blur-xl p-24 rounded-[60px] text-center border-2 border-dashed border-white/5">
                <p className="text-4xl font-[1000] text-white/10 uppercase tracking-widest">
                  No Active Missions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- التنبيهات الجانبية --- */}
        <div className="lg:col-span-4 space-y-8 text-right">
          <h3 className="text-2xl font-[1000] text-white px-4 flex flex-row-reverse items-center gap-3">
            <Bell className="w-6 h-6 text-amber-500" /> مركز البث
          </h3>
          <Card className="reveal bg-white/5 backdrop-blur-3xl p-10 rounded-[55px] border border-white/10 shadow-2xl space-y-8">
            <div className="p-6 bg-amber-500/10 rounded-[35px] border border-amber-500/20 group hover:bg-amber-500/20 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <div className="flex flex-row-reverse items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-[10px] font-[1000] uppercase text-amber-400 tracking-[0.3em]">
                  Urgent Note
                </span>
              </div>
              <p className="text-white/80 font-bold leading-relaxed text-sm"></p>
            </div>
            <Link href="/dashboard/student/notifications" className="block">
              <Button
                variant="ghost"
                className="w-full h-16 rounded-[22px] border border-white/5 text-white/40 font-white text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
              >
                Access All Frequencies
              </Button>
            </Link>
          </Card>
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
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
