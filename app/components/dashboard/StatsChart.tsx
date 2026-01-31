// components/dashboard/StatsChart.tsx
"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import gsap from "gsap";

// 1. تعريف شكل البيانات القادمة من السيرفر
interface ChartDataItem {
  _id: string; // اسم السكشن
  avgAttendance: number; // متوسط الحضور
}

interface StatsChartProps {
  data: ChartDataItem[];
}

export default function StatsChart({ data }: StatsChartProps) {
  // 2. تحديد نوع الـ Refs لضمان التوافق مع HTML
  const chartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;

    // أنيميشن الدخول باستخدام GSAP
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    });

    const chart = echarts.init(chartRef.current);
    const option: echarts.EChartsOption = {
      title: {
        text: "أداء السكاشن",
        left: "center",
        textStyle: { color: "#333", fontFamily: "inherit" },
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: data.map((i) => i._id),
      },
      yAxis: { type: "value" },
      series: [
        {
          data: data.map((i) => i.avgAttendance),
          type: "bar",
          showBackground: true,
          backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" },
          itemStyle: { color: "#3b82f6", borderRadius: [5, 5, 0, 0] },
        },
      ],
    };

    chart.setOption(option);

    // إضافة مستمع لتغيير حجم الشاشة لضمان تجاوب التشارت
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}
