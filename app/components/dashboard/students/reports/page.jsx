// app/dashboard/students/reports/page.tsx
"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDown, Search, UserCheck, GraduationCap } from "lucide-react";
import axios from "axios";

export default function StudentReports() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // جلب البيانات من الـ API المطور (Dashboard Stats)
    const fetchData = async () => {
      const res = await axios.get("/api/teacher/dashboard-detailed");
      setStudents(res.data.students);
    };
    fetchData();
  }, []);

  const exportExcel = async () => {
    window.open("/api/export/attendance", "_blank");
  };

  const filteredStudents = students.filter(
    (s) => s.name.includes(searchTerm) || s.studentId.includes(searchTerm),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            تقرير الطلاب الشامل
          </h1>
          <p className="text-gray-500">متابعة الحضور والدرجات لكل سكشن</p>
        </div>
        <Button onClick={exportExcel} className="bg-blue-600">
          <FileDown className="ml-2 h-4 w-4" /> تصدير التقرير (Excel)
        </Button>
      </div>

      <div className="flex items-center relative max-w-sm">
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="بحث باسم الطالب أو الكود..."
          className="pr-10"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>السكشن</TableHead>
              <TableHead className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" /> أيام الحضور
              </TableHead>
              <TableHead className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> متوسط الدرجات
              </TableHead>
              <TableHead>آخر كوز</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow
                key={student._id}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <TableCell>
                  <div className="font-bold">{student.name}</div>
                  <div className="text-xs text-gray-400">
                    ID: {student.studentId}
                  </div>
                </TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      student.attendanceCount > 10
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {student.attendanceCount} يوم
                  </span>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-100 rounded-full h-2 max-w-[100px]">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(student.avgScore / student.totalQuiz) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-blue-600">
                    {student.avgScore.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>{student.lastQuizDate || "لا يوجد"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    التفاصيل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
