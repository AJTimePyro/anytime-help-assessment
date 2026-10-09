"use client";

import React from "react";
import Link from "next/link";
import { Complaint } from "@/lib/types";
import {
  StatusChip,
  JourneyTrack,
  AppButton as Button,
} from "@/components/designed";
import { CATEGORIES } from "@/lib/seed/categories";
import { formatRelativeTime } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { APP_CONFIG } from "@/lib/config";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

interface ComplaintCardProps {
  complaint: Complaint;
  showStartWork?: boolean;
}

export function ComplaintCard({
  complaint,
  showStartWork = true,
}: ComplaintCardProps) {
  const { user, lastSeen, updateComplaintStatus } = useAppStore();
  const { lang, dict, t } = useT();

  const category = CATEGORIES.find((c) => c.id === complaint.categoryId);
  const sub = category?.subs.find((s) => s.id === complaint.subId);

  const title = sub
    ? sub.name[lang]
    : category?.name[lang] || complaint.categoryId;
  const categoryName = category?.name[lang] || complaint.categoryId;

  const seenAt = lastSeen[complaint.id];
  const isUnread =
    !seenAt ||
    new Date(complaint.updatedAt).getTime() > new Date(seenAt).getTime();

  // Overdue check (for members on pending complaints)
  const isMember = user?.role === "member";
  const daysPending = Math.floor(
    (Date.now() - new Date(complaint.createdAt).getTime()) / (24 * 3600 * 1000),
  );
  const isOverdue =
    isMember &&
    complaint.status === "pending" &&
    daysPending >= APP_CONFIG.overdueDays;

  const handleStartWork = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const prevStatus = complaint.status;
    updateComplaintStatus(
      complaint.id,
      "in_progress",
      user?.name || "Committee Member",
      "Work started by member",
    );

    toast(t(dict.complaints.workStarted, { id: complaint.id }), {
      action: {
        label: dict.common.undo,
        onClick: () => {
          updateComplaintStatus(
            complaint.id,
            prevStatus,
            user?.name || "Committee Member",
            "Undid start work action",
          );
        },
      },
      duration: 5000,
    });
  };

  return (
    <Link
      href={`/complaints/view?id=${complaint.id}`}
      className="block w-full bg-surface border border-border/80 rounded-2xl p-4 text-ink hover:border-border-control transition-all duration-150 active:scale-[0.99] select-none relative group shadow-xs hover:shadow-sm"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-18 h-18 rounded-xl bg-surface-sunken border border-border/80 shrink-0 overflow-hidden flex items-center justify-center relative shadow-2xs">
          {complaint.photos.length > 0 ? (
            <img
              src={complaint.photos[0]}
              alt={title}
              className="w-full h-full object-cover filter-(--img-filter)"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-primary-container/30 flex items-center justify-center text-primary-ink">
              <CategoryIcon name={category?.icon} className="w-6 h-6" />
            </div>
          )}
          {complaint.photos.length > 1 && (
            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-bold px-1 rounded-sm">
              +{complaint.photos.length - 1}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold text-ink truncate leading-tight">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              {isUnread && (
                <span
                  title="New update"
                  className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse"
                />
              )}
              <StatusChip status={complaint.status} size="sm" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium truncate">{categoryName}</span>
            <span className="font-mono text-[11px] font-bold text-primary-ink shrink-0 ml-2">
              {complaint.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-soft truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary-ink" />
            <span className="truncate">{complaint.location}</span>
          </div>

          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex items-center gap-1 text-[11px] text-ink-soft font-medium">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(complaint.updatedAt, lang)}</span>
            </div>
            <div className="w-28 sm:w-32 shrink-0">
              <JourneyTrack status={complaint.status} variant="compact" />
            </div>
          </div>
        </div>
      </div>

      {isMember && (
        <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-ink-soft truncate">
              {complaint.reporterName} ({complaint.reporterFlat})
            </span>
            {isOverdue && (
              <span className="px-2 py-0.5 rounded-md bg-pending-container text-pending-on font-bold text-[11px] shrink-0">
                {t(dict.complaints.waitingDays, { d: daysPending })}
              </span>
            )}
          </div>

          {showStartWork && complaint.status === "pending" && (
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={handleStartWork}
              className="text-xs font-bold py-1 px-3 min-h-0 h-auto rounded-lg ml-2 shrink-0"
            >
              {dict.home.startWork}
            </Button>
          )}
        </div>
      )}
    </Link>
  );
}
