"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import QRScanner from "../../../components/scanner/QRScanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  QrCode,
  Keyboard,
  Loader2,
  RefreshCw,
  Clock,
  User,
  Zap,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function AttendanceCrystalPage() {
  const [loading, setLoading] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [manualId, setManualId] = useState("");
  const [scannedList, setScannedList] = useState([]);

  // 🛡️ مراجع لمنع التكرار (Logic Refs)
  const lastScannedData = useRef(null);
  const lastScannedTime = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".glass-panel",
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
      },
    );
  }, []);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const submitData = async (payloadData
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/scan/flexible`,
        { ...payloadData, course: "الفيزياء الحديثة" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const newEntry = {
        id: Date.now(),
        name: res.data.studentName,
        studentId: res.data.studentId || payloadData.manualId || "QR SCAN",
        time: new Date().toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        count: res.data.attendance,
      };

      setScannedList((prev) => [newEntry, ...prev]);
      toast.success(res.data.message);

      // 🎇 وميض بصري للنجاح
      gsap.fromTo(
        ".scanner-overlay",
        { opacity: 0.5, backgroundColor: "#10b981" },
        { opacity: 0, duration: 0.5 },
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل تسجيل الحضور");
    } finally {
      setLoading(false);
      // إعادة تفعيل الماسح بعد تأخير بسيط لراحة العين
      setTimeout(() => {
        setIsScannerActive(true);
      }, 1000);
    }
  };

  const handleScan = useCallback(
    (text) => {
      if (!text || loading || !isScannerActive) return;

      const now = Date.now();
      // 1️⃣ منع القراءة المتكررة لنفس الكود في أقل من 5 ثوانٍ (Cooldown)
      if (
        text === lastScannedData.current &&
        now - lastScannedTime.current < 7000
      ) {
        return;
      }

      // 2️⃣ منطق فحص التكرار في القائمة الحالية (Session Check)
      // نحاول استخراج المعرف من الـ Payload لو كان JSON
      let currentId = text;
      try {
        const parsed = JSON.parse(text);
        currentId = parsed.manualId || parsed.studentId || text;
      } catch (e) {
        /* ليس JSON */
      }

      if (scannedList.some((s) => s.studentId === currentId)) {
        toast.info("هذا الطالب مسجل بالفعل في القائمة الحالية ⚠️");
        lastScannedData.current = text;
        lastScannedTime.current = now;
        return;
      }

      // تحديث المراجع وتجميد الماسح للإرسال
      lastScannedData.current = text;
      lastScannedTime.current = now;
      setIsScannerActive(false);

      submitData({ payload: text });
    },
    [loading, isScannerActive, scannedList],
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-6 md:p-10 space-y-10 font-sans text-white selection:bg-blue-500/30 relative overflow-hidden"
    >
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] z-0" />

      {/* Header HUD */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10 glass-panel">
        <div className="text-right space-y-2">
          <h1 className="text-5xl font-[1000] tracking-tighter text-white flex items-center gap-4 italic">
            تحضير الجلسة{" "}
            <QrCode className="text-blue-500 w-10 h-10 animate-pulse" />
          </h1>
          <p className="text-white/40 font-bold text-lg max-w-xl italic">
            نظام المسح الذكي المزود بحماية من التكرار اللحظي.
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-10 py-6 rounded-[35px] text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1 relative z-10">
            Live Attendance
          </p>
          <p className="text-5xl font-[1000] text-white relative z-10">
            {scannedList.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* العمود الأيسر: Scanner Hub */}
        <div className="lg:col-span-5 space-y-8 glass-panel">
          <Tabs defaultValue="qr" className="w-full">
            <TabsList className="grid grid-cols-2 w-full h-16 rounded-[24px] bg-white/5 p-2 mb-8 border border-white/10">
              <TabsTrigger
                value="qr"
                className="rounded-[18px] text-gray-300 font-black data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                <QrCode className="w-4 h-4 ml-2" /> مسح QR
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="rounded-[18px] font-black text-white/60 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                <Keyboard className="w-4 h-4 ml-2" /> إدخال يدوي
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr">
              <div className="relative aspect-square rounded-[50px] overflow-hidden border-2 border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl group">
                <div className="scanner-overlay absolute inset-0 z-30 pointer-events-none transition-all" />

                {isScannerActive ? (
                  <div className="w-full h-full opacity-90 transition-opacity">
                    <QRScanner onScanSuccess={handleScan} />
                    <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 shadow-[0_0_25px_#3b82f6] animate-scan-line z-20" />
                    <div className="absolute inset-0 border-[40px] border-black/20 z-10 pointer-events-none" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-slate-900/60 backdrop-blur-md">
                    {loading ? (
                      <div className="space-y-4">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto" />
                        <p className="font-[1000] text-blue-400 uppercase tracking-widest text-xs">
                          Verifying Identity...
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setIsScannerActive(true)}
                        className="rounded-[25px] h-20 px-12 bg-white text-slate-900 hover:bg-blue-600 hover:text-white font-[1000] text-xl gap-3 shadow-2xl transition-all active:scale-95"
                      >
                        <RefreshCw className="w-6 h-6" /> طالب جديد
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manual">
              <Card className="p-12 rounded-[45px] bg-white/5 backdrop-blur-3xl border-white/10 space-y-8 shadow-2xl">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-2">
                    Manual Entry Terminal
                  </label>
                  <Input
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="ID NUMBER..."
                    className="h-20 text-center rounded-[25px] bg-white/5 border-white/10 text-white font-[1000] text-4xl focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/5"
                  />
                </div>
                <Button
                  onClick={() => submitData({ manualId })}
                  disabled={loading || !manualId}
                  className="w-full h-18 bg-blue-600 hover:bg-blue-500 text-white rounded-[25px] font-[1000] text-xl shadow-xl shadow-blue-500/20 gap-3 transition-all"
                >
                  <Zap className="w-6 h-6 fill-current" /> تسجيل الآن
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* العمود الأيمن: Live Feed Table */}
        <div className="lg:col-span-7 space-y-6 glass-panel">
          <div className="flex items-center justify-between px-6">
            <h3 className="flex items-center gap-3 font-[1000] text-white uppercase text-sm tracking-[0.2em]">
              <Clock className="w-5 h-5 text-blue-500" /> السجل اللحظي للمسح
            </h3>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <Card className="border border-white/10 shadow-2xl rounded-[50px] overflow-hidden bg-white/5 backdrop-blur-3xl">
            <div className="max-h-[620px] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-white/5 border-b border-white/10">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-right font-black text-white/40 py-6 pr-10 text-[10px] uppercase tracking-widest">
                      الطالب
                    </TableHead>
                    <TableHead className="text-right font-black text-white/40 text-[10px] uppercase tracking-widest">
                      توقيت الوصول
                    </TableHead>
                    <TableHead className="text-center font-black text-white/40 text-[10px] uppercase tracking-widest">
                      حالة الحضور
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scannedList.length > 0 ? (
                    scannedList.map((student) => (
                      <TableRow
                        key={student.id}
                        className="border-b border-white/5 hover:bg-white/[0.07] transition-all group animate-in slide-in-from-right duration-500"
                      >
                        <TableCell className="py-6 pr-10">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-[20px] bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
                              <User className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="font-[1000] text-xl text-white group-hover:text-blue-400 transition-colors">
                                {student.name}
                              </p>
                              <p className="text-[10px] text-white/20 font-mono tracking-tighter uppercase mt-0.5">
                                ID: {student.studentId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/60 font-black text-sm italic">
                          {student.time}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-5 py-2.5 rounded-[18px] font-[1000] text-sm shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            {student.count} أيام
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-80 text-center">
                        <div className="flex flex-col items-center opacity-10">
                          <QrCode className="w-24 h-24 mb-4" />
                          <p className="text-4xl font-[1000] uppercase tracking-[0.3em]">
                            No Active Scans
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan-line {
          animation: scan 2.5s infinite linear;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
