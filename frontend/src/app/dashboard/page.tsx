"use client";

import GaugeChart from "@/components/charts/GaugeChart";
import RadarChart from "@/components/charts/RadarChart";
import RoadmapTimeline from "@/components/charts/RoadmapTimeline";

export default function Dashboard() {
  const radarData = [
    { subject: 'HR', A: 75, fullMark: 100 },
    { subject: 'Finance', A: 45, fullMark: 100 },
    { subject: 'Policy', A: 80, fullMark: 100 },
    { subject: 'Infra', A: 60, fullMark: 100 },
    { subject: 'Stakeholder', A: 90, fullMark: 100 },
  ];

  const timelineEvents = [
    { year: 1, title: "Develop nuclear policy", description: "Establish national position.", completed: true },
    { year: 2, title: "Build workforce", description: "Partner with international universities.", completed: false },
    { year: 3, title: "Funding partnerships", description: "Secure PPP agreements.", completed: false },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="glass-card flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Overall Nuclear Readiness</h3>
          <GaugeChart value={72} label="Readiness Index" />
        </div>
        
        <div className="glass-card lg:col-span-2">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Dimensional Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RadarChart data={radarData} />
            <div className="flex flex-col justify-center space-y-4">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="font-semibold text-emerald-400">Strength: Stakeholders</h4>
                <p className="text-sm text-slate-300">Strong public support and stakeholder engagement identified.</p>
              </div>
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <h4 className="font-semibold text-rose-400">Weakness: Financing</h4>
                <p className="text-sm text-slate-300">Budget constraints require PPP or international loans.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="glass-card lg:col-span-2">
          <h3 className="text-lg font-medium text-slate-200 mb-6">Generated Roadmap</h3>
          <RoadmapTimeline events={timelineEvents} />
        </div>
        
        <div className="glass-card">
          <h3 className="text-lg font-medium text-slate-200 mb-4">IAEA Phase Status</h3>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-5xl font-bold text-blue-400 mb-2">Phase 1</div>
            <p className="text-slate-400 text-center">Considerations before a decision to launch a nuclear power programme is taken.</p>
            <div className="w-full bg-slate-800 rounded-full h-2.5 mt-8">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <span className="text-xs text-slate-500 mt-2">65% Prerequisites Met</span>
          </div>
        </div>
      </div>
    </div>
  );
}
