"use client";

import { cn } from "@/lib/utils";
import type { SortDir } from "@/hooks/useSortedRows";

export interface TableColumn { key:string; label:string; align?:"left"|"right"; sortable?:boolean; }
export function Table({columns,sortKey,sortDir,onSort,children,className}:{
 columns:TableColumn[]; sortKey?:string; sortDir?:SortDir; onSort?:(key:string)=>void; children:React.ReactNode; className?:string;
}) {
 return <div className="stocksi-table-wrap stocksi-scroll"><table className={cn("w-full border-collapse text-left font-mono text-[11px]",className)}>
  <thead className="sticky top-0 z-10 bg-[#111c25]"><tr className="border-b border-[#2a3a46] text-[9px] uppercase tracking-[.1em] text-[#7f929e]">
   {columns.map(col=>{const sortable=col.sortable!==false&&!!onSort;const active=sortKey===col.key;return <th key={col.key} className={cn("whitespace-nowrap px-3 py-2.5 font-semibold",col.align==="right"&&"text-right")}>{sortable?<button type="button" onClick={()=>onSort(col.key)} className={cn("inline-flex min-h-7 items-center gap-1.5 hover:text-[#dce5e9]",col.align==="right"&&"ml-auto",active&&"text-[#dce5e9]")}>{col.label}<span className="text-[8px] text-[#55b9a7]">{active?(sortDir==="asc"?"▲":"▼"):"↕"}</span></button>:col.label}</th>;})}
  </tr></thead><tbody className="[&_tr:nth-child(even)]:bg-[#101922] [&_tr:hover]:bg-[#172631]">{children}</tbody>
 </table></div>;
}
export function Td({children,className,align="left"}:{children:React.ReactNode;className?:string;align?:"left"|"right"}) {
 return <td className={cn("whitespace-nowrap border-b border-[#1d2b35] px-3 py-2.5 text-[#b8c5cc]",align==="right"&&"text-right tabular-nums",className)}>{children}</td>;
}
export function EmptyRow({colSpan,message}:{colSpan:number;message:string}) {
 return <tr><td colSpan={colSpan} className="px-3 py-8 text-center font-sans text-[10px] text-[#718591]">{message}</td></tr>;
}
