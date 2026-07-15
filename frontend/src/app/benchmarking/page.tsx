"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { motion } from "framer-motion";

interface BenchmarkingData {
  target_country: string;
  peer_countries: Array<{
    name: string;
    similarity: number;
    gdp: number;
    population: number;
  }>;
  best_practices: string[];
  recommended_approach: string;
}

export default function BenchmarkingModule() {
  return (
    <React.Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-rose-400 w-8 h-8" /></div>}>
      <BenchmarkingContent />
    </React.Suspense>
  );
}

function BenchmarkingContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");

  const [data, setData] = useState<BenchmarkingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assessmentId) {
      setLoading(false);
      return;
    }

    // Since Benchmarking needs country_id but we have assessment_id in URL context,
    // We first fetch the assessment to get the country_id.
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const assessRes = await fetch(`${apiUrl}/api/v1/assessments/${assessmentId}`);
        if (!assessRes.ok) throw new Error("Failed to fetch assessment");
        const assessJson = await assessRes.json();
        
        const res = await fetch(`${apiUrl}/api/v1/benchmarking/${assessJson.country_id}`);
        if (!res.ok) throw new Error("Failed to fetch benchmarking data");
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
        <div className="rounded-full bg-rose-500/20 p-6">
          <BarChart3 className="w-16 h-16 text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Country Benchmarking</h1>
        <p className="text-slate-400 text-center max-w-lg">
          Please complete a Readiness Assessment first to view your benchmarking intelligence.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-12 h-12 text-rose-400 animate-spin" />
        <p className="text-slate-400 animate-pulse">Running similarity vectors against global dataset...</p>
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

  // Create chart data formatting from peers
  const chartData = data.peer_countries.map(p => ({
    subject: p.name,
    Similarity: p.similarity,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-rose-500/20 p-3">
          <BarChart3 className="w-8 h-8 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Country Benchmarking</h1>
          <p className="text-slate-400">Similarity analysis and best practices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 text-center">Vector Similarity with Peer Nations</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#cbd5e1" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
                <Radar name="Similarity %" dataKey="Similarity" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.5} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Peers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6 flex flex-col"
        >
          <h2 className="text-lg font-semibold mb-4">Closest Match Nations</h2>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {data.peer_countries.map((peer, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-200">{peer.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">GDP: ${peer.gdp}B | Pop: {(peer.population / 1000000).toFixed(1)}M</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-rose-400">{peer.similarity}%</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Match</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Best Practices & Approach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Historical Best Practices
          </h2>
          
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Recommended Approach</h4>
            <p className="text-slate-300">{data.recommended_approach}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.best_practices.map((practice, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-900/30 border border-slate-800">
                <p className="text-sm text-slate-300">{practice}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
