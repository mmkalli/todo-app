"use client";

import { currentTheme, setTheme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";

/**
 * Switches between light and dark. Which icon shows is decided by CSS
 * (the dark: variant), so it's correct on first paint without any state.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={() => setTheme(currentTheme() === "dark" ? "light" : "dark")}
      className="icon-btn"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <MoonIcon className="size-5 dark:hidden" />
      <SunIcon className="hidden size-5 dark:block" />
    </button>
  );
}
