// app/dashboard/quizzes/create/page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Image as ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function CreateQuiz() {
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    section: "",
    duration: 30,
  });
  const [questions, setQuestions] = useState([
    { text: "", image: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);

  // إضافة سؤال جديد
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", image: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);
  };
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // رفع صورة للسؤال
  const handleImageUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        `${API_BASE}/api/upload`,
        formData,
      );
      const newQuestions = [...questions];
      newQuestions[index].image = res.data.url;
      setQuestions(newQuestions);
      toast.success("تم رفع الصورة بنجاح");
    } catch (err) {
      toast.error("فشل رفع الصورة");
    }
  };

  const saveQuiz = async () => {
    try {
      await axios.post(`${API_BASE}/api/quizzes`, { ...quizInfo, questions });
      toast.success("تم إنشاء الكوز وربطه بالتقويم بنجاح!");
    } catch (err) {
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إنشاء كوز جديد</h1>
        <Button
          onClick={saveQuiz}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="ml-2 h-5 w-5" /> حفظ الكوز
        </Button>
      </div>

      {/* معلومات الكوز الأساسية */}
      <Card className="border-2 border-blue-100">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>عنوان الكوز</Label>
            <Input
              placeholder="مثلاً: اختبار الشهر"
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>السكشن المستهدف</Label>
            <Input
              placeholder="مثلاً: A1"
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, section: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>المدة (بالدقائق)</Label>
            <Input
              type="number"
              onChange={(e) =>
                setQuizInfo({ ...quizInfo, duration: parseInt(e.target.value) })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* قائمة الأسئلة */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <Card key={qIndex} className="relative overflow-hidden group">
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500" />
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  سؤال {qIndex + 1}
                </span>
                <Button
                  variant="ghost"
                  className="text-red-500"
                  onClick={() =>
                    setQuestions(questions.filter((_, i) => i !== qIndex))
                  }
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Input
                    placeholder="نص السؤال..."
                    value={q.text}
                    onChange={(e) => {
                      const n = [...questions];
                      n[qIndex].text = e.target.value;
                      setQuestions(n);
                    }}
                  />
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Label className="cursor-pointer bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition">
                      <ImageIcon className="h-5 w-5 inline ml-2" /> إرفاق صورة
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(qIndex, e.target.files![0])
                        }
                      />
                    </Label>
                    {q.image && (
                      <span className="text-xs text-green-600">
                        تم إرفاق صورة ✅
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctIndex === oIndex}
                        onChange={() => {
                          const n = [...questions];
                          n[qIndex].correctIndex = oIndex;
                          setQuestions(n);
                        }}
                      />
                      <Input
                        placeholder={`خيار ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const n = [...questions];
                          n[qIndex].options[oIndex] = e.target.value;
                          setQuestions(n);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full py-8 border-dashed border-2 text-blue-600"
        onClick={addQuestion}
      >
        <PlusCircle className="ml-2" /> إضافة سؤال جديد
      </Button>
    </div>
  );
}
