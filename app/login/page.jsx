"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  ShieldCheck,
  Loader2,
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import gsap from "gsap";
import axios from "axios";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const cardRef = useRef(null);
  const bgRef = useRef(null);
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    // تحريك الأضواء الخلفية بشكل مستمر
    gsap.to(bgRef.current.children, {
      x: "random(-50, 50)",
      y: "random(-50, 50)",
      scale: "random(0.8, 1.2)",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 5,
        from: "random",
      },
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/login`,
        form,
      );
      login(res.data.user, res.data.token);
      toast.success("تم فتح البوابة بنجاح");
    } catch (err) {
      toast.error("فشل التحقق من الهوية");
      // اهتزاز الكارت عند الخطأ
      gsap.to(cardRef.current, { x: 6, duration: 0.05, repeat: 5, yoyo: true });
    } finally {
      setLoading(false);
    }
  };

  // إعدادات الأنيميشن للعناصر الداخلية
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 rtl relative overflow-hidden selection:bg-primary/30">
      {/* 🌌 خلفية مستقبلية حية */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div
        ref={bgRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <motion.div
        ref={cardRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="w-full max-w-[360px] relative z-20"
      >
        {/* تأثير توهج النيون حول الكارت */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur opacity-30 animate-pulse" />

        <Card className="bg-slate-950/70 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative">
          {/* خط ضوئي علوي */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70" />

          <CardContent className="p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Header: شعار وأيقونة */}
              <motion.div
                variants={itemVariants}
                className="text-center space-y-2"
              >
                <div className="inline-flex p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)] mb-2 relative group">
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary animate-ping" />
                  <GraduationCap className="w-7 h-7 text-primary relative z-10" />
                </div>
                <h1 className="text-3xl font-[1000] tracking-tighter text-white drop-shadow-md">
                  Edu<span className="text-primary">Shield</span>
                  <span className="text-[8px] block text-white/30 font-black uppercase tracking-[0.4em] mt-1">
                    Quantum Access Portal
                  </span>
                </h1>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* البريد الإلكتروني */}
                <motion.div variants={itemVariants} className="relative group">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary group-focus-within:drop-shadow-[0_0_5px_rgba(var(--primary),0.5)] transition-all" />
                  <Input
                    type="text"
                    placeholder="معرف الدخول (البريد)"
                    className="h-12 pr-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/70 focus:ring-1 focus:ring-primary/30 text-white font-bold text-sm placeholder:text-white/20 transition-all"
                    required
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </motion.div>

                {/* كلمة المرور */}
                <motion.div variants={itemVariants} className="relative group">
                  <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary group-focus-within:drop-shadow-[0_0_5px_rgba(var(--primary),0.5)] transition-all" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="شفرة المرور"
                    className="h-12 pr-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/70 focus:ring-1 focus:ring-primary/30 text-white font-bold text-sm placeholder:text-white/20 transition-all"
                    required
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </motion.div>

                {/* زر الدخول المستقبلي */}
                <motion.div variants={itemVariants}>
                  <Button
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/80 hover:to-blue-600/80 text-white rounded-xl font-[1000] text-base transition-all duration-500 relative overflow-hidden group shadow-[0_10px_30px_-10px_rgba(var(--primary),0.5)]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-3">
                        تهيئة الاتصال{" "}
                        <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-5px] transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* سطر الحماية */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-2 opacity-30 pt-2"
              >
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">
                  Military-Grade Encryption Active
                </span>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
