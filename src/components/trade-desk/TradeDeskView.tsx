"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowDownRight, ArrowUpRight, Clock3, ExternalLink, Gauge, Radio, ShieldAlert, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { tradingViewUrl } from "@/components/SymbolLink";
import { formatNumber, formatPct, cn } from "@/lib/utils";
import type { TradeDeskResponse, TradeSetup } from "@/lib/trade-desk-types";

async function fetchTradeDesk(): Promise<TradeDeskResponse> {
  const res = await fetch("/api/trade-desk", { cache: "no-store" });
  if (!res.ok) throw new Error(`Trade desk HTTP ${res.status}`);
  return res.json();
}

function ActionBadge({ action }: { action: TradeSetup["action"] }) {
  const styles = action === "ENTER"
    ? "border-[#c9ddc7] bg-[#e8f0e4] text-[#356746]"
    : action === "WAIT"
      ? "border-[#e6ddc7] bg-[#f4efdf] text-[#8a7545]"
      : "border-[#ead2cb] bg-[#f6e9e4] text-[#98564a]";
  return <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[9px] font-extrabold tracking-[.16em]", styles)}>{action === "ENTER" ? "IN PLAY" : action === "WAIT" ? "ON WATCH" : "STAND ASIDE"}</span>;
}

function Metric({ label, value, detail, tone }: { label: string; value: string; detail?: string; tone?: "bull" | "bear" | "neutral" }) {
  return (
    <div className="rounded-xl border border-[#e7e6dc] bg-white/60 p-3">
      <p className="stocksi-eyebrow">{label}</p>
      <p className={cn("mt-1 text-lg font-bold tabular-nums tracking-tight", tone === "bull" ? "text-[#356746]" : tone === "bear" ? "text-[#98564a]" : "text-[#263a2d")}>{value}</p>
      {detail && <p className="mt-0.5 text-[9px] leading-relaxed text-[#899185]">{detail}</p>}
    </div>
  );
}

function SetupCard({ setup }: { setup: TradeSetup }) {
  const up = setup.side === "LONG";
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#dfe2d6] bg-gradient-to-br from-white/95 via-[#fbfaf5]/95 to-[#f0f2e9]/90 p-4 shadow-[0_8px_30px_rgba(43,58,39,.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#bdcdb5] hover:shadow-[0_18px_45px_rgba(43,58,39,.10)] sm:p-5">
      <div className={cn("absolute inset-y-0 left-0 w-[3px]", up ? "bg-[#6f9568]" : "bg-[#b9776b]")} />
      <div className="mb-4 flex flex-wrap items-start gap-2 pl-1">
        <ActionBadge action={setup.action} />
        <Badge variant={up ? "bull" : "bear"} className="rounded-full px-2.5 py-1">{up ? "LONG BIAS" : "SHORT BIAS"}</Badge>
        <span className="ml-auto text-[9px] font-bold uppercase tracking-[.13em] text-[#8a9385]">{setup.sector}</span>
      </div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 pl-1">
        <div>
          <a href={tradingViewUrl(setup.symbol)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[25px] font-black tracking-[-.055em] text-[#263d2e] transition-colors hover:text-[#66845a]">
            {setup.symbol}<ExternalLink className="mb-1 h-4 w-4 opacity-45" />
          </a>
          <p className="mt-0.5 text-[10px] text-[#858e82]">Live quote · {formatPct(setup.changePercent)} session move</p>
        </div>
        <div className="text-right">
          <p className="stocksi-eyebrow">Confluence</p>
          <p className="text-[28px] font-black leading-none tracking-[-.06em] text-[#344b38]">{setup.score}<span className="ml-1 text-[11px] font-semibold text-[#9aa193]">/100</span></p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="Last price" value={formatNumber(setup.ltp)} />
        <Metric label="Drive index" value={formatNumber(setup.rFactor, 2)} detail="Participation-adjusted activity" tone={setup.rFactor >= 1.5 ? "bull" : "neutral"} />
        <Metric label="Volume pulse" value={`${formatNumber(setup.relativeVolume, 2)}×`} detail="Versus normal activity" />
        <Metric label="Session read" value={up ? "Constructive" : "Defensive"} detail={up ? "Upside pressure" : "Downside pressure"} tone={up ? "bull" : "bear"} />
      </div>

      <div className="mb-4 rounded-xl border border-[#e1e3d9] bg-[#f4f4ec]/85 p-3">
        <div className="mb-2 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.16em] text-[#73806f]"><Target className="h-3.5 w-3.5" /> Trade structure</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div><p className="text-[9px] text-[#899185]">Potential entry</p><p className="mt-0.5 text-[12px] font-bold tabular-nums text-[#344b38]">{formatNumber(setup.entryLow)} – {formatNumber(setup.entryHigh)}</p></div>
          <div><p className="text-[9px] text-[#899185]">Risk boundary</p><p className="mt-0.5 text-[12px] font-bold tabular-nums text-[#98564a]">{formatNumber(setup.invalidation)}</p></div>
          <div><p className="text-[9px] text-[#899185]">Modelled objective</p><p className="mt-0.5 text-[12px] font-bold tabular-nums text-[#356746]">{formatNumber(setup.target)}</p></div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-[#edf0e7]/75 px-3 py-2.5">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8c875f]" />
        <div className="min-w-0">
          <p className="stocksi-eyebrow mb-1">Current read</p>
          <p className="text-[11px] font-semibold leading-relaxed text-[#596958]">{setup.when}</p>
        </div>
      </div>
    </article>
  );
}

function SetupSection({ title, setups, empty, tone }: { title: string; setups: TradeSetup[]; empty: string; tone: "bull" | "neutral" }) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {tone === "bull" ? <ArrowUpRight className="h-4 w-4 text-[#56805a]" /> : <Activity className="h-4 w-4 text-[#9a8554]" />}
          <h2 className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#526151]">{title}</h2>
          <span className="rounded-full border border-[#dfe2d6] bg-white/70 px-2 py-0.5 text-[10px] font-bold text-[#71806f]">{setups.length}</span>
        </div>
        <span className="hidden text-[9px] font-semibold uppercase tracking-wider text-[#9aa193] sm:block">{tone === "bull" ? "High alignment" : "Awaiting confirmation"}</span>
      </div>
      {setups.length === 0 ? (
        <div className="stocksi-panel rounded-2xl px-4 py-8 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf0e7] text-[#75866e]"><Radio className="h-4 w-4" /></div>
          <p className="text-[12px] font-semibold text-[#596958]">{empty}</p>
          <p className="mt-1 text-[10px] text-[#92998d]">The engine will surface candidates when the full market picture aligns.</p>
        </div>
      ) : <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{setups.map((s) => <SetupCard key={`${s.action}-${s.symbol}-${s.side}`} setup={s} />)}</div>}
    </section>
  );
}

