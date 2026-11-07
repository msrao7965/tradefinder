"use client";

import { useEffect,useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink,ArrowUpRight,ArrowDownRight,Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { tradingViewUrl } from "@/components/SymbolLink";
import { formatNumber,formatPct,cn } from "@/lib/utils";
import type { TradeDeskResponse,TradeSetup } from "@/lib/trade-desk-types";

async function fetchTradeDesk():Promise<TradeDeskResponse>{const res=await fetch("/api/trade-desk",{cache:"no-store"});if(!res.ok)throw new Error(`Trade desk HTTP ${res.status}`);return res.json()}
function todayKey(){return new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"})}
function timeLabel(ts:number){return new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(ts)}
function FirstSeen({value}:{value?:number}){return <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[#849084]"><Clock3 className="h-3 w-3"/>{value?timeLabel(value):"—"}</span>}
function FlowLine({value,positive}:{value:number;positive:boolean}){const w=Math.min(100,Math.max(5,value/3*100));return <div className="flex items-center gap-2"><div className="stocksi-flow-track h-1.5 w-20 rounded-full"><div className="stocksi-surge-bar h-full rounded-full" style={{width:w+"%",background:positive?"#548e67":"#bb7467"}}/></div><span className="font-mono text-[10px] text-[#5d6b60]">{value.toFixed(2)}×</span></div>}
function SetupCard({setup,firstSeen}:{setup:TradeSetup;firstSeen?:number}){
 const up=setup.side==="LONG";
 return <article className="stocksi-panel overflow-hidden">
  <div className="flex flex-wrap items-center gap-2 border-b border-[#e8e8df] bg-[#fbfbf6] px-3 py-2.5 sm:px-4">
   <Badge variant={setup.action==="ENTER"?"bull":setup.action==="WAIT"?"neutral":"bear"}>{setup.action}</Badge>
   <Badge variant={up?"bull":"bear"}>{up?"LONG BIAS":"SHORT BIAS"}</Badge>
   <a href={tradingViewUrl(setup.symbol)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[15px] font-bold tracking-tight text-[#263a2e] hover:text-[#397b52]">{setup.symbol}<ExternalLink className="h-3 w-3 text-[#8b978c]"/></a>
   <span className="text-[9px] uppercase tracking-wider text-[#879187]">{setup.sector}</span>
   <span className="ml-auto text-[9px] text-[#879187]">FIRST DETECTED <FirstSeen value={firstSeen}/></span>
  </div>
  <div className="grid grid-cols-2 gap-px bg-[#e8e9e0] sm:grid-cols-4 lg:grid-cols-7">
   <Metric label="Last traded" value={formatNumber(setup.ltp)} sub={formatPct(setup.changePercent)} tone={setup.changePercent>=0?"bull":"bear"}/>
   <Metric label="Confluence" value={String(setup.score)} sub="model score"/>
   <div className="bg-[#fffefa] px-3 py-3"><p className="text-[9px] uppercase tracking-wider text-[#899389]">Participation</p><div className="mt-2"><FlowLine value={setup.relativeVolume} positive={up}/></div></div>
   <Metric label="Drive index" value={formatNumber(setup.rFactor,2)}/>
   <Metric label="Entry zone" value={`${formatNumber(setup.entryLow)} – ${formatNumber(setup.entryHigh)}`}/>
   <Metric label="Risk boundary" value={formatNumber(setup.invalidation)} tone="bear"/>
   <Metric label="Objective" value={formatNumber(setup.target)} tone="bull"/>
  </div>
  {setup.reasons.length>0&&<div className="border-t border-[#e8e8df] px-3 py-2.5 text-[10px] leading-relaxed text-[#748075] sm:px-4"><span className="mr-2 font-bold uppercase tracking-wider text-[#5e7b63]">Market read</span>{setup.reasons.slice(0,3).join(" · ")}</div>}
 </article>;
}
function Metric({label,value,sub,tone}:{label:string;value:string;sub?:string;tone?:"bull"|"bear"}){return <div className="min-w-0 bg-[#fffefa] px-3 py-3"><p className="text-[9px] uppercase tracking-wider text-[#899389]">{label}</p><p className={cn("mt-1 break-words font-mono text-[11px] font-semibold",tone==="bull"?"text-[#2e8654]":tone==="bear"?"text-[#b45349]":"text-[#35483b]")}>{value}</p>{sub&&<p className="mt-0.5 font-mono text-[9px] text-[#879187]">{sub}</p>}</div>}
function SetupSection({title,setups,empty,firstSeen}:{title:string;setups:TradeSetup[];empty:string;firstSeen:Record<string,number>}){return <section className="mb-4"><div className="mb-2 flex items-center justify-between border-b border-[#dedfd5] pb-2"><h2 className="text-[10px] font-bold uppercase tracking-[.14em] text-[#526b57]">{title}</h2><span className="font-mono text-[9px] text-[#899389]">{setups.length} INSTRUMENTS</span></div>{setups.length===0?<div className="stocksi-panel px-4 py-8 text-center text-[10px] text-[#899389]">{empty}</div>:<div className="grid grid-cols-1 gap-3">{setups.map(s=><SetupCard key={s.symbol+"-"+s.side} setup={s} firstSeen={firstSeen[s.symbol]}/>)}</div>}</section>}
function MarketPulseArt(){return <div className="stocksi-panel relative flex min-h-[94px] items-center justify-between gap-4 overflow-hidden px-4 py-3"><div className="relative z-10 max-w-[230px]"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#6f846f]">Market activity stream</p><p className="mt-1 text-[12px] font-semibold text-[#34483a]">Capital is moving. Follow participation.</p><p className="mt-1 text-[9px] text-[#879187]">Live quote snapshots · directional context</p></div><div className="relative flex h-[66px] min-w-[100px] flex-1 items-end justify-end gap-[4px]" aria-hidden="true">{[18,30,22,46,34,56,41,65,48,72,59,88,68,95,74,100,79,92,65,83].map((h,i)=><span key={i} className="stocksi-candle relative w-[5px] rounded-t-[2px]" style={{height:h+"%",background:i%5===0?"#bd8175":"#649675",animationDelay:(i%8)*.08+"s"}}><span className="absolute -top-2 left-1/2 h-2 w-px -translate-x-1/2 bg-current opacity-50"/></span>)}</div><div className="stocksi-flow-dot absolute right-4 top-3 h-2 w-2 rounded-full bg-[#5b9a6d]"/></div>}
export function TradeDeskView(){
 const {data,isLoading,isFetching,isError,error}=useQuery({queryKey:["trade-desk"],queryFn:fetchTradeDesk,refetchInterval:20_000,refetchIntervalInBackground:false});
 const [firstSeen,setFirstSeen]=useState<Record<string,number>>({});
 useEffect(()=>{if(!data)return;try{const key="stocksi-trade-first-seen-"+todayKey();const saved=JSON.parse(localStorage.getItem(key)||"{}") as Record<string,number>;for(const s of [...data.enter,...data.wait])if(!saved[s.symbol])saved[s.symbol]=Date.now();localStorage.setItem(key,JSON.stringify(saved));setFirstSeen(saved)}catch{setFirstSeen({})}},[data?.asOf]);
 return <div className="mx-auto w-full max-w-[1600px] p-3 sm:p-5 lg:p-6">
  <PageHeader title="Trade Desk" subtitle="A ranked view of directional setups, participation and trade structure" asOf={data?.asOf} marketStatus={data?.marketStatus} quotesFetched={data?.quotesFetched} isLoading={isLoading} isFetching={isFetching} error={isError?(error instanceof Error?error.message:"Feed error"):data?.error}/>
  <MarketPulseArt/>
  <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
   <Stat label="High confluence" value={data?.enter.length??0} tone="bull"/>
   <Stat label="Developing" value={data?.wait.length??0}/>
   <Stat label="Filtered out" value={data?.avoidCount??0} tone="bear"/>
   <Stat label="Session window" value={data?.actionableWindow?"ACTIVE":data?.marketOpen?"SELECTIVE":"CLOSED"}/>
  </div>
  {data?.banner&&<div className="mb-4 rounded-md border border-[#e8ddbd] bg-[#fbf6e8] px-3 py-2 text-[10px] text-[#8a7445]">{data.banner}</div>}
  <SetupSection title="Strongest opportunities" setups={data?.enter??[]} empty="No high-confluence setups in the current market snapshot." firstSeen={firstSeen}/>
  <SetupSection title="Building momentum" setups={data?.wait??[]} empty="No developing setups in the current market snapshot." firstSeen={firstSeen}/>
  <p className="mt-3 border-t border-[#dedfd5] pt-3 text-[9px] leading-relaxed text-[#879187]">Market data is sourced from Yahoo Finance and may be delayed or incomplete. First detected time is recorded locally in this browser from the first refresh that observes a symbol. Verify price and liquidity before trading.</p>
 </div>;
}
function Stat({label,value,tone}:{label:string;value:string|number;tone?:"bull"|"bear"}){return <div className="stocksi-panel px-3 py-3"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-[#899389]">{label}</p><p className={cn("mt-1 font-mono text-xl font-semibold",tone==="bull"?"text-[#2e8654]":tone==="bear"?"text-[#b45349]":"text-[#35483b]")}>{value}</p></div>}
