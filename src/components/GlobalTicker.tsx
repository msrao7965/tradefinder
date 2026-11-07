"use client";

import { useQuery } from "@tanstack/react-query";
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
      <span className="font-semibold text-foreground">{item.name}</span>
      <span className="tabular-nums text-muted">{item.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
      <span className={`tabular-nums font-medium ${up ? "text-bull-text" : "text-bear-text"}`}>
        {up ? "↑" : "↓"} {formatPct(item.changePercent)}
      </span>
      <span className="ml-1 text-[#526267]" aria-hidden="true">•</span>
    </span>
  );
}

export function GlobalTicker() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["global-ticker"], queryFn: fetchTicker, refetchInterval: 30_000,
  });
  const items = data?.items ?? [];

  return (
    <div aria-label="Live market ticker" className="flex h-9 shrink-0 items-center overflow-hidden border-b border-white/[.07] bg-[#0c151b]">
      <span className="stocksi-kicker z-10 hidden shrink-0 bg-[#0c151b] px-3 text-[9px] font-bold uppercase sm:block">Market feed</span>
      {isLoading && <p className="px-4 text-[11px] text-muted">Connecting to market feed…</p>}
      {isError && <p className="px-4 text-[11px] text-bear-text">Market feed unavailable</p>}
      {!isLoading && !isError && items.length === 0 && <p className="px-4 text-[11px] text-muted">No ticker quotes returned</p>}
      {items.length > 0 && <div className="flex w-max animate-marquee">{[...items, ...items].map((item, i) => <TickerChip key={`${item.symbol}-${i}`} item={item} />)}</div>}
    </div>
  );
}
