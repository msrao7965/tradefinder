import { cn } from "@/lib/utils";

export function Card({title,children,className,action}:{title:string;children:React.ReactNode;className?:string;action?:React.ReactNode}) {
 return <section className={cn("stocksi-panel flex min-h-[280px] min-w-0 flex-col overflow-hidden",className)}>
  <header className="flex min-h-[45px] items-center justify-between gap-3 border-b border-[#e4e5dc] bg-[#fbfaf5] px-3 py-2.5">
   <h2 className="text-[10px] font-bold uppercase tracking-[.14em] text-[#344a3d]">{title}</h2>{action}
  </header>
  <div className="stocksi-scroll min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
 </section>;
}
