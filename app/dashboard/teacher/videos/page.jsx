"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Film,
  Trash2,
  MessageSquare,
  Send,
  CalendarClock,
  Play,
  Plus,
  Loader2,
  X,
  UserCircle,
  Reply,
  LayoutGrid,
  Upload,
  Sparkles,
  CheckCircle2,
  Zap,
  Cpu,
  Terminal,
  Radio,
  MonitorPlay,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import gsap from "gsap";

export default function TeacherVideoBroadcastPage() {
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // حالة شريط التحميل
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [replies, setReplies] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    section: "",
    scheduledAt: "",
    description: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchVideos = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/videos/teacher`, {
        headers: getHeaders(),
      });
      setVideos(res.data);
      gsap.fromTo(
        ".vid-node",
        { opacity: 0, scale: 0.7, rotationX: 40, y: 100 },
        {
          opacity: 1,
          scale: 1,
          rotationX: 0,
          y: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
        },
      );
    } catch (err) {
      toast.error("COMM_FAILURE: مزامنة البيانات فشلت");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // --- 🚀 بروتوكول الرفع مع تتبع النسبة المئوية ---
  const handleUpload = async () => {
    if (!formData.title || !videoFile)
      return toast.error("PROMPT: البيانات ناقصة");
    setUploading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("videoFile", videoFile);
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));

    try {
      await axios.post(`${API_BASE}/api/videos/upload`, data, {
        headers: { ...getHeaders(), "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100),
          );
          setUploadProgress(percentCompleted); // تحديث العداد
        },
      });
      toast.success("SYSTEM: تم   حزمة البيانات بنجاح ⚡");
      setFormData({ title: "", section: "", scheduledAt: "", description: "" });
      setVideoFile(null);
      setUploadProgress(0);
      fetchVideos();
    } catch (err) {
      toast.error("ERROR: فشل الإرسال");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("⚠️ هل تريد مسح الهدف نهائياً؟")) return;
    try {
      await axios.delete(`${API_BASE}/api/videos/${id}`, {
        headers: getHeaders(),
      });
      toast.success("تم التخلص من المحتوى");
      fetchVideos();
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <Loader2 className="w-16 h-16 animate-spin text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
        <p className="mt-6 text-white font-black tracking-[0.5em] uppercase text-xs animate-pulse italic">
          Establishing Uplink...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-white rtl font-sans relative overflow-hidden">
      {/* 🌌 الهيكل الخلفي */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-amber-600/5 rounded-full blur-[200px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b07_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b07_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 md:p-12 relative z-10">
        {/* --- Header HUD --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-amber-500/20 pb-12 mb-16">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-[1000] tracking-tighter italic text-white leading-none">
               {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-yellow-700 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                البيانات
              </span>
            </h1>
            <p className="text-white font-bold text-xl italic max-w-2xl border-r-4 border-amber-500 pr-6 uppercase tracking-widest bg-amber-500/5 py-2">
              وحدة التحكم المركزية لل  السحابي
            </p>
          </div>
          <div className="bg-black/40 border border-amber-500/30 p-8 flex items-center gap-8 shadow-2xl">
            <Radio className="w-12 h-12 text-amber-500 animate-pulse" />
            <div className="text-right">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1">
                Total Channels
              </p>
              <p className="text-6xl font-[1000] text-white italic tracking-tighter leading-none">
                {videos.length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* --- لوحة الإطلاق (Console) --- */}
          <Card className="lg:col-span-5 bg-black/60 backdrop-blur-xl border border-white/10 p-12 rounded-none space-y-12 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <h2 className="text-3xl font-[1000] italic uppercase flex items-center gap-5 text-white underline decoration-amber-500 underline-offset-8">
              <Terminal className="text-amber-500 w-10 h-10" /> معايير ال 
              الجديد
            </h2>

            <div className="space-y-10">
              {/* File Upload with Label */}
              <div className="space-y-4">
                <label className="text-xs font-black text-white bg-amber-500/20 px-3 py-1 border-r-2 border-amber-500 uppercase tracking-widest">
                  1. محرك البيانات (Video File)
                </label>
                <div className="relative h-32 w-full bg-white/[0.03] border-2 border-dashed border-white/10 flex items-center justify-center hover:border-amber-500 transition-all cursor-pointer overflow-hidden group">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-3 text-white/40 group-hover:text-white">
                    <Upload className="w-8 h-8" />
                    <span className="font-black italic text-sm uppercase">
                      {videoFile ? videoFile.name : "اضغط لاختيار الفيديو"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar (يظهر فقط عند الرفع) */}
              {uploading && (
                <div className="space-y-3 animate-pulse">
                  <div className="flex justify-between items-end text-[10px] font-black text-amber-500 uppercase tracking-widest italic">
                    <span>Uploading Stream...</span>
                    <span className="text-lg">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-800 to-amber-400 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3 text-right">
                  <label className="text-xs font-black text-white bg-amber-500/10 px-2 uppercase tracking-tighter">
                    2. العنوان (Title)
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-16 rounded-none bg-black border-white/10 text-white font-bold text-lg focus:border-amber-500 outline-none"
                    placeholder="اسم الحصة..."
                  />
                </div>
                <div className="space-y-3 text-right">
                  <label className="text-xs font-black text-white bg-amber-500/10 px-2 uppercase tracking-tighter">
                    3. النطاق (Sector)
                  </label>
                  <Input
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="h-16 rounded-none bg-black border-white/10 text-white font-black text-center focus:border-amber-500 outline-none uppercase"
                    placeholder="SEC-01"
                  />
                </div>
              </div>

              <div className="space-y-3 text-right">
                <label className="text-xs font-black text-white bg-amber-500/10 px-2 uppercase tracking-tighter">
                  4. توقيت الإطلاق (Schedule)
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledAt: e.target.value })
                  }
                  className="h-16 rounded-none bg-black border-white/10 text-white font-bold focus:border-amber-500 outline-none"
                />
              </div>

              <div className="space-y-3 text-right">
                <label className="text-xs font-black text-white bg-amber-500/10 px-2 uppercase tracking-tighter">
                  5. ملخص تقني (Summary)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="rounded-none bg-black border-white/10 text-white font-bold min-h-[120px] p-4 focus:border-amber-500 outline-none"
                  placeholder="اكتب ملخص للطلاب..."
                />
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full h-20 rounded-none bg-amber-700 text-black hover:bg-amber-400 font-[1000] text-3xl gap-4 shadow-2xl transition-all active:scale-95 group/btn"
            >
              {uploading ? (
                <Loader2 className="animate-spin w-10 h-10" />
              ) : (
                <>
                  <Zap className="w-8 h-8" /> إطلاق ال  المباشر
                </>
              )}
            </Button>
          </Card>

          {/* --- القائمة النشطة (Active Archives) --- */}
          <div className="lg:col-span-7 space-y-10">
            <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.8em] px-4 flex items-center gap-5 border-b border-white/10 pb-6">
              <Activity className="w-5 h-5" /> Live Signal Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[900px] overflow-y-auto custom-scrollbar pr-6">
              {videos.map((vid) => (
                <div
                  key={vid._id}
                  className="vid-node group relative cursor-pointer"
                >
                  <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-amber-500/30 transition-all group-hover:w-full group-hover:h-full group-hover:border-amber-500 group-hover:bg-amber-500/[0.02]"></div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-amber-500/30 transition-all group-hover:w-full group-hover:h-full group-hover:border-amber-500"></div>

                  <div className="relative bg-black border border-white/5 overflow-hidden transition-all duration-700 shadow-2xl group-hover:translate-y-[-5px]">
                    <div className="aspect-video bg-[#050505] relative flex items-center justify-center">
                      <div className="w-16 h-16 bg-amber-500/5 backdrop-blur-md border border-amber-500/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-700 z-20 shadow-2xl group-hover:text-black">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                      <div className="absolute top-4 left-4 z-20 flex gap-4">
                        <button
                          onClick={() => {
                            setSelectedVideo(vid);
                            fetchComments(vid._id);
                          }}
                          className="p-3 bg-black border border-white/10 text-white hover:text-amber-500 transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vid._id)}
                          className="p-3 bg-black border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-4 right-6 text-[10px] font-black italic text-amber-500 bg-black/80 px-4 py-1.5 border border-amber-500/20">
                        SEC:{vid.section}
                      </span>
                    </div>

                    <div className="p-10 space-y-4 text-right">
                      <h4 className="text-3xl font-[1000] italic text-white group-hover:text-amber-500 transition-colors uppercase leading-none tracking-tighter">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-white/30 font-bold line-clamp-2 italic leading-relaxed border-r-2 border-amber-500/20 pr-4">
                        {vid.description || "NO DATA DESCRIPTION."}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5 flex-row-reverse text-white/20">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {new Date(vid.scheduledAt).toLocaleDateString(
                              "ar-EG",
                            )}
                          </span>
                          <CalendarClock className="w-4 h-4" />
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/40 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f000;
          border-radius: 0px;
          box-shadow: 0 0 10px #f59e0b;
        }
        body {
          background-color: #020202;
        }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
