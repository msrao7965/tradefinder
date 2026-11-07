"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Radio } from "lucide-react";
import { formatPct } from "@/lib/utils";
import type { TickerItem } from "@/lib/types";

async function fetchTicker(): Promise<{ items: TickerItem[]; asOf: string }> {
  const res = await fetch("/api/ticker", { cache: "no-store" });
  if (!res.ok) throw new Error("Ticker feed unavailable");
  return res.json();
}

function TickerChip({ item }: { item: TickerItem }) {
  const up = item.changePercent >= 0;
  return (
    <span className="mx-3 inline-flex items-center gap-2 whitespace-nowrap text-[11px] sm:mx-4 sm:text-xs">
      <span className="font-bold text-[#304637]">{item.name}</span>
      <span className="tabular-nums text-[#69766a]">{item.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
      <span className={`tabular-nums font-bold ${up ? "text-bull-text" : "text-bear-text"}`}>
        {up ? "↗" : "↘"} {formatPct(item.changePercent)}
      </span>
      <span className="ml-1 text-[#c4c8b9]" aria-hidden="true">✦</span>
    </span>
  );
}

export function GlobalTicker() {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["global-ticker"], queryFn: fetchTicker, refetchInterval: 20_000,
    refetchIntervalInBackground: false,
  });
  const items = data?.items ?? [];

  return (
    <div aria-label="Live market ticker" className="flex h-10 shrink-0 items-center overflow-hidden border-b border-[#deded2] bg-[#fbfaf5]/90 shadow-[0_3px_14px_rgba(43,59,40,.035)]">
      <span className="z-10 flex h-full shrink-0 items-center gap-2 border-r border-[#e3e3d9] bg-[#f6f5ed] px-3 text-[9px] font-extrabold uppercase tracking-[.16em] text-[#56724f]">
        <Radio className="h-3.5 w-3.5" /> Market stream
      </span>
      {isLoading && <p className="px-4 text-[11px] text-[#7b8578]">Establishing market connection…</p>}
      {isError && <p className="px-4 text-[11px] text-bear-text">Market feed temporarily unavailable</p>}
      {!isLoading && !isError && items.length === 0 && <p className="px-4 text-[11px] text-[#7b8578]">Awaiting quote stream</p>}
      {items.length > 0 && <div className="flex w-max animate-marquee">{[...items, ...items].map((item, i) => <TickerChip key={`${item.symbol}-${i}`} item={item} />)}</div>}
      <span className="ml-auto hidden shrink-0 items-center gap-1.5 px-3 text-[9px] font-semibold uppercase tracking-wider text-[#8a9386] sm:flex">
        <Activity className={`h-3 w-3 ${isFetching ? "text-[#a68a50]" : "text-[#66845a]"}`} />
        {isFetching ? "Syncing" : "20s cycle"}
      </span>
    </div>
  );
}
