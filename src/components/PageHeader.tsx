"use client";

export function PageHeader({title,subtitle,asOf,marketStatus,quotesFetched,isLoading,isFetching,error}:{
 title:string; subtitle?:string; asOf?:string; marketStatus?:string; quotesFetched?:number; isLoading?:boolean; isFetching?:boolean; error?:string|null;
}) {
 const statusLabel=marketStatus==="open"?"OPEN":marketStatus==="preopen"?"PRE-OPEN":marketStatus==="closed"?"CLOSED":marketStatus?.toUpperCase();
 return <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#253440] pb-3 text-[10px] text-[#81929d]">
  <div className="mr-auto min-w-0"><h1 className="text-[17px] font-semibold tracking-tight text-[#e0e8ed]">{title}</h1>{subtitle&&<p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-[#82939d]">{subtitle}</p>}</div>
  {statusLabel&&<span className={marketStatus==="open"?"border border-[#245e4b] bg-[#10281f] px-2 py-1 font-mono font-bold text-[#35c98a]":"border border-[#34424c] bg-[#111a22] px-2 py-1 font-mono font-bold text-[#a6b3ba]"}>{isLoading?"CONNECTING":statusLabel}</span>}
  {typeof quotesFetched==="number"&&<span className="font-mono">UNIVERSE <b className="text-[#cbd6dc]">{quotesFetched}</b></span>}
  {asOf&&<span className="font-mono">UPDATED <b className="text-[#cbd6dc]">{asOf} IST</b></span>}
  {isFetching&&!isLoading&&<span className="font-mono text-[#55b9a7]">SYNCING</span>}
  {error&&<span className="text-[#ef777d]">{error}</span>}
 </div>;
}
