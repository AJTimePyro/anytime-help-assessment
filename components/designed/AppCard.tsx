"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "standard" | "interactive" | "informational" | "alert" | "hero";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const VARIANT_STYLES: Record<NonNullable<AppCardProps["variant"]>, string> = {
  standard: "bg-surface border border-border rounded-2xl p-4 text-ink ring-0",
  interactive:
    "bg-surface border border-border rounded-2xl p-4 text-ink cursor-pointer hover:border-border-control active:scale-[0.99] transition-all duration-150 ring-0",
  informational:
    "bg-primary-container text-on-primary-container rounded-2xl p-4 border border-primary-ink/20 ring-0",
  alert:
    "bg-danger-container text-danger-on rounded-2xl p-4 border border-danger-solid/30 ring-0",
  hero: "bg-surface border border-border rounded-3xl p-5 text-ink shadow-sm ring-0",
};

export function AppCard({
  variant = "standard",
  children,
  className = "",
  onClick,
  ...props
}: AppCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(VARIANT_STYLES[variant], className)}
      {...props}
    >
      {variant === "interactive" ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">{children}</div>
          <ChevronRight className="w-5 h-5 text-ink-soft shrink-0" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
