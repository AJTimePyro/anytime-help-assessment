"use client";

import { useAppStore } from "../store";
import { en } from "./en";
import { hi } from "./hi";

function interpolate(
  text: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return text;
  let result = text;
  for (const [key, val] of Object.entries(params)) {
    result = result.replaceAll(`{${key}}`, String(val));
  }
  return result;
}

export function useT() {
  const lang = useAppStore((state) => state.lang);
  const dict = lang === "hi" ? hi : en;

  return { dict, lang, t: interpolate };
}
