"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Timer,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Sparkles,
  HelpCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";
import gsap from "gsap";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function QuizRoomCrystal() {
  const { id } = useParams();
  const router = useRouter();

  // --- States ---
  const [quiz, setQuiz] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answersMap, setAnswersMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE= `${API}/api`;

  // --- 1. Fetch Quiz Data from API ---
  const fetchQuiz = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuiz(res.data);
      setTimeLeft(res.data.duration * 60);

      // أنيميشن الدخول الكريستالي
      gsap.fromTo(
        ".exam-hub",
        { opacity: 0, y: 30, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power4.out",
        },
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل تحميل الاختبار");
      router.push("/dashboard/student/quizzes");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  // --- 2. Countdown Logic ---
  useEffect(() => {
    if (loading || !quiz || timeLeft <= 0 || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, quiz, isFinished]);

  // --- 3. Interaction Handlers ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSelect = (optionIdx: number) => {
    setAnswersMap((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleFinish = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      // تحويل الإجابات للمصفوفة التي يتوقعها السيرفر
      const finalAnswers = quiz.questions.map((_: any, i: number) =>
        answersMap[i] !== undefined ? answersMap[i] : -1,
      );

      await axios.post(
        `${API_BASE}/quizzes/submit`,
        {
          quizId: id,
          answers: finalAnswers,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsFinished(true);
      toast.success("تم تأمين إجاباتك وتسليم الاختبار بنجاح ✅");
    } catch (err) {
      toast.error("خطأ أثناء تسليم الاختبار");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 opacity-20" />
        <p className="text-white/20 font-black tracking-[0.5em] uppercase text-[10px]">
          Establishing Secure Link...
        </p>
      </div>
    );

  if (isFinished) return <ResultViewCrystal title={quiz.title} />;

  const activeQ = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-10 font-sans text-white relative overflow-hidden rtl">
      {/* 🌌 Background Decoration */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] z-0" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10 exam-hub">
        {/* HUD Top Bar */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600/20 rounded-[22px] border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-[1000] text-white tracking-tight">
                {quiz.title}
              </h1>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">
                سؤال {currentIdx + 1} من {quiz.questions.length}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-4 px-10 py-4 rounded-[25px] font-[1000] text-4xl border transition-all duration-700",
              timeLeft < 60
                ? "bg-red-500/20 text-red-500 border-red-500/40 animate-pulse"
                : "bg-white/5 text-white border-white/10",
            )}
          >
            <Timer className="w-8 h-8" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress System */}
        <div className="space-y-3">
          <Progress
            value={progress}
            className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5"
          />
          <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest px-2">
            <span>Task Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[55px] shadow-2xl overflow-hidden relative">
          <CardContent className="p-12 md:p-16 space-y-12">
            <div className="text-right space-y-6">
              <div className="flex items-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-1.5 rounded-full w-fit border border-blue-500/20">
                <Sparkles className="w-4 h-4" /> Focus Mode Active
              </div>
              <h2 className="text-3xl md:text-5xl font-[1000] text-white leading-tight italic">
                {activeQ.text}
              </h2>
              {activeQ.image && (
                <div className="rounded-[40px] overflow-hidden border-8 border-white/5 bg-white/5 p-4 shadow-2xl">
                  <img
                    src={activeQ.image}
                    className="w-full max-h-[400px] object-contain rounded-[25px]"
                    alt="Visual Task"
                  />
                </div>
              )}
            </div>

            {/* Options Terminal */}
            <div className="grid grid-cols-1 gap-5">
              {activeQ.options.map((option: string, idx: number) => {
                const isSelected = answersMap[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className={cn(
                      "group flex items-center justify-between p-8 rounded-[30px] border-2 transition-all duration-500 text-right relative overflow-hidden",
                      isSelected
                        ? "border-blue-500 bg-blue-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]"
                        : "border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 text-white/70",
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black border transition-colors",
                          isSelected
                            ? "bg-white text-blue-600 border-white"
                            : "bg-white/5 border-white/10 text-white/30",
                        )}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xl font-bold tracking-tight">
                        {option}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 animate-in zoom-in duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center gap-6 pb-20">
          <Button
            variant="ghost"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => p - 1)}
            className="rounded-[25px] h-18 px-12 font-black text-white/30 hover:text-white hover:bg-white/5 transition-all text-lg italic"
          >
            السابق
          </Button>

          {currentIdx === quiz.questions.length - 1 ? (
            <Button
              onClick={handleFinish}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-[35px] h-20 px-16 font-[1000] text-2xl shadow-2xl shadow-emerald-500/20 gap-4 transition-all active:scale-95"
            >
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="w-7 h-7" /> إنهاء وتسليم
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIdx((p) => p + 1)}
              className="bg-white hover:bg-blue-600 text-slate-950 hover:text-white rounded-[35px] h-20 px-16 font-[1000] text-2xl shadow-2xl transition-all active:scale-95 gap-4"
            >
              السؤال التالي <ArrowRight className="w-7 h-7" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultViewCrystal({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 rtl">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
      </div>
      <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[60px] p-16 max-w-2xl w-full text-center shadow-2xl relative z-10">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/30">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-5xl font-[1000] text-white tracking-tighter mb-4 italic">
          مهمة مكتملة!
        </h1>
        <p className="text-white/40 text-xl font-bold mb-10 leading-relaxed">
          لقد أتممت اختبار <span className="text-blue-400">{title}</span>. تم
          تأمين إجاباتك في قاعدة البيانات، ستظهر النتيجة في سجل دراساتك قريباً.
        </p>
        <Link href="/dashboard/student">
          <Button className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-[30px] font-[1000] text-2xl shadow-xl transition-all active:scale-95">
            العودة لمقر القيادة
          </Button>
        </Link>
      </Card>
    </div>
  );
}
