"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SymbolLink } from "@/components/SymbolLink";
import { EmptyRow, Table, Td } from "@/components/ui/table";
import { useSortedRows } from "@/hooks/useSortedRows";
import { formatPct } from "@/lib/utils";
import type { BreakoutRow } from "@/lib/types";

const COLUMNS = [
  { key: "signal", label: "Pressure" },
  { key: "symbol", label: "Instrument" },
  { key: "changePercent", label: "Session move", align: "right" as const },
  { key: "signalPercent", label: "At first signal", align: "right" as const },
  { key: "time", label: "First seen · IST", align: "right" as const },
];

function getValue(row: BreakoutRow, key: string): string | number {
  switch (key) {
    case "signal": return row.signal;
    case "symbol": return row.symbol;
    case "changePercent": return row.changePercent;
    case "signalPercent": return row.signalPercent;
    case "time": return row.time;
    default: return 0;
  }
}

export function BreakoutBeacon({ rows, source = "live", sessionDate }: { rows: BreakoutRow[]; source?: "live" | "prior"; sessionDate?: string }) {
  const isPrior = source === "prior";
  const { rows: sorted, sortKey, sortDir, onSort } = useSortedRows(rows, getValue, "signalPercent", "desc");

  return (
    <Card title="Range Expansion" description="Names pushing beyond the opening range with unusually strong participation." action={isPrior ? <span className="text-[9px] font-bold uppercase tracking-wider text-[#8a7545]">Previous session{sessionDate ? ` · ${sessionDate}` : ""}</span> : <span className="rounded-full bg-[#eaf1e6] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#52774d]">Live detections</span>}>
      <Table columns={COLUMNS} sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
        {sorted.length === 0 ? <EmptyRow colSpan={5} message="Watching for decisive moves beyond the opening range…" /> : sorted.map((r) => (
          <tr key={`${r.symbol}-${r.signal}-${r.time}-${r.sessionDate ?? ""}`}>
            <Td><Badge variant={r.signal === "BULL" ? "bull" : "bear"}>{r.signal === "BULL" ? "UPWARD" : "DOWNWARD"}</Badge></Td>
            <Td><SymbolLink symbol={r.symbol} /></Td>
            <Td align="right" className={r.changePercent >= 0 ? "text-bull-text" : "text-bear-text"}>{r.changePercent >= 0 ? "↗" : "↘"} {formatPct(r.changePercent)}</Td>
            <Td align="right">{formatPct(r.signalPercent)}</Td>
            <Td align="right" className="font-semibold text-[#65745f]">{r.time}</Td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}
