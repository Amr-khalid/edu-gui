"use client";
import { Bell, Megaphone, AlertCircle, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NotificationProps {
  title: string;
  content: string;
  type: "urgent" | "announcement" | "reminder";
  createdAt: string;
  isRead?: boolean;
  onMarkAsRead?: () => void;
}

export default function NotificationCard({
  title,
  content,
  type,
  createdAt,
  isRead,
  onMarkAsRead,
}: NotificationProps) {
  // تحديد الأيقونة واللون بناءً على النوع
  const config = {
    urgent: {
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    announcement: {
      icon: Megaphone,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    reminder: {
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
  };

  const { icon: Icon, color, bg, border } = config[type];

  return (
    <div
      className={cn(
        "relative p-5 rounded-3xl border-2 transition-all duration-300 animate-item",
        border,
        isRead ? "bg-white opacity-70" : "bg-white shadow-sm",
      )}
    >
      <div className="flex gap-4 items-start">
        <div className={cn("p-3 rounded-2xl", bg, color)}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            <h4 className="font-black text-gray-900 text-lg">{title}</h4>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              {new Date(createdAt).toLocaleDateString("ar-EG")}
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{content}</p>
        </div>

        {!isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAsRead}
            className="rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors"
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!isRead && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
        </span>
      )}
    </div>
  );
}
