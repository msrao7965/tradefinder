"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SymbolLink } from "@/components/SymbolLink";
import { EmptyRow, Table, Td } from "@/components/ui/table";
import { useSortedRows } from "@/hooks/useSortedRows";
import { formatPct } from "@/lib/utils";
import type { IntradayBoostRow } from "@/lib/types";

const COLUMNS = [
 {key:"symbol",label:"Instrument"},
 {key:"changePercent",label:"Move",align:"right" as const},
 {key:"rFactor",label:"POWER",align:"right" as const},
 {key:"signal",label:"Bias"},
 {key:"firstSeen",label:"First seen",align:"right" as const,sortable:false},
];
function getValue(row:IntradayBoostRow,key:string):string|number {
 switch(key){case "symbol":return row.symbol;case "changePercent":return row.changePercent;case "rFactor":return row.rFactor;case "signal":return row.signal;default:return 0;}
}
function sessionKey(){return new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});}
function fmtTime(value:number){return new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(value);}
function FlowMeter({value,positive}:{value:number;positive:boolean}){
 const width=Math.min(100,Math.max(4,(value/4)*100));
 return <div className="flex min-w-[74px] items-center gap-2"><div className="stocksi-flow-track h-1.5 w-12 rounded-full"><div className="stocksi-surge-bar h-full rounded-full" style={{width:width+"%",background:positive?"#32d99a":"#ff7184"}}/></div><span className="font-mono text-[9px] font-bold text-[#d9e8fb]">{value.toFixed(2)}×</span></div>;
}
export function IntradayBoost({rows}:{rows:IntradayBoostRow[]}){
 const {rows:sorted,sortKey,sortDir,onSort}=useSortedRows(rows,getValue,"rFactor","desc");
 const [firstSeen,setFirstSeen]=useState<Record<string,number>>({});
 useEffect(()=>{
  const today=sessionKey();
  try {
   const storageKey="stocksi-first-seen-"+today;
   const saved=JSON.parse(localStorage.getItem(storageKey)||"{}") as Record<string,number>;
   let changed=false;
   for(const row of rows){if(!saved[row.symbol]){saved[row.symbol]=Date.now();changed=true;}}
   if(changed)localStorage.setItem(storageKey,JSON.stringify(saved));
   setFirstSeen(saved);
  } catch { setFirstSeen({}); }
 },[rows]);
 return <Card title="Volume Surge" action={<span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#45e6a4]"><span className="stocksi-flow-dot h-1.5 w-1.5 rounded-full bg-[#42e6a3]"/>Capital flow</span>}>
  <div className="border-b border-[#e9e9e1] bg-[#fbfbf6] px-3 py-2">
   <div className="flex items-center justify-between gap-2"><div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#9db6d4]">Relative participation</p><p className="mt-0.5 text-[10px] text-[#8da3c0]">Unusual activity building across the session</p></div><Activity className="h-4 w-4 text-[#6cb8ff]"/></div>
   <div className="mt-2 flex h-7 items-end gap-1" aria-hidden="true">{[22,36,28,48,39,58,43,72,54,82,65,94,72,100,80,90,68,96,75,100,86,92,72,98].map((h,i)=><span key={i} className="stocksi-candle min-w-0 flex-1 rounded-t-[2px]" style={{height:h+"%",background:i%4===0?"#ff7184":"#32d99a",animationDelay:(i%7)*.09+"s"}}/>)}</div>
  </div>
  <Table columns={COLUMNS} sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
   {sorted.length===0?<EmptyRow colSpan={5} message="Waiting for live participation readings"/>:sorted.map(r=><tr key={r.symbol} className="stocksi-new-row">
    <Td><SymbolLink symbol={r.symbol}/></Td>
    <Td align="right" className={r.changePercent>=0?"text-[#42e6a3]":"text-[#ff7184]"}>{r.changePercent>=0?<ArrowUpRight className="mr-0.5 inline h-3 w-3"/>:<ArrowDownRight className="mr-0.5 inline h-3 w-3"/>}{formatPct(r.changePercent)}</Td>
    <Td align="right"><FlowMeter value={r.rFactor} positive={r.changePercent>=0}/></Td>
    <Td><Badge variant={r.signal==="BULL"?"bull":r.signal==="BEAR"?"bear":"neutral"}>{r.signal==="BULL"?"BUYING":r.signal==="BEAR"?"SELLING":"BALANCED"}</Badge></Td>
    <Td align="right" className="font-mono text-[9px] text-[#a9bdd8]">{firstSeen[r.symbol]?fmtTime(firstSeen[r.symbol]):"—"}</Td>
   </tr>)}
  </Table>
  <div className="border-t border-[#e9e9e1] px-3 py-2 text-[9px] text-[#91a7c4]">First seen = first time this browser detected the instrument today · IST</div>
 </Card>;
}
