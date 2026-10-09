"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/designed";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ah-demo-v3");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user) {
          router.replace("/home");
          return;
        }
      }
    } catch {
      // Fallback to login on corrupted session
    }
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="w-48 h-6" />
      <Skeleton className="w-32 h-4" />
    </div>
  );
}
