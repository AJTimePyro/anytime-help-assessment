"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useMounted } from "@/lib/hooks";

export function HeaderControls() {
  const { lang, setLanguage } = useAppStore();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  if (!mounted) {
    return <div className="h-9 w-20" />;
  }

  return (
    <div className="flex items-center gap-2 select-none">
      <button
        onClick={() => setLanguage(lang === "en" ? "hi" : "en")}
        aria-label="Toggle language English or Hindi"
        className="flex items-center px-2.5 py-1.5 rounded-full bg-surface-sunken border border-border text-xs font-bold text-ink hover:bg-surface-raised hover:border-border-control transition active:scale-95"
      >
        <span className={lang === "en" ? "text-primary-ink" : "text-ink-soft"}>
          EN
        </span>
        <span className="mx-1 text-border-control">|</span>
        <span className={lang === "hi" ? "text-primary-ink" : "text-ink-soft"}>
          हिं
        </span>
      </button>

      <button
        onClick={cycleTheme}
        aria-label="Cycle theme light dark system"
        className="w-9 h-9 rounded-full bg-surface-sunken border border-border flex items-center justify-center text-ink-soft hover:text-ink hover:bg-surface-raised hover:border-border-control transition active:scale-95"
      >
        {theme === "light" ? (
          <Sun className="w-4 h-4 text-pending-solid" />
        ) : theme === "dark" ? (
          <Moon className="w-4 h-4 text-primary-ink" />
        ) : (
          <Laptop className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
