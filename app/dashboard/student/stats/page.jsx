"use client";
import { useEffect, useState, useRef } from "react";
import StatCard from "../../../components/dashboard/StatCard";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import gsap from "gsap";
import { toast } from "sonner";

export default function StudentDashboard() {
  const [report, setReport] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  // جلب البيانات من الروت الشامل ومن روت الاختبارات
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // جلب التقرير الشامل والاختبارات المتاحة
      const [reportRes, quizzesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/stats/student/full-report`, {
          headers,
        }),
        axios.get(`${API_BASE}/api/quizzes/student`, { headers }),
      ]);

      setReport(reportRes.data);
      setQuizzes(quizzesRes.data);

      // أنيميشن الدخول الأسطوري
      gsap.fromTo(
        ".reveal",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
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

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 opacity-20" />
        <p className="font-black text-slate-400 tracking-widest animate-pulse">
          جاري تحضير لوحة التحكم...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-10 py-6 px-2 min-h-screen bg-[#F8FAFC]"
    >
      {/* --- ترحيب ملكي --- */}
      <div className="reveal relative overflow-hidden bg-white p-10 rounded-[45px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right">
          <div>
            <h1 className="text-4xl font-[1000] text-slate-900 flex items-center gap-3">
              مرحباً بك، يا {report?.profile?.name.split(" ")[0] || "بطل"}{" "}
              <Sparkles className="text-yellow-500 fill-yellow-500 w-8 h-8" />
            </h1>
            <p className="text-slate-500 font-bold mt-2 text-lg italic">
              مستواك الحالي:{" "}
              <span className="text-blue-600 underline">
                الرتبة {report?.summary?.rank}
              </span>
              . استمر في التألق!
            </p>
          </div>
          <div className="bg-blue-600/5 px-8 py-4 rounded-[25px] border border-blue-100">
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1 text-center">
              سكشن الطالب
            </p>
            <p className="text-2xl font-black text-blue-700 text-center">
              {report?.profile?.section}
            </p>
          </div>
        </div>
      </div>

      {/* --- كروت الإحصائيات الذكية --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="متوسط درجاتي"
          value={report?.summary?.averageScore}
          icon={Target}
          className="reveal bg-white border-none shadow-[0_15px_40px_rgba(0,0,0,0.02)] rounded-[35px]"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="عدد مرات الحضور"
          value={report?.summary?.totalAttendance}
          icon={CheckCircle2}
          className="reveal bg-white border-none shadow-[0_15px_40px_rgba(0,0,0,0.02)] rounded-[35px]"
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="اختبارات مكتملة"
          value={report?.summary?.quizzesCompleted}
          icon={Trophy}
          className="reveal bg-white border-none shadow-[0_15px_40px_rgba(0,0,0,0.02)] rounded-[35px]"
          iconClassName="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- قائمة الاختبارات المتاحة (فلاتر المعلم) --- */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-2xl font-[900] text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" /> الاختبارات المتاحة
            </h3>
            <span className="text-sm font-bold text-slate-400 bg-white px-4 py-1.5 rounded-full border border-slate-100">
              {quizzes.length} متاح حالياً
            </span>
          </div>

          <div className="space-y-5">
            {quizzes.map((quiz) => (
              <Card
                key={quiz._id}
                className={`reveal p-8 border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[40px] bg-white flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500`}
              >
                <div className="flex gap-6 items-center">
                  <div
                    className={`p-5 rounded-[25px] transition-all duration-500 ${quiz.isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}
                  >
                    {quiz.isCompleted ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <Zap className="w-7 h-7 fill-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {quiz.title}
                    </h4>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400 font-bold">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                        <Clock className="w-4 h-4" /> {quiz.duration || 30}{" "}
                        دقيقة
                      </span>
                      {quiz.isCompleted ? (
                        <span className="text-emerald-600 font-black px-3 py-1 bg-emerald-50 rounded-lg">
                          الدرجة: {quiz.score} / {quiz.totalQuestions}
                        </span>
                      ) : (
                        <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-lg italic">
                          جاهز للبدء الآن
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!quiz.isCompleted ? (
                  <Link href={`/dashboard/student/quiz/${quiz._id}`}>
                    <Button className="rounded-2xl bg-blue-600 hover:bg-indigo-600 h-16 px-10 font-black text-lg gap-3 shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                      ابدأ الاختبار <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <div className="bg-slate-100/50 text-slate-400 px-8 py-4 rounded-2xl font-black text-sm">
                    تم إنجاز المهمة بنجاح
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* --- الشريط الجانبي: تنبيهات المعلم الذكية --- */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-2xl font-[900] text-slate-800 px-2 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" /> التنبيهات الأخيرة
          </h3>
          <Card className="reveal p-8 rounded-[45px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white space-y-6">
            {/* هنا يمكن جلب أول تنبيه من مصفوفة الإشعارات */}
            <div className="p-5 bg-orange-50/50 rounded-[30px] border border-orange-100 group hover:bg-orange-50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest">
                  تنبيه هام
                </span>
              </div>
              <p className="text-slate-700 font-bold leading-relaxed text-sm">
                تذكير: موعد الكويز القادم الأحد القادم. يرجى مراجعة الفصل الأول
                جيداً.
              </p>
            </div>

            <Link href="/dashboard/student/notifications" className="block">
              <Button
                variant="ghost"
                className="w-full h-14 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-black hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50/50 transition-all"
              >
                مشاهدة كل الإشعارات
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
