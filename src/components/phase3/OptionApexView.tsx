"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { EmptyRow, Table, Td } from "@/components/ui/table";
import { useSortedRows } from "@/hooks/useSortedRows";
import { formatNumber, formatPct } from "@/lib/utils";
import type { ApexLeg, OptionApexResponse } from "@/lib/phase3-types";

async function fetchApex(): Promise<OptionApexResponse> {
  const res = await fetch("/api/option-apex", { cache: "no-store" });
  if (!res.ok) throw new Error(`Option apex HTTP ${res.status}`);
  return res.json();
}

export function OptionApexView() {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["option-apex"],
    queryFn: fetchApex,
    refetchInterval: 20_000,
    refetchIntervalInBackground: false,
  });

  const { rows: sorted, sortKey, sortDir, onSort } = useSortedRows(
    data?.legs ?? [],
    (r: ApexLeg, key) => {
      if (key === "time") return r.time;
      if (key === "callLean") return r.callLean;
      if (key === "putLean") return r.putLean;
      if (key === "indexClose") return r.indexClose;
      if (key === "changePercent") return r.changePercent;
      return r.netBias;
    },
    "time",
    "asc",
  );

  return (
    <div className="stocksi-grid-glow min-h-full p-3 sm:p-5 lg:p-8">
      <PageHeader
        title="Options Compass"
        subtitle="A directional context gauge built from index structure and volatility conditions—not a live option-chain or open-interest feed."
        asOf={data?.asOf}
        marketStatus={data?.marketStatus}
        isLoading={isLoading}
        isFetching={isFetching}
        error={
          isError
            ? error instanceof Error
              ? error.message
              : "Feed error"
            : data?.error
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted">Nifty</p>
          <p className="text-sm font-semibold tabular-nums">
            {formatNumber(data?.nifty.price ?? 0)}
          </p>
          <p
            className={
              (data?.nifty.changePercent ?? 0) >= 0
                ? "text-xs text-bull-text"
                : "text-xs text-bear-text"
            }
          >
            {formatPct(data?.nifty.changePercent ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted">
            Bank Nifty
          </p>
          <p className="text-sm font-semibold tabular-nums">
            {formatNumber(data?.bankNifty.price ?? 0)}
          </p>
          <p
            className={
              (data?.bankNifty.changePercent ?? 0) >= 0
                ? "text-xs text-bull-text"
                : "text-xs text-bear-text"
            }
          >
            {formatPct(data?.bankNifty.changePercent ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted">
            India VIX
          </p>
          <p className="text-sm font-semibold tabular-nums">
            {formatNumber(data?.indiaVix.price ?? 0)}
          </p>
          <p className="text-xs text-muted">
            {data?.vixRegime ?? "—"} · {formatPct(data?.indiaVix.changePercent ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-[10px] uppercase tracking-wide text-muted">Market read</p>
          <div className="mt-1">
            <Badge
              variant={
                data?.bias === "CALL"
                  ? "bull"
                  : data?.bias === "PUT"
                    ? "bear"
                    : "neutral"
              }
            >
              {data?.bias ?? "NEUTRAL"}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted">
            Score {data?.biasScore ?? 0}
          </p>
        </div>
      </div>

      {data?.summary && (
        <p className="mb-4 rounded-md border border-border bg-border/20 px-3 py-2 text-xs text-foreground">
          {data.summary}
        </p>
      )}

      <Card title="Directional pressure · Nifty 15m">
        <Table
          columns={[
            { key: "time", label: "Interval" },
            { key: "indexClose", label: "Nifty", align: "right" },
            { key: "changePercent", label: "Interval move", align: "right" },
            { key: "callLean", label: "Upside pressure", align: "right" },
            { key: "putLean", label: "Downside pressure", align: "right" },
            { key: "netBias", label: "Net read" },
          ]}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
        >
          {sorted.length === 0 ? (
            <EmptyRow colSpan={6} message="No apex legs yet" />
          ) : (
            sorted.map((r) => (
              <tr key={r.time}>
                <Td className="font-medium">{r.time}</Td>
                <Td align="right">{formatNumber(r.indexClose)}</Td>
                <Td
                  align="right"
                  className={
                    r.changePercent >= 0 ? "text-bull-text" : "text-bear-text"
                  }
                >
                  {formatPct(r.changePercent)}
                </Td>
                <Td align="right" className="text-bull-text">
                  {formatNumber(r.callLean, 3)}
                </Td>
                <Td align="right" className="text-bear-text">
                  {formatNumber(r.putLean, 3)}
                </Td>
                <Td>
                  <Badge
                    variant={
                      r.netBias === "CALL"
                        ? "bull"
                        : r.netBias === "PUT"
                          ? "bear"
                          : "neutral"
                    }
                  >
                    {r.netBias}
                  </Badge>
                </Td>
              </tr>
            ))
          )}
        </Table>
      </Card>
      {data?.note && (
        <p className="mt-3 text-[10px] leading-relaxed text-muted">{data.note}</p>
      )}
    </div>
  );
}
