"use client";
import { useEffect, useRef } from "react";
import {
  ShieldCheck,
  Target,
  Rocket,
  Users,
  Zap,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
  Code2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import gsap from "gsap";

export default function AboutPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    // أنيميشن الدخول السينمائي
    gsap.fromTo(
      ".glass-node",
      { opacity: 0, y: 50, filter: "blur(15px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.2,
        duration: 1.5,
        ease: "expo.out",
      },
    );

    // تحريك الأضواء الخلفية بشكل عشوائي
    gsap.to(".bg-light", {
      x: "random(-80, 80)",
      y: "random(-80, 80)",
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#020617] text-white font-sans selection:bg-white/20 relative overflow-hidden rtl"
    >
      {/* 🌌 Background Decoration */}
      <div className="bg-light absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      <div className="bg-light absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px]" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 space-y-32">
        {/* --- Hero Section --- */}
        <section className="text-center space-y-8 glass-node">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />{" "}
            {/* أيقونة بيضاء */}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
              The Future of EdTech
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter leading-none italic">
            نحن نبني <span className="text-blue-500 not-italic">درع</span>{" "}
            <br />
            المعرفة الرقمي.
          </h1>
          <p className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-bold leading-relaxed">
            منصة <span className="text-white">EduShield</span> هي منظومة ذكية
            متكاملة تهدف إلى تمكين الطلاب والمعلمين بأدوات المستقبل.
          </p>
          <div className="flex justify-center gap-6 pt-10">
            <Link href="/login">
              <Button className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-blue-600 hover:text-white font-[1000] text-xl transition-all duration-500 gap-3">
                ابدأ رحلتك{" "}
                <ArrowRight className="w-5 h-5 rotate-180 text-inherit" />
              </Button>
            </Link>
          </div>
        </section>

        {/* --- Vision & Values Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ValueCard
            icon={ShieldCheck}
            title="أمان البيانات"
            desc="تشفير متطور لكل سجلات الطلاب ودرجاتهم لضمان الخصوصية التامة."
          />
          <ValueCard
            icon={Zap}
            title="سرعة الاستجابة"
            desc="نظام استجابة لحظي يعتمد على أحدث تقنيات الـ Cloud لتجربة سلسة."
          />
          <ValueCard
            icon={Target}
            title="دقة التقييم"
            desc="خوارزميات متقدمة لتحليل أداء الطالب وتقديم تقارير دقيقة ومفصلة."
          />
        </div>

        {/* --- Achievement HUD Section --- */}
        <section className="glass-node bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[60px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-[1000] tracking-tight text-white">
                رؤيتنا في{" "}
                <span className="text-blue-500 italic underline">أرقام</span>
              </h2>
              <p className="text-white/50 text-lg font-bold leading-relaxed">
                نحن نؤمن بأن التعليم يجب أن يكون متاحاً، ذكياً، وممتعاً. منصتنا
                تخدم حالياً آلاف الطلاب بمعدل رضا يتجاوز التوقعات.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-5xl font-[1000] text-white">+50,000</p>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                    اختبار منجز
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-5xl font-[1000] text-white">99.9%</p>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                    وقت تشغيل النظام
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 blur-[80px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity" />
              <Card className="bg-white/5 backdrop-blur-2xl border-white/10 p-10 rounded-[45px] relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-inner">
                  <Code2 className="w-8 h-8" /> {/* أيقونة بيضاء */}
                </div>
                <h3 className="text-2xl font-black italic">
                  بنية تحتية متطورة
                </h3>
                <p className="text-white/60 font-medium leading-relaxed">
                  نستخدم تقنيات Next.js و Node.js لضمان أفضل تجربة مستخدم ممكنة
                  وبأعلى سرعة معالجة بيانات.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Footer CTA --- */}
        <section className="text-center py-20 glass-node">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/5">
            <Users className="w-8 h-8 text-white/40" /> {/* أيقونة بيضاء */}
          </div>
          <h3 className="text-4xl md:text-6xl font-[1000] mb-8 italic">
            جاهز لتكون جزءاً من المستقبل؟
          </h3>
          <Link href="/login">
            <Button
              variant="ghost"
              className="h-20 px-16 rounded-[25px] border border-white/10 text-white/40 hover:text-white hover:bg-white/5 font-black text-xl uppercase tracking-[0.3em] transition-all"
            >
              Join the Alliance
            </Button>
          </Link>
        </section>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

// مكون كارت القيم الزجاجي (أيقونات بيضاء)
function ValueCard({ icon: Icon, title, desc }: any) {
  return (
    <Card className="glass-node group bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[50px] hover:bg-white/[0.08] transition-all duration-700 hover:-translate-y-4">
      <div className="w-20 h-20 bg-white/5 rounded-[28px] flex items-center justify-center text-white mb-8 border border-white/10 shadow-inner group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
        <Icon className="w-10 h-10" /> {/* الأيقونة باللون الأبيض */}
      </div>
      <h3 className="text-3xl font-[1000] text-white mb-4 tracking-tight transition-colors">
        {title}
      </h3>
      <p className="text-white/40 font-bold leading-relaxed">{desc}</p>
    </Card>
  );
}
