// app/dashboard/student/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Trophy,
  UserCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import * as echarts from "echarts";
import gsap from "gsap";
import axios from "axios";
import { toast } from "sonner";

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. جلب بيانات الطالب والكوزات المتاحة
    const fetchData = async () => {
      try {
        const [statsRes, quizRes] = await Promise.all([
          axios.get("/api/student/my-stats"), // API يعيد الحضور والدرجات
          axios.get("/api/quizzes/my-section"),
        ]);
        setStudentData(statsRes.data);
        setQuizzes(quizRes.data);

        // تشغيل أنيميشن الدخول
        gsap.from(".stat-card", {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
        });
      } catch (err) {
        toast.error("فشل في تحميل البيانات");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (studentData && chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        tooltip: { trigger: "axis" },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: studentData.performanceHistory.map((h) => h.date),
          axisLine: { lineStyle: { color: "#94a3b8" } },
        },
        yAxis: { type: "value", max: 100 },
        series: [
          {
            name: "درجتك",
            type: "line",
            smooth: true,
            data: studentData.performanceHistory.map((h) => h.score),
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(59, 130, 246, 0.5)" },
                { offset: 1, color: "rgba(59, 130, 246, 0)" },
              ]),
            },
            lineStyle: { width: 4, color: "#3b82f6" },
            itemStyle: { color: "#3b82f6" },
          },
        ],
      };
      chart.setOption(option);
    }
  }, [studentData]);

  return (
    <div ref={containerRef} className="p-6 max-w-7xl mx-auto space-y-8 rtl">
      {/* الترحيب بالخلفية المتحركة */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">
            أهلاً بك، {studentData?.name || "طالبنا المتميز"} 👋
          </h1>
          <p className="text-blue-100 opacity-90">
            سكشن: {studentData?.section} | مستواك العام: ممتاز
          </p>
        </div>
        <Trophy className="absolute left-10 top-1/2 -translate-y-1/2 h-32 w-32 text-white/10" />
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="stat-card border-none shadow-lg bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-2xl text-green-600">
              <UserCheck className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">نسبة الحضور</p>
              <h3 className="text-2xl font-bold">
                {studentData?.attendancePercentage || 0}%
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card border-none shadow-lg bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">كوزات مكتملة</p>
              <h3 className="text-2xl font-bold">
                {studentData?.completedQuizzes || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card border-none shadow-lg bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-purple-100 rounded-2xl text-purple-600">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">متوسط الدرجات</p>
              <h3 className="text-2xl font-bold">
                {studentData?.avgScore || 0}%
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* منحنى الأداء (ECharts) */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-500" /> منحنى تطور
              المستوى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={chartRef} className="w-full h-[350px]" />
          </CardContent>
        </Card>

        {/* الكوزات المتاحة حالياً */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-500" /> كوزات نشطة الآن
          </h2>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <Card
                key={quiz._id}
                className="border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer group shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600"
                    >
                      مدة: {quiz.duration} دقيقة
                    </Badge>
                    <Badge className="bg-red-500">جديد</Badge>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{quiz.title}</h4>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-gray-400">
                      عدد الأسئلة: {quiz.questions.length}
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full bg-blue-600 hover:bg-blue-700 group-hover:px-6 transition-all"
                    >
                      ابدأ الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="p-10 text-center bg-gray-50 rounded-2xl border-dashed border-2 text-gray-400">
              لا توجد كوزات متاحة حالياً لسكشن {studentData?.section}
            </div>
          )}

          {/* التقويم المصغر */}
          <Card className="bg-indigo-50 border-none shadow-none rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <CalendarIcon className="h-10 w-10 text-indigo-600" />
                <div>
                  <p className="text-sm text-indigo-600 font-bold">
                    المحاضرة القادمة
                  </p>
                  <p className="text-lg font-black text-indigo-900">
                    الأحد، 10 صباحاً
                  </p>
                </div>
              </div>
              <Progress value={65} className="h-2 bg-indigo-200" />
              <p className="text-[10px] mt-2 text-indigo-400">
                باقي يومين و 4 ساعات على موعدك القادم
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
