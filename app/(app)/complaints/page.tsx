"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { Status } from "@/lib/types";
import { CATEGORIES } from "@/lib/seed/categories";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import {
  AppSegmentedControl as SegmentedControl,
  AppButton,
  AppInput,
  EmptyState,
  Skeleton,
} from "@/components/designed";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { TopBar } from "@/components/shell/TopBar";
import { Search, Filter, X, FileText, SlidersHorizontal } from "lucide-react";

function ComplaintsListContent() {
  const searchParams = useSearchParams();
  const { user, complaints } = useAppStore();
  const { dict, lang } = useT();

  const isMember = user?.role === "member";

  const initialStatus = searchParams.get("status") as Status | null;

  const [scope, setScope] = useState<"all" | "mine">("all");
  const [activeStatus, setActiveStatus] = useState<Status | "all">(
    initialStatus || "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "waiting">(
    "newest",
  );

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        // Residents only see own complaints; members can toggle scope
        if (!isMember || scope === "mine") {
          if (c.reporterId !== user?.id && c.reporterName !== user?.name) {
            return false;
          }
        }

        if (activeStatus !== "all" && c.status !== activeStatus) {
          return false;
        }

        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(c.categoryId)
        ) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const cat = CATEGORIES.find((cat) => cat.id === c.categoryId);
          const sub = cat?.subs.find((s) => s.id === c.subId);
          const title = sub ? sub.name[lang].toLowerCase() : "";
          const desc = c.description.toLowerCase();
          const id = c.id.toLowerCase();
          const loc = c.location.toLowerCase();
          const rep = c.reporterName.toLowerCase();
          const flat = c.reporterFlat.toLowerCase();

          if (
            !title.includes(q) &&
            !desc.includes(q) &&
            !id.includes(q) &&
            !loc.includes(q) &&
            !rep.includes(q) &&
            !flat.includes(q)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (
          sortBy === "oldest" ||
          (activeStatus === "pending" && sortBy === "newest")
        ) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        if (sortBy === "waiting") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
  }, [
    complaints,
    isMember,
    user,
    scope,
    activeStatus,
    selectedCategories,
    searchQuery,
    sortBy,
    lang,
  ]);

  const counts = useMemo(() => {
    let all = 0;
    let pending = 0;
    let in_progress = 0;
    let resolved = 0;

    for (const c of complaints) {
      if (!isMember || scope === "mine") {
        if (c.reporterId !== user?.id && c.reporterName !== user?.name)
          continue;
      }
      all++;
      if (c.status === "pending") pending++;
      else if (c.status === "in_progress") in_progress++;
      else if (c.status === "resolved") resolved++;
    }

    return { all, pending, in_progress, resolved };
  }, [complaints, isMember, scope, user]);

  return (
    <div className="flex-1 flex flex-col relative pb-6 no-scrollbar">
      <TopBar title={dict.complaints.title} />

      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col animate-screen-enter">
        <div className="flex items-center justify-between gap-2">
          {showSearch ? (
            <div className="relative flex-1 flex items-center">
              <AppInput
                autoFocus
                isSearch
                placeholder={dict.complaints.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-h-10 text-xs pr-10"
              />
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
                className="absolute right-3 w-6 h-6 rounded-full flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold text-ink-soft">
                {filteredComplaints.length}{" "}
                {filteredComplaints.length === 1 ? "complaint" : "complaints"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSearch(true)}
                  aria-label="Search complaints"
                  className="w-9 h-9 rounded-full bg-surface-sunken border border-border/70 flex items-center justify-center text-ink hover:bg-surface-raised hover:border-border-control transition active:scale-95"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowFilterSheet(true)}
                  aria-label="Filter complaints"
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition active:scale-95 ${
                    selectedCategories.length > 0
                      ? "bg-primary-container text-primary-ink border-primary font-bold hover:bg-primary-container/80"
                      : "bg-surface-sunken border border-border/70 text-ink hover:bg-surface-raised hover:border-border-control"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {isMember && (
          <SegmentedControl
            size="small"
            value={scope}
            onChange={(val) => setScope(val as "all" | "mine")}
            options={[
              { value: "all", label: "All Society" },
              { value: "mine", label: "My Complaints" },
            ]}
          />
        )}

        <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-bg/95 backdrop-blur-xs flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-border/60">
          <button
            onClick={() => setActiveStatus("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition active:scale-95 ${
              activeStatus === "all"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface text-ink-soft border border-border/60 hover:text-ink hover:border-border shadow-2xs"
            }`}
          >
            All {counts.all}
          </button>

          <button
            onClick={() => setActiveStatus("pending")}
            className={`flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition active:scale-95 ${
              activeStatus === "pending"
                ? "bg-pending-solid text-on-solid shadow-xs"
                : "bg-surface text-ink-soft border border-border/60 hover:text-ink hover:border-border shadow-2xs"
            }`}
          >
            {activeStatus !== "pending" && (
              <span className="w-1.5 h-1.5 rounded-full bg-pending-solid inline-block mr-1.5" />
            )}
            Pending {counts.pending}
          </button>

          <button
            onClick={() => setActiveStatus("in_progress")}
            className={`flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition active:scale-95 ${
              activeStatus === "in_progress"
                ? "bg-inprogress-solid text-on-solid shadow-xs"
                : "bg-surface text-ink-soft border border-border/60 hover:text-ink hover:border-border shadow-2xs"
            }`}
          >
            {activeStatus !== "in_progress" && (
              <span className="w-1.5 h-1.5 rounded-full bg-inprogress-solid inline-block mr-1.5" />
            )}
            In Progress {counts.in_progress}
          </button>

          <button
            onClick={() => setActiveStatus("resolved")}
            className={`flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition active:scale-95 ${
              activeStatus === "resolved"
                ? "bg-resolved-solid text-on-solid shadow-xs"
                : "bg-surface text-ink-soft border border-border/60 hover:text-ink hover:border-border shadow-2xs"
            }`}
          >
            {activeStatus !== "resolved" && (
              <span className="w-1.5 h-1.5 rounded-full bg-resolved-solid inline-block mr-1.5" />
            )}
            Resolved {counts.resolved}
          </button>
        </div>

        {filteredComplaints.length > 0 ? (
          <div className="space-y-3 pt-1">
            {filteredComplaints.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                showStartWork={isMember}
              />
            ))}
          </div>
        ) : (
          <div className="my-auto py-12">
            {searchQuery || selectedCategories.length > 0 ? (
              <EmptyState
                icon={<SlidersHorizontal />}
                title={dict.complaints.noMatchTitle}
                description={dict.complaints.noMatchDesc}
                actionLabel={dict.complaints.clearFilters}
                onAction={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setActiveStatus("all");
                }}
              />
            ) : (
              <EmptyState
                icon={<FileText />}
                title={dict.complaints.emptyTitle}
                description={dict.complaints.emptyDesc}
                actionLabel={dict.home.raiseComplaint}
                onAction={() => (window.location.href = "/report")}
              />
            )}
          </div>
        )}
      </div>

      <Drawer open={showFilterSheet} onOpenChange={setShowFilterSheet}>
        <DrawerContent className="max-w-md mx-auto bg-surface-raised border-t sm:border border-border rounded-t-[28px] sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
          <DrawerHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-border">
            <DrawerTitle className="text-base font-bold text-ink">
              {dict.complaints.filterTitle}
            </DrawerTitle>
            <DrawerClose className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer">
              <X className="w-4 h-4" />
            </DrawerClose>
          </DrawerHeader>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              {dict.complaints.sortBy}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSortBy("newest")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  sortBy === "newest"
                    ? "bg-primary-container text-primary-ink border-primary"
                    : "bg-surface text-ink border border-border"
                }`}
              >
                {dict.complaints.newestFirst}
              </button>
              <button
                type="button"
                onClick={() => setSortBy("oldest")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  sortBy === "oldest"
                    ? "bg-primary-container text-primary-ink border-primary"
                    : "bg-surface text-ink border border-border"
                }`}
              >
                {dict.complaints.oldestFirst}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              {dict.complaints.categories}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const isChecked = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (isChecked) {
                        setSelectedCategories(
                          selectedCategories.filter((id) => id !== cat.id),
                        );
                      } else {
                        setSelectedCategories([...selectedCategories, cat.id]);
                      }
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition cursor-pointer ${
                      isChecked
                        ? "bg-primary-container text-primary-ink border-primary"
                        : "bg-surface text-ink border border-border"
                    }`}
                  >
                    <span className="truncate">{cat.name[lang]}</span>
                    {isChecked && <span className="font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <AppButton
              type="button"
              variant="outline"
              size="default"
              onClick={() => {
                setSelectedCategories([]);
                setSortBy("newest");
              }}
              className="py-2.5 px-4"
            >
              Reset
            </AppButton>
            <AppButton
              type="button"
              variant="primary"
              size="default"
              onClick={() => setShowFilterSheet(false)}
              className="flex-1 py-2.5 px-4"
            >
              {dict.complaints.applyFilters}
            </AppButton>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function ComplaintsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-5 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      }
    >
      <ComplaintsListContent />
    </Suspense>
  );
}
