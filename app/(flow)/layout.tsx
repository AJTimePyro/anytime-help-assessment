"use client";

import React from "react";
import { AuthGuard } from "@/components/shell/AuthGuard";

export default function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col w-full min-h-screen bg-bg text-ink relative flex-1">
        <main className="flex-1 flex flex-col relative">{children}</main>
      </div>
    </AuthGuard>
  );
}
