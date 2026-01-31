"use client";
import ReactECharts from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AttendanceChart() {
  const options = {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
      axisLine: { show: false },
    },
    yAxis: { type: "value", splitLine: { lineStyle: { type: "dashed" } } },
    series: [
      {
        name: "نسبة الحضور",
        type: "line",
        smooth: true,
        data: [85, 92, 88, 95, 90],
        itemStyle: { color: "#2563eb" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(37, 99, 235, 0.2)" },
              { offset: 1, color: "rgba(37, 99, 235, 0)" },
            ],
          },
        },
      },
    ],
  };

  return (
    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          تطور نسبة الحضور الأسبوعية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReactECharts option={options} style={{ height: "300px" }} />
      </CardContent>
    </Card>
  );
}
