import { Lang } from "./types";

const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTHS_HI = [
  "जनवरी",
  "फ़रवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

export function getInitials(name?: string, fallback = "AH"): string {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatDate(isoDate: string, lang: Lang = "en"): string {
  const d = new Date(isoDate);
  const monthStr =
    lang === "hi" ? MONTHS_HI[d.getMonth()] : MONTHS_EN[d.getMonth()];
  return `${d.getDate()} ${monthStr}`;
}

export function formatRelativeTime(
  isoDate: string,
  lang: Lang = "en",
  nowTime: number = Date.now(),
): string {
  const then = new Date(isoDate).getTime();
  const diffSec = Math.floor((nowTime - then) / 1000);

  if (diffSec < 60) {
    return lang === "hi" ? "अभी" : "Just now";
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return lang === "hi" ? `${diffMin} मिनट पहले` : `${diffMin}m ago`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return lang === "hi" ? `${diffHour} घंटे पहले` : `${diffHour} h ago`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) {
    return lang === "hi" ? "कल" : "Yesterday";
  }

  if (diffDay < 7) {
    return lang === "hi" ? `${diffDay} दिन पहले` : `${diffDay} d ago`;
  }

  return formatDate(isoDate, lang);
}

export function formatDateTime(isoDate: string, lang: Lang = "en"): string {
  const dateStr = formatDate(isoDate, lang);
  const d = new Date(isoDate);

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm =
    hours >= 12
      ? lang === "hi"
        ? "दोपहर/शाम"
        : "PM"
      : lang === "hi"
        ? "सुबह"
        : "AM";
  hours = hours % 12 || 12;

  return `${dateStr}, ${hours}:${minutes} ${ampm}`;
}
