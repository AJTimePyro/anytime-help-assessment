"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { ResidentRecord } from "@/lib/types";
import { getInitials } from "@/lib/format";
import { TopBar } from "@/components/shell/TopBar";
import { CallButton, WhatsAppButton } from "@/components/common/CommonButtons";
import { AppCard as Card, AppInput as Input } from "@/components/designed";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Phone, X, MapPin } from "lucide-react";

export default function ResidentsPage() {
  const { residents } = useAppStore();
  const { dict } = useT();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "owned" | "rented">(
    "all",
  );
  const [activeResident, setActiveResident] = useState<ResidentRecord | null>(
    null,
  );

  const filteredResidents = residents.filter((r) => {
    if (filterType !== "all" && r.ownership !== filterType) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.house.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.block.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col relative pb-24 no-scrollbar">
      <TopBar title={dict.residents.title} />

      <div className="p-4 sm:p-5 space-y-4 animate-screen-enter flex-1">
        <Input
          isSearch
          placeholder={dict.residents.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-2">
          {(["all", "owned", "rented"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 cursor-pointer ${
                filterType === type
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface text-ink-soft border border-border hover:text-ink"
              }`}
            >
              {type === "all"
                ? dict.residents.all
                : type === "owned"
                  ? dict.residents.owned
                  : dict.residents.rented}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {filteredResidents.map((res) => (
            <Card
              key={res.id}
              onClick={() => setActiveResident(res)}
              className="flex items-center justify-between p-3.5 hover:border-border-control transition active:scale-[0.99] cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <Avatar size="default" className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-primary-container text-primary-ink font-bold text-xs">
                    {getInitials(res.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink truncate leading-tight">
                      {res.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        res.ownership === "owned"
                          ? "bg-primary-container text-primary-ink"
                          : "bg-surface-sunken text-ink-soft"
                      }`}
                    >
                      {res.ownership === "owned" ? "Owner" : "Tenant"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-soft mt-1 truncate">
                    <Home className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">
                      {res.house}, {res.block}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-1.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <WhatsAppButton
                  variant="icon"
                  phone={res.phone.replace(/\s+/g, "")}
                  message={`Hello ${res.name}, contacting regarding Anytime Help Society.`}
                />
                <CallButton phone={res.phone} variant="icon" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Drawer
        open={!!activeResident}
        onOpenChange={(open) => !open && setActiveResident(null)}
      >
        <DrawerContent className="max-w-md mx-auto bg-surface-raised border-t sm:border border-border rounded-t-[28px] sm:rounded-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
          {activeResident && (
            <>
              <DrawerHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-border">
                <div>
                  <span className="text-xs font-semibold text-ink-soft uppercase">
                    {dict.residents.details}
                  </span>
                  <DrawerTitle className="text-base font-bold text-ink">
                    {activeResident.name}
                  </DrawerTitle>
                </div>
                <DrawerClose className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer">
                  <X className="w-4 h-4" />
                </DrawerClose>
              </DrawerHeader>

              <div className="space-y-3 text-xs text-ink">
                <div className="p-3.5 rounded-2xl bg-surface-sunken flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <span className="text-[11px] text-ink-soft block">
                      Residence Address
                    </span>
                    <span className="font-bold text-sm">
                      {activeResident.house}, {activeResident.block},{" "}
                      {activeResident.society}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-sunken flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <span className="text-[11px] text-ink-soft block">
                      Contact Phone
                    </span>
                    <span className="font-bold text-sm">
                      +91 {activeResident.phone}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-sunken flex items-center justify-between">
                  <span className="font-medium text-ink-soft">
                    Ownership Status
                  </span>
                  <span className="font-bold uppercase text-primary-ink">
                    {activeResident.ownership}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <WhatsAppButton
                  variant="button"
                  phone={activeResident.phone.replace(/\s+/g, "")}
                  className="w-full"
                />
                <CallButton phone={activeResident.phone} className="w-full" />
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
