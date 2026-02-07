import { Skull, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanCreditsBadgeProps {
  freeScansLeft: number;
  creditsRemaining: number;
  isSubscriber: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ScanCreditsBadge({
  freeScansLeft,
  creditsRemaining,
  isSubscriber,
  onClick,
  className,
  size = "sm",
}: ScanCreditsBadgeProps) {
  const total = freeScansLeft + creditsRemaining;
  const isFreeOnly = freeScansLeft > 0 && creditsRemaining === 0;

  const colorClass = isSubscriber
    ? "bg-accent/20 text-accent border-accent/40"
    : total >= 5
      ? "bg-success/20 text-success border-success/40"
      : total >= 2
        ? "bg-warning/20 text-warning border-warning/40"
        : "bg-destructive/20 text-destructive border-destructive/40";

  const sizeClass = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  }[size];

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-all duration-200 hover:scale-105 cursor-pointer",
        sizeClass,
        colorClass,
        className
      )}
    >
      <Skull className={iconSize} />
      {isSubscriber ? (
        <span className="flex items-center gap-1">
          <Zap className={iconSize} />
          Unlimited
        </span>
      ) : isFreeOnly ? (
        <span>{freeScansLeft} free scan{freeScansLeft !== 1 ? "s" : ""}</span>
      ) : (
        <span>{total} scan{total !== 1 ? "s" : ""}</span>
      )}
    </button>
  );
}
