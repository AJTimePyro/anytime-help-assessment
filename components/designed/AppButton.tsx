"use client";

import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text" | "destructive";
  size?: "default" | "large" | "small";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const BUTTON_SIZE_CLASSES: Record<
  NonNullable<AppButtonProps["size"]>,
  string
> = {
  small: "min-h-10 px-3.5 py-1.5 text-sm rounded-xl gap-1.5",
  default: "min-h-12 px-5 py-2.5 text-base font-semibold rounded-xl gap-2",
  large: "min-h-14 px-6 py-3.5 text-[17px] font-semibold rounded-2xl gap-2.5",
};

const BUTTON_VARIANT_CLASSES: Record<
  NonNullable<AppButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-primary text-on-primary hover:opacity-95 shadow-xs active:scale-[0.98] border-transparent",
  secondary:
    "bg-primary-container text-on-primary-container hover:opacity-90 active:scale-[0.98] border-transparent",
  outline:
    "border border-border-control bg-surface text-ink hover:bg-surface-sunken active:scale-[0.98]",
  text: "bg-transparent text-primary-ink hover:bg-primary-container/30 active:scale-[0.98] border-transparent",
  destructive:
    "bg-danger-solid text-on-solid hover:bg-danger-solid/90 active:scale-[0.98] shadow-xs border-transparent",
};

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "default",
      isLoading = false,
      icon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <ShadcnButton
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
          BUTTON_SIZE_CLASSES[size],
          BUTTON_VARIANT_CLASSES[variant],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </ShadcnButton>
    );
  },
);

AppButton.displayName = "AppButton";
