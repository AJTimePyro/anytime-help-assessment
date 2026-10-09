"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { Status } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed/categories";
import { APP_CONFIG } from "@/lib/config";
import { formatDateTime, formatRelativeTime, getInitials } from "@/lib/format";
import { TopBar } from "@/components/shell/TopBar";
import {
  JourneyTrack,
  StatusChip,
  AppButton as Button,
  AppInput,
  AppTextarea,
  EmptyState,
  Skeleton,
} from "@/components/designed";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Share2,
  MessageCircle,
  MapPin,
  Calendar,
  User,
  Send,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

function ComplaintDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    user,
    complaints,
    markLastSeen,
    updateComplaintStatus,
    addComplaintReply,
  } = useAppStore();
  const { dict, lang, t } = useT();

  const isMember = user?.role === "member";

  const complaint = complaints.find((c) => c.id === id);

  const [expandedDesc, setExpandedDesc] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status>("pending");
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    if (complaint) {
      markLastSeen(complaint.id);
      setSelectedStatus(complaint.status);
    }
  }, [complaint, markLastSeen]);

  if (!complaint) {
    return (
      <div className="flex-1 flex flex-col p-6 items-center justify-center">
        <EmptyState
          icon={<AlertCircle />}
          title="Complaint not found"
          description={`No record found matching ID ${id || "unknown"}.`}
          actionLabel="Back to Complaints"
          onAction={() => router.push("/complaints")}
        />
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === complaint.categoryId);
  const sub = category?.subs.find((s) => s.id === complaint.subId);
  const title = sub
    ? sub.name[lang]
    : category?.name[lang] || complaint.categoryId;

  const pendingEntry = complaint.statusHistory.find(
    (h) => h.status === "pending",
  );
  const inProgressEntry = complaint.statusHistory.find(
    (h) => h.status === "in_progress",
  );
  const resolvedEntry = complaint.statusHistory.find(
    (h) => h.status === "resolved",
  );

  const stepperTimestamps = {
    pending: pendingEntry
      ? formatRelativeTime(pendingEntry.at, lang)
      : undefined,
    in_progress: inProgressEntry
      ? formatRelativeTime(inProgressEntry.at, lang)
      : undefined,
    resolved: resolvedEntry
      ? formatRelativeTime(resolvedEntry.at, lang)
      : undefined,
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Complaint link copied to clipboard");
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = replyText.trim() || "Status noted.";

    addComplaintReply(
      complaint.id,
      textToSend,
      user?.name || (isMember ? "Committee Member" : "Resident"),
      user?.role || "resident",
    );

    setReplyText("");
    toast.success("Reply added to timeline");
  };

  const handleQuickReply = (text: string) => {
    addComplaintReply(
      complaint.id,
      text,
      user?.name || "Committee Member",
      "member",
    );
    toast.success("Quick update sent");
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateComplaintStatus(
      complaint.id,
      selectedStatus,
      user?.name || "Committee Member",
      statusNote.trim() || undefined,
    );
    setShowStatusSheet(false);
    setStatusNote("");
    toast.success(t(dict.complaints.statusUpdated, { status: selectedStatus }));
  };

  const handleReopen = () => {
    updateComplaintStatus(
      complaint.id,
      "pending",
      user?.name || "Resident",
      dict.detail.reopenNote,
    );
    toast.info("Complaint reopened as Pending");
  };

  return (
    <div className="flex-1 flex flex-col relative pb-36 no-scrollbar">
      <TopBar
        title={complaint.id}
        showBack
        backHref="/complaints"
        rightAction={
          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/${APP_CONFIG.supportWhatsApp}?text=${encodeURIComponent(
                `Regarding complaint ${complaint.id}: ${title}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discuss on WhatsApp"
              className="w-9 h-9 rounded-full bg-whatsapp-container text-whatsapp-on-container flex items-center justify-center hover:opacity-90 transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>

            <button
              onClick={handleShare}
              aria-label="Share complaint link"
              className="w-9 h-9 rounded-full bg-surface-sunken border border-border/60 flex items-center justify-center text-ink hover:bg-surface-raised hover:border-border-control transition active:scale-95"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-5 space-y-6 flex-1 animate-screen-enter">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-surface-sunken text-ink-soft font-bold text-xs">
              {category?.name[lang]}
            </span>
            <StatusChip status={complaint.status} size="sm" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-ink leading-snug">
            {title}
          </h1>
        </div>

        <div className="p-4 rounded-3xl bg-surface border border-border shadow-xs">
          <JourneyTrack
            status={complaint.status}
            variant="full"
            timestamps={stepperTimestamps}
          />
        </div>

        {complaint.photos.length > 0 && (
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden border border-border aspect-16/10 bg-surface-sunken">
              <img
                src={complaint.photos[activePhotoIdx]}
                alt={title}
                onClick={() =>
                  setPreviewPhoto(complaint.photos[activePhotoIdx])
                }
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition filter-(--img-filter)"
              />
              {complaint.photos.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {complaint.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === activePhotoIdx ? "w-4 bg-white" : "bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-2.5 text-xs text-ink-soft">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="text-ink font-semibold">{complaint.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary shrink-0" />
            <span>
              {dict.detail.reportedBy}:{" "}
              <strong className="text-ink font-semibold">
                {isMember
                  ? `${complaint.reporterName} (${complaint.reporterFlat})`
                  : complaint.reporterId === user?.id
                    ? "You"
                    : complaint.reporterName}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>
              {dict.detail.reportedOn}:{" "}
              <strong className="text-ink font-semibold">
                {formatDateTime(complaint.createdAt, lang)}
              </strong>
            </span>
          </div>
        </div>

        <div className="space-y-1.5 p-4 rounded-2xl bg-surface border border-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Description
          </h3>
          <p
            className={`text-sm text-ink leading-relaxed ${
              !expandedDesc && complaint.description.length > 160
                ? "line-clamp-4"
                : ""
            }`}
          >
            {complaint.description}
          </p>
          {complaint.description.length > 160 && (
            <button
              onClick={() => setExpandedDesc(!expandedDesc)}
              className="text-xs font-bold text-primary-ink hover:underline inline-flex items-center gap-1 pt-1"
            >
              {expandedDesc ? dict.detail.showLess : dict.detail.readMore}
              {expandedDesc ? (
                 <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            {dict.detail.timeline}
          </h2>

          <div className="space-y-3">
            {complaint.statusHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-surface-sunken border border-border"
              >
                <div className="w-7 h-7 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">
                      Marked {item.status.replace("_", " ")} by {item.byName}
                    </span>
                    <span className="text-[10px] text-ink-soft">
                      {formatRelativeTime(item.at, lang)}
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-xs text-ink-soft mt-1">{item.note}</p>
                  )}
                </div>
              </div>
            ))}

            {complaint.replies.map((reply) => {
              const isMe = reply.byRole === user?.role;
              return (
                <div
                  key={reply.id}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 space-y-1 shadow-xs ${
                      isMe
                        ? "bg-primary-container text-on-primary-container rounded-tr-xs"
                        : "bg-surface border border-border text-ink rounded-tl-xs"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Avatar size="sm" className="w-5 h-5">
                        <AvatarFallback className="text-[9px] font-bold bg-surface-sunken text-ink">
                          {getInitials(reply.byName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-between gap-2 text-[10px] font-bold flex-1">
                        <span>{reply.byName}</span>
                        <span className="opacity-75">
                          {reply.byRole === "member" ? "Committee" : "Resident"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed font-normal">
                      {reply.text}
                    </p>
                    <span className="text-[9px] opacity-70 block text-right">
                      {formatRelativeTime(reply.at, lang)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog
        open={!!previewPhoto}
        onOpenChange={(open) => !open && setPreviewPhoto(null)}
      >
        <DialogContent className="p-2 sm:max-w-2xl bg-black/95 border-none shadow-2xl flex items-center justify-center">
          {previewPhoto && (
            <img
              src={previewPhoto}
              alt="Full size preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain cursor-pointer filter-(--img-filter)"
              onClick={() => setPreviewPhoto(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="sticky bottom-0 left-0 right-0 bg-surface-raised border-t border-border p-3 space-y-2.5 z-20 mt-auto">
        {isMember && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              dict.detail.quickReply1,
              dict.detail.quickReply2,
              dict.detail.quickReply3,
            ].map((qr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickReply(qr)}
                className="px-2.5 py-1 rounded-full bg-surface-sunken hover:bg-surface-raised hover:border-border-control text-[11px] font-semibold text-ink shrink-0 border border-border active:scale-95 transition"
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSendReply} className="flex items-center gap-2">
          <AppInput
            placeholder={
              isMember ? dict.detail.replyPlaceholder : dict.detail.addComment
            }
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-11 text-xs"
          />

          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={!replyText.trim()}
            className="w-11 h-11 p-0 shrink-0 rounded-xl"
            aria-label="Send reply"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {isMember ? (
          <Button
            type="button"
            onClick={() => setShowStatusSheet(true)}
            variant="primary"
            size="default"
            className="w-full"
          >
            {dict.detail.updateStatus}
          </Button>
        ) : (
          complaint.status === "resolved" && (
            <Button
              type="button"
              variant="text"
              onClick={handleReopen}
              className="w-full text-xs font-bold text-danger-solid"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              {dict.detail.reopen}
            </Button>
          )
        )}
      </div>

      <Drawer open={showStatusSheet} onOpenChange={setShowStatusSheet}>
        <DrawerContent className="max-w-md mx-auto bg-surface-raised border-t sm:border border-border rounded-t-[28px] sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
          <DrawerHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-border">
            <DrawerTitle className="text-base font-bold text-ink">
              {dict.detail.changeStatusTitle}
            </DrawerTitle>
            <DrawerClose className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer">
              <X className="w-4 h-4" />
            </DrawerClose>
          </DrawerHeader>

          <form onSubmit={handleSaveStatus} className="space-y-4">
            <div className="space-y-2">
              {[
                { val: "pending", label: "Pending", icon: Clock },
                { val: "in_progress", label: "In progress", icon: Wrench },
                { val: "resolved", label: "Resolved", icon: CheckCircle2 },
              ].map((s) => {
                const isSelected = selectedStatus === s.val;
                return (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setSelectedStatus(s.val as Status)}
                    className={`w-full min-h-13 p-3 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? "bg-primary-container border-primary text-primary-ink font-bold shadow-xs"
                        : "bg-surface border border-border text-ink font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <s.icon className="w-5 h-5" />
                      <span className="text-sm">{s.label}</span>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <AppTextarea
              label="Update Note (optional)"
              showCounter={false}
              placeholder={dict.detail.addNotePlaceholder}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="min-h-20"
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
            >
              {dict.common.save}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function ComplaintViewPage() {
  return (
    <Suspense
      fallback={
        <div className="p-5 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      }
    >
      <ComplaintDetailContent />
    </Suspense>
  );
}
