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
  return <span className="mx-4 inline-flex items-center gap-2 whitespace-nowrap font-mono text-[10px] sm:text-[11px]">
    <span className="font-semibold tracking-wide text-[#cbd6dc]">{item.name}</span>
    <span className="text-[#9cabb4]">{item.price.toLocaleString("en-IN",{maximumFractionDigits:2})}</span>
    <span className={up?"font-semibold text-[#35c98a]":"font-semibold text-[#ef777d]"}>{up?"▲":"▼"} {formatPct(item.changePercent)}</span>
  </span>;
}
export function GlobalTicker() {
  const {data,isLoading,isError}=useQuery({queryKey:["global-ticker"],queryFn:fetchTicker,refetchInterval:20_000,refetchIntervalInBackground:false});
  const items=data?.items??[];
  return <div aria-label="Live market ticker" className="flex h-9 shrink-0 items-center overflow-hidden border-b border-[#253440] bg-[#080e14]">
    <span className="z-10 flex h-full shrink-0 items-center border-r border-[#253440] bg-[#0b141c] px-3 font-mono text-[9px] font-bold uppercase tracking-[.13em] text-[#55b9a7]">NSE · TAPE</span>
    {isLoading&&<p className="px-3 text-[10px] text-[#82939d]">Connecting to market feed…</p>}
    {isError&&<p className="px-3 text-[10px] text-[#ef777d]">Market feed unavailable</p>}
    {!isLoading&&!isError&&items.length===0&&<p className="px-3 text-[10px] text-[#82939d]">No ticker quotes returned</p>}
    {items.length>0&&<div className="flex w-max">{items.map(item=><TickerChip key={item.symbol} item={item}/>)}</div>}
  </div>;
}
