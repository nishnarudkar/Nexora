"use client";

import { HelpCircle, AlertCircle } from "lucide-react";

export default function HelpModule() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 animate-fade-in-up">
      <div className="rounded-full bg-blue-500/20 p-6">
        <HelpCircle className="w-16 h-16 text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Support & Documentation</h1>
      <p className="text-slate-400 text-center max-w-lg">
        Access the Nexora platform documentation, IAEA guidelines, and contact support.
      </p>
      
      <div className="glass-card mt-8 p-6 flex items-start gap-4 max-w-lg border-blue-500/30 bg-blue-500/5">
        <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-blue-200">Documentation Unavailable</h3>
          <p className="text-sm text-slate-300 mt-1">
            Support portal is currently offline. For questions regarding the hackathon submission, please refer to the project README.
          </p>
        </div>
      </div>
    </div>
  );
}
