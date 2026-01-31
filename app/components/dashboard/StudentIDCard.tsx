"use client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { QrCode, ShieldCheck, Download } from "lucide-react";
import QRCode from "react-qr-code"; // سنحتاج لتثبيتها: npm install react-qr-code

export default function StudentIDCard() {
  const { user } = useAuth();

  return (
    <Card className="relative overflow-hidden w-full max-w-sm mx-auto rounded-[32px] border-none bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-200">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-200" />
            <span className="text-xs font-black tracking-widest uppercase opacity-80">
              Digital ID
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">
            2026 Version
          </span>
        </div>

        {/* QR Section */}
        <div className="bg-white p-4 rounded-3xl flex justify-center items-center mx-auto w-48 h-48 shadow-inner">
          <QRCode
            value={JSON.stringify({ sid: user?.id, name: user?.name })}
            size={160}
            fgColor="#1e3a8a"
          />
        </div>

        {/* User Info */}
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-black">{user?.name}</h3>
          <p className="text-blue-100 text-sm font-medium">
            {user?.section} | {user?.studentId || "Student"}
          </p>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="bg-white/10 p-4 flex justify-center">
        <button className="flex items-center gap-2 text-[10px] font-bold hover:text-white transition-colors">
          <Download className="w-3 h-3" /> تحميل الهوية كصورة
        </button>
      </div>
    </Card>
  );
}
