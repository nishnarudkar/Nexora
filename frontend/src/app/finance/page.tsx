"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DollarSign, AlertCircle, Loader2, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { motion } from "framer-motion";

interface FinanceData {
  feasibility_score: number;
  capex_estimates: Record<string, number>;
  recommended_model: string;
  risk_factors: string[];
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

export default function FinanceModule() {
  return (
    <React.Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-amber-400 w-8 h-8" /></div>}>
      <FinanceContent />
    </React.Suspense>
  );
}

function FinanceContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");

  const [data, setData] = useState<FinanceData | null>(null);
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
        const res = await fetch(`${apiUrl}/api/v1/finance/${assessmentId}`);
        if (!res.ok) throw new Error("Failed to fetch Finance data");
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
        <div className="rounded-full bg-amber-500/20 p-6">
          <DollarSign className="w-16 h-16 text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Financing Models Intelligence</h1>
        <p className="text-slate-400 text-center max-w-lg">
          Please complete a Readiness Assessment first to view your financial intelligence.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
        <p className="text-slate-400 animate-pulse">Analyzing financial feasibility...</p>
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

  const capexData = Object.keys(data.capex_estimates).map((key) => ({
    name: key,
    value: data.capex_estimates[key]
  }));

  // Helper for gauge
  const circumference = 2 * Math.PI * 45; // r=45
  const offset = circumference - (data.feasibility_score / 100) * circumference;

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-amber-500/20 p-3">
          <DollarSign className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financing Models Intelligence</h1>
          <p className="text-slate-400">CAPEX estimation and model recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 col-span-1 lg:col-span-2 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30"
        >
          <div className="p-4 rounded-xl bg-amber-500/20 flex-shrink-0">
            <DollarSign className="w-10 h-10 text-amber-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-amber-200 font-medium tracking-wider uppercase text-sm mb-1">AI Recommended Funding Model</h3>
            <p className="text-2xl font-bold text-white">{data.recommended_model}</p>
            <p className="text-slate-400 text-sm mt-2">Based on your inputted budget and private investment capability.</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-slate-800 relative">
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="#1e293b" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="#fbbf24" strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                transform="rotate(-90 50 50)" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-amber-400">{data.feasibility_score}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
            </div>
          </div>
        </motion.div>

        {/* Capex Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6">Estimated CAPEX Breakdown (USD Millions)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capexData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {capexData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} formatter={(value) => `$${value}M`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Key Risk Factors
          </h2>
          <div className="space-y-4">
            {data.risk_factors.map((risk, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-red-950/20 border border-red-900/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">{risk}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
