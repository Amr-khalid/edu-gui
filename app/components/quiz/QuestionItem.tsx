"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ImagePlus, CheckCircle2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

export default function QuestionItem({
  index,
  question,
  updateQuestion,
  removeQuestion,
}: any) {
  const [uploading, setUploading] = useState(false);

  // دالة رفع الصورة للسيرفر
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التأكد من حجم الملف (اختياري)
    if (file.size > 5 * 1024 * 1024)
      return toast.error("حجم الصورة كبير جداً (الأقصى 5MB)");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      updateQuestion(index, "image", res.data.url);
      toast.success("تم رفع الصورة");
    } catch (err) {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="question-card border-none shadow-md rounded-3xl bg-white mb-6 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-3">
      <div className="bg-blue-600 h-1.5 w-full" />
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">
            السؤال {index + 1}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeQuestion(index)}
            className="text-red-500 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="اكتب نص السؤال هنا..."
              value={question.text}
              onChange={(e) => updateQuestion(index, "text", e.target.value)}
              className="h-12 rounded-xl border-gray-100 font-bold flex-1"
            />

            {/* زر رفع الصورة */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id={`q-img-${index}`}
                onChange={handleImageUpload}
              />
              <Button
                asChild
                variant="outline"
                className={cn(
                  "h-12 w-12 p-0 rounded-xl border-dashed border-2",
                  question.image
                    ? "border-green-500 text-green-600"
                    : "border-gray-200 text-gray-400",
                )}
              >
                <label
                  htmlFor={`q-img-${index}`}
                  className="cursor-pointer flex items-center justify-center"
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ImagePlus className="w-5 h-5" />
                  )}
                </label>
              </Button>
            </div>
          </div>

          {/* معاينة الصورة */}
          {question.image && (
            <div className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden border bg-gray-50 group mx-auto">
              <img
                src={question.image}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => updateQuestion(index, "image", "")}
                className="absolute top-2 left-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((opt: string, optIdx: number) => (
              <div key={optIdx} className="relative group">
                <Input
                  placeholder={`الخيار ${optIdx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...question.options];
                    newOpts[optIdx] = e.target.value;
                    updateQuestion(index, "options", newOpts);
                  }}
                  className={cn(
                    "h-11 rounded-xl pr-10",
                    question.correctIndex === optIdx
                      ? "border-green-500 bg-green-50/30"
                      : "border-gray-100",
                  )}
                />
                <button
                  type="button"
                  onClick={() => updateQuestion(index, "correctIndex", optIdx)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2",
                    question.correctIndex === optIdx
                      ? "text-green-600"
                      : "text-gray-300",
                  )}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
