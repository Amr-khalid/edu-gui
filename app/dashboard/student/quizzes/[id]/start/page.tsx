"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Timer,
  ChevronRight,
  ChevronLeft,
  Send,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import gsap from "gsap";
import { cn } from "@/lib/utils";

// دالة خلط المصفوفات (Fisher-Yates Shuffle) لضمان عشوائية الأسئلة والخيارات
const shuffle = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function QuizSolvingCrystalPage() {
  const { id } = useParams();
  const router = useRouter();

  // --- States ---
  const [originalQuiz, setOriginalQuiz] = useState<any>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answersMap, setAnswersMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
;

  // --- 1. جلب البيانات وتهيئتها بناءً على الـ JSON المرسل ---
  const initQuiz = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data; // البيانات كما في أوبجكت الامتحان الخاص بك
      setOriginalQuiz(data);
      setTimeLeft(data.duration * 60);

      // تجهيز الأسئلة: خلط الأسئلة وخلط الخيارات مع الحفاظ على مراجع الإجابة الأصلية
      const prepared = data.questions.map((q: any, qIdx: number) => ({
        ...q,
        originalIdx: qIdx, // مرجع السؤال في المصفوفة الأصلية
        shuffledOptions: shuffle(
          q.options.map((opt: string, oIdx: number) => ({
            text: opt,
            oIdx: oIdx, // مرجع الخيار (مثلاً 0 هو الخيار الصحيح في مثالك)
          })),
        ),
      }));

      setShuffledQuestions(shuffle(prepared));

      // أنيميشن الدخول الكريستالي الناعم
      gsap.fromTo(
        ".quiz-stage",
        { opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "expo.out",
        },
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل الدخول لجلسة الاختبار");
      router.push("/dashboard/student/quizzes");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    initQuiz();
  }, [initQuiz]);

  // --- 2. نظام التوقيت والعد التنازلي ---
  useEffect(() => {
    if (loading || !originalQuiz || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, originalQuiz, timeLeft]);

  // --- 3. التعامل مع الإجابات ---
  const onSelect = (originalOptIdx: number) => {
    const q = shuffledQuestions[currentIdx];
    setAnswersMap((prev) => ({ ...prev, [q.originalIdx]: originalOptIdx }));
  };

  const handleFinish = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      // تحويل الإجابات للمصفوفة التي يتوقعها السيرفر بالترتيب الأصلي
      const finalAnswers = originalQuiz.questions.map((_: any, i: number) =>
        answersMap[i] !== undefined ? answersMap[i] : -1,
      );

      await axios.post(
        `${API_BASE}/quizzes/submit`,
        { quizId: id, answers: finalAnswers },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("تم تسليم المهمة وتأمين الإجابات بنجاح ✅");
      router.push("/dashboard/student/quizzes");
    } catch (err) {
      toast.error("خطأ في الاتصال أثناء التسليم");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin opacity-30" />
        <p className="text-white font-black tracking-[0.5em] uppercase text-xs animate-pulse">
          Syncing Secure Environment...
        </p>
      </div>
    );

  const activeQ = shuffledQuestions[currentIdx];
  const progress = ((currentIdx + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-10 font-sans text-white relative overflow-hidden rtl">
      {/* 🌌 تأثيرات إضاءة خلفية ثابتة لإبراز الشفافية */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] z-0" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10 quiz-stage">
        {/* HUD Top Bar - زجاجي بالكامل */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[45px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600/20 rounded-[25px] border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">
                المهمة الحالية
              </p>
              <h3 className="text-4xl font-[1000] text-white leading-none italic">
                {currentIdx + 1}{" "}
                <span className="text-white/20 text-xl font-black tracking-normal">
                  / {shuffledQuestions.length}
                </span>
              </h3>
            </div>
          </div>

          {/* المؤقت الزجاجي */}
          <div
            className={cn(
              "flex items-center gap-5 px-12 py-5 rounded-[30px] font-[1000] text-5xl border transition-all duration-700 shadow-2xl",
              timeLeft < 60
                ? "bg-red-500/20 text-red-500 border-red-500/40 animate-pulse shadow-red-500/20"
                : "bg-white/5 text-white border-white/10 shadow-blue-500/10",
            )}
          >
            <Timer
              className={cn(
                "w-10 h-10",
                timeLeft < 60 ? "text-red-500" : "text-blue-500",
              )}
            />
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>

        {/* خط التقدم النيوني */}
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div
            className="h-full bg-gradient-to-l from-blue-600 to-indigo-400 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card - شفافية قصوى */}
        <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[60px] shadow-2xl overflow-hidden relative">
          <CardContent className="p-12 md:p-20 space-y-12">
            <div className="space-y-8 text-right">
              <div className="flex items-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-5 py-2 rounded-full w-fit border border-blue-500/20">
                <Sparkles className="w-4 h-4" /> Focus Mode: Active
              </div>
              <h2 className="text-4xl md:text-6xl font-[1000] text-white leading-[1.2] tracking-tight italic">
                {activeQ.text}
              </h2>

              {/* عرض الصورة إذا وجدت في الـ JSON */}
              {activeQ.image && activeQ.image !== "" && (
                <div className="rounded-[45px] overflow-hidden border-8 border-white/5 shadow-2xl bg-white/5 p-4">
                  <img
                    src={activeQ.image}
                    alt="Question Context"
                    className="w-full object-contain max-h-[500px] rounded-[35px]"
                  />
                </div>
              )}
            </div>

            {/* الخيارات الزجاجية */}
            <div className="grid grid-cols-1 gap-5">
              {activeQ.shuffledOptions.map((opt: any, i: number) => {
                const isSelected = answersMap[activeQ.originalIdx] === opt.oIdx;
                return (
                  <button
                    key={i}
                    onClick={() => onSelect(opt.oIdx)}
                    className={cn(
                      "group flex items-center justify-between p-9 rounded-[35px] border-2 transition-all duration-500 text-right relative overflow-hidden",
                      isSelected
                        ? "border-blue-500 bg-blue-600 text-white shadow-[0_0_35px_rgba(59,130,246,0.4)] scale-[1.02]"
                        : "border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 text-white/80",
                    )}
                  >
                    <span className="text-2xl font-black tracking-tight">
                      {opt.text}
                    </span>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500",
                        isSelected
                          ? "border-white bg-white"
                          : "border-white/10",
                      )}
                    >
                      {isSelected && (
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-in zoom-in duration-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* أزرار التنقل الزجاجية */}
        <div className="flex justify-between items-center gap-8 pb-20">
          <Button
            variant="ghost"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => p - 1)}
            className="rounded-[35px] h-20 px-14 font-black text-white/30 hover:text-white hover:bg-white/10 transition-all gap-3 text-xl italic"
          >
            <ChevronRight className="w-8 h-8" /> السابق
          </Button>

          {currentIdx === shuffledQuestions.length - 1 ? (
            <Button
              onClick={handleFinish}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-[40px] h-24 px-24 font-[1000] text-3xl shadow-2xl shadow-emerald-500/30 gap-5 transition-all active:scale-95"
            >
              {submitting ? (
                <Loader2 className="animate-spin w-10 h-10" />
              ) : (
                <>
                  <Send className="w-9 h-9" /> إنهاء المهمة
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIdx((p) => p + 1)}
              className="bg-white hover:bg-blue-600 text-slate-950 hover:text-white rounded-[40px] h-24 px-24 font-[1000] text-3xl shadow-2xl transition-all active:scale-95 gap-5"
            >
              التالي <ChevronLeft className="w-9 h-9" />
            </Button>
          )}
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        body {
          background-color: #020617;
        } /* خلفية داكنة جداً لضمان ظهور الشفافية */
      `}</style>
    </div>
  );
}
