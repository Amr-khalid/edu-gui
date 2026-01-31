"use client";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  Search,
  Loader2,
  Edit3,
  Trash2,
  Save,
  GraduationCap,
  ChevronLeft,
  Activity,
  Plus,
  Database,
  UserCheck,
  UserPlus,
  X,
  Mail,
  Send,
  Table, // أيقونة جديدة للـ Excel
  Upload,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import gsap from "gsap";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";

export default function StudentCrystalManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentGrades, setStudentGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // حالة خاصة برفع الملفات
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ id: "", title: "", score: "" });
  const [studentForm, setStudentForm] = useState({
    name: "",
    studentId: "",
    section: "",
    email: "",
  });


  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const API_BASE = `${API}/api`;
  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    fetchStudents();
  }, []);


const handleDeleteStudent = async (id: string) => {
  if (
    !confirm(
      "⚠️ تحذير: هل أنت متأكد من حذف هذا الطالب نهائياً؟ سيتم مسح كافة سجلاته ودرجاته.",
    )
  )
    return;

  const loadId = toast.loading("جاري مسح بيانات الطالب من السحابة...");
  try {
    await axios.delete(`${API_BASE}/users/students/${id}`, {
      headers: getHeaders(),
    });
    toast.success("تم حذف الطالب بنجاح ✅", { id: loadId });
    setSelectedStudent(null); // إغلاق واجهة الطالب المحذوف
    fetchStudents(); // تحديث القائمة
  } catch (err) {
    toast.error("فشل في حذف الطالب", { id: loadId });
  }
};



  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/students`, {
        headers: getHeaders(),
      });
      setStudents(res.data);
      gsap.from(".student-row", {
        opacity: 0,
        x: -30,
        stagger: 0.05,
        ease: "expo.out",
      });
    } catch (err) {
      toast.error("فشل مزامنة قائمة الطلاب");
    } finally {
      setLoading(false);
    }
  };

  // --- 🆕 رفع ملف Excel وإنشاء الطلاب تلقائياً ---
  const handleBulkExcelUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const loadId = toast.loading("جاري معالجة ملف الـ Excel وبث البيانات...");

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        let successCount = 0;
        // نمر على كل صف في ملف الإكسيل
        for (const row of data) {
          try {
            await axios.post(
              `${API_BASE}/qr/generate-external`,
              {
                name: row.الاسم || row.name,
                studentId: row.الكود || row.studentId,
                section: row.السكشن || row.section,
                email: row.الايميل || row.email,
                course: "الفيزياء الحديثة",
              },
              { headers: getHeaders() },
            );
            successCount++;
          } catch (err) {
            console.error("خطأ في إنشاء طالب:", row);
          }
        }

        toast.success(`تم إنشاء ${successCount} طالب بنجاح ✅`, { id: loadId });
        fetchStudents();
      } catch (err) {
        toast.error("خطأ في قراءة ملف الإكسيل", { id: loadId });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleCreateStudent = async () => {
    if (!studentForm.name || !studentForm.studentId || !studentForm.email)
      return toast.error("أكمل بيانات الطالب");
    const loadId = toast.loading("جاري بث الهوية الرقمية...");
    try {
      await axios.post(
        `${API_BASE}/qr/generate-external`,
        {
          ...studentForm,
          course: "الفيزياء الحديثة",
        },
        { headers: getHeaders() },
      );
      toast.success("تم إنشاء الحساب وإرسال الكود ✅", { id: loadId });
      setShowAddModal(false);
      setStudentForm({ name: "", studentId: "", section: "", email: "" });
      fetchStudents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "فشل التسجيل", { id: loadId });
    }
  };

  const fetchGrades = async (student: any) => {
    setSelectedStudent(student);
    setForm({ id: "", title: "", score: "" });
    try {
      const res = await axios.get(`${API_BASE}/grades/summary/${student._id}`, {
        headers: getHeaders(),
      });
      setStudentGrades(res.data);
      gsap.fromTo(
        ".grade-anim",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, stagger: 0.1 },
      );
    } catch (err) {
      toast.error("فشل جلب الدرجات");
    }
  };

  // --- 🆕 حذف درجة اختبار ---
  const handleDeleteGrade = async (gradeId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدرجة؟")) return;
    try {
      await axios.delete(`${API_BASE}/grades/${gradeId}`, {
        headers: getHeaders(),
      });
      toast.success("تم حذف الدرجة بنجاح");
      fetchGrades(selectedStudent);
    } catch (err) {
      toast.error("فشل في حذف الدرجة");
    }
  };

  const handleSaveGrade = async () => {
    if (!form.title || !form.score) return toast.error("أكمل البيانات");
    try {
      const payload = {
        studentId: selectedStudent._id,
        examTitle: form.title,
        score: Number(form.score),
      };
      if (form.id) {
        await axios.put(`${API_BASE}/grades/${form.id}`, payload, {
          headers: getHeaders(),
        });
      } else {
        await axios.post(`${API_BASE}/grades/manual`, payload, {
          headers: getHeaders(),
        });
      }
      toast.success("تم التحديث بنجاح ✅");
      setForm({ id: "", title: "", score: "" });
      fetchGrades(selectedStudent);
    } catch (err) {
      toast.error("فشل الحفظ");
    }
  };

  const exportExcel = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reports/full-export`, {
        headers: getHeaders(),
      });
      const formatted = res.data.map((s: any) => {
        const row: any = {
          الاسم: s.name,
          الكود: s.studentId,
          السكشن: s.section,
          الحضور: s.attendanceCount,
        };
        s.grades.forEach((g: any) => {
          row[g.examTitle] = g.score;
        });
        return row;
      });
      const ws = XLSX.utils.json_to_sheet(formatted);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "التقارير");
      XLSX.writeFile(wb, `Students_Report_${Date.now()}.xlsx`);
      toast.success("تم تصدير الملف 📂");
    } catch (err) {
      toast.error("فشل التصدير");
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* 🌌 Background Lights */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] z-0" />

      {/* --- Add Student Modal --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowAddModal(false)}
          />
          <Card className="relative z-10 w-full max-w-xl bg-slate-900 border border-white/10 rounded-[50px] p-10 shadow-2xl">
            <div className="text-right space-y-8">
              <div className="flex items-center justify-end gap-4">
                <h2 className="text-4xl text-white font-[1000] italic">
                  إضافة طالب
                </h2>
                <div className="p-3 bg-cyan-600/20 rounded-2xl text-cyan-400">
                  <UserPlus className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="الاسم الكامل"
                  value={studentForm.name}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, name: e.target.value })
                  }
                  className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-xl"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="كود الطالب"
                    value={studentForm.studentId}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        studentId: e.target.value,
                      })
                    }
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-mono"
                  />
                  <Input
                    placeholder="السكشن"
                    value={studentForm.section}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        section: e.target.value,
                      })
                    }
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold"
                  />
                </div>
                <Input
                  placeholder="البريد الإلكتروني (لاستلام الـ QR)"
                  value={studentForm.email}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, email: e.target.value })
                  }
                  className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold"
                />
              </div>
              <Button
                onClick={handleCreateStudent}
                className="w-full h-20 rounded-[30px] bg-cyan-600 hover:bg-cyan-500 text-white font-[1000] text-2xl gap-4 transition-all"
              >
                بث الهوية الرقمية <Send className="w-7 h-7" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Sidebar - القائمة الجانبية */}
      <div className="lg:col-span-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[45px] p-8 flex flex-col h-[calc(100vh-80px)] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-[1000] italic">الطلاب</h2>
          <div className="flex gap-2">
            {/* زر الرفع الجماعي */}
            <div className="relative">
              <input
                type="file"
                accept=".xlsx, .xls"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleBulkExcelUpload}
                disabled={uploading}
              />
              <Button
                variant="ghost"
                className="bg-blue-500/10 text-blue-400 hover:bg-blue-500 rounded-xl w-12 h-12 p-0"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Table className="w-5 h-5" />
                )}
              </Button>
            </div>

            <Button
              onClick={exportExcel}
              variant="ghost"
              className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 rounded-xl w-12 h-12 p-0"
            >
              <FileDown className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-600 hover:bg-cyan-500 rounded-xl w-12 h-12 p-0 shadow-lg shadow-cyan-600/30"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
          <Input
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/5 rounded-2xl pr-12 h-14 font-bold"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {students
            .filter((s) => s.name.includes(search))
            .map((s) => (
              <button
                key={s._id}
                onClick={() => fetchGrades(s)}
                className={cn(
                  "student-row w-full p-5 rounded-[25px] flex items-center justify-between transition-all group",
                  selectedStudent?._id === s._id
                    ? "bg-cyan-600 shadow-xl"
                    : "bg-white/5 hover:bg-white/10",
                )}
              >
                <div className="flex items-center gap-4 text-right">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black",
                      selectedStudent?._id === s._id
                        ? "bg-white/20"
                        : "bg-white/5 text-cyan-500",
                    )}
                  >
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-sm">{s.name}</p>
                    <p className="text-[10px] opacity-30">{s.studentId}</p>
                  </div>
                </div>
                <ChevronLeft
                  className={cn(
                    "w-5 h-5 transition-all",
                    selectedStudent?._id === s._id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </button>
            ))}
        </div>
      </div>

      {/* Main Content - منطقة الرصد */}
      <div className="lg:col-span-8 space-y-8 overflow-y-auto h-[calc(100vh-80px)] pr-2 custom-scrollbar">
        {selectedStudent ? (
          <div className="space-y-8">
            <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[55px] shadow-2xl relative overflow-hidden text-right">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <h1 className="text-6xl font-[1000] text-gray-300/90 tracking-tighter mb-2">
                    {selectedStudent.name}
                  </h1>
                  <div className="flex gap-4">
                    <span className="bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black border border-cyan-500/20">
                      <Database className="w-3 h-3 inline ml-1" />{" "}
                      {selectedStudent.studentId}
                    </span>
                    <span className="bg-white/5 text-white/40 px-4 py-1.5 rounded-full text-[10px] font-black border border-white/5">
                      <UserCheck className="w-3 h-3 inline ml-1" /> Section{" "}
                      {selectedStudent.section}
                    </span>
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="text-center">
                    <p className="text-[10px] text-white/30 font-black uppercase">
                      الحضور
                    </p>
                    <p className="text-5xl font-[1000] text-emerald-400">
                      {selectedStudent.attendanceCount || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white/30 font-black uppercase">
                      الدرجات
                    </p>
                    <p className="text-5xl font-[1000] text-cyan-400">
                      {studentGrades.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white/30 font-black uppercase">
                      حذف الطالب
                    </p>
                    <p className="text-5xl font-[1000] text-cyan-400">
                      <Button
                        onClick={() => handleDeleteStudent(selectedStudent._id)}
                        variant="ghost"
                        className="p-4 h-16 w-16 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-8 h-8" />
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[45px] grid grid-cols-1 md:grid-cols-12 gap-6 shadow-xl">
              <div className="md:col-span-5 space-y-2">
                <label className="text-[10px] font-black text-white/30 mr-4 tracking-widest">
                  اسم الاختبار
                </label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold"
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black text-white/30 mr-4 tracking-widest">
                  الدرجة
                </label>
                <Input
                  type="number"
                  value={form.score}
                  onChange={(e) => setForm({ ...form, score: e.target.value })}
                  className="h-16 rounded-2xl bg-white/5 border-white/10 font-[1000] text-3xl text-center text-cyan-400"
                />
              </div>
              <div className="md:col-span-4 flex items-end">
                <Button
                  onClick={handleSaveGrade}
                  className={cn(
                    "w-full h-16 rounded-2xl font-[1000] text-xl transition-all",
                    form.id ? "bg-amber-600" : "bg-cyan-600 hover:bg-cyan-500",
                  )}
                >
                  {form.id ? "تحديث" : "رصد"} <Plus className="mr-2 w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentGrades.map((g, i) => (
                <div
                  key={i}
                  className="grade-anim bg-white/5 p-8 rounded-[40px] border border-white/5 group hover:bg-white/10 flex justify-between items-center"
                >
                  <div className="space-y-1 text-right">
                    <p className="text-xl font-black group-hover:text-cyan-400 transition-colors">
                      {g.examTitle}
                    </p>
                    <p className="text-[10px] text-white/20 font-bold uppercase">
                      {new Date(g.date).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-5xl font-[1000] tracking-tighter">
                      {g.score}
                    </p>
                    {/* زر الحذف لكل درجة */}
                    <button
                      onClick={() => handleDeleteGrade(g._id)}
                      className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <Activity className="w-32 h-32 text-cyan-500 animate-pulse mb-6" />
            <p className="text-4xl font-[1000] tracking-[0.5em]">
              SELECT AGENT
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
