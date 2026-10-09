"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Wrench, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType = "pending" | "in_progress" | "resolved" | "danger";

export interface StatusChipProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const STATUS_CONFIGS = {
  pending: {
    defaultLabel: "Pending",
    icon: Clock,
    classes: "bg-pending-container text-pending-on",
  },
  in_progress: {
    defaultLabel: "In progress",
    icon: Wrench,
    classes: "bg-inprogress-container text-inprogress-on",
  },
  resolved: {
    defaultLabel: "Resolved",
    icon: CheckCircle2,
    classes: "bg-resolved-container text-resolved-on",
  },
  danger: {
    defaultLabel: "Urgent",
    icon: AlertCircle,
    classes: "bg-danger-container text-danger-on",
  },
} as const;

export function StatusChip({
  status,
  label,
  size = "md",
  className = "",
}: StatusChipProps) {
  const config = STATUS_CONFIGS[status];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center tracking-normal shrink-0 border-transparent transition-colors rounded-full font-semibold h-auto",
        config.classes,
        size === "sm"
          ? "text-xs px-2.5 py-1 gap-1.5"
          : "text-[13px] px-3 py-1.5 gap-1.5",
        className,
      )}
    >
      <Icon
        className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"}
        strokeWidth={2}
      />
      <span>{displayLabel}</span>
    </Badge>
  );
}
