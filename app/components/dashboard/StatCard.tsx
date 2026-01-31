"use client";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {
  return (
    <Card className="p-6 border-none shadow-sm rounded-3xl bg-white transition-transform hover:scale-[1.02] duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-black text-gray-900">{value}</h3>
          {trend && (
            <p className="text-xs font-bold mt-2 text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
              {trend}
            </p>
          )}
        </div>
        <div className={cn("p-4 rounded-2xl", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
