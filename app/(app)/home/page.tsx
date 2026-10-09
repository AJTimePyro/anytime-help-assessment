"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { CATEGORIES } from "@/lib/seed/categories";
import { TopBar } from "@/components/shell/TopBar";
import {
  JourneyTrack,
  AppCard as Card,
  AppButton as Button,
  AppInput as Input,
  StatusChip,
} from "@/components/designed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { WhatsAppButton } from "@/components/common/CommonButtons";
import { formatRelativeTime } from "@/lib/format";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import {
  CheckCircle2,
  FilePlus,
  Users,
  BookOpen,
  ArrowRight,
  Pin,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, complaints, notices, updateProfile } = useAppStore();
  const { dict, lang, t } = useT();

  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressInput, setAddressInput] = useState("");

  const isMember = user?.role === "member";

  const residentComplaints = complaints.filter(
    (c) => c.reporterId === user?.id || c.reporterName === user?.name,
  );
  const openResidentComplaints = residentComplaints.filter(
    (c) => c.status !== "resolved",
  );
  const carouselComplaints = openResidentComplaints.slice(0, 3);

  const pendingComplaints = complaints.filter((c) => c.status === "pending");
  const inProgressComplaints = complaints.filter(
    (c) => c.status === "in_progress",
  );
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved");

  const sortedPending = [...pendingComplaints].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const oldestDays = sortedPending[0]
    ? Math.floor(
        (Date.now() - new Date(sortedPending[0].createdAt).getTime()) /
          (24 * 3600 * 1000),
      )
    : 0;
  const waitingLongest = sortedPending.slice(0, 3);

  const sortedNotices = [...notices].sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const latestNotice = sortedNotices[0];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAddress = addressInput.trim() || "F-69, Block F";
    updateProfile(user?.name || "Prince Kumar", finalAddress);
    setShowAddressModal(false);
  };

  return (
    <div className="flex-1 flex flex-col relative pb-24 no-scrollbar">
      <TopBar isHome />

      <div className="p-4 sm:p-5 space-y-6 animate-screen-enter">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              {t(dict.home.greeting, { name: user?.name || "Neighbor" })}
            </h1>
            <p className="text-xs text-ink-soft font-medium mt-0.5">
              {isMember ? dict.roles.member : "Anytime Help Society"}
            </p>
          </div>
          {isMember && (
            <span className="px-3 py-1 rounded-full bg-primary-container text-primary-ink font-bold text-xs">
              SL-014
            </span>
          )}
        </div>

        {!isMember && (
          <>
            {!user?.address && (
              <Card variant="informational" className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-on-primary-container">
                      {dict.home.addAddressTitle}
                    </h3>
                    <p className="text-xs text-on-primary-container/80 mt-0.5">
                      {dict.home.addAddressDesc}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowAddressModal(true)}
                    variant="primary"
                    size="small"
                  >
                    {dict.home.addAddressBtn}
                  </Button>
                </div>
              </Card>
            )}

            {carouselComplaints.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    {dict.home.openComplaints} ({carouselComplaints.length})
                  </span>
                  {carouselComplaints.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      {carouselComplaints.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCarouselIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === activeCarouselIndex
                              ? "w-4 bg-primary"
                              : "bg-track-empty"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {(() => {
                  const currentComp =
                    carouselComplaints[activeCarouselIndex] ||
                    carouselComplaints[0];
                  const cat = CATEGORIES.find(
                    (c) => c.id === currentComp.categoryId,
                  );
                  const sub = cat?.subs.find((s) => s.id === currentComp.subId);
                  const title = sub
                    ? sub.name[lang]
                    : cat?.name[lang] || currentComp.categoryId;

                  return (
                    <Link
                      href={`/complaints/view?id=${currentComp.id}`}
                      className="block bg-surface border border-border rounded-3xl p-5 text-ink shadow-sm hover:border-border-control transition active:scale-[0.99]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-lg text-ink leading-tight">
                            {title}
                          </h3>
                          <p className="text-xs text-ink-soft font-medium mt-0.5">
                            {cat?.name[lang]} • {currentComp.location}
                          </p>
                        </div>
                        <StatusChip status={currentComp.status} />
                      </div>

                      <div className="my-3 py-2 border-y border-border">
                        <JourneyTrack
                          status={currentComp.status}
                          variant="full"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-ink-soft pt-1">
                        <span>
                          {t(dict.home.updatedAgo, {
                            time: formatRelativeTime(
                              currentComp.updatedAt,
                              lang,
                            ),
                            by:
                              currentComp.statusHistory[
                                currentComp.statusHistory.length - 1
                              ]?.byName || "Committee",
                          })}
                        </span>
                        <span className="font-mono font-bold text-primary-ink">
                          {currentComp.id}
                        </span>
                      </div>
                    </Link>
                  );
                })()}
              </div>
            ) : (
              <Card className="flex flex-col items-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-resolved-container text-resolved-solid flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-ink">
                    {dict.home.allGoodTitle}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    {dict.home.allGoodDesc}
                  </p>
                </div>
                <Link
                  href="/complaints"
                  className="text-xs text-primary-ink font-semibold hover:underline"
                >
                  {dict.home.viewPast} →
                </Link>
              </Card>
            )}

            <div className="space-y-2.5">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-ink">
                  {dict.home.whatNeedsFixing}
                </h2>
                <p className="text-xs text-ink-soft">
                  {dict.home.tapCategoryToRaise}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => router.push(`/report?cat=${cat.id}`)}
                    className="flex flex-col items-center text-center p-2 rounded-2xl bg-surface border border-border hover:border-primary hover:bg-primary-container/30 active:scale-95 transition group select-none min-h-23"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center transition-transform group-hover:scale-105">
                      <CategoryIcon
                        name={cat.icon}
                        className="w-6 h-6"
                        strokeWidth={2}
                      />
                    </div>
                    <span className="text-xs font-semibold text-ink leading-tight mt-1.5 line-clamp-2">
                      {cat.short[lang]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {latestNotice && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                    {dict.home.noticeBoard}
                  </h2>
                  <Link
                    href="/notices"
                    className="text-xs font-semibold text-primary-ink hover:underline"
                  >
                    {dict.common.seeAll}
                  </Link>
                </div>

                <Link
                  href="/notices"
                  className={`block p-4 rounded-2xl bg-surface border transition hover:border-border-control ${
                    latestNotice.important
                      ? "border-l-4 border-l-danger-solid border-border"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-ink leading-tight line-clamp-1">
                      {latestNotice.title}
                    </h4>
                    {latestNotice.important && (
                      <span className="px-2 py-0.5 rounded-full bg-danger-container text-danger-on text-[10px] font-bold shrink-0">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft mt-1 line-clamp-2 leading-relaxed">
                    {latestNotice.body}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-ink-soft mt-2.5 pt-2 border-t border-border">
                    <span>{latestNotice.byName}</span>
                    <span>
                      {formatRelativeTime(latestNotice.createdAt, lang)}
                    </span>
                  </div>
                </Link>
              </div>
            )}

            <Link
              href="/directory"
              className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border hover:border-border-control active:scale-[0.99] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">
                    {dict.home.societyDirectory}
                  </h4>
                  <p className="text-xs text-ink-soft">
                    RWA Committee & Emergency contacts
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-soft" />
            </Link>
          </>
        )}

        {isMember && (
          <>
            <div className="rounded-3xl p-5 bg-primary-container text-on-primary-container border border-primary-ink/20 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {dict.home.needsAttention}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface/70 text-ink">
                  Society Triage
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-3xl font-extrabold block">
                    {pendingComplaints.length}
                  </span>
                  <span className="text-xs opacity-85 font-medium">
                    Pending review
                  </span>
                </div>
                <div>
                  <span className="text-3xl font-extrabold block">
                    {oldestDays}d
                  </span>
                  <span className="text-xs opacity-85 font-medium">
                    {dict.home.oldestWaiting}
                  </span>
                </div>
              </div>

              <Link
                href="/complaints?status=pending"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-on-primary font-bold text-sm hover:opacity-95 active:scale-98 transition shadow-xs"
              >
                <span>{dict.home.reviewPending}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface border border-border">
                <span className="text-2xl font-bold text-inprogress-solid">
                  {inProgressComplaints.length}
                </span>
                <p className="text-xs font-semibold text-ink-soft mt-0.5">
                  {dict.home.inProgressCount}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border">
                <span className="text-2xl font-bold text-resolved-solid">
                  {resolvedComplaints.length}
                </span>
                <p className="text-xs font-semibold text-ink-soft mt-0.5">
                  {dict.home.resolvedThisMonth}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                  {dict.home.waitingLongest}
                </h2>
                <Link
                  href="/complaints"
                  className="text-xs font-semibold text-primary-ink hover:underline"
                >
                  {dict.common.seeAll}
                </Link>
              </div>

              {waitingLongest.length > 0 ? (
                <div className="space-y-2.5">
                  {waitingLongest.map((c) => (
                    <ComplaintCard key={c.id} complaint={c} showStartWork />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-6 text-xs text-ink-soft">
                  No pending complaints waiting!
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                {dict.home.quickActions}
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/notices"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border hover:border-border-control active:scale-95 transition"
                >
                  <Pin className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-ink">
                    {dict.home.postNotice}
                  </span>
                </Link>

                <Link
                  href="/residents"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border hover:border-border-control active:scale-95 transition"
                >
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-ink">
                    {dict.home.residents}
                  </span>
                </Link>

                <Link
                  href="/directory"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border hover:border-border-control active:scale-95 transition"
                >
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-ink">
                    {dict.home.directory}
                  </span>
                </Link>

                <Link
                  href="/report"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border hover:border-border-control active:scale-95 transition"
                >
                  <FilePlus className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-ink">
                    {dict.home.raiseComplaint}
                  </span>
                </Link>
              </div>
            </div>
          </>
        )}

        <WhatsAppButton variant="fab" />
      </div>

      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-md bg-surface-raised border border-border rounded-2xl p-6">
          <form onSubmit={handleSaveAddress} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-ink">
                {dict.home.addAddressTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-soft">
                {dict.home.addAddressDesc}
              </DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="e.g. F-69, Block F"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full">
              {dict.common.save}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
