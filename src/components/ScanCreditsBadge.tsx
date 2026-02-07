import { Skull } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanCreditsBadgeProps {
  freeScansLeft: number;
  creditsRemaining: number;
  isSubscriber: boolean;
  onClick?: () => void;
  className?: string;
}

export function ScanCreditsBadge({
  freeScansLeft,
  creditsRemaining,
  isSubscriber,
  onClick,
  className,
}: ScanCreditsBadgeProps) {
  const total = freeScansLeft + creditsRemaining;

  const colorClass = isSubscriber
    ? "bg-accent/20 text-accent border-accent/40"
    : total >= 5
      ? "bg-success/20 text-success border-success/40"
      : total >= 2
        ? "bg-warning/20 text-warning border-warning/40"
        : "bg-destructive/20 text-destructive border-destructive/40";

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-pointer",
        colorClass,
        className
      )}
    >
      <Skull className="w-3 h-3" />
      {isSubscriber ? (
        <span>Unlimited</span>
      ) : (
        <span>{total} scan{total !== 1 ? "s" : ""}</span>
      )}
    </button>
  );
}
