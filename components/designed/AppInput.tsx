"use client";

import React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isPhone?: boolean;
  isSearch?: boolean;
}

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      isPhone = false,
      isSearch = false,
      type = "text",
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {isSearch && (
            <Search className="absolute left-3.5 w-5 h-5 text-ink-soft pointer-events-none" />
          )}

          {isPhone && (
            <div className="absolute left-3.5 flex items-center gap-1.5 text-ink font-semibold text-base border-r border-border-control pr-2.5 z-10 select-none">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
          )}

          <ShadcnInput
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full min-h-12 rounded-xl bg-surface-sunken border transition text-ink placeholder:text-ink-soft focus-visible:ring-2 focus-visible:ring-focus-ring disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-danger-solid focus-visible:ring-danger-solid"
                : "border-border-control",
              isSearch ? "pl-11 pr-4" : isPhone ? "pl-24 pr-4" : "px-4",
              className,
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs font-semibold text-danger-on bg-danger-container px-2.5 py-1 rounded-md inline-block">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-ink-soft">{helperText}</p>
        )}
      </div>
    );
  },
);

AppInput.displayName = "AppInput";
