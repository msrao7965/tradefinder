"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { SymbolLink } from "@/components/SymbolLink";
import { EmptyRow, Table, Td } from "@/components/ui/table";
import { useSortedRows } from "@/hooks/useSortedRows";
import { formatCompact, formatNumber, formatPct } from "@/lib/utils";
import type { InsiderRow, InsiderStrategyResponse } from "@/lib/phase2-types";

async function fetchInsider(): Promise<InsiderStrategyResponse> {
  const res = await fetch("/api/insider-strategy", { cache: "no-store" });
  if (!res.ok) throw new Error(`Activity stream HTTP ${res.status}`);
  return res.json();
}

function getValue(row: InsiderRow, key: string): string | number {
  switch (key) {
    case "symbol": return row.symbol;
    case "sector": return row.sector;
    case "ltp": return row.ltp;
    case "changePercent": return row.changePercent;
    case "relativeVolume": return row.relativeVolume;
    case "turnover": return row.turnover;
    case "score": return row.score;
    case "signal": return row.signal;
    default: return 0;
  }
}

export function InsiderStrategyView() {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["insider-strategy"], queryFn: fetchInsider, refetchInterval: 20_000,
    refetchIntervalInBackground: false,
  });
  const { rows: sorted, sortKey, sortDir, onSort } = useSortedRows(data?.rows ?? [], getValue, "score", "desc");

  return (
    <div className="stocksi-grid-glow min-h-full p-3 sm:p-5 lg:p-8">
      <PageHeader title="Flow Watch" subtitle="Unusual participation and traded-value footprints that can signal growing attention or directional pressure." asOf={data?.asOf} marketStatus={data?.marketStatus} quotesFetched={data?.quotesFetched} isLoading={isLoading} isFetching={isFetching} error={isError ? (error instanceof Error ? error.message : "Feed error") : data?.error} />
      <Card title="Unusual participation" description="Names trading materially above their normal activity rhythm. This is a volume-based signal—not a measure of insider transactions.">
        <Table columns={[
          { key: "signal", label: "Pressure" }, { key: "symbol", label: "Instrument" }, { key: "sector", label: "Sector" },
          { key: "ltp", label: "Last price", align: "right" }, { key: "changePercent", label: "Session move", align: "right" },
          { key: "relativeVolume", label: "Activity pace", align: "right" }, { key: "turnover", label: "Value traded", align: "right" }, { key: "score", label: "Intensity", align: "right" },
        ]} sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
          {sorted.length === 0 ? <EmptyRow colSpan={8} message="No standout participation footprints in the latest quote set." /> : sorted.map((r) => (
            <tr key={r.symbol}>
              <Td><Badge variant={r.signal === "BULL" ? "bull" : "bear"}>{r.signal === "BULL" ? "UPWARD" : "DOWNWARD"}</Badge></Td>
              <Td><SymbolLink symbol={r.symbol} /></Td><Td className="text-muted">{r.sector}</Td><Td align="right">{formatNumber(r.ltp)}</Td>
              <Td align="right" className={r.changePercent >= 0 ? "text-bull-text" : "text-bear-text"}>{r.changePercent >= 0 ? "↗" : "↘"} {formatPct(r.changePercent)}</Td>
              <Td align="right">{formatNumber(r.relativeVolume, 2)}×</Td><Td align="right">{formatCompact(r.turnover)}</Td><Td align="right" className="font-semibold text-[#526d4d]">{formatNumber(r.score, 1)}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
