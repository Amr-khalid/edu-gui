"use client";
import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  BookOpen,
  ChevronLeft,
  Loader2,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  MonitorPlay,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode"; // استيراد مفكك التوكن

export default function StudentCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState ([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000" ;

  // --- 1. فك التوكن واستخراج بيانات الطالب (المدرس والسكشن) ---
  const studentInfo = useMemo(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode<any>(token); // سيحتوي على teacherId و section
    } catch (e) {
      return null;
    }
  }, []);

  // --- 2. جلب البيانات من السيرفر ---
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/calendar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);

      // أنيميشن الدخول الهادئ
      gsap.fromTo(
        ".event-node",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" },
      );
    } catch (err) {
      toast.error("فشل في مزامنة الرادار الزمني");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- 3. منطق الفلترة الاحترافي (المدرس + السكشن) ---
  const filteredEvents = useMemo(() => {
    if (!studentInfo) return [];
    return events.filter(
      (e) =>
        e.teacherId === studentInfo.teacherId || e.teacherId === "697e31c30481b81b48a235a2" && // مطابقة المدرس
        (e.section === studentInfo.section || e.section === "all"), // مطابقة السكشن أو العام
    );
  }, [events, studentInfo]);

  // أيام الأحداث للتقويم
  const eventDays = useMemo(
    () => filteredEvents.map((e) => new Date(e.date)),
    [filteredEvents],
  );

  // أحداث اليوم المختار
  const dayEvents = useMemo(() => {
    if (!date) return [];
    const selectedDateStr = date.toDateString();
    return filteredEvents.filter(
      (e) => new Date(e.date).toDateString() === selectedDateStr,
    );
  }, [date, filteredEvents]);

  if (loading)
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-white/20 font-black tracking-widest text-[10px] uppercase">
          Syncing Schedule Matrix...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-12 text-white rtl relative overflow-hidden">
      {/* 🌌 الخلفية الزجاجية */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] z-0" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
              جداولي <span className="text-blue-500">الزمنية</span>
            </h1>
            <p className="text-white/40 font-bold italic">
              مزامنة أحداث مستر {studentInfo?.teacherName || "المعلم"} المعتمدة
              لك.
            </p>
          </div>
          <Card className="bg-white/5 backdrop-blur-3xl px-8 py-4 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <div className="text-right">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                المواعيد المؤكدة
              </p>
              <p className="text-3xl font-black text-blue-400 italic leading-none">
                {filteredEvents.length}
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: The Calendar */}
          <div className="lg:col-span-5">
            <Card className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-2xl">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="mx-auto scale-110"
                dir="rtl"
                modifiers={{ hasEvent: eventDays }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: "bold",
                    color: "#3b82f6",
                    borderBottom: "3px solid #3b82f6",
                    borderRadius: "0px",
                  },
                }}
              />
              <div className="mt-10 p-6 bg-blue-500/5 rounded-[30px] border border-blue-500/10 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase">
                  <ShieldCheck className="w-4 h-4" /> بروتوكول المزامنة
                </div>
                <p className="text-xs text-white/40 leading-relaxed font-bold italic">
                  يتم الآن عرض أحداث السكشن {studentInfo?.section} فقط.
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Agenda Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-2xl font-black italic flex items-center gap-3">
                <Zap className="text-blue-500 w-5 h-5 animate-pulse" />
                {date?.toLocaleDateString("ar-EG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <Badge className="bg-blue-500/10 text-blue-400 border-none px-4 py-2 rounded-xl font-black text-[10px]">
                {dayEvents.length} سجلات اليوم
              </Badge>
            </div>

            <div className="space-y-4">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <div
                    key={event._id}
                    className="event-node group bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-[35px] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all duration-500 flex items-center gap-6"
                  >
                    {/* Time Box */}
                    <div
                      className={cn(
                        "w-20 h-20 rounded-[24px] flex flex-col items-center justify-center shrink-0 border border-white/5",
                        event.type === "quiz"
                          ? "bg-red-500/5 text-red-500"
                          : "bg-blue-500/5 text-blue-500",
                      )}
                    >
                      <span className="text-lg font-black tracking-tighter">
                        {new Date(event.date).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <Clock className="w-3 h-3 opacity-30 mt-1" />
                    </div>

                    <div className="flex-1 text-right space-y-1">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[9px] font-black text-white/20 uppercase">
                          SEC: {event.section}
                        </span>
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 text-[8px] font-black uppercase border-white/10 text-white/40 group-hover:text-blue-400"
                        >
                          {event.type === "quiz" ? "اختبار" : "محاضرة"}
                        </Badge>
                      </div>
                      <h4 className="text-xl font-black italic text-white/90 group-hover:text-white transition-colors leading-none">
                        {event.title}
                      </h4>
                    </div>

                    <ArrowUpRight className="w-6 h-6 text-white/10 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white/[0.01] rounded-[60px] border-2 border-dashed border-white/5 opacity-20">
                  <MonitorPlay className="w-16 h-16 text-white mb-4 opacity-30" />
                  <p className="text-xl font-black italic uppercase tracking-[0.4em]">
                    Grid Empty
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        body {
          background-color: #020617;
        }
        .rdp {
          --rdp-accent-color: #3b82f6 !important;
        }
        .rdp-day_selected {
          background-color: #3b82f6 !important;
          color: white !important;
          font-weight: 900 !important;
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  );
}
