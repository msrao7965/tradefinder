"use client";

import { Activity, Database } from "lucide-react";
import { BreakoutBeacon } from "@/components/scanners/BreakoutBeacon";
import { IntradayBoost } from "@/components/scanners/IntradayBoost";
import { HighPowerStocks, TopGainers, TopLosers } from "@/components/scanners/LeadersMatrix";
import { LowLevelStocks, TopLevelStocks } from "@/components/scanners/LevelTrackers";
import { useMarketData } from "@/hooks/useMarketData";

function StatusBar() {
  const { data, isLoading, isFetching, isError, error } = useMarketData(20_000);
  const statusLabel = data?.marketStatus === "open" ? "Market in session" : data?.marketStatus === "preopen" ? "Pre-open window" : data?.marketStatus === "closed" ? "Session closed" : "Status unavailable";

  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-[#dcded3] pb-5 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="mr-auto">
        <p className="stocksi-eyebrow mb-2">Underground Bulls / Market breadth</p>
        <h1 className="stocksi-display text-[26px] font-black leading-none sm:text-[32px]">Market Pulse</h1>
        <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-[#778176]">Find where price is accelerating, where participation is building and where momentum is losing its footing.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#778176]">
        <span className={data?.marketOpen ? "inline-flex items-center gap-1.5 rounded-full border border-[#d8e5d4] bg-[#eaf1e6] px-3 py-1.5 font-bold text-[#4d744e]" : "rounded-full border border-[#e1e2d8] bg-white/65 px-3 py-1.5 font-semibold"}><span className={data?.marketOpen ? "stocksi-live-dot h-1.5 w-1.5 rounded-full bg-[#66845a]" : "h-1.5 w-1.5 rounded-full bg-[#a68a50]"} />{isLoading ? "Connecting…" : statusLabel}</span>
        {data && <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e2d8] bg-white/65 px-3 py-1.5"><Database className="h-3 w-3" />{data.quotesFetched.toLocaleString("en-IN")} / {data.universeSize.toLocaleString("en-IN")} quotes</span>}
        {data && <span className="rounded-full border border-[#e1e2d8] bg-white/65 px-3 py-1.5">Updated {data.asOf} IST</span>}
        {isFetching && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ecdc] px-3 py-1.5 font-semibold text-[#947a42]"><Activity className="h-3 w-3 animate-pulse" />Syncing</span>}
        {isError && <span role="status" className="text-[#98564a]">{error instanceof Error ? error.message : "Market feed error"}</span>}
        {data?.error && <span className="text-[#98564a]">{data.error}</span>}
      </div>
    </div>
  );
}

export function ScannerGrid() {
  const { data, isLoading } = useMarketData(20_000);
  const empty = {
    breakouts: [] as never[], breakoutsSource: "live" as const, intradayBoost: [],
    topLevel: [], lowLevel: [], topGainers: [], topLosers: [], highPower: [],
  };
  const pulse = data ?? empty;

  return (
    <div className="stocksi-grid-glow mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col p-3 sm:p-5 lg:p-8">
      <StatusBar />
      {isLoading && !data && <p className="mb-4 text-xs text-[#7b8578]">Establishing live market context…</p>}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-5">
        <BreakoutBeacon rows={pulse.breakouts} source={data?.breakoutsSource} sessionDate={data?.breakoutsSessionDate} />
        <IntradayBoost rows={pulse.intradayBoost} />
        <TopLevelStocks rows={pulse.topLevel} />
        <LowLevelStocks rows={pulse.lowLevel} />
        <TopGainers rows={pulse.topGainers} />
        <TopLosers rows={pulse.topLosers} />
        <HighPowerStocks rows={pulse.highPower} />
      </div>
    </div>
  );
}
