import { createClient } from "@/lib/supabase/server";
import type { Subscription } from "@/lib/types";
import SummaryCards from "@/components/SummaryCards";
import SubscriptionList from "@/components/SubscriptionList";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("next_renewal_date", { ascending: true });

  const subs = (data ?? []) as Subscription[];

  return (
    <div className="space-y-8">
      {error && (
        <p className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">
          Couldn&apos;t load subscriptions: {error.message}
        </p>
      )}
      <SummaryCards subs={subs} />
      <SubscriptionList subs={subs} />
    </div>
  );
}
