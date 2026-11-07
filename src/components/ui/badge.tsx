import { cn } from "@/lib/utils";

export function Badge({children,variant="neutral",className}:{
 children:React.ReactNode; variant?:"bull"|"bear"|"neutral"; className?:string;
}) {
 return <span className={cn("inline-flex items-center border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
  variant==="bull"&&"border-[#245b49] bg-[#10271f] text-[#39c98d]",
  variant==="bear"&&"border-[#63343a] bg-[#2a171b] text-[#ed777e]",
  variant==="neutral"&&"border-[#34434e] bg-[#151f28] text-[#98a8b1]",className)}>{children}</span>;
}
