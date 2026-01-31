import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  Calendar,
  Bell,
  BarChart3,
  Settings,
  QrCode,
  FilePlus,
  Library,
  Video, // أيقونة الفيديو الأساسية
  MonitorPlay, // أيقونة بديلة تعطي طابعاً مستقبلياً
} from "lucide-react";

export const TEACHER_LINKS = [
  { name: "لوحة التحكم", href: "/dashboard/teacher", icon: LayoutDashboard },
  { name: "تسجيل الحضور", href: "/dashboard/teacher/scan", icon: QrCode },
  {
    name: "إنشاء كوز",
    href: "/dashboard/teacher/quizzes/create",
    icon: FilePlus,
  },
  {
    name: "الطلاب والتقارير",
    href: "/dashboard/teacher/students",
    icon: BarChart3,
  },
  // --- الخانة الجديدة للمعلم ---
  {
    name: "رفع الفيديوهات",
    href: "/dashboard/teacher/videos",
    icon: Video,
  },
  {
    name: "المكتبة الرقمية",
    href: "/dashboard/teacher/materials",
    icon: Library,
  },
  
  {
    name: "التقويم الدراسي",
    href: "/dashboard/teacher/calendar",
    icon: Calendar,
  },
  { name: "الإعلانات", href: "/dashboard/teacher/notifications", icon: Bell },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

export const STUDENT_LINKS = [
  { name: "لوحة التحكم", href: "/dashboard/student", icon: LayoutDashboard },
  {
    name: "الاختبارات المتاحة",
    href: "/dashboard/student/quizzes",
    icon: BookOpen,
  },
  // --- الخانة الجديدة للطالب ---
  {
    name: "أرشيف المحاضرات",
    href: "/dashboard/student/videos",
    icon: MonitorPlay,
  },


   {
    name: "المكتبة الرقمية",
    href: "/dashboard/student/materials",
    icon: Library,
  },
  {
    name: "الجدول الزمني",
    href: "/dashboard/student/calendar",
    icon: Calendar,
  },
 
  {
    name: "تنبيهات المعلم",
    href: "/dashboard/student/notifications",
    icon: Bell,
  },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];
