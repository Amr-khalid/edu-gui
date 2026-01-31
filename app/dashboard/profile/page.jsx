"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import StudentIDCard from "../../components/dashboard/StudentIDCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: ID Card & Avatar */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-white shadow-md overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff&size=128`}
                  alt="Avatar"
                />
              </div>
              <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-400 font-bold">
                {user?.role === "TEACHER" ? "معلم معتمد" : "طالب بنظام الساعات"}
              </p>
            </div>
          </div>

          {user?.role === "STUDENT" && <StudentIDCard />}
        </div>

        {/* Right Column: Settings Form */}
        <div className="flex-1 bg-white rounded-[40px] p-8 lg:p-12 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-900">
              المعلومات الشخصية
            </h3>
            <Button
              variant={isEditing ? "destructive" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl font-bold"
            >
              {isEditing ? "إلغاء التعديل" : "تعديل البيانات"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="الاسم الكامل"
              value={user?.name}
              icon={User}
              disabled={!isEditing}
            />
            <ProfileField
              label="البريد الإلكتروني"
              value={user?.email}
              icon={Mail}
              disabled={true}
            />
            <ProfileField
              label="السكشن / المجموعة"
              value={user?.section || "غير محدد"}
              icon={MapPin}
              disabled={!isEditing}
            />
            <ProfileField
              label="رقم الهاتف"
              value="+20 123 456 789"
              icon={Phone}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="pt-6 animate-in fade-in slide-in-from-bottom-2">
              <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-lg font-bold gap-2 shadow-lg shadow-blue-100">
                <Save className="w-5 h-5" /> حفظ التغييرات الجديدة
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// مكون فرعي للحقول
function ProfileField({ label, value, icon: Icon, disabled }) {
  return (
    <div className="space-y-2 text-right">
      <label className="text-xs font-bold text-gray-400 pr-2">{label}</label>
      <div className="relative">
        <Input
          defaultValue={value}
          disabled={disabled}
          className="h-14 rounded-2xl border-gray-50 bg-gray-50/50 pr-12 font-bold text-gray-700 disabled:opacity-100"
        />
        <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
      </div>
    </div>
  );
}
