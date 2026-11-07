"use client";

import { Activity, Clock3, Database, Radio } from "lucide-react";

export function PageHeader({ title, subtitle, asOf, marketStatus, quotesFetched, isLoading, isFetching, error }: {
  title: string;
  subtitle?: string;
  asOf?: string;
  marketStatus?: string;
  quotesFetched?: number;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: string | null;
}) {
  const statusLabel = marketStatus === "open" ? "Market in session" : marketStatus === "preopen" ? "Pre-open window" : marketStatus === "closed" ? "Session closed" : marketStatus || undefined;
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[#dcded3] pb-5 sm:mb-7 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-0 flex-1">
        <p className="stocksi-eyebrow mb-2">Underground Bulls / Intelligence terminal</p>
        <h1 className="stocksi-display text-[26px] font-black leading-none sm:text-[32px]">{title}</h1>
        {subtitle && <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-[#778176] sm:text-[13px]">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#778176] sm:justify-end">
        {statusLabel && <span className={marketStatus === "open" ? "inline-flex items-center gap-1.5 rounded-full border border-[#d8e5d4] bg-[#eaf1e6] px-3 py-1.5 font-bold text-[#4d744e]" : "rounded-full border border-[#e1e2d8] bg-white/65 px-3 py-1.5 font-semibold text-[#778176]"}>{marketStatus === "open" && <span className="stocksi-live-dot h-1.5 w-1.5 rounded-full bg-[#66845a]" />}{isLoading ? "Connecting…" : statusLabel}</span>}
        {typeof quotesFetched === "number" && <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e2d8] bg-white/65 px-3 py-1.5"><Database className="h-3 w-3" />{quotesFetched.toLocaleString("en-IN")} instruments</span>}
        {asOf && <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e2d8] bg-white/65 px-3 py-1.5"><Clock3 className="h-3 w-3" />Updated {asOf} IST</span>}
        {isFetching && !isLoading && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ecdc] px-3 py-1.5 font-semibold text-[#947a42]"><Activity className="h-3 w-3 animate-pulse" />Syncing</span>}
        {error && <span role="status" className="max-w-full rounded-full bg-[#f3e4df] px-3 py-1.5 font-semibold text-[#9b5148]">{error}</span>}
      </div>
    </div>
  );
}
