"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users, AlertCircle, Loader2, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface HRData {
  current_personnel: Record<string, number>;
  required_personnel: Record<string, number>;
  deficit: Record<string, number>;
  skill_gap_matrix: Array<{
    role: string;
    gap_level: string;
    mitigation: string;
  }>;
  university_partnerships: string[];
}

export default function HumanResourcesModule() {
  return (
    <React.Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-purple-400 w-8 h-8" /></div>}>
      <HumanResourcesContent />
    </React.Suspense>
  );
}

function HumanResourcesContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");

  const [data, setData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assessmentId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/v1/hr/${assessmentId}`);
        if (!res.ok) throw new Error("Failed to fetch HR data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  if (!assessmentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 animate-fade-in-up">
        <div className="rounded-full bg-purple-500/20 p-6">
          <Users className="w-16 h-16 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Human Resources Intelligence</h1>
        <p className="text-slate-400 text-center max-w-lg">
          Please complete a Readiness Assessment first to view your HR intelligence.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
        <p className="text-slate-400 animate-pulse">Analyzing workforce data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold tracking-tight text-red-200">Analysis Failed</h1>
        <p className="text-slate-400">{error || "Could not load data"}</p>
      </div>
    );
  }

  const chartData = Object.keys(data.current_personnel).map((role) => ({
    name: role,
    Current: data.current_personnel[role],
    Required: data.required_personnel[role],
  }));

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-purple-500/20 p-3">
          <Users className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Human Resources Intelligence</h1>
          <p className="text-slate-400">Workforce deficit and recruitment strategies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-purple-400" />
            Current vs. Required Personnel
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="Current" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Required" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Partnerships Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            Recommended University Partnerships
          </h2>
          <div className="space-y-4">
            {data.university_partnerships.map((uni, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-md">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-medium text-slate-200">{uni}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill Gap Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold mb-6">Skill Gap Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                  <th className="pb-3 px-4 font-medium">Role</th>
                  <th className="pb-3 px-4 font-medium">Deficit</th>
                  <th className="pb-3 px-4 font-medium">Severity</th>
                  <th className="pb-3 px-4 font-medium">Mitigation Strategy</th>
                </tr>
              </thead>
              <tbody>
                {data.skill_gap_matrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-200">{row.role}</td>
                    <td className="py-4 px-4 text-slate-300">{data.deficit[row.role] || 0} personnel</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        row.gap_level === "Critical" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        row.gap_level === "High" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {row.gap_level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{row.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
