"use client";

import { useMemo, useState } from "react";
import type { Subscription } from "@/lib/types";
import SubscriptionCard from "./SubscriptionCard";
import SubscriptionModal from "./SubscriptionModal";
import { Plus, Inbox } from "lucide-react";
import { daysUntil } from "@/lib/utils";

export default function SubscriptionList({ subs }: { subs: Subscription[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);

  const sorted = useMemo(
    () =>
      [...subs].sort((a, b) => {
        if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;
        return daysUntil(a.next_renewal_date) - daysUntil(b.next_renewal_date);
      }),
    [subs],
  );

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(sub: Subscription) {
    setEditing(sub);
    setModalOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Your subscriptions</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-lg bg-accent text-accent-on font-medium text-sm px-3.5 py-2 hover:bg-accent-hover transition-colors"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((sub) => (
            <SubscriptionCard key={sub.id} sub={sub} onEdit={() => openEdit(sub)} />
          ))}
        </div>
      )}

      {modalOpen && <SubscriptionModal existing={editing} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="border border-dashed border-edge rounded-card p-10 text-center">
      <div className="h-12 w-12 rounded-full bg-accent-subtle text-accent flex items-center justify-center mx-auto mb-3">
        <Inbox size={20} />
      </div>
      <h3 className="font-medium">No subscriptions yet</h3>
      <p className="text-sm text-content-muted mt-1 max-w-sm mx-auto">
        Add your first one — Netflix, Spotify, a gym membership — and TrackSubs
        will start watching its renewal date for you.
      </p>
      <button
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent text-accent-on font-medium text-sm px-4 py-2 hover:bg-accent-hover transition-colors"
      >
        <Plus size={15} />
        Add a subscription
      </button>
    </div>
  );
}
