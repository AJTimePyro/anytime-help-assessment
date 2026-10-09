"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Plus, Bell, User, Users } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";

export function BottomNav() {
  const pathname = usePathname();
  const { user, complaints, notices, lastSeen } = useAppStore();
  const { lang } = useT();

  const isMember = user?.role === "member";

  // Calculate unread complaints count (updated by others since last seen)
  const unreadComplaintsCount = complaints.filter((c) => {
    const seenAt = lastSeen[c.id];
    if (!seenAt) return true;
    return new Date(c.updatedAt).getTime() > new Date(seenAt).getTime();
  }).length;

  const unreadNoticesCount = notices.filter((n) => {
    const seenAt = lastSeen[n.id];
    if (!seenAt) return true;
    return new Date(n.createdAt).getTime() > new Date(seenAt).getTime();
  }).length;

  const navItems = [
    {
      label: "Home",
      hindiLabel: "होम",
      href: "/home",
      icon: Home,
      badge: 0,
    },
    {
      label: "Complaints",
      hindiLabel: "शिकायतें",
      href: "/complaints",
      icon: FileText,
      badge: unreadComplaintsCount,
    },
    {
      label: "Raise",
      hindiLabel: "शिकायत",
      href: "/report",
      icon: Plus,
      isCenter: true,
      badge: 0,
    },
    {
      label: isMember ? "Residents" : "Notices",
      hindiLabel: isMember ? "निवासी" : "सूचनाएं",
      href: isMember ? "/residents" : "/notices",
      icon: isMember ? Users : Bell,
      badge: isMember ? 0 : unreadNoticesCount,
    },
    {
      label: "Profile",
      hindiLabel: "प्रोफ़ाइल",
      href: "/profile",
      icon: User,
      badge: 0,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="w-full shrink-0 bg-surface-raised border-t border-border px-2 py-1.5 flex items-center justify-around z-30 select-none shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
    >
      {navItems.map((item) => {
        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label="Raise Complaint"
              className="-mt-5 group flex flex-col items-center focus:outline-none"
            >
              <div className="w-13 h-13 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/25 border-4 border-surface-raised group-active:scale-95 transition-transform duration-150">
                <Plus className="w-7 h-7" strokeWidth={2.6} />
              </div>
              <span className="text-[11px] font-bold text-ink mt-0.5">
                {lang === "hi" ? item.hindiLabel : item.label}
              </span>
            </Link>
          );
        }

        const isActive =
          pathname === item.href ||
          (item.href !== "/home" && pathname?.startsWith(item.href));

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-14 py-1 px-1.5 rounded-xl transition-all duration-150 active:scale-95 ${
              isActive ? "text-primary-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            <div
              className={`relative flex items-center justify-center px-3 py-1 rounded-full transition-colors ${
                isActive ? "bg-primary-container" : "bg-transparent"
              }`}
            >
              <Icon
                className="w-5 h-5 transition-transform"
                strokeWidth={isActive ? 2.3 : 1.8}
              />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-danger-solid text-on-solid text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] mt-0.5 tracking-tight font-medium ${
                isActive ? "font-bold text-primary-ink" : "text-ink-soft"
              }`}
            >
              {lang === "hi" ? item.hindiLabel : item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
