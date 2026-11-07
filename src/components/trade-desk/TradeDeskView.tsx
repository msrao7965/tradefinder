"use client";

import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { tradingViewUrl } from "@/components/SymbolLink";
import { formatNumber, formatPct, cn } from "@/lib/utils";
import type { TradeDeskResponse, TradeSetup } from "@/lib/trade-desk-types";

async function fetchTradeDesk(): Promise<TradeDeskResponse> {
 const res=await fetch("/api/trade-desk",{cache:"no-store"});
 if(!res.ok) throw new Error(`Trade desk HTTP ${res.status}`);
 return res.json();
}
function SetupRow({setup}:{setup:TradeSetup}) {
 const up=setup.side==="LONG";
 const action=setup.action;
 return <article className="border-b border-[#22313b] bg-[#0c151d] px-3 py-3 transition-colors hover:bg-[#111e28] sm:px-4">
  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
   <span className={cn("w-[58px] border px-1.5 py-1 text-center font-mono text-[9px] font-bold",action==="ENTER"?"border-[#245b49] bg-[#10271f] text-[#39c98d]":action==="WAIT"?"border-[#645431] bg-[#292316] text-[#d6b76c]":"border-[#63343a] bg-[#2a171b] text-[#ed777e]")}>{action}</span>
   <Badge variant={up?"bull":"bear"}>{up?"LONG":"SHORT"}</Badge>
   <a href={tradingViewUrl(setup.symbol)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[15px] font-bold tracking-tight text-[#e0e8ed] hover:text-[#55b9a7]">{setup.symbol}<ExternalLink className="h-3 w-3 text-[#607580]"/></a>
   <span className="text-[9px] uppercase tracking-wider text-[#718591]">{setup.sector}</span>
   <span className="ml-auto font-mono text-[10px] text-[#8fa0aa]">ALIGNMENT <b className="text-[#dce5e9]">{setup.score}/100</b></span>
  </div>
  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 lg:grid-cols-7">
   <Metric label="Last price" value={formatNumber(setup.ltp)} sub={formatPct(setup.changePercent)} tone={setup.changePercent>=0?"bull":"bear"}/>
   <Metric label="Drive index" value={formatNumber(setup.rFactor,2)}/>
   <Metric label="Relative activity" value={`${formatNumber(setup.relativeVolume,2)}×`}/>
   <Metric label="Entry zone" value={`${formatNumber(setup.entryLow)} – ${formatNumber(setup.entryHigh)}`}/>
   <Metric label="Risk boundary" value={formatNumber(setup.invalidation)} tone="bear"/>
   <Metric label="Objective" value={formatNumber(setup.target)} tone="bull"/>
   <Metric label="Market read" value={setup.when} small/>
  </div>
  {setup.reasons.length>0&&<div className="mt-3 border-l-2 border-[#385a62] pl-2 text-[10px] leading-relaxed text-[#8ea0a9]">{setup.reasons.slice(0,3).join(" · ")}</div>}
 </article>;
}
function Metric({label,value,sub,tone,small}:{label:string;value:string;sub?:string;tone?:"bull"|"bear";small?:boolean}) {
 return <div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-[#70838f]">{label}</p><p className={cn("mt-1 break-words font-mono text-[11px] font-semibold",small?"font-sans text-[10px] leading-snug":"",tone==="bull"?"text-[#39c98d]":tone==="bear"?"text-[#ed777e]":"text-[#c8d3d9]")}>{value}</p>{sub&&<p className={cn("mt-0.5 font-mono text-[9px]",tone==="bull"?"text-[#39c98d]":tone==="bear"?"text-[#ed777e]":"text-[#81929d]")}>{sub}</p>}</div>;
}
function SetupSection({title,setups,empty,kind}:{title:string;setups:TradeSetup[];empty:string;kind:"bull"|"watch"}) {
 return <section className="mb-4 overflow-hidden border border-[#263744] bg-[#0b131a]">
  <header className="flex items-center justify-between border-b border-[#263744] bg-[#101a23] px-3 py-2.5"><div className="flex items-center gap-2"><span className={cn("h-2 w-2",kind==="bull"?"bg-[#35c98a]":"bg-[#d6b76c]")}/><h2 className="text-[10px] font-bold uppercase tracking-[.14em] text-[#cbd6dc]">{title}</h2></div><span className="font-mono text-[10px] text-[#8496a0]">{setups.length} NAMES</span></header>
  {setups.length===0?<p className="px-4 py-7 text-center text-[10px] text-[#718591]">{empty}</p>:setups.map(s=><SetupRow key={`${s.action}-${s.symbol}-${s.side}`} setup={s}/>)}
 </section>;
}
export function TradeDeskView() {
 const {data,isLoading,isFetching,isError,error}=useQuery({queryKey:["trade-desk"],queryFn:fetchTradeDesk,refetchInterval:20_000,refetchIntervalInBackground:false});
 return <div className="mx-auto w-full max-w-[1800px] p-3 sm:p-4 lg:p-5">
  <PageHeader title="Trade Desk" subtitle="NSE equity signal blotter · ranked by directional confluence" asOf={data?.asOf} marketStatus={data?.marketStatus} quotesFetched={data?.quotesFetched} isLoading={isLoading} isFetching={isFetching} error={isError?(error instanceof Error?error.message:"Feed error"):data?.error}/>
  <div className="mb-4 grid grid-cols-2 gap-px border border-[#263744] bg-[#263744] sm:grid-cols-4">
   <Stat label="HIGH ALIGNMENT" value={data?.enter.length??0} tone="bull"/>
   <Stat label="UNDER OBSERVATION" value={data?.wait.length??0}/>
   <Stat label="NOT QUALIFIED" value={data?.avoidCount??0} tone="bear"/>
   <Stat label="SESSION WINDOW" value={data?.actionableWindow?"ACTIVE":data?.marketOpen?"SELECTIVE":"CLOSED"}/>
  </div>
  {data?.banner&&<div className="mb-4 border border-[#4a422e] bg-[#211d14] px-3 py-2 font-mono text-[10px] text-[#c7ad70]">{data.banner}</div>}
  <div className="mb-2 flex items-center justify-between border-b border-[#263744] pb-2"><span className="text-[9px] font-bold uppercase tracking-[.13em] text-[#718591]">Instrument / direction / live quote / trade structure</span><span className="font-mono text-[9px] text-[#718591]">AUTO UPDATE · 20S</span></div>
  <SetupSection title="Highest confluence" setups={data?.enter??[]} empty="No high-alignment setups in the current quote cycle." kind="bull"/>
  <SetupSection title="Developing setups" setups={data?.wait??[]} empty="No developing setups in the current quote cycle." kind="watch"/>
  <p className="mt-3 border-t border-[#253440] pt-3 text-[9px] leading-relaxed text-[#647985]">Rule-based market context from live Yahoo Finance quotes. Indicative levels are model outputs, not execution instructions or guaranteed outcomes. Verify liquidity and price structure before acting.</p>
 </div>;
}
function Stat({label,value,tone}:{label:string;value:string|number;tone?:"bull"|"bear"}) {
 return <div className="bg-[#0d151d] px-3 py-3"><p className="text-[8px] font-bold tracking-[.13em] text-[#718591]">{label}</p><p className={cn("mt-1 font-mono text-xl font-semibold",tone==="bull"?"text-[#35c98a]":tone==="bear"?"text-[#ef777d]":"text-[#d6e0e5]")}>{value}</p></div>;
}
