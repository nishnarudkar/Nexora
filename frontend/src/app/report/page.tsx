"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Gauge } from 'recharts';
import { Activity, ShieldCheck, DollarSign, Users, CheckCircle2, ChevronRight, Globe, AlertTriangle } from 'lucide-react';

export default function ReportPage() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('assessmentId');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assessmentId) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      fetch(`${apiUrl}/api/generate-roadmap/${assessmentId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setReportData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-medium text-blue-200">AI Intelligence Engine Processing...</h2>
      </div>
    );
  }

  if (!reportData) return <div className="p-8 text-center">Error loading report</div>;

  const radarData = [
    { subject: 'Human Resources', A: reportData.readiness_index.human_resources, fullMark: 100 },
    { subject: 'Financing', A: reportData.readiness_index.financing, fullMark: 100 },
    { subject: 'Stakeholders', A: reportData.readiness_index.stakeholders, fullMark: 100 },
    { subject: 'Policy', A: reportData.readiness_index.policy, fullMark: 100 },
    { subject: 'Infrastructure', A: reportData.readiness_index.infrastructure, fullMark: 100 },
  ];

  const hrData = Object.keys(reportData.workforce_requirements).map(key => ({
    name: key.replace('_', ' ').toUpperCase(),
    Required: reportData.workforce_requirements[key]
  }));

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" /> Assessment Complete
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Nuclear Readiness Report</h1>
          <p className="text-slate-400 text-lg">AI-generated decision intelligence for SMR deployment.</p>
        </div>
        <div className="mt-6 md:mt-0 glass-card !p-4 flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Overall Score</p>
            <p className="text-4xl font-extrabold text-blue-400">{reportData.readiness_index.overall}<span className="text-xl text-slate-600">/100</span></p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
               <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-500" strokeDasharray={`${reportData.readiness_index.overall * 1.63} 163`} />
             </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Radar Chart */}
        <div className="lg:col-span-1 glass-card flex flex-col items-center">
          <h3 className="text-xl font-bold text-white self-start w-full mb-4 flex items-center gap-2"><Activity className="text-blue-400"/> Readiness Dimensions</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                <Radar name="Readiness" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Benchmarking */}
        <div className="lg:col-span-2 glass-card">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Globe className="text-emerald-400"/> Country Benchmarking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-2">Similar Nuclear Profiles</p>
              <div className="flex flex-wrap gap-2">
                {reportData.benchmarking.similar_countries.map((c: string) => (
                  <span key={c} className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-blue-200 border border-slate-700">{c}</span>
                ))}
              </div>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400 mb-2">Recommended Financing</p>
              <p className="text-lg font-medium text-white">{reportData.financing_model}</p>
            </div>
            <div className="md:col-span-2 bg-blue-900/20 p-6 rounded-xl border border-blue-800/30">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-blue-200 mb-1">AI Strategic Insights</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">{reportData.benchmarking.lessons_learned}</p>
                  <p className="text-slate-300 text-sm leading-relaxed"><span className="text-white font-medium">Recommendation:</span> {reportData.benchmarking.recommended_approach}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* IAEA Milestones */}
        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ShieldCheck className="text-purple-400"/> IAEA Milestone Progress</h3>
          <div className="mb-8 relative">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-purple-300">Phase {reportData.iaea_phase}</span>
              <span className="text-sm text-slate-400">{reportData.iaea_progress}% Complete</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full" style={{ width: `${reportData.iaea_progress}%` }} />
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-400 uppercase font-semibold tracking-wider mb-4">Remaining Tasks for Phase 1</p>
            <ul className="space-y-3">
              {reportData.iaea_remaining_tasks.map((task: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* HR Deficit */}
        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Users className="text-amber-400"/> Workforce Deficit Analysis</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hrData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="Required" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-400 mt-4 text-center">Estimated additional personnel required before Phase 2.</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="glass-card mb-12">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">7-Year Phased SMR Deployment Roadmap</h3>
        <div className="max-w-4xl mx-auto">
          {reportData.timeline.map((step: any, index: number) => (
            <div key={index} className="flex group mb-8 last:mb-0">
              <div className="flex flex-col items-center mr-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-bold group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  Y{step.year}
                </div>
                {index !== reportData.timeline.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-800 my-2 group-hover:bg-blue-900 transition-colors" />
                )}
              </div>
              <div className="pb-8">
                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                <p className="text-slate-400 text-lg leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
