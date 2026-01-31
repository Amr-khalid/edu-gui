"use client";
import { useEffect, useState, useRef } from "react";
import {
  FileText,
  Download,
  Eye,
  Search,
  Library,
  Sparkles,
  Loader2,
  FileType,
  Bookmark,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import gsap from "gsap";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MaterialsCrystalPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/materials/student`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMaterials(res.data);

      // أنيميشن الدخول الكريستالي
      gsap.fromTo(
        ".glass-card",
        { opacity: 0, scale: 0.9, y: 30, filter: "blur(15px)" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
        },
      );
    } catch (err) {
      toast.error("فشل الاتصال بالمكتبة المركزية");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredFiles = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 opacity-20" />
        <p className="text-white/20 font-black tracking-[0.5em] uppercase text-[10px] animate-pulse">
          Syncing Knowledge Vault...
        </p>
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-6 md:p-10 space-y-12 bg-slate-950 text-white font-sans selection:bg-blue-500/30 relative overflow-hidden rtl"
    >
      {/* 🌌 Background Decoration - لتعزيز تأثير الشفافية والزجاج */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Header HUD - زجاجي نيون */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 bg-white/5 backdrop-blur-3xl p-10 rounded-[50px] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-30" />

          <div className="flex items-center gap-8">
            <div className="bg-blue-600/20 p-6 rounded-[30px] text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Library className="w-10 h-10" />
            </div>
            <div className="text-right">
              <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter italic flex items-center gap-4">
                المكتبة الرقمية{" "}
                <Zap className="text-blue-500 w-8 h-8 fill-current animate-pulse" />
              </h1>
              <p className="text-white/40 font-bold text-xl mt-2 tracking-tight">
                أرشيف الموارد التعليمية المتقدمة لطلاب النخبة.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-blue-400 transition-colors" />
            <Input
              placeholder="ابحث في الأرشيف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-14 h-18 bg-white/5 backdrop-blur-xl border-white/10 rounded-[25px] text-white font-black text-lg placeholder:text-white/10 focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
          </div>
        </div>

        {/* Materials Glass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredFiles.map((file) => (
            <Card
              key={file._id}
              className="glass-card group relative overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[55px] shadow-2xl hover:bg-white/[0.08] transition-all duration-700 hover:-translate-y-3"
            >
              {/* زخرفة تقنية خلفية */}
              <div className="absolute -top-10 -right-10 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
                <FileType className="w-48 h-48 rotate-45" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                <div className="flex justify-between items-start">
                  <div className="p-5 bg-blue-600/20 rounded-[25px] border border-blue-500/20 text-blue-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-9 h-9" />
                  </div>
                  <span className="text-[10px] font-[1000] uppercase tracking-[0.3em] bg-white/5 text-white/40 px-5 py-2.5 rounded-full border border-white/5 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all">
                    Secure PDF
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-[1000] text-white leading-[1.1] tracking-tight group-hover:text-blue-400 transition-colors duration-500">
                    {file.title}
                  </h3>
                  <div className="flex items-center gap-5 text-white/20 font-black text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                      <Bookmark className="w-3 h-3 text-blue-500" />{" "}
                      {file.section}
                    </span>
                    <span className="bg-white/5 px-3 py-1 rounded-full">
                      {new Date(file.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => window.open(file.fileUrl, "_blank")}
                    className="flex-[2] h-16 rounded-[22px] bg-white hover:bg-blue-600 text-slate-950 hover:text-white font-[1000] text-lg shadow-2xl transition-all duration-500 gap-3"
                  >
                    <Eye className="w-5 h-5" /> معاينة
                  </Button>

                  <a
                    href={file.fileUrl}
                    download={file.title}
                    className="flex-1"
                  >
                    <Button
                      variant="ghost"
                      className="w-full h-16 rounded-[22px] border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 font-black gap-2 transition-all duration-500"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))}

          {/* Empty State */}
          {filteredFiles.length === 0 && (
            <div className="col-span-full py-48 text-center bg-white/[0.02] backdrop-blur-xl rounded-[80px] border-4 border-dashed border-white/5 opacity-20">
              <Library className="w-24 h-24 mx-auto mb-6" />
              <p className="text-5xl font-[1000] uppercase tracking-tighter italic">
                Archive Empty
              </p>
            </div>
          )}
        </div>
      </div>

      {/* تخصيص الـ Scrollbar ليتناسب مع الشكل الزجاجي المظلم */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
