"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/useT";
import { useAppStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { BrandLogo } from "@/components/common/BrandLogo";
import { HeaderControls } from "@/components/common/HeaderControls";
import {
  AppSegmentedControl as SegmentedControl,
  AppInput as Input,
  AppButton as Button,
} from "@/components/designed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { dict } = useT();
  const login = useAppStore((state) => state.login);

  const [role, setRole] = useState<Role>("resident");
  const [phone, setPhone] = useState("");
  const [showRegisterSheet, setShowRegisterSheet] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhone =
      phone.trim() || (role === "member" ? "9876543210" : "9876543211");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "ah-pending-login",
        JSON.stringify({ role, phone: finalPhone }),
      );
    }
    router.push("/otp");
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto no-scrollbar animate-screen-enter">
      <div className="flex items-center justify-end w-full">
        <HeaderControls />
      </div>

      <div className="flex flex-col items-center text-center my-auto space-y-6 max-w-sm mx-auto w-full">
        <BrandLogo size="lg" showText={false} />

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {dict.auth.welcomeBack}
          </h1>
          <p className="text-sm text-ink-soft leading-snug">
            {dict.auth.subGreeting}
          </p>
        </div>

        <div className="w-full space-y-2">
          <SegmentedControl
            value={role}
            onChange={(val) => setRole(val as Role)}
            options={[
              { value: "resident", label: dict.roles.resident },
              { value: "member", label: dict.roles.member },
            ]}
          />
          <p className="text-xs text-ink-soft font-medium">
            {role === "resident"
              ? dict.auth.residentTabDesc
              : dict.auth.memberTabDesc}
          </p>
        </div>

        <form onSubmit={handleGetOtp} className="w-full space-y-4">
          <Input
            isPhone
            type="text"
            placeholder={dict.auth.phonePlaceholder}
            value={phone}
            onChange={handlePhoneChange}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
          >
            {dict.auth.getOtp}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setShowRegisterSheet(true)}
          className="text-xs text-primary-ink font-semibold hover:underline"
        >
          {dict.auth.newHere}
        </button>
      </div>

      <Dialog open={showRegisterSheet} onOpenChange={setShowRegisterSheet}>
        <DialogContent className="sm:max-w-md bg-surface-raised border border-border rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-ink">
              New Registration
            </DialogTitle>
            <DialogDescription className="text-sm text-ink-soft">
              {dict.auth.registerNotice}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <Button
              onClick={() => {
                setShowRegisterSheet(false);
                login("resident", "9876543210");
                toast.success("Welcome!");
                router.replace("/home");
              }}
              variant="primary"
              className="w-full"
            >
              Continue as Resident
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
