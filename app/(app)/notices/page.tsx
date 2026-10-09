"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { Notice } from "@/lib/types";
import { formatRelativeTime, formatDateTime } from "@/lib/format";
import { TopBar } from "@/components/shell/TopBar";
import {
  AppButton as Button,
  AppInput as Input,
  AppTextarea as Textarea,
  EmptyState,
} from "@/components/designed";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Bell, Pin, Plus, X, Calendar, User } from "lucide-react";
import { toast } from "sonner";

export default function NoticesPage() {
  const { user, notices, lastSeen, markLastSeen, addNotice } = useAppStore();
  const { dict, lang } = useT();

  const isMember = user?.role === "member";

  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);
  const [showPostSheet, setShowPostSheet] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("General");
  const [important, setImportant] = useState(false);
  const [audience, setAudience] = useState<"all" | "residents" | "members">(
    "all",
  );

  const visibleNotices = notices.filter((n) => {
    if (isMember) return true;
    return n.audience === "all" || n.audience === "residents";
  });

  const sortedNotices = [...visibleNotices].sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleOpenNotice = (n: Notice) => {
    markLastSeen(n.id);
    setActiveNotice(n);
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || "Society Notice Announcement";
    const finalBody =
      body.trim() || "Please refer to RWA office for further information.";

    addNotice({
      title: finalTitle,
      body: finalBody,
      topic,
      important,
      audience,
      byName: user?.name || "Committee Member",
    });

    setShowPostSheet(false);
    setTitle("");
    setBody("");
    setImportant(false);
    toast.success(dict.notices.postedSuccess);
  };

  return (
    <div className="flex-1 flex flex-col relative pb-24 no-scrollbar">
      <TopBar title={dict.notices.title} />

      <div className="p-4 sm:p-5 space-y-4 animate-screen-enter flex-1">
        {sortedNotices.length > 0 ? (
          <div className="space-y-3">
            {sortedNotices.map((notice) => {
              const seenAt = lastSeen[notice.id];
              const isUnread =
                !seenAt ||
                new Date(notice.createdAt).getTime() >
                  new Date(seenAt).getTime();

              return (
                <div
                  key={notice.id}
                  onClick={() => handleOpenNotice(notice)}
                  className={`p-4 rounded-2xl bg-surface border transition cursor-pointer active:scale-[0.99] select-none shadow-xs ${
                    notice.important
                      ? "border-l-4 border-l-danger-solid border-border"
                      : "border-border hover:border-border-control"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-surface-sunken text-ink-soft font-bold text-[11px]">
                        {notice.topic}
                      </span>
                      {notice.important && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger-container text-danger-on text-[10px] font-bold">
                          <Pin className="w-3 h-3 fill-current" />
                          Important
                        </span>
                      )}
                      {isMember && (
                        <span className="px-2 py-0.5 rounded-full bg-primary-container text-primary-ink text-[10px] font-bold">
                          {notice.audience === "all"
                            ? "All"
                            : notice.audience === "residents"
                              ? "Residents"
                              : "Members"}
                        </span>
                      )}
                    </div>

                    {isUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse" />
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-ink mt-2 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-ink-soft mt-1 line-clamp-2 leading-relaxed">
                    {notice.body}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-ink-soft mt-3 pt-2 border-t border-border">
                    <span className="font-medium truncate max-w-45">
                      {notice.byName}
                    </span>
                    <span>{formatRelativeTime(notice.createdAt, lang)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-auto py-12">
            <EmptyState
              icon={<Bell />}
              title={dict.notices.emptyTitle}
              description={dict.notices.emptyDesc}
            />
          </div>
        )}
      </div>

      {isMember && (
        <button
          onClick={() => setShowPostSheet(true)}
          className="fixed bottom-20 right-4 sm:right-[max(1.5rem,calc(50%-20rem))] z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-on-primary font-bold text-sm shadow-float active:scale-95 transition-all duration-150 hover:opacity-95"
        >
          <Plus className="w-5 h-5" />
          <span>{dict.notices.newNotice}</span>
        </button>
      )}

      <Drawer
        open={!!activeNotice}
        onOpenChange={(open) => !open && setActiveNotice(null)}
      >
        <DrawerContent className="max-w-md mx-auto bg-surface-raised border-t sm:border border-border rounded-t-[28px] sm:rounded-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
          {activeNotice && (
            <>
              <DrawerHeader className="p-0 pb-3 flex flex-row items-start justify-between gap-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-primary-container text-primary-ink text-xs font-bold">
                      {activeNotice.topic}
                    </span>
                    {activeNotice.important && (
                      <span className="px-2 py-0.5 rounded-full bg-danger-container text-danger-on text-xs font-bold">
                        Important Alert
                      </span>
                    )}
                  </div>
                  <DrawerTitle className="text-base font-bold text-ink leading-snug">
                    {activeNotice.title}
                  </DrawerTitle>
                </div>
                <DrawerClose className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-ink-soft hover:text-ink shrink-0 cursor-pointer">
                  <X className="w-4 h-4" />
                </DrawerClose>
              </DrawerHeader>

              <p className="text-sm text-ink leading-relaxed whitespace-pre-line">
                {activeNotice.body}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-border text-xs text-ink-soft">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>
                    {dict.notices.postedBy}:{" "}
                    <strong className="text-ink">{activeNotice.byName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formatDateTime(activeNotice.createdAt, lang)}</span>
                </div>
              </div>

              <Button
                onClick={() => setActiveNotice(null)}
                variant="secondary"
                className="w-full"
              >
                {dict.common.close}
              </Button>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <Drawer open={showPostSheet} onOpenChange={setShowPostSheet}>
        <DrawerContent className="max-w-md mx-auto bg-surface-raised border-t sm:border border-border rounded-t-[28px] sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
          <DrawerHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-border">
            <DrawerTitle className="text-base font-bold text-ink">
              {dict.notices.postNotice}
            </DrawerTitle>
            <DrawerClose className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer">
              <X className="w-4 h-4" />
            </DrawerClose>
          </DrawerHeader>

          <form onSubmit={handlePostNotice} className="space-y-4">
            <div className="space-y-3">
              <Input
                label={`${dict.notices.noticeTitle} *`}
                placeholder="e.g. Water tank cleaning schedule"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                label={dict.notices.noticeBody}
                rows={4}
                maxLength={500}
                placeholder="Full announcement description..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink block">
                    {dict.notices.selectTopic}
                  </label>
                  <Select
                    value={topic}
                    onValueChange={(val) => val && setTopic(val)}
                  >
                    <SelectTrigger className="w-full min-h-11 rounded-xl bg-surface-sunken border-border-control text-xs text-ink">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Water">Water</SelectItem>
                      <SelectItem value="Electricity">Electricity</SelectItem>
                      <SelectItem value="Garbage">Garbage</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink block">
                    {dict.notices.sendTo}
                  </label>
                  <Select
                    value={audience}
                    onValueChange={(val) => val && setAudience(val as any)}
                  >
                    <SelectTrigger className="w-full min-h-11 rounded-xl bg-surface-sunken border-border-control text-xs text-ink">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Society</SelectItem>
                      <SelectItem value="residents">Residents Only</SelectItem>
                      <SelectItem value="members">Committee Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-sunken border border-border cursor-pointer select-none">
                <Checkbox
                  checked={important}
                  onCheckedChange={(checked) => setImportant(checked === true)}
                />
                <span className="text-xs font-semibold text-ink">
                  {dict.notices.markImportant}
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
            >
              {dict.notices.postNotice}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
