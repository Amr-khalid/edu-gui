"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TEACHER_LINKS, STUDENT_LINKS } from "../../config/navigation";
import { cn } from "@/lib/utils";
import { LogOut, GraduationCap, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = user?.role === "TEACHER" ? TEACHER_LINKS : STUDENT_LINKS;

  if (!user) return null;

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      /* 🛠️ التعديل الجوهري هنا: حذفنا hidden وجعلناه flex دائماً مع ضبط الارتفاع والحواف */
      className={cn(
        "flex flex-col w-full h-full glass-effect bg-black/10 backdrop-blur-xl border-white/10 rtl z-50 transition-all",
        "lg:w-72 lg:h-[calc(100vh-2rem)] lg:sticky lg:top-4 lg:right-4 lg:m-4 lg:rounded-[2.5rem] lg:border-l",
      )}
    >
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-4">
        <div className="bg-primary/20 p-2.5 rounded-2xl backdrop-blur-sm border border-white/20 shadow-inner">
          <GraduationCap className="text-primary w-6 h-6" />
        </div>
        <span className="text-2xl font-[1000] tracking-tight bg-gradient-to-l from-white to-white/50 bg-clip-text text-transparent italic">
          EduShield
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <motion.div
              key={link.href}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 * index }}
            >
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-[1.5rem] text-sm font-black transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-white/10 text-white shadow-2xl border border-white/10"
                    : "text-white/40 hover:text-white hover:bg-white/5",
                )}
              >
                {/* Active Indicator (Glow) */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-primary/5 blur-xl"
                  />
                )}

                <link.icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                    isActive
                      ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                      : "text-white/40 group-hover:text-white",
                  )}
                />
                <span className="relative z-10 tracking-tight">
                  {link.name}
                </span>
                {isActive && (
                  <ChevronLeft className="mr-auto w-4 h-4 animate-pulse text-primary" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-6 mt-auto space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 group hover:bg-white/10 transition-all">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3 font-black">
            قاعدة البيانات الأمنية
          </p>
          <div className="flex flex-col gap-1 text-right">
            <p className="text-sm font-[1000] text-white truncate italic">
              {user.name}
            </p>
            <div className="flex items-center gap-2 justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              <p className="text-[10px] text-primary font-black tracking-widest uppercase">
                {user.role === "TEACHER" ? "Faculty Member" : "Active Student"}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-[1.5rem] h-14 transition-all duration-500 border border-white/5 hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-black text-xs uppercase tracking-widest">
            إنهاء الجلسة
          </span>
        </Button>
      </div>
    </motion.div>
  );
}
