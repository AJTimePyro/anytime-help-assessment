"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  variant?: "fab" | "button" | "icon";
  className?: string;
}

export function WhatsAppButton({
  phone = "919000000000",
  message = "Hello, I need assistance with Anytime Help.",
  variant = "fab",
  className = "",
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  if (variant === "fab") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact support on WhatsApp"
        className={`fixed bottom-22 right-4 sm:right-[max(1.5rem,calc(50%-20rem))] z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm shadow-lg shadow-[#25D366]/35 hover:bg-[#20bd5a] hover:shadow-xl active:scale-95 transition-all duration-150 border border-white/25 select-none ${className}`}
      >
        <MessageCircle className="w-5 h-5 fill-white text-white shrink-0" />
        <span className="text-white font-bold tracking-tight">
          Help on WhatsApp
        </span>
      </a>
    );
  }

  if (variant === "icon") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className={`w-10 h-10 rounded-full bg-[#25D366]/15 text-[#075e54] dark:bg-[#25D366]/20 dark:text-[#25D366] flex items-center justify-center hover:opacity-90 transition active:scale-95 ${className}`}
      >
        <MessageCircle className="w-5 h-5 fill-current" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20bd5a] active:scale-95 transition shadow-sm ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-white text-white" />
      <span className="text-white font-bold">WhatsApp</span>
    </a>
  );
}

interface CallButtonProps {
  phone: string;
  className?: string;
  variant?: "button" | "icon";
}

export function CallButton({
  phone,
  className = "",
  variant = "button",
}: CallButtonProps) {
  const cleanPhone = phone.replace(/\s+/g, "");

  if (variant === "icon") {
    return (
      <a
        href={`tel:${cleanPhone}`}
        aria-label={`Call ${phone}`}
        className={`w-10 h-10 rounded-full bg-primary-container text-primary-ink flex items-center justify-center hover:opacity-90 transition active:scale-95 ${className}`}
      >
        <Phone className="w-4 h-4" />
      </a>
    );
  }

  return (
    <a
      href={`tel:${cleanPhone}`}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-primary-ink font-semibold text-sm hover:opacity-90 active:scale-95 transition ${className}`}
    >
      <Phone className="w-4 h-4" />
      <span>Call</span>
    </a>
  );
}
