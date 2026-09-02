"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // One-time read of the class public/theme-boot.js already set on <html>
    // before hydration (to avoid a flash of the wrong theme) — there's no
    // external store to subscribe to, just a value to sync once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("tracksubs-theme", next ? "dark" : "light");
    } catch {
      // localStorage can be unavailable (private mode) — theme just won't persist.
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-lg border border-edge-faint flex items-center justify-center text-content-muted hover:bg-surface-hover hover:text-content transition-colors"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
