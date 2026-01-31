"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Play,
  Clock,
  MessageCircle,
  Send,
  UserCircle,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  MonitorPlay,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Box,
  Layers,
  Cpu,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import gsap from "gsap";

export default function StudentVideoHub() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL; ;
  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // --- 1. جلب البيانات بنظام الهوية الرقمية ---
  const fetchVideos = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/videos/student`, {
        headers: getHeaders(),
      });
      setVideos(res.data);

      // أنيميشن الإقلاع الرقمي
      gsap.fromTo(
        ".vid-node",
        { opacity: 0, scale: 0.8, filter: "blur(20px)", y: 40 },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power4.out",
        },
      );
    } catch (err) {
      toast.error("LINK_ERROR: فشل في الاتصال بالبرج المركزي");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const fetchComments = async (videoId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/videos/${videoId}/comments`,
        { headers: getHeaders() },
      );
      setComments(res.data);
      gsap.from(".comment-stream", { opacity: 0, y: 10, stagger: 0.05 });
    } catch (err) {
      console.error("Comms link failed");
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/api/videos/${selectedVideo._id}/comments`,
        { text: newComment },
        { headers: getHeaders() },
      );
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("SIGNAL TRANSMITTED");
    } catch (err) {
      toast.error("UPLINK FAILED");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading)
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center relative">
        <div className="w-16 h-16 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="mt-6 text-cyan-500 font-black tracking-[0.8em] uppercase text-[10px] animate-pulse">
          Syncing Matrix...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#010204] text-white rtl font-sans relative overflow-hidden selection:bg-cyan-500/40">
      {/* 🌌 الخلفية: سديم أزرق وشبكة ليزرية متطورة */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-cyan-600/5 rounded-full blur-[200px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 md:p-12 relative z-10">
        {/* --- Header HUD --- */}
        {!selectedVideo && (
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-500">
                <Globe className="w-4 h-4 animate-spin-slow" />
                <span className="text-[9px] font-black uppercase tracking-[0.6em]">
                  Satellite Uplink Active
                </span>
              </div>
              <h1 className="text-7xl md:text-9xl font-[1000] tracking-tighter italic text-white leading-none">
                برج{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase">
                  المحتوى
                </span>
              </h1>
              <p className="text-white/40 font-bold text-xl italic max-w-2xl border-r-2 border-cyan-500/30 pr-6 uppercase tracking-widest">
                Digital Learning Node v5.0 // No Data Leakage
              </p>
            </div>

            <Card className="bg-white/[0.02] backdrop-blur-3xl border border-cyan-500/20 p-8 rounded-none flex items-center gap-8 shadow-[0_0_50px_rgba(6,182,212,0.05)]">
              <Cpu className="w-12 h-12 text-cyan-400 animate-pulse" />
              <div className="text-right">
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-1">
                  Encrypted Streams
                </p>
                <p className="text-6xl font-[1000] text-white italic tracking-tighter leading-none">
                  {videos.length}
                </p>
              </div>
            </Card>
          </div>
        )}

        {selectedVideo ? (
          /* --- The Command View (مشغل الفيديو المحمي) --- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in zoom-in-95 duration-700">
            <div className="lg:col-span-8 space-y-10">
              <button
                onClick={() => setSelectedVideo(null)}
                className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-none border border-cyan-500/30 text-white font-black hover:bg-cyan-500 hover:text-black transition-all group"
              >
                <ChevronLeft className="rotate-180 group-hover:translate-x-2 transition-transform" />
                <span className="italic uppercase tracking-widest text-[10px]">
                  Return to Central Hub
                </span>
              </button>

              <div className="relative group">
                <div className="absolute -inset-1 bg-cyan-500/20 blur-2xl opacity-20"></div>

                {/* Container المشغل المحمي */}
                <div className="aspect-video bg-black rounded-none border border-white/10 overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,1)]">
                  <video
                    src={selectedVideo.videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    controlsList="nodownload noremoteplayback"
                    onContextMenu={(e) => e.preventDefault()}
                    disablePictureInPicture
                  >
                    Protocols not supported.
                  </video>

                  {/* Scanning Grid Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

                  <div className="absolute top-8 right-8 bg-cyan-600/90 backdrop-blur-md px-4 py-1 rounded-none text-[9px] font-black italic tracking-widest border border-white/20">
                    SECURED NODE // NO_DOWNLOAD
                  </div>
                </div>
              </div>

              <Card className="bg-white/[0.01] backdrop-blur-[60px] border border-white/5 p-12 rounded-none space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[4px] h-full bg-cyan-500"></div>
                <div className="flex justify-between items-start flex-row-reverse">
                  <h1 className="text-5xl font-[1000] italic text-white tracking-tighter uppercase leading-none">
                    {selectedVideo.title}
                  </h1>
                  <ShieldCheck className="w-10 h-10 text-cyan-400 animate-pulse" />
                </div>
                <p className="text-white/50 font-bold leading-relaxed text-xl text-right border-r-2 border-cyan-500/20 pr-6 italic">
                  {selectedVideo.description ||
                    "NO METADATA AVAILABLE FOR THIS SESSION."}
                </p>
              </Card>
            </div>

            {/* Interaction Matrix */}
            <div className="lg:col-span-4 h-fit sticky top-10">
              <Card className="bg-[#050608] border border-cyan-500/20 rounded-none p-10 shadow-2xl flex flex-col max-h-[800px] text-right">
                <div className="flex items-center justify-end gap-4 mb-10 border-b border-white/5 pb-6">
                  <div className="text-right">
                    <h3 className="text-2xl font-[1000] italic text-white uppercase leading-none">
                      Neural Discussion
                    </h3>
                    <p className="text-[8px] text-cyan-500/50 font-black tracking-[0.4em] uppercase">
                      Feed ID: {selectedVideo._id.slice(-6)}
                    </p>
                  </div>
                  <MessageSquare className="text-cyan-500 w-10 h-10" />
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar mb-10">
                  {comments.map((c, i) => (
                    <div key={i} className="comment-stream space-y-4">
                      <div className="bg-white/[0.02] p-6 border-l-2 border-cyan-500/30 group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                          <UserCircle className="w-5 h-5 text-cyan-500/40" />
                          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic">
                            {c.userId?.name || "STUDENT_NODE"}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white/80 leading-relaxed pr-2 italic">
                          {c.text}
                        </p>
                      </div>
                      {c.replies?.map((r, j) => (
                        <div
                          key={j}
                          className="mr-8 bg-cyan-500/5 p-4 border border-cyan-500/10 text-[11px] font-bold text-cyan-200 italic"
                        >
                          <span className="text-[8px] font-black uppercase text-cyan-500 block mb-1">
                            RE: TEACHER_OVERRIDE
                          </span>
                          {r.text}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="relative group">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="INPUT SIGNAL..."
                    className="h-16 pr-6 pl-16 bg-white/[0.02] border border-white/10 rounded-none font-black text-xs text-white focus:border-cyan-500 outline-none transition-all"
                  />
                  <Button
                    onClick={handlePostComment}
                    className="absolute left-0 top-0 h-full w-14 bg-cyan-600 text-black hover:bg-cyan-400 transition-all rounded-none p-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* --- The Grid (قائمة الفيديوهات المستقبلية) --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {videos.map((vid) => (
              <div
                key={vid._id}
                onClick={() => {
                  setSelectedVideo(vid);
                  fetchComments(vid._id);
                }}
                className="vid-node group relative cursor-pointer"
              >
                {/* تقاطعات الزوايا (Corner HUD Brackets) */}
                <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-cyan-500/20 transition-all group-hover:w-full group-hover:h-full group-hover:border-cyan-500 group-hover:bg-cyan-500/[0.02]"></div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-cyan-500/20 transition-all group-hover:w-full group-hover:h-full group-hover:border-cyan-500"></div>

                <div className="relative bg-black border border-white/5 overflow-hidden transition-all duration-700 shadow-2xl group-hover:translate-y-[-5px]">
                  <div className="aspect-video bg-[#030406] relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-70" />
                    <div className="w-20 h-20 bg-cyan-500/5 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center group-hover:scale-125 transition-all duration-700 z-20 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                      <Play className="w-8 h-8 text-cyan-400 fill-current translate-x-1" />
                    </div>
                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500 opacity-20 animate-[scan_3s_linear_infinite]"></div>
                  </div>

                  <div className="p-10 space-y-6 text-right">
                    <h3 className="text-3xl font-[1000] italic text-white group-hover:text-cyan-400 transition-colors uppercase leading-none tracking-tighter">
                      {vid.title}
                    </h3>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5 flex-row-reverse">
                      <div className="flex items-center gap-3 text-cyan-500/40">
                        <span className="text-[10px] font-black uppercase tracking-widest font-mono">
                          {new Date(vid.scheduledAt).toLocaleDateString(
                            "en-US",
                          )}
                        </span>
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic bg-white/5 px-3 py-1">
                        SEC: {vid.section}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #06b6d4;
          border-radius: 0px;
          box-shadow: 0 0 15px #06b6d4;
        }
        body {
          background-color: #010204;
        }
        ::selection {
          background: rgba(6, 182, 212, 0.4);
          color: white;
        }
        video::-webkit-media-controls-panel {
          background-image: linear-gradient(
            transparent,
            rgba(0, 0, 0, 0.9)
          ) !important;
        }
      `}</style>
    </div>
  );
}
