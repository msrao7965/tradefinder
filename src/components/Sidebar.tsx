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
  return (
    <Link href="/trade-desk" aria-label="Stocksi by Underground Bulls home" className="flex shrink-0 items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#b6ff69]/25 bg-[#b6ff69]/10 text-[#b6ff69]">
        <LineChart className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="block text-[19px] font-black tracking-[-0.06em] text-white">
          Stock<span className="text-[#b6ff69]">si</span>
        </span>
        <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.18em] text-[#91a2a2]">
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
        "flex min-h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors",
        active
          ? "border border-[#b6ff69]/20 bg-[#b6ff69]/10 text-[#c5ff8e]"
          : "border border-transparent text-[#94a3a3] hover:bg-white/[.045] hover:text-white",
      )}
    >
      <Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const activePath = pathname === "/" ? "/trade-desk" : pathname;

  return (
    <>
      <aside className="hidden h-full w-[246px] shrink-0 flex-col border-r border-white/[.07] bg-[#0a1117] px-4 py-6 md:flex">
        <div className="mb-9 px-2"><Brand /></div>
        <p className="stocksi-kicker mb-3 px-3 text-[9px] font-bold uppercase">Equity workspace</p>
        <nav aria-label="Stock navigation" className="space-y-1">
          {stocksNav.map((item) => <NavLink key={item.href} item={item} active={activePath === item.href} />)}
        </nav>
        <p className="stocksi-kicker mb-3 mt-8 px-3 text-[9px] font-bold uppercase">Index & derivatives</p>
        <nav aria-label="Index navigation" className="space-y-1">
          {indexNav.map((item) => <NavLink key={item.href} item={item} active={activePath === item.href} />)}
        </nav>
        <div className="mt-auto rounded-xl border border-white/[.07] bg-white/[.025] p-3 text-[10px] leading-relaxed text-[#839393]">
          Market intelligence, organised for decisive execution.
          <span className="mt-2 block text-[#b6ff69]">Verify every setup on your chart.</span>
        </div>
      </aside>

      <header className="border-b border-white/[.07] bg-[#0a1117] px-4 pb-2 pt-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Brand />
          <span className="rounded-full border border-[#b6ff69]/20 bg-[#b6ff69]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#b6ff69]">Live workspace</span>
        </div>
        <nav aria-label="Main navigation" className="stocksi-scroll mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {allNav.map((item) => {
            const Icon = item.icon;
            const active = activePath === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
                className={cn("flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[11px] font-medium",
                  active ? "border-[#b6ff69]/25 bg-[#b6ff69]/10 text-[#c5ff8e]" : "border-white/[.07] text-[#93a2a3]")}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />{item.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
