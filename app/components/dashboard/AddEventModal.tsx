"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function AddEventModal({ onEventAdded }: { onEventAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "lecture",
    date: "",
    section: ""
  });
 const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.section) {
      return toast.error("يرجى ملء جميع الحقول");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/calendar`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم إضافة الموعد بنجاح");
      setOpen(false);
      onEventAdded(); // تحديث القائمة في الصفحة الرئيسية
      setFormData({ title: "", type: "lecture", date: "", section: "" });
    } catch (err) {
      toast.error("فشل في إضافة الموعد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600/10 hover:bg-blue-700/20 rounded-2xl h-12 gap-2 shadow-xl shadow-blue-100/10">
          <Plus className="w-5 h-5" /> إضافة موعد جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900">موعد جديد</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 mr-2">عنوان الموعد</label>
            <Input 
              placeholder="مثلاً: مراجعة قوانين نيوتن" 
              className="h-12 rounded-xl bg-gray-50 border-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 mr-2">النوع</label>
              <Select onValueChange={(v) => setFormData({...formData, type: v})} defaultValue="lecture">
                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">محاضرة</SelectItem>
                  <SelectItem value="quiz">اختبار</SelectItem>
                  <SelectItem value="review">مراجعة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 mr-2">السكشن</label>
              <Select onValueChange={(v) => setFormData({...formData, section: v})}>
                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-none">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="all">الكل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 mr-2">التاريخ والوقت</label>
            <Input 
              type="datetime-local" 
              className="h-12 rounded-xl bg-gray-50 border-none"
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : "حفظ الموعد في التقويم"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}