import type { Subscription } from "@/lib/types";
import { monthlyCost, yearlyCost, formatCurrency, daysUntil } from "@/lib/utils";
import { Wallet, CalendarClock, ListChecks } from "lucide-react";

export default function SummaryCards({ subs }: { subs: Subscription[] }) {
  const active = subs.filter((s) => s.is_active);
  const currency = active[0]?.currency ?? "USD";

  const monthlyTotal = active.reduce((sum, s) => sum + monthlyCost(s), 0);
  const yearlyTotal = active.reduce((sum, s) => sum + yearlyCost(s), 0);
  const dueSoon = active.filter((s) => {
    const d = daysUntil(s.next_renewal_date);
    return d >= 0 && d <= 7;
  }).length;

  const cards = [
    {
      icon: <Wallet size={18} />,
      label: "Monthly spend",
      value: formatCurrency(monthlyTotal, currency),
      sub: `${formatCurrency(yearlyTotal, currency)} / year`,
    },
    {
      icon: <CalendarClock size={18} />,
      label: "Renewing this week",
      value: String(dueSoon),
      sub: dueSoon === 1 ? "subscription" : "subscriptions",
    },
    {
      icon: <ListChecks size={18} />,
      label: "Active subscriptions",
      value: String(active.length),
      sub: `${subs.length - active.length} paused`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-surface-card border border-edge-faint rounded-card shadow-card p-5 animate-rise-in"
        >
          <div className="flex items-center gap-2 text-content-muted text-sm mb-2">
            <span className="text-accent">{c.icon}</span>
            {c.label}
          </div>
          <div className="text-2xl font-semibold tracking-tight">{c.value}</div>
          <div className="text-xs text-content-faint mt-1">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
