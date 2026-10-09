"use client";

import React from "react";
import {
  Droplets,
  Zap,
  Trash2,
  Brush,
  Waves,
  CloudRain,
  Lamp,
  Trees,
  Wrench,
  type LucideProps,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<LucideProps>> = {
  Droplets,
  Zap,
  Trash2,
  Brush,
  Waves,
  CloudRain,
  Lamp,
  Trees,
};

export interface CategoryIconProps extends LucideProps {
  name?: string;
  fallback?: React.ComponentType<LucideProps>;
}

export function CategoryIcon({
  name,
  fallback = Wrench,
  ...props
}: CategoryIconProps) {
  const IconComponent = (name && CATEGORY_ICONS[name]) || fallback;
  return <IconComponent {...props} />;
}
