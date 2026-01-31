"use client";
import { useEffect, useState } from "react";
import {
  CloudUpload,
  Trash2,
  Eye,
  FilePlus,
  Layers,
  Info,
  Loader2,
  FileCheck,
  X,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import gsap from "gsap";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TeacherMaterialsCrystalPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [file, setFile] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/materials/teacher`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMaterials(res.data);
      gsap.from(".crystal-panel", {
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
      });
    } catch (err) {
      toast.error("فشل جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error("يرجى ملء كافة البيانات");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("section", section || "all");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/materials/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("تم رفع الملزمة للسحابة بنجاح 🚀");
      setTitle("");
      setFile(null);
      fetchMaterials();
    } catch (err) {
      toast.error("فشل الرفع، تأكد من إعدادات التخزين");
    } finally {
      setUploading(false);
    }
  };

  const deleteMaterial = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(materials.filter((m) => m._id !== id));
      toast.success("تم حذف الملف نهائياً");
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 opacity-20" />
        <p className="text-white/20 font-black tracking-[0.3em] uppercase mt-4 text-[10px]">
          Syncing Library...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-12 relative overflow-hidden bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      {/* Background Blobs - تأثير الإضاءة الخلفية */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
          <div className="text-right space-y-2">
            <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter italic flex items-center gap-4">
              المكتبة الرقمية <BookOpen className="text-blue-500 w-10 h-10" />
            </h1>
            <p className="text-white/40 font-bold text-lg max-w-xl">
              إدارة ورفع الملازم التعليمية لطلابك عبر السحابة الذكية.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl px-10 py-6 rounded-[35px] border border-white/10 text-center shadow-2xl">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">
              إجمالي الملازم
            </p>
            <p className="text-4xl font-[1000] text-white">
              {materials.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 📤 Upload Form - Crystal Card */}
          <div className="lg:col-span-4 crystal-panel p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[50px] shadow-2xl space-y-8 self-start relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
            <h3 className="text-2xl font-black flex items-center gap-3">
              <FilePlus className="text-blue-500 w-6 h-6" /> رفع ملف جديد
            </h3>

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-2">
                  عنوان الملزمة
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: مراجعة ليلة الامتحان"
                  className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold text-lg placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-2">
                  السكشن (اختياري)
                </label>
                <Input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="A1, B2..."
                  className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold"
                />
              </div>

              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/10 rounded-[35px] cursor-pointer hover:bg-white/5 hover:border-blue-500/50 transition-all group shadow-inner"
                >
                  {file ? (
                    <FileCheck className="w-12 h-12 text-emerald-400 animate-bounce" />
                  ) : (
                    <CloudUpload className="w-12 h-12 text-white/20 group-hover:text-blue-400 transition-colors" />
                  )}
                  <span className="mt-4 text-xs font-black text-white/40 truncate max-w-full px-4">
                    {file ? file.name : "اضغط لرفع ملف PDF"}
                  </span>
                </label>
              </div>

              <Button
                disabled={uploading}
                className="w-full h-16 rounded-[25px] bg-blue-600 hover:bg-blue-500 text-white font-[1000] text-xl gap-3 shadow-2xl shadow-blue-600/20 transition-all active:scale-95"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {" "}
                    <CloudUpload className="w-6 h-6" /> بدء الرفع الآن{" "}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* 📚 Materials List - Transparent Grid */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.4em] px-4 flex items-center gap-3">
              <Layers className="w-4 h-4" /> Cloud Storage Assets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {materials.length > 0 ? (
                materials.map((m) => (
                  <div
                    key={m._id}
                    className="crystal-panel p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[45px] shadow-xl hover:bg-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-blue-600/20 p-4 rounded-[22px] text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <Button
                        onClick={() => deleteMaterial(m._id)}
                        variant="ghost"
                        className="text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-full h-12 w-12 p-0 transition-all"
                      >
                        <Trash2 className="w-6 h-6" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {m.title}
                      </h4>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                        Target:{" "}
                        {m.section === "all"
                          ? "إلى جميع الطلاب"
                          : `Section ${m.section}`}
                      </p>
                    </div>

                    <div className="mt-10">
                      <Button
                        onClick={() => window.open(m.fileUrl, "_blank")}
                        className="w-full h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-sm gap-3 border border-white/5 shadow-inner transition-all"
                      >
                        <Eye className="w-5 h-5" /> عرض المراجعة النهائية
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full h-60 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[50px] opacity-20">
                  <p className="text-4xl font-[1000] uppercase tracking-widest italic">
                    No Data Found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
