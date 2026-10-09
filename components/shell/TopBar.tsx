"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "../common/BrandLogo";
import { HeaderControls } from "../common/HeaderControls";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import { getInitials } from "@/lib/format";
import Link from "next/link";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  isHome?: boolean;
}

export function TopBar({
  title,
  showBack = false,
  backHref,
  rightAction,
  isHome = false,
}: TopBarProps) {
  const router = useRouter();
  const user = useAppStore((state) => state.user);

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  if (isHome) {
    return (
      <header className="w-full shrink-0 h-15 px-4 bg-surface border-b border-border flex items-center justify-between z-20 select-none">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" showText={false} />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-ink leading-tight">
              Anytime Help Society
            </span>
            <span className="text-[11px] text-ink-soft font-medium">
              Sushant Lok 2 & 3
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HeaderControls />
          <Link
            href="/profile"
            aria-label="Profile"
            className="rounded-full active:scale-95 transition hover:opacity-90 inline-flex"
          >
            <Avatar size="sm" className="w-8 h-8 border border-border">
              <AvatarFallback className="bg-primary-container text-primary-ink font-bold text-xs">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full shrink-0 h-15 px-4 bg-surface border-b border-border flex items-center justify-between z-20 select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && (
          <button
            onClick={handleBack}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-surface-sunken border border-border/70 flex items-center justify-center text-ink hover:bg-surface-raised hover:border-border-control transition active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-bold text-ink truncate leading-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {rightAction || <HeaderControls />}
      </div>
    </header>
  );
}
