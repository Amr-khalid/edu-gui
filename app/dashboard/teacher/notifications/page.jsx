"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BellRing,
  Send,
  Trash2,
  Megaphone,
  AlertCircle,
  Clock,
  Users,
  Loader2,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import gsap from "gsap";

export default function TeacherNotificationsCrystalPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    section: "all",
    type: "announcement",
  });

  const containerRef = useRef(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/notifications/teacher`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotes(res.data);

      // أنيميشن الظهور الزجاجي
      gsap.fromTo(
        ".glass-panel",
        { opacity: 0, scale: 0.95, y: 30 },
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
      toast.error("فشل في تحديث القائمة");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!form.title || !form.content) return toast.error("أكمل بيانات التنبيه");
    setSending(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/notifications`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم إرسال التنبيه للطلاب بنجاح 🚀");
      setForm({ title: "", content: "", section: "all", type: "announcement" });
      fetchNotes();
    } catch (err) {
      toast.error("فشل الإرسال");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
      toast.success("تم الحذف بنجاح");
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-6 md:p-10 space-y-12 pb-32 font-sans text-white relative overflow-hidden bg-slate-950 selection:bg-blue-500/30 rtl"
    >
      {/* 🌌 Background Decoration - لتعزيز تأثير الشفافية */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] z-0" />

      {/* --- [Section 1] Create Notification Header --- */}
      <section className="space-y-8 relative z-10 glass-panel">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="bg-blue-600/20 p-4 rounded-[22px] border border-blue-500/30 text-blue-400 shadow-lg">
            <BellRing className="w-8 h-8" />
          </div>
          <div className="text-right">
            <h1 className="text-4xl md:text-5xl font-[1000] tracking-tighter italic">
              بث تنبيه جديد
            </h1>
            <p className="text-white/40 font-bold text-sm uppercase tracking-widest mt-1">
              Global Broadcast System
            </p>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[50px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2">
                  عنوان الرسالة
                </label>
                <Input
                  placeholder="عنوان التنبيه..."
                  className="h-16 rounded-[22px] bg-white/5 border-white/10 text-white font-black text-xl placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/40 transition-all"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2">
                  محتوى الإعلان
                </label>
                <Textarea
                  placeholder="اكتب تفاصيل الرسالة هنا بوضوح..."
                  className="min-h-[200px] rounded-[35px] bg-white/5 border-white/10 p-8 text-lg text-white/80 placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/40"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2">
                  الجمهور المستهدف
                </label>
                <Select
                  onValueChange={(v) => setForm({ ...form, section: v })}
                  defaultValue="all"
                >
                  <SelectTrigger className="h-16 rounded-[22px] bg-white/5 border-white/10 font-black text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/90 backdrop-blur-2xl border-white/10 text-white rounded-2xl">
                    <SelectItem value="all" className="font-bold py-3">
                      إلى جميع الطلاب
                    </SelectItem>
                    <SelectItem value="A1" className="font-bold py-3">
                      Section A1
                    </SelectItem>
                    <SelectItem value="B2" className="font-bold py-3">
                      Section B2
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2">
                  درجة الأهمية
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      id: "announcement",
                      label: "إعلان عام",
                      icon: Megaphone,
                      color: "blue",
                    },
                    {
                      id: "urgent",
                      label: "عاجل جداً",
                      icon: ShieldAlert,
                      color: "red",
                    },
                    {
                      id: "reminder",
                      label: "تذكير دوري",
                      icon: Clock,
                      color: "orange",
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setForm({ ...form, type: t.id  })}
                      className={cn(
                        "flex items-center justify-between p-5 rounded-[22px] border transition-all duration-500 font-black text-sm group",
                        form.type === t.id
                          ? `border-${t.color}-500 bg-${t.color}-500/20 text-white shadow-lg shadow-${t.color}-500/10`
                          : "border-white/5 bg-white/5 text-white/30 hover:bg-white/10",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <t.icon
                          className={cn(
                            "w-5 h-5",
                            form.type === t.id
                              ? `text-${t.color}-400`
                              : "text-white/20",
                          )}
                        />
                        {t.label}
                      </div>
                      {form.type === t.id && (
                        <Sparkles className="w-4 h-4 animate-pulse text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSend}
                disabled={sending}
                className="w-full h-20 rounded-[30px] bg-blue-600 hover:bg-blue-500 text-white font-[1000] text-xl gap-4 shadow-2xl shadow-blue-600/20 transition-all active:scale-95 mt-4"
              >
                {sending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Send className="w-6 h-6" /> إطلاق التنبيه
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* --- [Section 2] History - Glass Grid --- */}
      <section className="space-y-8 relative z-10">
        <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em] px-6 flex items-center gap-3">
          <Clock className="w-4 h-4" /> سجل التنبيهات الصادرة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center opacity-20">
              <Loader2 className="animate-spin mx-auto w-12 h-12 text-blue-500" />
            </div>
          ) : (
            notes.map((note) => (
              <Card
                key={note._id}
                className="glass-panel group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[45px] overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-700 shadow-xl"
              >
                <div
                  className={cn(
                    "h-1.5 w-full",
                    note.type === "urgent"
                      ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                      : note.type === "reminder"
                        ? "bg-orange-400"
                        : "bg-blue-500",
                  )}
                />
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 text-right">
                      <h4 className="font-black text-white text-xl tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
                          <Users className="w-3 h-3 text-blue-500" />{" "}
                          {note.section}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3 text-white/20" />{" "}
                          {new Date(note.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(note._id)}
                      className="text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-2xl w-12 h-12 transition-all"
                    >
                      <Trash2 className="w-6 h-6" />
                    </Button>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-3 italic">
                    "{note.content}"
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* تخصيص الـ Scrollbar */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
