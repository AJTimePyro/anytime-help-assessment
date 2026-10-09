"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { AppButton } from "./AppButton";
import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center space-y-4 my-auto",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-full bg-primary-container text-primary-ink flex items-center justify-center shadow-inner">
        {React.isValidElement(icon)
          ? React.cloneElement(
              icon as React.ReactElement<{ className?: string }>,
              {
                className: "w-8 h-8",
              },
            )
          : icon}
      </div>

      <div className="space-y-1 max-w-xs">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        {description && (
          <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
        )}
      </div>

      {actionLabel && onAction && (
        <AppButton onClick={onAction} variant="secondary" size="default">
          {actionLabel}
        </AppButton>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this information. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center space-y-4 my-auto",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-full bg-danger-container text-danger-on flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1 max-w-xs">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
      </div>

      {onRetry && (
        <AppButton
          onClick={onRetry}
          variant="outline"
          size="default"
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Try again
        </AppButton>
      )}
    </div>
  );
}

export function Skeleton({
  className = "",
  ...props
}: React.ComponentProps<typeof ShadcnSkeleton>) {
  return (
    <ShadcnSkeleton
      className={cn("bg-surface-sunken rounded-xl", className)}
      {...props}
    />
  );
}
