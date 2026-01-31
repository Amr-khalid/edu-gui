"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Lock,
  Bell,
  Camera,
  Loader2,
  Save,
  ShieldCheck,
  Mail,
  Phone,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import gsap from "gsap";

export default function SettingsCrystalPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const containerRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);

      // أنيميشن الظهور الزجاجي
      gsap.fromTo(
        ".glass-panel",
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "expo.out",
        },
      );
    } catch (err) {
      toast.error("فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e ) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const loadingToast = toast.loading("جاري مزامنة الصورة...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setUser({ ...user, avatar: res.data.url });
      toast.success("تم تحديث الهوية البصرية بنجاح", { id: loadingToast });
    } catch (err) {
      toast.error("فشل الرفع", { id: loadingToast });
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE}/api/users/profile`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم تحديث البيانات بنجاح ✅");
    } catch (err) {
      toast.error("فشل التحديث");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passForm.newPassword !== passForm.confirmPassword)
      return toast.error("كلمات المرور غير متطابقة");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/users/profile/password`,
        passForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("تم تأمين الحساب بكلمة مرور جديدة");
      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err ) {
      toast.error(err.response?.data?.message || "خطأ في التغيير");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 opacity-20" />
        <p className="text-white/20 font-black tracking-widest uppercase mt-4 text-[10px]">
          Initializing HUB...
        </p>
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-6 md:p-10 space-y-10 bg-slate-950 text-white font-sans selection:bg-blue-500/30 relative overflow-hidden rtl"
    >
      {/* 🌌 Background Decoration */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] z-0" />

      {/* Header HUD */}
      <div className="glass-panel flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 relative z-10">
        <div className="text-right space-y-2">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter italic flex items-center gap-5">
            الإعدادات <Fingerprint className="text-blue-500 w-12 h-12" />
          </h1>
          <p className="text-white/40 font-bold text-lg max-w-xl">
            تحكم في هويتك الرقمية ومعايير الأمان الخاصة بك.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full relative z-10" dir="rtl">
        <TabsList className="bg-white/5 backdrop-blur-2xl p-2 rounded-[25px] h-20 border border-white/10 w-full md:w-fit flex gap-2">
          <TabsTrigger
            value="profile"
            className="rounded-[18px] px-10 font-black text-white/40 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all h-full gap-3"
          >
            <User className="w-5 h-5" /> الملف الشخصي
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-[18px] px-10 font-black text-white/40 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all h-full gap-3"
          >
            <Lock className="w-5 h-5" /> الأمان والحماية
          </TabsTrigger>
        </TabsList>

        {/* --- Profile Tab --- */}
        <TabsContent value="profile" className="mt-10 space-y-8 glass-panel">
          <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[55px] overflow-hidden shadow-2xl">
            <div className="h-48 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>
            <CardContent className="p-12 -mt-24 space-y-12">
              {/* Avatar Section */}
              <div className="relative w-44 h-44 mx-auto md:mx-0 group">
                <div className="w-full h-full rounded-[45px] border-4 border-slate-950 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-500">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-[1000] text-blue-500">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-2 -right-2 bg-blue-600 p-4 rounded-[22px] text-white cursor-pointer hover:bg-blue-500 transition-all shadow-xl border-4 border-slate-950 group-hover:rotate-12">
                  <Camera className="w-6 h-6" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    accept="image/*"
                  />
                </label>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup label="الاسم الكامل" icon={User}>
                  <Input
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-black text-xl placeholder:text-white/10 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </InputGroup>

                <InputGroup
                  label="البريد الإلكتروني (غير قابل للتعديل)"
                  icon={Mail}
                >
                  <Input
                    disabled
                    value={user.email}
                    className="h-16 rounded-2xl bg-white/[0.02] border-white/5 text-white/30 font-bold opacity-60 cursor-not-allowed"
                  />
                </InputGroup>

                <InputGroup label="رقم هاتف الطوارئ" icon={Phone}>
                  <Input
                    value={user.parentPhone || ""}
                    onChange={(e) =>
                      setUser({ ...user, parentPhone: e.target.value })
                    }
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-black text-xl"
                    placeholder="01xxxxxxxxx"
                  />
                </InputGroup>

                <InputGroup label="رقم الهوية الأكاديمية" icon={Sparkles}>
                  <Input
                    disabled
                    value={user.studentId || "TEACHER_ACCOUNT"}
                    className="h-16 rounded-2xl bg-white/[0.02] border-white/5 text-blue-400/50 font-mono tracking-widest"
                  />
                </InputGroup>
              </div>

              <div className="pt-8 border-t border-white/5">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="h-18 px-12 rounded-[25px] bg-blue-600 hover:bg-blue-500 text-white font-[1000] text-xl gap-4 shadow-2xl shadow-blue-600/20 transition-all active:scale-95"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save className="w-6 h-6" /> حفظ التغييرات الآن
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Security Tab --- */}
        <TabsContent value="security" className="mt-10 glass-panel">
          <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[55px] p-12 space-y-12 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="bg-emerald-500/20 p-6 rounded-[30px] border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-[1000] tracking-tight">
                  تأمين الحساب
                </h3>
                <p className="text-white/40 font-bold">
                  تحديث كلمة المرور لضمان أعلى مستويات الخصوصية.
                </p>
              </div>
            </div>

            <div className="max-w-2xl space-y-8">
              <InputGroup label="كلمة المرور الحالية" icon={Lock}>
                <Input
                  type="password"
                  value={passForm.currentPassword}
                  onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-black text-xl"
                />
              </InputGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="كلمة المرور الجديدة" icon={Lock}>
                  <Input
                    type="password"
                    value={passForm.newPassword}
                    onChange={(e) =>
                      setPassForm({ ...passForm, newPassword: e.target.value })
                    }
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-black text-xl"
                  />
                </InputGroup>
                <InputGroup label="تأكيد الكلمة الجديدة" icon={Lock}>
                  <Input
                    type="password"
                    value={passForm.confirmPassword}
                    onChange={(e) =>
                      setPassForm({
                        ...passForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-black text-xl"
                  />
                </InputGroup>
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={saving}
                className="w-full h-20 bg-white hover:bg-blue-600 hover:text-white text-slate-950 rounded-[30px] font-[1000] text-2xl shadow-2xl transition-all duration-500"
              >
                تحديث بيانات الدخول
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// مكون فرعي لتنظيم الليبل مع الأيقونة بستايل زجاجي
function InputGroup({ label, icon: Icon, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-2">
        <Icon className="w-3 h-3 text-blue-400" />
        <label className="text-[10px] font-[1000] text-white/30 uppercase tracking-[0.3em]">
          {label}
        </label>
      </div>
      {children}
    </div>
  );
}
