"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Trophy,
  BookOpen,
  Activity,
  Zap,
  Loader2,
  Crown,
  ArrowUpRight,
  TrendingUp,
  History,
  Info,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import gsap from "gsap";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const API_BASE = `${API}/api`;

  // --- دالة معالجة درجات API وتحويلها لبيانات رسم بياني ---
  const processGradesForChart = (grades: any[]) => {
    const daysMap = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];

    // إنشاء مصفوفة لآخر 7 أيام
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateStr: d.toISOString().split("T")[0],
        dayName: daysMap[d.getDay()],
        scores: [] as number[],
      };
    });

    // توزيع الدرجات على الأيام المقابلة لها
    grades.forEach((grade) => {
      const gDate = new Date(grade.date).toISOString().split("T")[0];
      const daySlot = last7Days.find((d) => d.dateStr === gDate);
      if (daySlot) {
        // حساب النسبة المئوية (الدرجة / الدرجة القصوى * 100)
        daySlot.scores.push((grade.score / grade.maxScore) * 100);
      }
    });

    // حساب المتوسط لكل يوم
    return last7Days.map((d) => ({
      day: d.dayName,
      score:
        d.scores.length > 0
          ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length)
          : 0,
    }));
  };

  const fetchAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // 1. جلب ملخص الإحصائيات (الحضور، عدد الطلاب، الكوزات النشطة)
      const summaryRes = await axios.get(
        `${API_BASE}/teacher/dashboard-summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // 2. جلب الدرجات حصرياً للرسم البياني
      const gradesRes = await axios.get(`${API_BASE}/grades`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const grades = gradesRes.data;
      const summary = summaryRes.data;

      // معالجة بيانات الرسم البياني من /api/grades
      const processedChartData = processGradesForChart(grades);
      setChartData(processedChartData);

      // دمج البيانات للكروت العلوية
      setStats({
        attendanceToday: summary.attendanceToday || 0,
        totalStudents: summary.totalStudents || 0,
        activeQuizzes: summary.activeQuizzes || 0,
        avgScore: summary.avgScore || "0%",
        recent: grades.slice(0, 5), // عرض آخر الدرجات المرصودة في السايدبار
      });

      gsap.fromTo(
        ".crystal-node",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: "power4.out" },
      );
    } catch (err) {
      toast.error("فشل في مزامنة الرادار التعليمي");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading)
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 opacity-20" />
      </div>
    );
    console.log(stats);
    

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-12 space-y-12 rtl text-white font-sans overflow-hidden relative">
      {/* HUD Header */}
      <div className="crystal-node bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[45px] shadow-2xl relative group">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-right">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter italic">
              مركز التحليل الأكاديمي
            </h1>
            <p className="text-white/40 font-bold text-xl italic leading-relaxed">
              أهلاً مستر {user?.name?.split(" ")[0]}. هذا التقرير يوضح **العلاقة
              بين التزام الطلاب ونتائج الاختبارات**.
            </p>
          </div>
          {/* <div className="bg-emerald-500/10 border border-emerald-500/20 px-8 py-6 rounded-[35px] text-center shadow-inner">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">
              إجمالي جودة الأداء
            </p>
            <div className="text-5xl font-[1000] italic text-white drop-shadow-lg">
              {stats?.avgScore}
            </div>
          </div> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
         
         
          {
            label: "إجمالي الطلاب",
            sub: "عدد الطلاب المسجلين في فصلك",
            val: stats?.totalStudents,
            icon: Crown,
            col: "text-purple-400",
          },
          {
            label: "كوزات نشطة",
            sub: "اختبارات متاحة للحل الآن",
            val: stats?.activeQuizzes,
            icon: BookOpen,
            col: "text-orange-400",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="crystal-node bg-white/[0.03] p-8 rounded-[40px] border border-white/5 hover:bg-white/10 transition-all group"
          >
            <s.icon
              className={`w-8 h-8 ${s.col} mb-4 group-hover:scale-110 transition-transform`}
            />
            <div className="space-y-1">
              <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">
                {s.label}
              </p>
              <p className="text-[9px] text-white/20 font-bold">{s.sub}</p>
            </div>
            <h2 className="text-4xl font-[1000] italic text-white mt-4">
              {s.val}
            </h2>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 crystal-node bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[50px] border border-white/10 shadow-2xl h-[580px] relative">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-[1000] flex items-center gap-4 italic text-white">
              <TrendingUp className="text-emerald-400 w-7 h-7" /> منحنى تطور
              مستوى الدرجات
            </h3>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
              <Info className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-black uppercase text-emerald-400">
                مستمد من /api/grades مباشرة
              </span>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="5 5"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#ffffff20"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={15}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0f172a] border border-white/10 p-4 rounded-2xl shadow-2xl">
                          <p className="text-[10px] font-black text-white/40 mb-1 uppercase tracking-widest">
                            {payload[0].payload.day}
                          </p>
                          <p className="text-emerald-400 font-black text-lg">
                            المتوسط: {payload[0].value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={5}
                  fill="url(#colorScore)"
                  animationDuration={2500}
                >
                  <LabelList
                    dataKey="score"
                    position="top"
                    fill="#fff"
                    fontSize={14}
                    fontWeight="1000"
                    formatter={(v: any) => `${v}%`}
                  />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar */}
        <div className="crystal-node bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[50px] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          <h3 className="text-2xl font-[1000] mb-8 flex items-center gap-4 text-white italic">
            <History className="text-blue-400 w-7 h-7" /> سجل العمليات الأخيرة
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            {stats?.recent.map((g: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center group border-b border-white/5 pb-4"
              >
                <div className="text-right">
                  <p className="font-black text-white group-hover:text-emerald-400 transition-colors">
                    {g.examTitle}
                  </p>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-tighter mt-1">
                    {new Date(g.date).toLocaleDateString("ar-EG")}
                  </p>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-xl text-xs font-black text-emerald-400 border border-white/5">
                  %{Math.round((g.score / g.maxScore) * 100)}
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-10 h-16 bg-white text-black hover:bg-emerald-600 hover:text-white rounded-[25px] font-[1000] text-xl transition-all gap-3 shadow-2xl shadow-white/5">
            عرض التقارير التفصيلية <ArrowUpRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
