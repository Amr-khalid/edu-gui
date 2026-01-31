"use client";

import { useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

export default function Home() {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. أنيميشن الخلفية العائمة (Floating Blobs)
      gsap.to(".floating-blob", {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        scale: "random(0.9, 1.1)",
        duration: "random(5, 10)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { amount: 2 },
      });

      // 2. أنيميشن دخول المحتوى الرئيسي (Hero Section)
      const tl = gsap.timeline({
        defaults: { ease: "expo.out", duration: 1.5 },
      });

      tl.fromTo(
        ".hero-reveal",
        { y: 100, opacity: 0, filter: "blur(20px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.15 },
      );

      // 3. أنيميشن دخول الكروت (Features)
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          stagger: 0.2,
          delay: 1,
        },
      );
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={comp}
      className="min-h-screen bg-[#0A0A0A] relative overflow-hidden text-white selection:bg-indigo-500/30 font-sans"
    >
      {/* --- الخلفية الديناميكية الفخمة --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-blob absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="floating-blob absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="floating-blob absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen" />
        {/* طبقة ضوضاء خفيفة للواقعية */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* --- محتوى الصفحة --- */}
      <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center">
        {/* Hero Section: الزجاج الرئيسي */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 p-12 rounded-[50px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_60px_rgba(79,70,229,0.1)] relative overflow-hidden group">
          {/* لمعة زجاجية عند التحويم */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full"
            style={{ transitionDuration: "1.5s" }}
          />

          <div className="hero-reveal flex justify-center">
            <span className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-black uppercase tracking-widest border border-indigo-500/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> منصة التعليم المستقبلية
            </span>
          </div>

          <h1 className="hero-reveal text-5xl md:text-7xl font-[1000] tracking-tight leading-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            ارتقِ بتعليمك إلى <br /> المستوى الأسطوري.
          </h1>

          <p className="hero-reveal text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            نظام إدارة تعلم متكامل يجمع بين الفخامة والذكاء الاصطناعي. حضور
            إلكتروني، اختبارات تفاعلية، ومكتبة رقمية في مكان واحد.
          </p>

          <div className="hero-reveal flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/login">
              <Button className="h-16 px-10 rounded-[24px] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg gap-3 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95">
                تسجيل الدخول <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                className="h-16 px-10 rounded-[24px] text-zinc-300 hover:text-white hover:bg-white/5 border border-white/5 font-black text-lg transition-all"
              >
                اكتشف المزيد
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section: كروت زجاجية عائمة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group p-8 rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden"
            >
              <div
                className={`w-16 h-16 rounded-3xl ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-3 group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-zinc-400 font-bold leading-relaxed">
                {feature.description}
              </p>
              {/* توهج خلفي عند التحويم */}
              <div
                className={`absolute -bottom-20 -right-20 w-40 h-40 ${feature.glow} blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer بسيط */}
      <footer className="hero-reveal absolute bottom-5 w-full text-center text-zinc-600 text-sm font-bold uppercase tracking-widest">
        © 2026 منصة التعليم المتطورة. جميع الحقوق محفوظة.
      </footer>
    </main>
  );
}

// بيانات المميزات
const features = [
  {
    title: "نظام حضور ذكي",
    description:
      "تسجيل حضور الطلاب عبر QR Code أو يدوياً مع تقارير لحظية وحماية ضد التلاعب.",
    icon: CheckCircle2,
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    glow: "bg-emerald-600",
  },
  {
    title: "مكتبة رقمية شاملة",
    description:
      "رفع وتحميل الملازم والمراجعات بصيغة PDF مع معاينة فورية وتنظيم حسب المجموعات.",
    icon: BookOpen,
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    glow: "bg-blue-600",
  },
  {
    title: "اختبارات تفاعلية",
    description:
      "إنشاء كوزات متقدمة مع تصحيح تلقائي، تايمر، وتحليلات دقيقة لأداء كل طالب.",
    icon: Rocket,
    color: "bg-gradient-to-br from-purple-500 to-pink-600",
    glow: "bg-purple-600",
  },
];
