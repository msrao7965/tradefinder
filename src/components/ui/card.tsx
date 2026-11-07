import { cn } from "@/lib/utils";

export function Card({
  title,
  children,
  className,
  action,
  description,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  description?: string;
}) {
  return (
    <section className={cn("stocksi-panel flex min-h-[260px] min-w-0 flex-col overflow-hidden rounded-2xl p-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(46,57,42,.09)] sm:min-h-[300px]", className)}>
      <header className="flex min-h-[62px] items-center justify-between gap-3 border-b border-[#e5e5db] px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[.13em] text-[#34483a]">{title}</h2>
          {description && <p className="mt-1 text-[10px] leading-relaxed text-[#7d877b]">{description}</p>}
        </div>
        {action}
      </header>
      <div className="stocksi-scroll min-h-0 min-w-0 flex-1 overflow-auto px-1 pb-2 sm:px-2">{children}</div>
    </section>
  );
}
