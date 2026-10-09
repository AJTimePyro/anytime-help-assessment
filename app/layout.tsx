import type { Metadata, Viewport } from "next";
import { Mukta } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anytime Help — Housing Society Grievance & Notice App",
  description:
    "Grievance redressal, maintenance tracking, and official announcements for Anytime Help Society.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", mukta.variable)}
    >
      <body className="antialiased font-sans bg-bg text-ink min-h-screen">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="ah-theme"
        >
          <div className="min-h-screen w-full flex justify-center bg-bg">
            <div className="w-full max-w-2xl min-h-screen flex flex-col bg-bg relative">
              {children}
            </div>
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--surface-raised)",
                color: "var(--ink)",
                borderColor: "var(--border)",
                borderRadius: "16px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
