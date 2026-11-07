"use client";

import { BreakoutBeacon } from "@/components/scanners/BreakoutBeacon";
import { IntradayBoost } from "@/components/scanners/IntradayBoost";
import {
  HighPowerStocks,
  TopGainers,
  TopLosers,
} from "@/components/scanners/LeadersMatrix";
import {
  LowLevelStocks,
  TopLevelStocks,
} from "@/components/scanners/LevelTrackers";
import { useMarketData } from "@/hooks/useMarketData";

function StatusBar() {
  const { data, isLoading, isFetching, isError, error } = useMarketData();

  const statusLabel =
    data?.marketStatus === "open"
      ? "Market Open"
      : data?.marketStatus === "preopen"
        ? "Pre-Open"
        : data?.marketStatus === "closed"
          ? "Market Closed"
          : "Status Unknown";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted">
      <h1 className="mr-auto text-sm font-semibold text-foreground">
        Market Pulse
      </h1>
      <span
        className={
          data?.marketOpen
            ? "rounded bg-bull-bg px-2 py-0.5 text-bull-text"
            : "rounded bg-border/50 px-2 py-0.5"
        }
      >
        {isLoading ? "Connecting…" : statusLabel}
      </span>
      {data && (
        <>
          <span>
            Universe {data.quotesFetched}/{data.universeSize}
          </span>
          <span>As of {data.asOf} IST</span>
        </>
      )}
      {isFetching && !isLoading && <span className="text-muted">Refreshing…</span>}
      {isError && (
        <span className="text-bear-text">
          {error instanceof Error ? error.message : "Feed error"}
        </span>
      )}
      {data?.error && (
        <span className="text-bear-text">{data.error}</span>
      )}
    </div>
  );
}

export function ScannerGrid() {
  const { data, isLoading } = useMarketData();

  const empty = {
    breakouts: [] as never[],
    breakoutsSource: "live" as const,
    intradayBoost: [],
    topLevel: [],
    lowLevel: [],
    topGainers: [],
    topLosers: [],
    highPower: [],
  };

  const pulse = data ?? empty;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col p-3 sm:p-5 lg:p-7">
      <StatusBar />
      {isLoading && !data && (
        <p className="mb-4 text-xs text-muted">
          Fetching live NSE quotes for the F&amp;O universe…
        </p>
      )}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-5">
        <BreakoutBeacon
          rows={pulse.breakouts}
          source={data?.breakoutsSource}
          sessionDate={data?.breakoutsSessionDate}
        />
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
