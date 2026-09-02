import { CATEGORY_TONE, type Category } from "@/lib/types";

const TONE_CLASSES: Record<string, string> = {
  accent: "bg-accent-subtle text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  danger: "bg-danger-soft text-danger",
};

export default function CategoryBadge({ category }: { category: Category }) {
  const tone = CATEGORY_TONE[category] ?? "accent";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {category}
    </span>
  );
}
