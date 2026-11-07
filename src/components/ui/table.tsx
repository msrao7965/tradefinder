"use client";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/hooks/useSortedRows";
export interface TableColumn {key:string;label:string;align?:"left"|"right";sortable?:boolean}
export function Table({columns,sortKey,sortDir,onSort,children,className}:{columns:TableColumn[];sortKey?:string;sortDir?:SortDir;onSort?:(key:string)=>void;children:React.ReactNode;className?:string}) {
 return <div className="stocksi-table-wrap stocksi-scroll"><table className={cn("w-full border-collapse text-left text-[11px]",className)}>
  <thead className="sticky top-0 z-10 bg-[#f5f5ee]"><tr className="border-b border-[#e2e3d9] text-[9px] uppercase tracking-[.11em] text-[#77847a]">
   {columns.map(col=>{const sortable=col.sortable!==false&&!!onSort;const active=sortKey===col.key;return <th key={col.key} className={cn("whitespace-nowrap px-3 py-2.5 font-semibold",col.align==="right"&&"text-right")}>{sortable?<button type="button" onClick={()=>onSort(col.key)} className={cn("inline-flex min-h-7 items-center gap-1.5 hover:text-[#2e4e3b]",col.align==="right"&&"ml-auto",active&&"text-[#2e4e3b]")}>{col.label}<span className="text-[8px] text-[#66866c]">{active?(sortDir==="asc"?"▲":"▼"):"↕"}</span></button>:col.label}</th>})}
  </tr></thead><tbody className="[&_tr:nth-child(even)]:bg-[#fafaf5] [&_tr:hover]:bg-[#f0f4ec]">{children}</tbody>
 </table></div>;
}
export function Td({children,className,align="left"}:{children:React.ReactNode;className?:string;align?:"left"|"right"}) {
 return <td className={cn("whitespace-nowrap border-b border-[#ecece4] px-3 py-2.5 text-[#43534a]",align==="right"&&"text-right tabular-nums",className)}>{children}</td>;
}
export function EmptyRow({colSpan,message}:{colSpan:number;message:string}) {return <tr><td colSpan={colSpan} className="px-3 py-8 text-center text-[10px] text-[#8b958c]">{message}</td></tr>}
