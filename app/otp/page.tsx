"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/useT";
import { useAppStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { AppOTPInput, AppButton } from "@/components/designed";
import { HeaderControls } from "@/components/common/HeaderControls";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function OTPPage() {
  const router = useRouter();
  const { dict, t } = useT();
  const login = useAppStore((state) => state.login);

  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<Role>("resident");
  const [phone, setPhone] = useState("9000000010");
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("ah-pending-login");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.role) setRole(parsed.role);
          if (parsed.phone) setPhone(parsed.phone);
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    login(role, phone);
    toast.success("Verification successful!");
    router.replace("/home");
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp("");
    toast.info("A new verification code was sent.");
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto no-scrollbar animate-screen-enter">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-sunken border border-border/60 flex items-center justify-center text-ink hover:bg-surface-raised hover:border-border-control transition active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <HeaderControls />
      </div>

      <div className="flex flex-col items-center text-center my-auto space-y-6 max-w-sm mx-auto w-full">
        <div className="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {dict.auth.enterOtp}
          </h1>
          <p className="text-sm text-ink-soft leading-snug">
            {t(dict.auth.otpSentTo, { phone: `+91 ${phone}` })}
          </p>
        </div>

        <div className="w-full space-y-3">
          <AppOTPInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (val.length === 6) {
                login(role, phone);
                toast.success("Verification successful!");
                router.replace("/home");
              }
            }}
          />
        </div>

        <AppButton
          onClick={() => handleVerify()}
          variant="primary"
          size="large"
          className="w-full"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {dict.auth.verify}
        </AppButton>

        <div className="text-xs text-ink-soft">
          {resendTimer > 0 ? (
            <span>{t(dict.auth.resendIn, { s: resendTimer })}</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary-ink font-semibold hover:underline"
            >
              {dict.auth.resendNow}
            </button>
          )}
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}
