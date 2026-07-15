"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function GaugeChart({ value, label }: { value: number; label: string }) {
  const data = [
    { name: "Score", value: value },
    { name: "Remaining", value: 100 - value }
  ];
  
  const COLORS = ["#3b82f6", "#1e293b"];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-12">
          <span className="text-3xl font-bold">{value}%</span>
        </div>
      </div>
      <span className="text-sm text-slate-400 mt-2">{label}</span>
    </div>
  );
}
