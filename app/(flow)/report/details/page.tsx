"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/useT";
import { useAppStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed/categories";
import { TopBar } from "@/components/shell/TopBar";
import {
  AppButton as Button,
  AppInput as Input,
  AppTextarea as Textarea,
} from "@/components/designed";
import { Switch } from "@/components/ui/switch";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

export default function ReportDetailsPage() {
  const router = useRouter();
  const { dict, lang } = useT();
  const { user, draft, addComplaint } = useAppStore();

  const [description, setDescription] = useState(draft.description || "");
  const [photos, setPhotos] = useState<string[]>(draft.photos || []);
  const [commonArea, setCommonArea] = useState(draft.commonArea ?? false);
  const [location, setLocation] = useState(
    draft.location || (commonArea ? "" : user?.address || ""),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = CATEGORIES.find((c) => c.id === draft.categoryId);
  const sub = category?.subs.find((s) => s.id === draft.subId);

  // If navigated without draft category, redirect to step 1
  useEffect(() => {
    if (!draft.categoryId) {
      router.replace("/report");
    }
  }, [draft.categoryId, router]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 3) {
      toast.error("You can add at most 3 photos.");
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Resize to max 800px JPEG 0.7
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setPhotos((prev) => [...prev, dataUrl]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalDescription =
      description.trim() ||
      sub?.name[lang] ||
      category?.name[lang] ||
      "Maintenance issue reported";
    const finalLocation =
      location.trim() ||
      (commonArea ? "Society Common Area" : user?.address || "Flat A-101");

    const newComp = addComplaint({
      categoryId: draft.categoryId!,
      subId: draft.subId!,
      description: finalDescription,
      photos,
      location: finalLocation,
      commonArea,
    });

    sessionStorage.setItem("ah-just-created-id", newComp.id);
    router.replace("/report/success");
  };

  if (!category) return null;

  return (
    <div className="flex-1 flex flex-col relative pb-28 no-scrollbar">
      <TopBar title={dict.report.step2Title} showBack backHref="/report" />

      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-5 space-y-6 animate-screen-enter flex-1"
      >
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-ink">
            {dict.report.step2Subtitle}
          </span>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-primary-container text-on-primary-container">
            <div className="flex flex-col">
              <span className="text-xs font-semibold opacity-80">
                {category.name[lang]}
              </span>
              <span className="text-sm font-bold">
                {sub?.name[lang] || category.name[lang]}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={() => router.push("/report")}
              className="text-xs font-bold text-primary-ink bg-surface px-3 py-1.5 h-auto min-h-0 rounded-xl shadow-xs"
            >
              Change
            </Button>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-ink">
              {dict.report.photosTitle}
            </label>
            <span className="text-xs text-ink-soft">{photos.length}/3</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {photos.length < 3 && (
              <label className="w-22 h-22 rounded-2xl border-2 border-dashed border-border-control bg-surface-sunken hover:bg-surface-raised hover:border-primary transition flex flex-col items-center justify-center text-ink-soft hover:text-ink cursor-pointer shrink-0 select-none active:scale-95">
                <Camera className="w-6 h-6 mb-1 text-primary" />
                <span className="text-[11px] font-bold">Add photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}

            {photos.map((url, idx) => (
              <div
                key={idx}
                className="w-22 h-22 rounded-2xl border border-border overflow-hidden shrink-0 relative group shadow-xs"
              >
                <img
                  src={url}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover filter-(--img-filter)"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center active:scale-95 transition hover:bg-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Textarea
            label={dict.report.whatHappened}
            placeholder={dict.report.whatHappenedPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-border">
          <label className="text-sm font-bold text-ink block">
            {dict.report.whereIsIt}
          </label>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-sunken border border-border">
            <div className="space-y-0.5 pr-2">
              <span className="text-sm font-semibold text-ink block">
                {dict.report.commonAreaSwitch}
              </span>
              <span className="text-xs text-ink-soft block leading-tight">
                {dict.report.commonAreaDesc}
              </span>
            </div>

            <Switch
              checked={commonArea}
              onCheckedChange={(checked) => {
                setCommonArea(checked);
                if (!checked && user?.address) {
                  setLocation(user.address);
                } else if (checked && location === user?.address) {
                  setLocation("");
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={
                commonArea
                  ? dict.report.commonLocationPlaceholder
                  : dict.report.flatLocationPlaceholder
              }
            />
          </div>
        </div>

        <div className="sticky bottom-0 -mx-4 sm:-mx-5 -mb-5 p-4 bg-surface-raised border-t border-border z-20 mt-auto">
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full shadow-md"
            isLoading={isSubmitting}
          >
            {isSubmitting ? dict.report.submitting : dict.report.submitButton}
          </Button>
        </div>
      </form>
    </div>
  );
}
