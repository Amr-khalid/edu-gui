"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Trash2,
  Target,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import AddEventModal from "../../../components/dashboard/AddEventModal";

export default function TeacherCalendarGlassPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState(
    "all",
  );
  const containerRef = useRef(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


  const API_URL = `${API_BASE}/api/calendar`;

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);

      gsap.fromTo(
        ".glass-node",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power4.out",
        },
      );
    } catch (err) {
      toast.error("فشل مزامنة الجدول الدراسي");
    } finally {
      setLoading(false);
    }
  };

  // --- [دالة الحذف الجديدة] ---
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الموعد نهائياً؟")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم الحذف بنجاح ✅");
      fetchEvents(); // تحديث القائمة فوراً
    } catch (err ) {
      toast.error(err.response?.data?.message || "فشل الحذف");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const quizDays = useMemo(
    () => events.filter((e) => e.type === "quiz").map((e) => new Date(e.date)),
    [events],
  );
  const lectureDays = useMemo(
    () =>
      events.filter((e) => e.type === "lecture").map((e) => new Date(e.date)),
    [events],
  );

  const filteredDayEvents = useMemo(() => {
    return events.filter((event) => {
      const isSameDay =
        new Date(event.date).toDateString() === date?.toDateString();
      const matchesFilter = viewFilter === "all" || event.type === viewFilter;
      return isSameDay && matchesFilter;
    });
  }, [date, events, viewFilter]);

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-6 md:p-10 space-y-12 bg-slate-950 text-white font-sans selection:bg-blue-500/30 relative overflow-hidden rtl"
    >
      {/* Background Decor */}
      <div className="fixed top-[-5%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] z-0" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] z-0" />

      {/* Header */}
      <div className="glass-node flex flex-col md:flex-row justify-between items-end gap-6 bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[50px] shadow-2xl relative z-10">
        <div className="text-right space-y-2">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter text-white flex items-center gap-5">
            التقويم الدراسي <CalendarIcon className="text-blue-500 w-10 h-10" />
          </h1>
          <p className="text-white/40 font-bold text-lg italic">
            إدارة المواعيد في بيئة كريستالية متطورة.
          </p>
        </div>
        <AddEventModal onEventAdded={fetchEvents} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 relative z-10">
        {/* --- Left Column: Solid Calendar --- */}
        <div className="lg:col-span-4 space-y-8 glass-node">
          <Card className="bg-white border-none p-8 rounded-[50px] shadow-2xl overflow-hidden text-slate-900">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="mx-auto scale-110 my-4"
              dir="rtl"
              modifiers={{ hasQuiz: quizDays, hasLecture: lectureDays }}
              modifiersStyles={{
                hasQuiz: {
                  backgroundColor: "#fee2e2",
                  color: "#ef4444",
                  fontWeight: "900",
                  borderRadius: "10px",
                },
                hasLecture: {
                  backgroundColor: "#ffedd5",
                  color: "#f97316",
                  fontWeight: "900",
                  borderRadius: "10px",
                },
              }}
            />
            <div className="mt-12 space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">
                تصفية الجدول
              </h4>
              <FilterButton
                label="عرض الكل"
                active={viewFilter === "all"}
                onClick={() => setViewFilter("all")}
                color="blue"
                isSolid
              />
              <FilterButton
                label="الاختبارات"
                active={viewFilter === "quiz"}
                onClick={() => setViewFilter("quiz")}
                color="red"
                isSolid
              />
              <FilterButton
                label="المحاضرات"
                active={viewFilter === "lecture"}
                onClick={() => setViewFilter("lecture")}
                color="orange"
                isSolid
              />
            </div>
          </Card>
        </div>

        {/* --- Right Column: Glass Events List --- */}
        <div className="lg:col-span-6 space-y-8 glass-node">
          <div className="flex items-center justify-between px-8">
            <h3 className="text-3xl font-[1000] text-white tracking-tighter">
              {date?.toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "long",
              })}
            </h3>
            <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-6 py-2 rounded-full font-black text-xs">
              {filteredDayEvents.length} أحداث مسجلة
            </Badge>
          </div>

          <div className="space-y-6">
            {filteredDayEvents.length > 0 ? (
              filteredDayEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-white/5 backdrop-blur-3xl p-8 rounded-[45px] border border-white/10 hover:bg-white/10 transition-all duration-500 flex items-center gap-10 relative"
                >
                  {/* Time Badge */}
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center w-28 h-28 rounded-[35px] shrink-0 border shadow-inner",
                      event.type === "quiz"
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-orange-500/10 border-orange-500/20 text-orange-400",
                    )}
                  >
                    <span className="text-2xl font-[1000]">
                      {new Date(event.date).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Clock className="w-5 h-5 opacity-30 mt-1" />
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">
                      Section {event.section}
                    </p>
                    <h4 className="text-2xl font-black text-white">
                      {event.title}
                    </h4>
                  </div>

                  {/* --- [زر الحذف بلمسة زجاجية] --- */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEvent(event._id)}
                    className="rounded-2xl h-14 w-14 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-xl rounded-[60px] border-4 border-dashed border-white/5 opacity-30">
                <CalendarIcon className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-black uppercase tracking-widest">
                  Empty Timeline
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون زر الفلتر الموحد
function FilterButton({ label, active, onClick, color, isSolid }) {
  const colorClasses = {
    blue: isSolid
      ? "text-blue-600 bg-blue-50 border-blue-100"
      : "text-blue-400 bg-blue-500/10",
    red: isSolid
      ? "text-red-600 bg-red-50 border-red-100"
      : "text-red-400 bg-red-500/10",
    orange: isSolid
      ? "text-orange-600 bg-orange-50 border-orange-100"
      : "text-orange-400 bg-orange-500/10",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 rounded-[22px] text-sm font-black transition-all border",
        active
          ? `${colorClasses[color]} border-current shadow-lg`
          : "text-slate-400 border-transparent hover:bg-slate-50",
      )}
    >
      {label} {active && <CheckCircle2 className="w-5 h-5" />}
    </button>
  );
}
