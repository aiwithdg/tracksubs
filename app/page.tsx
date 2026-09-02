import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Layers, CalendarClock, PiggyBank, ShieldCheck } from "lucide-react";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center">
            <Layers size={16} className="text-accent-on" />
          </div>
          <span className="font-semibold tracking-tight">TrackSubs</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium rounded-lg px-4 py-2 bg-accent text-accent-on hover:bg-accent-hover transition-colors"
        >
          Sign in
        </Link>
      </header>

      <section className="flex-1 flex items-center">
        <div className="max-w-5xl w-full mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-rise-in">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
              Every subscription.
              <br />
              One place. No surprises.
            </h1>
            <p className="mt-5 text-content-muted text-lg max-w-md">
              TrackSubs keeps tabs on what you pay, when it renews, and what it
              adds up to — so nothing quietly charges your card again.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent text-accent-on font-medium px-5 py-3 hover:bg-accent-hover transition-colors"
            >
              Get started — it&apos;s free
            </Link>
          </div>

          <div className="grid gap-4">
            <FeatureCard
              icon={<PiggyBank size={18} />}
              title="Know your true monthly cost"
              body="Every plan, normalized to monthly and yearly totals — no more mental math across weekly, quarterly, and annual charges."
            />
            <FeatureCard
              icon={<CalendarClock size={18} />}
              title="See what's renewing next"
              body="A sorted view of upcoming renewals so you can cancel — or budget — before the charge hits."
            />
            <FeatureCard
              icon={<ShieldCheck size={18} />}
              title="Private by default"
              body="Your data is yours alone, protected by row-level security in Supabase — no one else can read it."
            />
          </div>
        </div>
      </section>

      <footer className="max-w-5xl w-full mx-auto px-6 py-8 text-sm text-content-faint">
        Built with Next.js, Supabase &amp; Tailwind. Deployed on Vercel.
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-surface-card border border-edge-faint rounded-card shadow-card p-5 animate-rise-in">
      <div className="h-9 w-9 rounded-lg bg-accent-subtle text-accent flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-content-muted mt-1">{body}</p>
    </div>
  );
}
