"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
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
function PowerValue({value}:{value:number}){return <span className="font-mono text-[10px] font-extrabold tracking-tight text-[#e8f1ff]">{value.toFixed(2)}×</span>;}
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
  <Table columns={COLUMNS} sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
   {sorted.length===0?<EmptyRow colSpan={5} message="Waiting for live participation readings"/>:sorted.map(r=><tr key={r.symbol} className="stocksi-new-row">
    <Td><SymbolLink symbol={r.symbol}/></Td>
    <Td align="right" className={r.changePercent>=0?"text-[#42e6a3]":"text-[#ff7184]"}>{r.changePercent>=0?<ArrowUpRight className="mr-0.5 inline h-3 w-3"/>:<ArrowDownRight className="mr-0.5 inline h-3 w-3"/>}{formatPct(r.changePercent)}</Td>
    <Td align="right"><PowerValue value={r.rFactor}/></Td>
    <Td><Badge variant={r.signal==="BULL"?"bull":r.signal==="BEAR"?"bear":"neutral"}>{r.signal==="BULL"?"BUYING":r.signal==="BEAR"?"SELLING":"BALANCED"}</Badge></Td>
    <Td align="right" className="font-mono text-[9px] text-[#a9bdd8]">{firstSeen[r.symbol]?fmtTime(firstSeen[r.symbol]):"—"}</Td>
   </tr>)}
  </Table>
 </Card>;
}
