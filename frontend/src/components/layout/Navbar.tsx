import Link from "next/link";
import { Activity, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Activity className="h-6 w-6 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight gradient-text">Nexora</span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/assessment" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            New Assessment
          </Link>
          <button className="md:hidden">
            <Menu className="h-6 w-6 text-slate-300" />
          </button>
        </div>
      </div>
    </nav>
  );
}
