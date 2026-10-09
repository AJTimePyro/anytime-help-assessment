"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/useT";
import { JourneyTrack, AppButton as Button } from "@/components/designed";

export default function ReportSuccessPage() {
  const router = useRouter();
  const { dict } = useT();
  const [complaintId, setComplaintId] = useState("AH-1043");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = sessionStorage.getItem("ah-just-created-id");
      if (storedId) {
        setComplaintId(storedId);
      }
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto no-scrollbar animate-screen-enter text-center">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 max-w-sm mx-auto w-full my-auto">
        <div className="relative w-24 h-24 rounded-full bg-resolved-container text-resolved-solid flex items-center justify-center shadow-lg">
          <svg className="w-14 h-14" viewBox="0 0 52 52">
            <circle
              className="stroke-resolved-solid stroke-[3px] fill-none"
              cx="26"
              cy="26"
              r="24"
              strokeDasharray="150"
              strokeDashoffset="0"
            />
            <path
              className="stroke-resolved-solid stroke-[4px] fill-none stroke-linecap-round stroke-linejoin-round"
              d="M14 27l8 8 16-16"
              strokeDasharray="40"
              strokeDashoffset="0"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {dict.report.successTitle}
          </h1>
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary-container text-primary-ink font-mono font-bold text-sm">
            {complaintId}
          </div>
          <p className="text-sm text-ink-soft max-w-xs leading-relaxed pt-1">
            {dict.report.successMsg}
          </p>
        </div>

        <div className="w-full p-4 rounded-3xl bg-surface border border-border shadow-xs">
          <JourneyTrack status="pending" variant="full" />
        </div>
      </div>

      <div className="space-y-3 pt-6 max-w-sm mx-auto w-full">
        <Button
          onClick={() => router.replace(`/complaints/view?id=${complaintId}`)}
          variant="primary"
          size="large"
          className="w-full"
        >
          {dict.report.viewComplaint}
        </Button>

        <Button
          onClick={() => router.replace("/home")}
          variant="text"
          size="default"
          className="w-full text-sm font-semibold"
        >
          {dict.report.backToHome}
        </Button>
      </div>
    </div>
  );
}
