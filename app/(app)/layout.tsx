"use client";

import React from "react";
import { AuthGuard } from "@/components/shell/AuthGuard";
import { BottomNav } from "@/components/shell/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex flex-col w-full min-h-screen bg-bg text-ink relative flex-1">
        <main className="flex-1 flex flex-col relative">{children}</main>
        <div className="sticky bottom-0 z-30 w-full">
          <BottomNav />
        </div>
      </div>
    </AuthGuard>
  );
}
