"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useMounted } from "@/lib/hooks";
import { Skeleton } from "@/components/designed";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("resident" | "member")[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!mounted) return;

    // Public routes that don't need authentication
    const isPublic =
      pathname === "/login" || pathname === "/otp" || pathname === "/";

    if (!user && !isPublic) {
      router.replace("/login");
      return;
    }

    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/home");
    }
  }, [mounted, user, pathname, allowedRoles, router]);

  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col p-6 space-y-4 justify-center">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="w-48 h-6 mx-auto" />
        <Skeleton className="w-full h-32 rounded-2xl" />
      </div>
    );
  }

  return <>{children}</>;
}
