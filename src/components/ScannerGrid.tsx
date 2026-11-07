"use client";

import { Activity } from "lucide-react";
import { BreakoutBeacon } from "@/components/scanners/BreakoutBeacon";
import { IntradayBoost } from "@/components/scanners/IntradayBoost";
import { HighPowerStocks, TopGainers, TopLosers } from "@/components/scanners/LeadersMatrix";
import { LowLevelStocks, TopLevelStocks } from "@/components/scanners/LevelTrackers";
import { useMarketData } from "@/hooks/useMarketData";

function StatusBar() {
 const {data,isLoading,isFetching,isError,error}=useMarketData(20_000);
 const label=data?.marketStatus==="open"?"OPEN":data?.marketStatus==="preopen"?"PRE-OPEN":data?.marketStatus==="closed"?"CLOSED":"UNKNOWN";
 return <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#253440] pb-3 font-mono text-[10px]">
  <div className="mr-auto"><p className="stocksi-eyebrow mb-1">NSE / CASH MARKET</p><h1 className="text-[18px] font-semibold text-[#e0e8ed]">Market Pulse</h1><p className="mt-0.5 font-sans text-[10px] text-[#81929d]">Price discovery · participation · market breadth</p></div>
  <span className={data?.marketOpen?"border border-[#245e4b] bg-[#10281f] px-2 py-1 font-bold text-[#35c98a]":"border border-[#34424c] bg-[#111a22] px-2 py-1 font-bold text-[#a6b3ba]"}>{isLoading?"CONNECTING":label}</span>
  {data&&<><span className="text-[#81929d]">COVERAGE <b className="text-[#d1dbe0]">{data.quotesFetched}/{data.universeSize}</b></span><span className="text-[#81929d]">AS OF <b className="text-[#d1dbe0]">{data.asOf} IST</b></span></>}
  {isFetching&&!isLoading&&<span className="text-[#55b9a7]">SYNCING</span>}
  {isError&&<span className="text-[#ef777d]">{error instanceof Error?error.message:"Feed error"}</span>}
  {data?.error&&<span className="text-[#ef777d]">{data.error}</span>}
 </div>;
}
export function ScannerGrid() {
 const {data,isLoading}=useMarketData(20_000);
 const empty={breakouts:[] as never[],breakoutsSource:"live" as const,intradayBoost:[],topLevel:[],lowLevel:[],topGainers:[],topLosers:[],highPower:[]};
 const pulse=data??empty;
 return <div className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col p-3 sm:p-4 lg:p-5">
  <StatusBar/>
  {isLoading&&!data&&<p className="mb-3 font-mono text-[10px] text-[#81929d]">INITIALISING QUOTE STREAM…</p>}
  <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-2">
   <BreakoutBeacon rows={pulse.breakouts} source={data?.breakoutsSource} sessionDate={data?.breakoutsSessionDate}/>
   <IntradayBoost rows={pulse.intradayBoost}/>
   <TopLevelStocks rows={pulse.topLevel}/>
   <LowLevelStocks rows={pulse.lowLevel}/>
   <TopGainers rows={pulse.topGainers}/>
   <TopLosers rows={pulse.topLosers}/>
   <HighPowerStocks rows={pulse.highPower}/>
  </div>
  <div className="mt-3 flex items-center gap-2 border-t border-[#253440] pt-2 font-mono text-[9px] text-[#647985]"><Activity className="h-3 w-3 text-[#49b6a2]"/> QUOTE SNAPSHOT · 20 SECOND POLL · SOURCE: YAHOO FINANCE</div>
 </div>;
}
