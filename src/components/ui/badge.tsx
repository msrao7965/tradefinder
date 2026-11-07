import { cn } from "@/lib/utils";

export function Badge({ children, variant = "neutral", className }: {
  children: React.ReactNode;
  variant?: "bull" | "bear" | "neutral";
  className?: string;
}) {
  return <span className={cn(
    "inline-flex items-center rounded-full border px-2 py-1 text-[9px] font-extrabold tracking-[.1em]",
    variant === "bull" && "border-[#d0e0ce] bg-[#e7f0e4] text-[#356746]",
    variant === "bear" && "border-[#ead2cb] bg-[#f5e7e2] text-[#98564a]",
    variant === "neutral" && "border-[#e0e2d8] bg-[#f0f0e9] text-[#788477]",
    className,
  )}>{children}</span>;
}