export function TradeDeskView() {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["trade-desk"], queryFn: fetchTradeDesk, refetchInterval: 20_000,
    refetchIntervalInBackground: false,
  });

  return (
    <div className="stocksi-grid-glow mx-auto min-h-full w-full max-w-[1600px] p-3 sm:p-5 lg:p-8">
      <PageHeader
        title="Trade Desk"
        subtitle="A live read of price pressure, participation and sector alignment—distilled into a ranked decision view."
        asOf={data?.asOf} marketStatus={data?.marketStatus} quotesFetched={data?.quotesFetched}
        isLoading={isLoading} isFetching={isFetching}
        error={isError ? (error instanceof Error ? error.message : "Feed error") : data?.error}
      />

      <section className="stocksi-panel mb-6 overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e5da] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-[#66845a]" /><p className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#566653]">Market intelligence overview</p></div>
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#7a8976]"><span className="stocksi-live-dot h-1.5 w-1.5 rounded-full bg-[#66845a]" /> {isFetching ? "Refreshing signal map" : "Signal map active"} · 20s cycle</span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-[#e4e5da] sm:grid-cols-4">
          <div className="bg-white/65 p-4"><p className="stocksi-eyebrow">In play</p><p className="mt-1 text-3xl font-black tracking-[-.06em] text-[#356746]">{data?.enter.length ?? 0}</p><p className="text-[10px] text-[#879083]">Strongest alignment</p></div>
          <div className="bg-white/65 p-4"><p className="stocksi-eyebrow">On watch</p><p className="mt-1 text-3xl font-black tracking-[-.06em] text-[#8a7545]">{data?.wait.length ?? 0}</p><p className="text-[10px] text-[#879083]">Developing structure</p></div>
          <div className="bg-white/65 p-4"><p className="stocksi-eyebrow">Filtered out</p><p className="mt-1 text-3xl font-black tracking-[-.06em] text-[#98564a]">{data?.avoidCount ?? 0}</p><p className="text-[10px] text-[#879083]">Weak or conflicting reads</p></div>
          <div className="bg-white/65 p-4"><p className="stocksi-eyebrow">Session posture</p><p className="mt-2 text-[14px] font-extrabold text-[#344b38]">{data?.actionableWindow ? "Active window" : data?.marketOpen ? "Selective" : "Off-session"}</p><p className="text-[10px] text-[#879083]">Based on market hours</p></div>
        </div>
        {data?.banner && <div className="flex items-start gap-2 border-t border-[#e4e5da] bg-[#f4efdf]/70 px-4 py-3 text-[11px] leading-relaxed text-[#82734e]"><Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />{data.banner}</div>}
      </section>

      <SetupSection title="Highest conviction" setups={data?.enter ?? []} empty="No high-alignment opportunities at this moment." tone="bull" />
      <SetupSection title="Developing opportunities" setups={data?.wait ?? []} empty="No developing setups. The market picture is still forming." tone="neutral" />

      <div className="mt-5 flex items-start gap-2 border-t border-[#dcded3] pt-4 text-[10px] leading-relaxed text-[#899184]">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>Quantitative market context from live Yahoo Finance quotes. Indicative levels are model outputs, not execution instructions or guaranteed outcomes. Verify price structure and liquidity before acting.</p>
      </div>
    </div>
  );
}
