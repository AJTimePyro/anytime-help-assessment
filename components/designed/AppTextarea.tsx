"use client";

import React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface AppTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCounter?: boolean;
}

export const AppTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AppTextareaProps
>(
  (
    {
      className = "",
      label,
      error,
      maxLength = 500,
      showCounter = true,
      value,
      disabled,
      ...props
    },
    ref,
  ) => {
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-ink">
              {label}
            </label>
            {showCounter && (
              <span className="text-xs text-ink-soft font-medium">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        <ShadcnTextarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            "w-full min-h-27.5 rounded-xl bg-surface-sunken border p-3.5 transition text-ink placeholder:text-ink-soft focus-visible:ring-2 focus-visible:ring-focus-ring disabled:opacity-50 disabled:cursor-not-allowed resize-none",
            error
              ? "border-danger-solid focus-visible:ring-danger-solid"
              : "border-border-control",
            className,
          )}
          {...props}
        />

        {error && (
          <p className="text-xs font-semibold text-danger-on bg-danger-container px-2.5 py-1 rounded-md inline-block">
            {error}
          </p>
        )}
      </div>
    );
  },
);

AppTextarea.displayName = "AppTextarea";
