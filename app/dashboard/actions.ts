"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SubscriptionInput } from "@/lib/types";
import { advanceRenewalDate } from "@/lib/utils";

export async function addSubscription(input: SubscriptionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("subscriptions")
    .insert({ ...input, user_id: user.id });
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function updateSubscription(id: string, input: SubscriptionInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("subscriptions").update(input).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function toggleActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("subscriptions")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

/** Marks a subscription as paid for its current cycle and rolls the renewal date forward. */
export async function renewSubscription(
  id: string,
  next_renewal_date: string,
  billing_cycle: SubscriptionInput["billing_cycle"],
  custom_interval_days: number | null,
) {
  const supabase = await createClient();
  const newDate = advanceRenewalDate(next_renewal_date, { billing_cycle, custom_interval_days });
  const { error } = await supabase
    .from("subscriptions")
    .update({ next_renewal_date: newDate })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
