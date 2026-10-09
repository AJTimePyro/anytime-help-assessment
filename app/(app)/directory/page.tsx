"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { getInitials } from "@/lib/format";
import { TopBar } from "@/components/shell/TopBar";
import { CallButton, WhatsAppButton } from "@/components/common/CommonButtons";
import { AppCard as Card, AppInput as Input } from "@/components/designed";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldAlert, Building2 } from "lucide-react";

export default function DirectoryPage() {
  const { contacts } = useAppStore();
  const { dict } = useT();
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
  });

  const officeContacts = filteredContacts.filter((c) => c.type === "office");
  const emergencyContacts = filteredContacts.filter(
    (c) => c.type === "emergency",
  );

  return (
    <div className="flex-1 flex flex-col relative pb-24 no-scrollbar">
      <TopBar title={dict.directory.title} />

      <div className="p-4 sm:p-5 space-y-6 animate-screen-enter flex-1">
        <Input
          isSearch
          placeholder={dict.directory.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {officeContacts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              {dict.directory.officeGroup}
            </h2>

            <div className="space-y-2.5">
              {officeContacts.map((contact) => (
                <Card
                  key={contact.id}
                  className="flex items-center justify-between p-3.5 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar size="default" className="w-11 h-11 shrink-0">
                      <AvatarFallback className="bg-primary-container text-primary-ink font-bold text-sm">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-ink truncate leading-tight">
                        {contact.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-surface-sunken text-ink-soft text-[11px] font-semibold mt-0.5 truncate">
                        {contact.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <WhatsAppButton
                      variant="icon"
                      phone={contact.phone.replace(/\s+/g, "")}
                      message={`Hello ${contact.name}, contacting regarding Anytime Help Society.`}
                    />
                    <CallButton phone={contact.phone} variant="icon" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {emergencyContacts.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-danger-solid flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              {dict.directory.emergencyGroup}
            </h2>

            <div className="space-y-2.5">
              {emergencyContacts.map((contact) => (
                <Card
                  key={contact.id}
                  variant="alert"
                  className="flex items-center justify-between p-3.5 shadow-xs bg-surface border border-danger-solid/30 text-ink"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar size="default" className="w-11 h-11 shrink-0">
                      <AvatarFallback className="bg-danger-container text-danger-on font-bold text-base">
                        🚨
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-bold text-ink">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-ink-soft font-medium">
                        {contact.role} • Dial {contact.phone}
                      </span>
                    </div>
                  </div>

                  <CallButton phone={contact.phone} variant="button" />
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
