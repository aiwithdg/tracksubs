/*
 * Pre-paint theme boot — avoids a flash of the wrong theme.
 * Loaded as a render-blocking classic script in <head>, before Tailwind's
 * .dark-scoped styles apply, so it must run synchronously and never throw.
 */
(function () {
  try {
    var stored = localStorage.getItem("tracksubs-theme");
    var dark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    /* never block boot */
  }
})();
