"use client";

import { Card } from "@/components/ui/card";
import { SymbolLink } from "@/components/SymbolLink";
import { EmptyRow, Table, Td } from "@/components/ui/table";
import { useSortedRows } from "@/hooks/useSortedRows";
import { formatCompact, formatNumber, formatPct } from "@/lib/utils";
import type { LeaderRow } from "@/lib/types";

const GAINER_COLUMNS = [
  { key: "symbol", label: "Instrument" },
  { key: "ltp", label: "Last price", align: "right" as const },
  { key: "changePercent", label: "Session move", align: "right" as const },
  { key: "volume", label: "Shares traded", align: "right" as const },
];
const POWER_COLUMNS = [
  { key: "symbol", label: "Instrument" },
  { key: "ltp", label: "Last price", align: "right" as const },
  { key: "turnover", label: "Value traded", align: "right" as const },
  { key: "changePercent", label: "Session move", align: "right" as const },
];

function getValue(row: LeaderRow, key: string): string | number {
  switch (key) {
    case "symbol": return row.symbol;
    case "ltp": return row.ltp;
    case "changePercent": return row.changePercent;
    case "volume": return row.volume;
    case "turnover": return row.turnover;
    default: return 0;
  }
}

export function TopGainers({ rows }: { rows: LeaderRow[] }) {
  const { rows: sorted, sortKey, sortDir, onSort } = useSortedRows(rows, getValue, "changePercent", "desc");
  return <Card title="Upside Leaders" description="The strongest positive price moves across the tracked universe."><Table columns={GAINER_COLUMNS} sortKey={sortKey} sortDir={sortDir} onSort={onSort}>{sorted.length === 0 ? <EmptyRow colSpan={4} message="No positive leaders in the current quote set." /> : sorted.map((r) => <tr key={r.symbol}><Td><SymbolLink symbol={r.symbol} /></Td><Td align="right">{formatNumber(r.ltp)}</Td><Td align="right" className="text-bull-text">↗ {formatPct(r.changePercent)}</Td><Td align="right" className="text-[#788477]">{formatCompact(r.volume)}</Td></tr>)}</Table></Card>;
}

export function TopLosers({ rows }: { rows: LeaderRow[] }) {
  const { rows: sorted, sortKey, sortDir, onSort } = useSortedRows(rows, getValue, "changePercent", "asc");
  return <Card title="Downside Leaders" description="The sharpest negative price moves—useful for spotting broad weakness and pressure."><Table columns={GAINER_COLUMNS} sortKey={sortKey} sortDir={sortDir} onSort={onSort}>{sorted.length === 0 ? <EmptyRow colSpan={4} message="No negative leaders in the current quote set." /> : sorted.map((r) => <tr key={r.symbol}><Td><SymbolLink symbol={r.symbol} /></Td><Td align="right">{formatNumber(r.ltp)}</Td><Td align="right" className="text-bear-text">↘ {formatPct(r.changePercent)}</Td><Td align="right" className="text-[#788477]">{formatCompact(r.volume)}</Td></tr>)}</Table></Card>;
}

export function HighPowerStocks({ rows }: { rows: LeaderRow[] }) {
  const { rows: sorted, sortKey, sortDir, onSort } = useSortedRows(rows, getValue, "turnover", "desc");
  return <Card title="Capital in Motion" description="The names attracting the highest traded value—where market participation is concentrated."><Table columns={POWER_COLUMNS} sortKey={sortKey} sortDir={sortDir} onSort={onSort}>{sorted.length === 0 ? <EmptyRow colSpan={4} message="Capital activity is yet to build in the available quote set." /> : sorted.map((r) => <tr key={r.symbol}><Td><SymbolLink symbol={r.symbol} /></Td><Td align="right">{formatNumber(r.ltp)}</Td><Td align="right">{formatCompact(r.turnover)}</Td><Td align="right" className={r.changePercent >= 0 ? "text-bull-text" : "text-bear-text"}>{r.changePercent >= 0 ? "↗" : "↘"} {formatPct(r.changePercent)}</Td></tr>)}</Table></Card>;
}
