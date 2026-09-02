import type { BillingCycle, Subscription } from "./types";

const CYCLE_DAYS: Record<BillingCycle, number> = {
  weekly: 7,
  monthly: 30.44,
  quarterly: 91.31,
  yearly: 365.25,
  custom: 30, // overridden by custom_interval_days when present
};

/** Average days between charges, used to normalize cost to a common cadence. */
export function cycleDays(sub: Pick<Subscription, "billing_cycle" | "custom_interval_days">) {
  if (sub.billing_cycle === "custom") {
    return sub.custom_interval_days && sub.custom_interval_days > 0
      ? sub.custom_interval_days
      : CYCLE_DAYS.custom;
  }
  return CYCLE_DAYS[sub.billing_cycle];
}

export function monthlyCost(sub: Pick<Subscription, "cost" | "billing_cycle" | "custom_interval_days">) {
  return (sub.cost / cycleDays(sub)) * 30.44;
}

export function yearlyCost(sub: Pick<Subscription, "cost" | "billing_cycle" | "custom_interval_days">) {
  return (sub.cost / cycleDays(sub)) * 365.25;
}

export function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function daysUntil(isoDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function formatRelativeDate(isoDate: string) {
  const diff = daysUntil(isoDate);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < 0) return `${Math.abs(diff)} days overdue`;
  if (diff <= 30) return `in ${diff} days`;
  return new Date(isoDate + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Advances a renewal date by one billing cycle, preserving day-of-month where possible. */
export function advanceRenewalDate(
  isoDate: string,
  sub: Pick<Subscription, "billing_cycle" | "custom_interval_days">,
) {
  const date = new Date(isoDate + "T00:00:00");
  switch (sub.billing_cycle) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    case "custom":
      date.setDate(date.getDate() + (sub.custom_interval_days || 30));
      break;
  }
  return date.toISOString().slice(0, 10);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
