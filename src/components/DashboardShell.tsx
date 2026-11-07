"use client";

import { GlobalTicker } from "@/components/GlobalTicker";
import { Sidebar } from "@/components/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:h-dvh md:min-h-0 md:flex-row md:overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <GlobalTicker />
        <main id="main-content" className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
        <footer className="shrink-0 border-t border-white/[.08] bg-[#0b1422]/90 px-4 py-2 text-center text-[9px] leading-relaxed text-[#7187a4]">Stocksi is an AI-assisted market research tool, not investment advice. All signals are informational; verify independently before trading.</footer>
        <footer className="shrink-0 border-t border-white/[.08] bg-[#0b1422]/90 px-4 py-2 text-center text-[9px] leading-relaxed text-[#7187a4]">Stocksi is an AI-assisted market research tool, not investment advice. All signals are informational; verify independently before trading.</footer>
      </div>
    </div>
  );
}
