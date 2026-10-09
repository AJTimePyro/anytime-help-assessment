"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/hooks";
import { APP_CONFIG } from "@/lib/config";
import { getInitials } from "@/lib/format";
import { TopBar } from "@/components/shell/TopBar";
import {
  AppCard as Card,
  AppButton as Button,
  AppInput as Input,
  AppSegmentedControl as SegmentedControl,
} from "@/components/designed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WhatsAppButton } from "@/components/common/CommonButtons";
import {
  Phone,
  MapPin,
  Sun,
  Moon,
  MessageCircle,
  Shield,
  Info,
  LogOut,
  Edit2,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, lang, setLanguage, updateProfile, logout } = useAppStore();
  const { dict } = useT();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [editName, setEditName] = useState(user?.name || "");
  const [editAddress, setEditAddress] = useState(user?.address || "");

  const isMember = user?.role === "member";

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = editName.trim() || user?.name || "Resident";
    updateProfile(finalName, editAddress.trim());
    setShowEditSheet(false);
    toast.success(dict.profile.savedProfile);
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    router.replace("/login");
  };

  return (
    <div className="flex-1 flex flex-col relative pb-28 no-scrollbar">
      <TopBar title={dict.profile.title} />

      <div className="p-4 sm:p-5 space-y-5 animate-screen-enter flex-1">
        <Card className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <Avatar
                size="lg"
                className="w-16 h-16 border-2 border-primary shadow-sm shrink-0"
              >
                <AvatarFallback className="bg-primary-container text-primary-ink font-extrabold text-xl">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold text-ink leading-tight">
                  {user?.name || "Neighbor"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-sunken text-ink-soft text-xs font-semibold">
                    {isMember ? dict.roles.member : dict.roles.resident}
                  </span>
                  {isMember && user?.memberId && (
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-primary-ink text-xs font-bold font-mono">
                      {user.memberId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEditName(user?.name || "");
                setEditAddress(user?.address || "");
                setShowEditSheet(true);
              }}
              className="p-2 rounded-xl bg-surface-sunken border border-border/60 text-ink hover:bg-surface-raised hover:border-border-control transition active:scale-95"
              aria-label="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 pt-3 border-t border-border text-xs text-ink-soft">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>+91 {user?.phone || "90000 00010"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="text-ink font-medium">
                {user?.address || "No address added yet"}
              </span>
            </div>
          </div>
        </Card>

        {mounted && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              {dict.profile.appearance}
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition select-none ${
                  theme === "light"
                    ? "bg-primary-container border-primary text-primary-ink font-bold shadow-xs"
                    : "bg-surface border-border text-ink"
                }`}
              >
                <div
                  data-theme="light"
                  className="w-full h-11 rounded-lg bg-bg border border-border p-1.5 flex flex-col justify-between"
                >
                  <div className="w-3/4 h-2 bg-primary rounded-xs" />
                  <div className="w-1/2 h-1.5 bg-surface-sunken rounded-xs" />
                </div>
                <span className="text-xs font-semibold">
                  {dict.profile.themeLight}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition select-none ${
                  theme === "dark"
                    ? "bg-primary-container border-primary text-primary-ink font-bold shadow-xs"
                    : "bg-surface border-border text-ink"
                }`}
              >
                <div
                  data-theme="dark"
                  className="w-full h-11 rounded-lg bg-bg border border-border p-1.5 flex flex-col justify-between"
                >
                  <div className="w-3/4 h-2 bg-primary rounded-xs" />
                  <div className="w-1/2 h-1.5 bg-surface-sunken rounded-xs" />
                </div>
                <span className="text-xs font-semibold">
                  {dict.profile.themeDark}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition select-none ${
                  theme === "system"
                    ? "bg-primary-container border-primary text-primary-ink font-bold shadow-xs"
                    : "bg-surface border-border text-ink"
                }`}
              >
                <div className="w-full h-11 rounded-lg overflow-hidden border border-border flex">
                  <div
                    data-theme="light"
                    className="w-1/2 h-full bg-bg p-1 flex items-center justify-center"
                  >
                    <Sun className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div
                    data-theme="dark"
                    className="w-1/2 h-full bg-bg p-1 flex items-center justify-center"
                  >
                    <Moon className="w-3.5 h-3.5 text-primary-ink" />
                  </div>
                </div>
                <span className="text-xs font-semibold">
                  {dict.profile.themeSystem}
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            {dict.profile.language}
          </h3>
          <SegmentedControl
            value={lang}
            onChange={(val) => setLanguage(val as any)}
            options={[
              { value: "en", label: "English" },
              { value: "hi", label: "हिन्दी" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            {dict.profile.support}
          </h3>
          <Card className="p-0 overflow-hidden divide-y divide-border">
            <a
              href={`https://wa.me/${APP_CONFIG.supportWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 hover:bg-surface-sunken transition text-ink"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-whatsapp" />
                <span className="text-xs font-semibold">
                  {dict.profile.helpWhatsApp}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-ink-soft" />
            </a>

            <button
              type="button"
              onClick={() =>
                setShowInfoSheet({
                  title: dict.profile.privacyPolicy,
                  content:
                    "Anytime Help respects your privacy. All grievance information and member notices are stored locally in the prototype browser session.",
                })
              }
              className="w-full flex items-center justify-between p-3.5 hover:bg-surface-sunken transition text-ink text-left"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">
                  {dict.profile.privacyPolicy}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-soft" />
            </button>

            <button
              type="button"
              onClick={() =>
                setShowInfoSheet({
                  title: dict.profile.aboutUs,
                  content:
                    "Anytime Help Society grievance tracking and community notices portal for Sushant Lok 2 & 3, Gurugram. Designed for high accessibility and reliability.",
                })
              }
              className="w-full flex items-center justify-between p-3.5 hover:bg-surface-sunken transition text-ink text-left"
            >
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">
                  {dict.profile.aboutUs}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-soft" />
            </button>
          </Card>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-danger-container text-danger-on hover:opacity-90 active:scale-98 transition text-xs font-bold flex items-center justify-center gap-2 border border-danger-solid/20"
          >
            <LogOut className="w-4 h-4" />
            <span>{dict.profile.logout}</span>
          </button>
        </div>
      </div>

      <WhatsAppButton variant="fab" />

      <Drawer open={showEditSheet} onOpenChange={setShowEditSheet}>
        <DrawerContent className="max-w-md mx-auto bg-surface-raised border-t sm:border border-border rounded-t-[28px] sm:rounded-2xl p-5 space-y-4 shadow-2xl animate-screen-enter">
          <DrawerHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-border">
            <DrawerTitle className="text-base font-bold text-ink">
              {dict.profile.editProfile}
            </DrawerTitle>
            <DrawerClose className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer">
              <X className="w-4 h-4" />
            </DrawerClose>
          </DrawerHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-3">
              <Input
                label={dict.profile.nameLabel}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <Input
                label={dict.profile.phoneLabel}
                value={`+91 ${user?.phone}`}
                disabled
              />

              <Input
                label={dict.profile.addressLabel}
                placeholder="e.g. F-69, Block F"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
              />
            </div>

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

      <Drawer
        open={!!showInfoSheet}
        onOpenChange={(open) => !open && setShowInfoSheet(null)}
      >
        <DrawerContent className="max-w-md mx-auto bg-surface-raised border-t sm:border border-border rounded-t-[28px] sm:rounded-2xl p-6 space-y-4 shadow-2xl animate-screen-enter">
          {showInfoSheet && (
            <>
              <DrawerHeader className="p-0 pb-2 flex flex-row items-center justify-between">
                <DrawerTitle className="text-base font-bold text-ink">
                  {showInfoSheet.title}
                </DrawerTitle>
                <DrawerClose className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer">
                  <X className="w-4 h-4" />
                </DrawerClose>
              </DrawerHeader>
              <p className="text-xs text-ink-soft leading-relaxed">
                {showInfoSheet.content}
              </p>
              <Button
                onClick={() => setShowInfoSheet(null)}
                variant="secondary"
                className="w-full"
              >
                {dict.common.close}
              </Button>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-md bg-surface-raised border border-border rounded-2xl p-6 text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-ink text-center">
              {dict.profile.logoutConfirm}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              {dict.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutConfirm(false);
                handleLogout();
              }}
            >
              {dict.profile.logout}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
