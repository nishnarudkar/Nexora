import Link from 'next/link';
import { ArrowRight, Atom, Globe, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="z-10 flex flex-col items-center max-w-5xl px-6 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-blue-200 mb-8 animate-fade-in-up">
          <Atom className="w-4 h-4 text-blue-400" />
          <span>The Future of Nuclear Energy Planning</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6">
          <span className="text-white">Atom</span>
          <span className="gradient-text">Ready</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl leading-relaxed">
          An AI-powered Decision Intelligence Platform that evaluates a country's readiness for Small Modular Reactor (SMR) adoption and generates a personalized implementation roadmap.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/assessment" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.7)] flex items-center justify-center gap-2 group">
            Start Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 rounded-xl glass-panel text-white font-semibold text-lg hover:bg-slate-800/50 transition-all">
            View Sample Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-card">
            <Globe className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Country Benchmarking</h3>
            <p className="text-slate-400">Compare your infrastructure and policies against similar nuclear programs globally.</p>
          </div>
          <div className="glass-card">
            <Shield className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">IAEA Compliance</h3>
            <p className="text-slate-400">Track your progress against official IAEA Nuclear Infrastructure Milestones.</p>
          </div>
          <div className="glass-card">
            <Zap className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI-Driven Roadmap</h3>
            <p className="text-slate-400">Get a phased, year-by-year implementation plan tailored to your country's unique profile.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
