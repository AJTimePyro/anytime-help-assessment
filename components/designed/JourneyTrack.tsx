"use client";

import React from "react";
import { Clock, Wrench, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type JourneyStage = "pending" | "in_progress" | "resolved";

export interface JourneyTrackProps {
  status: JourneyStage;
  variant?: "compact" | "full";
  timestamps?: {
    pending?: string;
    in_progress?: string;
    resolved?: string;
  };
  labels?: {
    pending?: string;
    in_progress?: string;
    resolved?: string;
  };
  className?: string;
}

const STAGE_ORDER: JourneyStage[] = ["pending", "in_progress", "resolved"];

export function JourneyTrack({
  status,
  variant = "full",
  timestamps,
  labels = {
    pending: "Pending",
    in_progress: "In progress",
    resolved: "Resolved",
  },
  className = "",
}: JourneyTrackProps) {
  const currentIndex = STAGE_ORDER.indexOf(status);

  if (variant === "compact") {
    return (
      <div className={cn("w-full flex items-center gap-1.5", className)}>
        {STAGE_ORDER.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const bgClass = !isCompleted
            ? "bg-track-empty"
            : stage === "pending"
              ? "bg-pending-solid"
              : stage === "in_progress"
                ? "bg-inprogress-solid"
                : "bg-resolved-solid";

          return (
            <div
              key={stage}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                bgClass,
              )}
            />
          );
        })}
      </div>
    );
  }

  const nodes = [
    {
      stage: "pending" as const,
      label: labels.pending || "Pending",
      time: timestamps?.pending,
      icon: Clock,
      colorClass: "bg-pending-solid text-on-solid",
    },
    {
      stage: "in_progress" as const,
      label: labels.in_progress || "In progress",
      time: timestamps?.in_progress,
      icon: Wrench,
      colorClass: "bg-inprogress-solid text-on-solid",
    },
    {
      stage: "resolved" as const,
      label: labels.resolved || "Resolved",
      time: timestamps?.resolved,
      icon: Check,
      colorClass: "bg-resolved-solid text-on-solid",
    },
  ];

  return (
    <div className={cn("w-full relative py-2", className)}>
      <div className="absolute top-5.5 left-[10%] right-[10%] h-0.75 bg-track-empty z-0" />

      <div
        className={cn(
          "absolute top-5.5 left-[10%] h-0.75 transition-all duration-500 ease-out origin-left z-0",
          currentIndex === 2 ? "bg-resolved-solid" : "bg-inprogress-solid",
        )}
        style={{
          width: currentIndex === 0 ? "0%" : currentIndex === 1 ? "40%" : "80%",
        }}
      />

      <div className="flex items-start justify-between relative z-10">
        {nodes.map((node, idx) => {
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;
          const IconComponent = node.icon;

          return (
            <div
              key={node.stage}
              className="flex flex-col items-center flex-1 text-center"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                  isFuture
                    ? "bg-surface-sunken border-2 border-border-control text-ink-disabled"
                    : node.colorClass,
                  isCurrent &&
                    "ring-4 ring-offset-2 ring-offset-surface ring-primary/40 shadow-md scale-105",
                )}
              >
                <IconComponent className="w-4 h-4" strokeWidth={2.2} />
              </div>

              <span
                className={cn(
                  "mt-2 text-xs font-semibold",
                  isFuture ? "text-ink-soft" : "text-ink",
                )}
              >
                {node.label}
              </span>

              {node.time && !isFuture && (
                <span className="text-[11px] text-ink-soft mt-0.5 leading-tight">
                  {node.time}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
