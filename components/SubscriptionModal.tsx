"use client";

import { useState } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import { CATEGORIES, BILLING_CYCLES, type Subscription, type SubscriptionInput, type BillingCycle, type Category } from "@/lib/types";
import { addSubscription, updateSubscription, deleteSubscription } from "@/app/dashboard/actions";
import { todayIso } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"];

const EMPTY: SubscriptionInput = {
  name: "",
  category: "Other",
  cost: 0,
  currency: "USD",
  billing_cycle: "monthly",
  custom_interval_days: null,
  next_renewal_date: todayIso(),
  start_date: null,
  vendor_url: null,
  notes: null,
};

export default function SubscriptionModal({
  existing,
  onClose,
}: {
  existing: Subscription | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<SubscriptionInput>(
    existing
      ? {
          name: existing.name,
          category: existing.category,
          cost: existing.cost,
          currency: existing.currency,
          billing_cycle: existing.billing_cycle,
          custom_interval_days: existing.custom_interval_days,
          next_renewal_date: existing.next_renewal_date,
          start_date: existing.start_date,
          vendor_url: existing.vendor_url,
          notes: existing.notes,
        }
      : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof SubscriptionInput>(key: K, value: SubscriptionInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (existing) {
        await updateSubscription(existing.id, form);
      } else {
        await addSubscription(form);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    if (!confirm(`Delete ${existing.name}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteSubscription(existing.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-surface-card rounded-t-2xl sm:rounded-card border border-edge-faint shadow-popover p-6 max-h-[90vh] overflow-y-auto animate-rise-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{existing ? "Edit subscription" : "Add subscription"}</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Netflix"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Cost">
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={form.cost}
                onChange={(e) => set("cost", parseFloat(e.target.value) || 0)}
                className="input"
              />
            </Field>
            <Field label="Currency">
              <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className="input">
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Billing cycle">
              <select
                value={form.billing_cycle}
                onChange={(e) => set("billing_cycle", e.target.value as BillingCycle)}
                className="input"
              >
                {BILLING_CYCLES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            {form.billing_cycle === "custom" ? (
              <Field label="Every N days">
                <input
                  type="number"
                  min={1}
                  value={form.custom_interval_days ?? ""}
                  onChange={(e) => set("custom_interval_days", parseInt(e.target.value) || null)}
                  className="input"
                />
              </Field>
            ) : (
              <Field label="Category">
                <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} className="input">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>

          {form.billing_cycle === "custom" && (
            <Field label="Category">
              <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Next renewal date">
            <input
              required
              type="date"
              value={form.next_renewal_date}
              onChange={(e) => set("next_renewal_date", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Vendor URL (optional)">
            <input
              type="url"
              value={form.vendor_url ?? ""}
              onChange={(e) => set("vendor_url", e.target.value || null)}
              placeholder="https://netflix.com/account"
              className="input"
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value || null)}
              rows={2}
              className="input resize-none"
            />
          </Field>

          {error && <p className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            {existing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 text-sm text-danger hover:bg-danger-soft rounded-lg px-3 py-2 transition-colors disabled:opacity-60"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="ml-auto flex items-center gap-2 rounded-lg bg-accent text-accent-on font-medium text-sm px-5 py-2.5 hover:bg-accent-hover transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {existing ? "Save changes" : "Add subscription"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--border-primary);
          background: var(--bg-input);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          box-shadow: 0 0 0 2px var(--accent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-content-secondary">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
