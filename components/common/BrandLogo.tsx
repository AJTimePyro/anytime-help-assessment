"use client";

import { Home, Clock } from "lucide-react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  className = "",
}: BrandLogoProps) {
  const circleSize = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-18 h-18",
  }[size];

  const iconSize = {
    sm: 18,
    md: 24,
    lg: 34,
  }[size];

  const textSize = {
    sm: "text-base font-bold",
    md: "text-lg font-bold",
    lg: "text-2xl font-bold tracking-tight",
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className={`${circleSize} rounded-full bg-primary-container text-primary flex items-center justify-center relative shrink-0 shadow-inner`}
      >
        <Home size={iconSize} strokeWidth={2.2} />
        <div className="absolute bottom-1 right-1 bg-primary text-on-primary rounded-full p-0.5 shadow-sm">
          <Clock size={iconSize * 0.45} strokeWidth={2.5} />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`text-ink leading-tight ${textSize}`}>
            Anytime Help
          </span>
          <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
            Society Grievance Portal
          </span>
        </div>
      )}
    </div>
  );
}
