"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutDashboard, FileText, Settings, HelpCircle, BarChart3, Users, DollarSign } from "lucide-react";

export default function Sidebar() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('assessmentId') || '';
  const querySuffix = assessmentId ? `?assessmentId=${assessmentId}` : '';

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/50 backdrop-blur-sm md:flex">
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-4">
        <nav className="flex-1 space-y-2">
          <div className="pb-4">
            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overview
            </h4>
            <Link href={`/dashboard${querySuffix}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white">
              <LayoutDashboard className="h-5 w-5 text-blue-400" />
              <span>Dashboard</span>
            </Link>
            <Link href="/assessment" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white">
              <FileText className="h-5 w-5 text-emerald-400" />
              <span>Readiness Assessment</span>
            </Link>
          </div>
          
          <div className="pb-4">
            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Intelligence Modules
            </h4>
            <Link href={`/hr${querySuffix}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white">
              <Users className="h-5 w-5 text-purple-400" />
              <span>Human Resources</span>
            </Link>
            <Link href={`/finance${querySuffix}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white">
              <DollarSign className="h-5 w-5 text-amber-400" />
              <span>Financing Models</span>
            </Link>
            <Link href={`/benchmarking${querySuffix}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white">
              <BarChart3 className="h-5 w-5 text-rose-400" />
              <span>Benchmarking</span>
            </Link>
          </div>
        </nav>
        
        <div className="mt-auto border-t border-slate-800 pt-4 pb-4">
          <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:text-white">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <Link href="/help" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:text-white">
            <HelpCircle className="h-5 w-5" />
            <span>Support</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
