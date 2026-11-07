"use client";
export function PageHeader({title,subtitle,asOf,marketStatus,quotesFetched,isLoading,isFetching,error}:{title:string;subtitle?:string;asOf?:string;marketStatus?:string;quotesFetched?:number;isLoading?:boolean;isFetching?:boolean;error?:string|null}) {
 const label=marketStatus==="open"?"MARKET OPEN":marketStatus==="preopen"?"PRE-OPEN":marketStatus==="closed"?"MARKET CLOSED":marketStatus?.toUpperCase();
 return <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#dedfd5] pb-3 text-[10px] text-[#7b867d]">
  <div className="mr-auto min-w-0"><p className="mb-1 text-[9px] font-bold uppercase tracking-[.16em] text-[#718675]">UNDERGROUND BULLS / MARKET INTELLIGENCE</p><h1 className="text-[19px] font-semibold tracking-[-.03em] text-[#25372d]">{title}</h1>{subtitle&&<p className="mt-1 text-[10px] text-[#7d887e]">{subtitle}</p>}</div>
  {label&&<span className={marketStatus==="open"?"border border-[#c9dfcf] bg-[#e8f3e9] px-2 py-1 font-mono font-bold text-[#2e794c]":"border border-[#e0e2d9] bg-[#f6f6f0] px-2 py-1 font-mono font-bold text-[#7b867d]"}>{isLoading?"CONNECTING":label}</span>}
  {typeof quotesFetched==="number"&&<span className="font-mono">COVERAGE <b className="text-[#3b4b40]">{quotesFetched}</b></span>}
  {asOf&&<span className="font-mono">UPDATED <b className="text-[#3b4b40]">{asOf} IST</b></span>}
  {isFetching&&!isLoading&&<span className="font-mono text-[#397d55]">REFRESHING</span>}{error&&<span className="text-[#ae5147]">{error}</span>}
 </div>;
}
