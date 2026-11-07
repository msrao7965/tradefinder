"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, BarChart3, Clock, Layers, LayoutDashboard, LineChart,
  Radar, TrendingUp, Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stocksNav = [
  { label: "Trade Desk", href: "/trade-desk", icon: LayoutDashboard },
  { label: "Market Pulse", href: "/market-pulse", icon: Activity },
  { label: "Flow Watch", href: "/insider-strategy", icon: Radar },
  { label: "Sector Atlas", href: "/sector-scope", icon: Layers },
  { label: "Swing Radar", href: "/swing-spectrum", icon: Waves },
] as const;

const indexNav = [
  { label: "Momentum Clock", href: "/option-clock", icon: Clock },
  { label: "Options Compass", href: "/option-apex", icon: BarChart3 },
  { label: "Index Drivers", href: "/index-mover", icon: TrendingUp },
] as const;

const allNav = [...stocksNav, ...indexNav];

function Brand() {
  return (
    <Link href="/trade-desk" aria-label="Stocksi by Underground Bulls home" className="flex shrink-0 items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#66845a]/25 bg-[#e8eee2] text-[#426847] shadow-sm">
        <LineChart className="h-[19px] w-[19px]" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="block text-[22px] font-black tracking-[-0.07em] text-[#20382d]">
          Stock<span className="text-[#78965c]">si</span>
        </span>
        <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-[.2em] text-[#7c8578]">
          by Underground Bulls
        </span>
      </span>
    </Link>
  );
}

function NavLink({ item, active }: { item: (typeof allNav)[number]; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[13px] font-semibold transition-all duration-200",
        active
          ? "border border-[#66845a]/20 bg-gradient-to-r from-[#e6eddf] to-[#f3f4eb] text-[#345b3d] shadow-[inset_3px_0_0_#66845a,0_5px_18px_rgba(54,82,51,.06)]"
          : "border border-transparent text-[#737e73] hover:border-[#dfe2d6] hover:bg-white/65 hover:text-[#294334]",
      )}
    >
      <Icon className={cn("h-[17px] w-[17px] shrink-0 transition-transform group-hover:scale-105", active ? "text-[#52774d]" : "text-[#899386")} aria-hidden="true" />
      <span>{item.label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#66845a]" />}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const activePath = pathname === "/" ? "/trade-desk" : pathname;

  return (
    <>
      <aside className="hidden h-full w-[258px] shrink-0 flex-col border-r border-[#dcded3] bg-[#f8f7f1]/85 px-4 py-6 shadow-[8px_0_30px_rgba(40,55,37,.025)] backdrop-blur-xl md:flex">
        <div className="mb-10 px-2"><Brand /></div>
        <p className="stocksi-eyebrow mb-3 px-3">Equity intelligence</p>
        <nav aria-label="Stock navigation" className="space-y-1.5">
          {stocksNav.map((item) => <NavLink key={item.href} item={item} active={activePath === item.href} />)}
        </nav>
        <p className="stocksi-eyebrow mb-3 mt-9 px-3">Index & derivatives</p>
        <nav aria-label="Index navigation" className="space-y-1.5">
          {indexNav.map((item) => <NavLink key={item.href} item={item} active={activePath === item.href} />)}
        </nav>
        <div className="mt-auto rounded-2xl border border-[#dfe2d6] bg-gradient-to-br from-white/90 to-[#edf0e6]/80 p-4 shadow-sm">
          <p className="stocksi-eyebrow mb-2">Underground research</p>
          <p className="text-[11px] leading-relaxed text-[#687568]">A clearer read on participation, price behaviour and market structure.</p>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#52774d]">
            <span className="stocksi-live-dot h-1.5 w-1.5 rounded-full bg-[#66845a]" />
            Intelligence stream active
          </div>
        </div>
      </aside>

      <header className="border-b border-[#deded2] bg-[#f8f7f1]/90 px-4 pb-3 pt-3 shadow-sm backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Brand />
          <span className="flex items-center gap-1.5 rounded-full border border-[#dce5d7] bg-[#eaf0e5] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#52774d]">
            <span className="stocksi-live-dot h-1.5 w-1.5 rounded-full bg-[#66845a]" /> Live
          </span>
        </div>
        <nav aria-label="Main navigation" className="stocksi-scroll mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {allNav.map((item) => {
            const Icon = item.icon;
            const active = activePath === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
                className={cn("flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-semibold",
                  active ? "border-[#66845a]/25 bg-[#e8eee2] text-[#345b3d]" : "border-[#e3e4da] bg-white/55 text-[#778174]")}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />{item.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
