"use client";

import { Settings as SettingsIcon, AlertCircle } from "lucide-react";

export default function SettingsModule() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 animate-fade-in-up">
      <div className="rounded-full bg-slate-500/20 p-6">
        <SettingsIcon className="w-16 h-16 text-slate-400" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
      <p className="text-slate-400 text-center max-w-lg">
        Configure your AI engine preferences, manage API keys, and update your country profile data.
      </p>
      
      <div className="glass-card mt-8 p-6 flex items-start gap-4 max-w-lg border-slate-500/30 bg-slate-500/5">
        <AlertCircle className="w-6 h-6 text-slate-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-slate-200">Settings Unavailable</h3>
          <p className="text-sm text-slate-300 mt-1">
            The settings panel is disabled in this demo environment.
          </p>
        </div>
      </div>
    </div>
  );
}
