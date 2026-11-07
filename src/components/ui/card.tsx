import { cn } from "@/lib/utils";

export function Card({title,children,className,action,description}:{
 title:string; children:React.ReactNode; className?:string; action?:React.ReactNode; description?:string;
}) {
 return <section className={cn("stocksi-panel flex min-h-[300px] min-w-0 flex-col overflow-hidden",className)}>
  <header className="flex min-h-[43px] items-center justify-between gap-3 border-b border-[#253440] bg-[#101a23] px-3 py-2">
   <div className="min-w-0"><h2 className="text-[10px] font-bold uppercase tracking-[.12em] text-[#c4d0d7]">{title}</h2>{description&&<p className="mt-0.5 text-[9px] text-[#748894]">{description}</p>}</div>{action}
  </header>
  <div className="stocksi-scroll min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
 </section>;
}
