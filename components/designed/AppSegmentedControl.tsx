"use client";

import React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  badge?: string | number;
}

export interface AppSegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "default" | "small";
}

export function AppSegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className = "",
  size = "default",
}: AppSegmentedControlProps<T>) {
  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={(val) => {
        if (typeof val === "string") onChange(val as T);
      }}
      className={cn("w-full", className)}
    >
      <TabsPrimitive.List
        className={cn(
          "grid w-full rounded-xl bg-surface-sunken p-1 border border-border/70 gap-1 select-none",
          size === "small" ? "h-auto min-h-10" : "h-auto min-h-12",
        )}
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => (
          <TabsPrimitive.Tab
            key={option.value}
            value={option.value}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-150 cursor-pointer select-none",
              "text-ink-soft hover:text-ink",
              "data-active:bg-surface-raised data-active:text-ink data-active:shadow-xs",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
            )}
          >
            <span>{option.label}</span>
            {option.badge !== undefined && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary-container text-on-primary-container">
                {option.badge}
              </span>
            )}
          </TabsPrimitive.Tab>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
