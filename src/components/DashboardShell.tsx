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
      </div>
    </div>
  );
}
