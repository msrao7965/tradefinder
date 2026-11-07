"use client";

import { cn } from "@/lib/utils";
import type { SortDir } from "@/hooks/useSortedRows";

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "right";
  sortable?: boolean;
}

export function Table({ columns, sortKey, sortDir, onSort, children, className }: {
  columns: TableColumn[];
  sortKey?: string;
  sortDir?: SortDir;
  onSort?: (key: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="stocksi-table-wrap stocksi-scroll">
      <table className={cn("w-full border-collapse text-left text-xs", className)}>
        <thead className="sticky top-0 z-10 bg-[#f4f4ec]">
          <tr className="border-b border-[#e5e5db] text-[9px] font-bold uppercase tracking-[.13em] text-[#849080]">
            {columns.map((col) => {
              const sortable = col.sortable !== false && !!onSort;
              const active = sortKey === col.key;
              return (
                <th key={col.key} className={cn("whitespace-nowrap px-3 py-3 font-semibold sm:px-4", col.align === "right" && "text-right")}>
                  {sortable ? <button type="button" onClick={() => onSort(col.key)} aria-label={`Sort by ${col.label}`} className={cn("inline-flex min-h-8 items-center gap-1.5 transition-colors hover:text-[#344b38]", col.align === "right" && "ml-auto", active && "text-[#344b38]")}>{col.label}<span className="text-[9px] opacity-70" aria-hidden>{active ? (sortDir === "asc" ? "▲" : "▼") : "◇"}</span></button> : col.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child_td]:border-b-0 [&_tr:hover]:bg-[#edf1e8]/75">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className, align = "left" }: { children: React.ReactNode; className?: string; align?: "left" | "right" }) {
  return <td className={cn("whitespace-nowrap border-b border-[#e8e8df] px-3 py-3 text-[11px] text-[#435448] sm:px-4 sm:py-3.5", align === "right" && "text-right tabular-nums", className)}>{children}</td>;
}

export function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return <tr><td colSpan={colSpan} className="px-3 py-9 text-center text-[11px] text-[#8a9386]">{message}</td></tr>;
}
