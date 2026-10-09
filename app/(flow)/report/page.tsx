"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n/useT";
import { useAppStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed/categories";
import { Category, SubCategory } from "@/lib/types";
import { TopBar } from "@/components/shell/TopBar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { X, ChevronRight } from "lucide-react";

function ReportCategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict, lang } = useT();
  const { setDraft } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [showSubSheet, setShowSubSheet] = useState(false);

  useEffect(() => {
    const catParam = searchParams.get("cat");
    if (catParam) {
      const found = CATEGORIES.find((c) => c.id === catParam);
      if (found) {
        handleCategoryClick(found);
      }
    }
  }, [searchParams]);

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    if (cat.subs.length === 1) {
      setDraft({
        categoryId: cat.id,
        subId: cat.subs[0].id,
        commonArea: cat.defaultCommonArea,
      });
      router.push("/report/details");
    } else {
      setShowSubSheet(true);
    }
  };

  const handleSelectSub = (sub: SubCategory) => {
    if (!selectedCategory) return;
    setDraft({
      categoryId: selectedCategory.id,
      subId: sub.id,
      commonArea: selectedCategory.defaultCommonArea,
    });
    setShowSubSheet(false);
    router.push("/report/details");
  };

  return (
    <div className="flex-1 flex flex-col relative pb-8 no-scrollbar">
      <TopBar title={dict.report.step1Title} showBack backHref="/home" />

      <div className="p-4 sm:p-5 space-y-4 animate-screen-enter flex-1">
        <div className="space-y-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-ink">
            {dict.report.step1Subtitle}
          </span>
          <h2 className="text-xl font-bold text-ink">
            {dict.home.whatNeedsFixing}
          </h2>
          <p className="text-xs text-ink-soft">
            {dict.home.tapCategoryToRaise}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-start p-4 rounded-2xl bg-surface border border-border hover:border-primary hover:bg-primary-container/20 active:scale-[0.98] transition group text-left select-none shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center transition-transform group-hover:scale-105 mb-3">
                <CategoryIcon
                  name={cat.icon}
                  className="w-7 h-7"
                  strokeWidth={2}
                />
              </div>
              <h3 className="font-bold text-sm text-ink leading-tight">
                {cat.name[lang]}
              </h3>
              <span className="text-[11px] font-medium text-ink-soft mt-1">
                {cat.subs.length} {cat.subs.length === 1 ? "type" : "types"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Drawer
        open={showSubSheet && !!selectedCategory}
        onOpenChange={setShowSubSheet}
      >
        <DrawerContent className="max-w-md mx-auto bg-surface-raised border-t sm:border border-border rounded-t-[28px] sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
          {selectedCategory && (
            <>
              <DrawerHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-border">
                <div>
                  <span className="text-[11px] font-bold text-primary-ink uppercase">
                    {selectedCategory.name[lang]}
                  </span>
                  <DrawerTitle className="text-base font-bold text-ink">
                    Pick the problem
                  </DrawerTitle>
                </div>
                <DrawerClose className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center text-ink-soft hover:text-ink cursor-pointer">
                  <X className="w-4 h-4" />
                </DrawerClose>
              </DrawerHeader>

              <div className="space-y-2 pt-1">
                {selectedCategory.subs.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectSub(sub)}
                    className="w-full min-h-14 px-4 py-3 rounded-2xl bg-surface border border-border hover:border-primary hover:bg-primary-container/30 active:scale-[0.98] transition text-left flex items-center justify-between select-none cursor-pointer"
                  >
                    <span className="text-[15px] font-semibold text-ink">
                      {sub.name[lang]}
                    </span>
                    <ChevronRight className="w-5 h-5 text-ink-soft shrink-0" />
                  </button>
                ))}
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ReportCategoryContent />
    </Suspense>
  );
}
