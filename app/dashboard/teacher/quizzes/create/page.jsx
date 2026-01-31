"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Send,
  Clock,
  Loader2,
  Sparkles,
  LayoutGrid,
  PenTool,
  Trash2,
  ShieldCheck,
  CalendarClock,
  PauseCircle,
  PlayCircle,
  Settings2,
  Zap,
} from "lucide-react";
import QuestionItem from "../../../../components/quiz/QuestionItem";
import axios from "axios";
import { toast } from "sonner";
import gsap from "gsap";
import Link from "next/link";

export default function CreateQuizGlassPage() {
  const [loading, setLoading] = useState(false);
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    section: "",
    duration: 30,
    status: "active", // الحقول الجديدة
    scheduledAt: "", // الحقول الجديدة
  });

  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctIndex: 0, image: "" },
  ]);

  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".glass-panel",
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
      },
    );
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctIndex: 0, image: "" },
    ]);
  };

  const updateQuestion = (idx , field , value ) => {
    const newQuestions = [...questions];
    (newQuestions[idx] )[field] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (idx ) => {
    if (questions.length === 1)
      return toast.error("يجب إضافة سؤال واحد على الأقل");
    setQuestions(questions.filter((_, i) => i !== idx));
  };
  const API_BASE = process.env.NEXT_PUBLIC_API_URL 

  const handlePublish = async () => {
    if (!quizInfo.title || !quizInfo.section)
      return toast.error("أكمل بيانات العنوان والسكشن");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // نرسل الـ quizInfo كاملة شاملة الحالة والموعد
      await axios.post(
        `${API_BASE}/api/quizzes`,
        { ...quizInfo, questions },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("تم نشر الرادار التعليمي بنجاح 🚀");
      setTimeout(
        () => (window.location.href = "/dashboard/teacher/quizzes"),
        1500,
      );
    } catch (err ) {
      toast.error(err.response?.data?.message || "فشل الاتصال ببرج البيانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-6 md:p-10 space-y-12 pb-32 font-sans text-white relative overflow-hidden selection:bg-blue-500/40"
    >
      {/* 🌌 Background Elements */}
      <div className="fixed inset-0 z-[-1] bg-[#050505]" />
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] z-[-1]" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] z-[-1]" />

      {/* 🛠️ Main Config Panel - Glass HUD */}
      <div className="glass-panel bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[50px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

        <div className="relative z-10 space-y-10 text-right">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
              <Settings2 className="w-6 h-6 text-white/40" />
              <div className="text-right">
                <p className="text-[10px] font-black text-white/20 uppercase">
                  Core Status
                </p>
                <p className="text-sm font-bold text-emerald-400 italic">
                  SYSTEM READY
                </p>
                <p className="text-sm font-bold text-emerald-400 italic">
                  <Link href="/dashboard/teacher/quizzes/results">
         Results Overview
        </Link>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-[1000] tracking-tighter italic">
                  بناء اختبار جديد
                </h1>
                <p className="text-white/40 font-bold text-sm uppercase tracking-widest mt-1">
                  Deploying to secure cloud
                </p>
              </div>
              <div className="p-4 bg-blue-600/20 rounded-[25px] border border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <PenTool className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* العنوان */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2">
                عنوان الاختبار
              </label>
              <Input
                placeholder="اسم الكويز..."
                className="h-16 rounded-[22px] bg-white/5 border-white/10 font-bold text-lg focus:ring-2 focus:ring-blue-500/50 transition-all"
                onChange={(e) =>
                  setQuizInfo({ ...quizInfo, title: e.target.value })
                }
              />
            </div>

            {/* السكشن */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2">
                السكشن
              </label>
              <Select
                onValueChange={(v) => setQuizInfo({ ...quizInfo, section: v })}
              >
                <SelectTrigger className="h-16 rounded-[22px] bg-white/5 border-white/10 font-bold text-lg">
                  <SelectValue placeholder="اختر السكشن" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-2xl border-white/10 text-white rounded-2xl">
                  {["A1", "B2", "C3", "all"].map((sec) => (
                    <SelectItem
                      key={sec}
                      value={sec}
                      className="font-bold py-3 focus:bg-blue-600"
                    >
                      Section {sec.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* الجدولة والحالة (الجديد) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <CalendarClock className="w-3 h-3" /> وقت الفتح تلقائياً
              </label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  className="h-16 rounded-[22px] bg-blue-500/5 border-blue-500/20 font-bold text-white pl-4 text-right"
                  onChange={(e) =>
                    setQuizInfo({
                      ...quizInfo,
                      scheduledAt: e.target.value,
                      status: e.target.value ? "scheduled" : "active",
                    })
                  }
                />
              </div>
            </div>

            {/* الحالة والزمن */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <Clock className="w-3 h-3" /> زمن الاختبار
              </label>
              <div className="relative">
                <Input
                  type="number"
                  defaultValue={30}
                  className="h-16 rounded-[22px] bg-emerald-500/5 border-emerald-500/20 font-black text-2xl text-white pl-14"
                  onChange={(e) =>
                    setQuizInfo({
                      ...quizInfo,
                      duration: e.target.value,
                    })
                  }
                />
                <Zap className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 Questions Grid */}
      <div className="space-y-8 relative z-10">
        <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.4em] px-8 flex items-center gap-3">
          <LayoutGrid className="w-4 h-4" /> رصد بنك الأسئلة
        </h3>
        {questions.map((q, i) => (
          <div
            key={i}
            className="glass-panel bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-2 rounded-[45px] hover:bg-white/[0.04] transition-all relative group"
          >
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[10px] font-black text-white/20 italic group-hover:text-white transition-colors">
              {i + 1}
            </div>
            <QuestionItem
              index={i}
              question={q}
              updateQuestion={updateQuestion}
              removeQuestion={removeQuestion}
            />
          </div>
        ))}
      </div>

      {/* 🚀 Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
        <div className="bg-white/5 backdrop-blur-3xl p-4 rounded-[40px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] flex gap-4">
          <Button
            onClick={addQuestion}
            variant="ghost"
            className="flex-1 h-20 rounded-[30px] text-white hover:bg-white/10 font-black text-xl gap-3 border border-white/5 transition-all shadow-inner"
          >
            <Plus className="w-6 h-6 text-blue-400" /> إضافة سؤال
          </Button>

          <Button
            onClick={handlePublish}
            disabled={loading}
            className="flex-1 h-20 rounded-[30px] bg-white text-black hover:bg-blue-600 hover:text-white font-[1000] text-2xl gap-3 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send className="w-6 h-6" /> نشر الآن
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
