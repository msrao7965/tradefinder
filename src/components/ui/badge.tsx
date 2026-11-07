import { cn } from "@/lib/utils";
export function Badge({children,variant="neutral",className}:{children:React.ReactNode;variant?:"bull"|"bear"|"neutral";className?:string}) {
 return <span className={cn("inline-flex items-center border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",variant==="bull"&&"border-[#c8dfce] bg-[#e8f3e9] text-[#2f754b]",variant==="bear"&&"border-[#edcfca] bg-[#faece8] text-[#ae5147]",variant==="neutral"&&"border-[#e1e3d9] bg-[#f1f2ec] text-[#758177]",className)}>{children}</span>;
}
