import { Layers, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { signOut } from "@/app/dashboard/actions";

export default function Navbar({ email }: { email: string | undefined }) {
  return (
    <header className="border-b border-edge-faint bg-surface-card/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center">
            <Layers size={16} className="text-accent-on" />
          </div>
          <span className="font-semibold tracking-tight">TrackSubs</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-content-muted">{email}</span>
          <ThemeToggle />
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sign out"
              className="h-9 w-9 rounded-lg border border-edge-faint flex items-center justify-center text-content-muted hover:bg-surface-hover hover:text-content transition-colors"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
