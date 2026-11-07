"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { EmptyRow, Table, Td } from "@/components/ui/table";
import { useSortedRows } from "@/hooks/useSortedRows";
import { formatNumber, formatPct, cn } from "@/lib/utils";
import type { ClockSlot, OptionClockResponse } from "@/lib/phase3-types";

async function fetchClock(underlying: "nifty" | "bank"): Promise<OptionClockResponse> {
  const q = underlying === "bank" ? "?underlying=bank" : "";
  const res = await fetch(`/api/option-clock${q}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Momentum clock HTTP ${res.status}`);
  return res.json();
}

export function OptionClockView() {
  const [underlying, setUnderlying] = useState<"nifty" | "bank">("nifty");
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["option-clock", underlying], queryFn: () => fetchClock(underlying),
    refetchInterval: 20_000, refetchIntervalInBackground: false,
  });
  const { rows: sorted, sortKey, sortDir, onSort } = useSortedRows(data?.slots ?? [], (r: ClockSlot, key) => {
    if (key === "time") return r.time;
    if (key === "close") return r.close;
    if (key === "changePercent") return r.changePercent;
    if (key === "cumulativeFromOpen") return r.cumulativeFromOpen;
    return r.bias;
  }, "time", "asc");

  return (
    <div className="stocksi-grid-glow min-h-full p-3 sm:p-5 lg:p-8">
      <PageHeader title="Momentum Clock" subtitle="A time-based view of index direction—revealing when upside or downside pressure gathered strength through the session." asOf={data?.asOf} marketStatus={data?.marketStatus} isLoading={isLoading} isFetching={isFetching} error={isError ? (error instanceof Error ? error.message : "Feed error") : data?.error} />
      <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex overflow-hidden rounded-xl border border-[#dfe2d6] bg-white/65 p-1">
          <button type="button" onClick={() => setUnderlying("nifty")} className={cn("rounded-lg px-4 py-2 font-semibold transition-colors", underlying === "nifty" ? "bg-[#e7eee2] text-[#3f6747] shadow-sm" : "text-[#788477] hover:bg-white")}>Nifty 50</button>
          <button type="button" onClick={() => setUnderlying("bank")} className={cn("rounded-lg px-4 py-2 font-semibold transition-colors", underlying === "bank" ? "bg-[#e7eee2] text-[#3f6747] shadow-sm" : "text-[#788477] hover:bg-white")}>Bank Nifty</button>
        </div>
        {data && <span className="rounded-full border border-[#e1e2d8] bg-white/65 px-3 py-2 text-[#65745f]">{data.underlying} · {formatNumber(data.underlyingPrice)} · {formatPct(data.underlyingChangePercent)}</span>}
        {data?.bestLongWindow && <span className="rounded-full bg-[#eaf1e6] px-3 py-2 font-semibold text-[#4d744e]">Strongest upside window · {data.bestLongWindow}</span>}
        {data?.bestShortWindow && <span className="rounded-full bg-[#f3e4df] px-3 py-2 font-semibold text-[#98564a]">Strongest downside window · {data.bestShortWindow}</span>}
      </div>
      <Card title="Session rhythm · 15-minute intervals" description="Each interval shows its price contribution and the directional pressure accumulated from the open.">
        <Table columns={[
          { key: "time", label: "Interval · IST" }, { key: "close", label: "Index level", align: "right" },
          { key: "changePercent", label: "Interval move", align: "right" }, { key: "cumulativeFromOpen", label: "From open", align: "right" }, { key: "bias", label: "Directional read" },
        ]} sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
          {sorted.length === 0 ? <EmptyRow colSpan={5} message="Session intervals will appear as index data builds." /> : sorted.map((r) => (
            <tr key={r.time}><Td className="font-semibold">{r.time}</Td><Td align="right">{formatNumber(r.close)}</Td>
              <Td align="right" className={r.changePercent >= 0 ? "text-bull-text" : "text-bear-text"}>{formatPct(r.changePercent)}</Td>
              <Td align="right" className={r.cumulativeFromOpen >= 0 ? "text-bull-text" : "text-bear-text"}>{formatPct(r.cumulativeFromOpen)}</Td>
              <Td><Badge variant={r.bias === "BULL" ? "bull" : r.bias === "BEAR" ? "bear" : "neutral"}>{r.bias === "BULL" ? "UPWARD" : r.bias === "BEAR" ? "DOWNWARD" : "BALANCED"}</Badge></Td>
            </tr>
          ))}
        </Table>
      </Card>
      {data?.note && <p className="mt-3 text-[10px] leading-relaxed text-[#899184]">{data.note}</p>}
    </div>
  );
}
