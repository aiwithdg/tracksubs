"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/types";
import { formatCurrency, formatRelativeDate, monthlyCost, daysUntil } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
import { renewSubscription, toggleActive } from "@/app/dashboard/actions";
import { CheckCircle2, PauseCircle, PlayCircle, ExternalLink } from "lucide-react";

export default function SubscriptionCard({
  sub,
  onEdit,
}: {
  sub: Subscription;
  onEdit: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const overdue = daysUntil(sub.next_renewal_date) < 0;
  const dueSoon = !overdue && daysUntil(sub.next_renewal_date) <= 3;

  async function handleRenew(e: React.MouseEvent) {
    e.stopPropagation();
    setBusy(true);
    try {
      await renewSubscription(sub.id, sub.next_renewal_date, sub.billing_cycle, sub.custom_interval_days);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setBusy(true);
    try {
      await toggleActive(sub.id, !sub.is_active);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onClick={onEdit}
      className={`group cursor-pointer bg-surface-card border border-edge-faint rounded-card shadow-card p-4 sm:p-5 animate-rise-in transition-opacity ${
        sub.is_active ? "" : "opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{sub.name}</h3>
            {sub.vendor_url && (
              <a
                href={sub.vendor_url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-content-faint hover:text-accent"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
          <div className="mt-1.5">
            <CategoryBadge category={sub.category} />
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold">{formatCurrency(sub.cost, sub.currency)}</div>
          <div className="text-xs text-content-faint capitalize">{sub.billing_cycle}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span
          className={
            overdue
              ? "text-danger font-medium"
              : dueSoon
                ? "text-warning font-medium"
                : "text-content-muted"
          }
        >
          Renews {formatRelativeDate(sub.next_renewal_date)}
        </span>
        <span className="text-content-faint">
          ≈ {formatCurrency(monthlyCost(sub), sub.currency)}/mo
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-edge-faint">
        <button
          onClick={handleRenew}
          disabled={busy || !sub.is_active}
          className="flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-success hover:bg-success-soft rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-40"
        >
          <CheckCircle2 size={13} />
          Mark renewed
        </button>
        <button
          onClick={handleToggle}
          disabled={busy}
          className="flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:bg-surface-hover rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-40"
        >
          {sub.is_active ? <PauseCircle size={13} /> : <PlayCircle size={13} />}
          {sub.is_active ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}
