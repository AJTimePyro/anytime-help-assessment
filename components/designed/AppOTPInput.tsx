"use client";

import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export interface AppOTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export function AppOTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  className = "",
}: AppOTPInputProps) {
  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <InputOTP
        maxLength={length}
        value={value}
        onChange={onChange}
        disabled={disabled}
        containerClassName="gap-2 sm:gap-2.5 justify-center w-full"
      >
        <InputOTPGroup className="gap-2 sm:gap-2.5 w-full justify-between">
          {Array.from({ length }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="w-12 h-14 sm:w-13 sm:h-16 text-center text-2xl font-bold rounded-2xl bg-surface-sunken border border-border-control text-ink data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-focus-ring transition first:rounded-2xl last:rounded-2xl"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
