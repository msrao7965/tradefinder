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
          <div className="mx-auto w-full max-w-[1800px] px-4 pb-3 pt-1 text-[9px] leading-relaxed text-[#7187a4] sm:px-6">
            Stocksi is an AI-assisted market research tool, not investment advice. All signals are informational; verify independently before trading.
          </div>
        </main>
      </div>
    </div>
  );
}
