export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly" | "custom";

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom (days)" },
];

export type Category =
  | "Streaming"
  | "Software"
  | "Music"
  | "Gaming"
  | "Cloud & Storage"
  | "Fitness"
  | "News & Media"
  | "Finance"
  | "Utilities"
  | "Other";

export const CATEGORIES: Category[] = [
  "Streaming",
  "Software",
  "Music",
  "Gaming",
  "Cloud & Storage",
  "Fitness",
  "News & Media",
  "Finance",
  "Utilities",
  "Other",
];

// Each category gets one of the semantic status colors so the dashboard reads
// as a small, consistent palette rather than one color per subscription.
export const CATEGORY_TONE: Record<Category, "accent" | "success" | "warning" | "info" | "danger"> = {
  Streaming: "danger",
  Software: "accent",
  Music: "warning",
  Gaming: "info",
  "Cloud & Storage": "accent",
  Fitness: "success",
  "News & Media": "info",
  Finance: "success",
  Utilities: "warning",
  Other: "accent",
};

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  category: Category;
  cost: number;
  currency: string;
  billing_cycle: BillingCycle;
  custom_interval_days: number | null;
  next_renewal_date: string; // ISO date (YYYY-MM-DD)
  start_date: string | null;
  vendor_url: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SubscriptionInput = Pick<
  Subscription,
  | "name"
  | "category"
  | "cost"
  | "currency"
  | "billing_cycle"
  | "custom_interval_days"
  | "next_renewal_date"
  | "start_date"
  | "vendor_url"
  | "notes"
>;
