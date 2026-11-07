"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Clock, Layers, LayoutDashboard, LineChart, Radar, TrendingUp, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const stocksNav = [
  { label: "Trade Desk", href: "/trade-desk", icon: LayoutDashboard },
  { label: "Market Pulse", href: "/market-pulse", icon: Activity },
  { label: "Flow Watch", href: "/insider-strategy", icon: Radar },
  { label: "Sector Heatmap", href: "/sector-scope", icon: Layers },
  { label: "Swing Setups", href: "/swing-spectrum", icon: Waves },
] as const;
const indexNav = [
  { label: "Momentum Clock", href: "/option-clock", icon: Clock },
  { label: "Options Bias", href: "/option-apex", icon: BarChart3 },
  { label: "Index Drivers", href: "/index-mover", icon: TrendingUp },
] as const;
const allNav = [...stocksNav, ...indexNav];

function Brand() {
  return <Link href="/trade-desk" aria-label="Stocksi home" className="flex items-center gap-2.5 px-2">
    <span className="flex h-8 w-8 items-center justify-center border border-[#355466] bg-[#10232c] text-[#53bda9]"><LineChart className="h-4 w-4" /></span>
    <span className="leading-none"><span className="block text-[19px] font-bold tracking-[-.06em] text-[#e1e8ec]">STOCK<span className="text-[#53bda9]">SI</span></span><span className="mt-1 block text-[8px] font-semibold uppercase tracking-[.17em] text-[#6f8490]">Underground Bulls</span></span>
  </Link>;
}
function NavLink({ item, active }: { item: (typeof allNav)[number]; active: boolean }) {
  const Icon = item.icon;
  return <Link href={item.href} aria-current={active ? "page" : undefined} className={cn(
    "flex min-h-9 items-center gap-2.5 border-l-2 px-3 text-[12px] font-medium",
    active ? "border-[#49b6a2] bg-[#13232b] text-[#d5e9e5]" : "border-transparent text-[#82939d] hover:bg-[#111d26] hover:text-[#d8e0e5]"
  )}><Icon className={cn("h-4 w-4", active ? "text-[#53bda9]" : "text-[#718590]")} /><span>{item.label}</span></Link>;
}

export function Sidebar() {
  const pathname = usePathname();
  const activePath = pathname === "/" ? "/trade-desk" : pathname;
  return <>
    <aside className="hidden h-full w-[220px] shrink-0 flex-col border-r border-[#253440] bg-[#0a1118] py-5 md:flex">
      <div className="mb-8"><Brand /></div>
      <p className="stocksi-kicker mb-2 px-4 text-[9px] font-bold uppercase">Equities</p>
      <nav aria-label="Stock navigation" className="space-y-0.5">{stocksNav.map(item => <NavLink key={item.href} item={item} active={activePath === item.href} />)}</nav>
      <p className="stocksi-kicker mb-2 mt-7 px-4 text-[9px] font-bold uppercase">Indices & derivatives</p>
      <nav aria-label="Index navigation" className="space-y-0.5">{indexNav.map(item => <NavLink key={item.href} item={item} active={activePath === item.href} />)}</nav>
      <div className="mt-auto border-t border-[#253440] px-4 pt-4 text-[9px] leading-relaxed text-[#627581]">MARKET INTELLIGENCE TERMINAL <span className="mt-1 block text-[#49b6a2]">UNDERGROUND BULLS</span></div>
    </aside>
    <header className="border-b border-[#253440] bg-[#0a1118] px-3 pb-2 pt-3 md:hidden">
      <div className="flex items-center justify-between"><Brand /><span className="text-[9px] font-semibold uppercase tracking-wider text-[#49b6a2]">Market terminal</span></div>
      <nav aria-label="Main navigation" className="stocksi-scroll mt-3 flex gap-1 overflow-x-auto pb-1">{allNav.map(item => { const Icon=item.icon; const active=activePath===item.href; return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={cn("flex min-h-8 shrink-0 items-center gap-1.5 border px-2.5 text-[10px]",active?"border-[#3d756f] bg-[#13232b] text-[#b9ded6]":"border-[#253440] text-[#81919b]")}><Icon className="h-3 w-3" />{item.label}</Link>; })}</nav>
    </header>
  </>;
}
