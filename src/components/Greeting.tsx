"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

function greetingFor(hour: number) {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// A string snapshot so useSyncExternalStore can compare it; time depends on
// the viewer's clock, so it's only computed in the browser.
function snapshot() {
  const now = new Date();
  const date = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  return `${greetingFor(now.getHours())}|${date}`;
}

export function Greeting({ name }: { name: string }) {
  const value = useSyncExternalStore(noopSubscribe, snapshot, () => null);
  const [greeting, date] = value ? value.split("|") : ["Hello", null];
  // Show the first name, or the part of an email before the @.
  const first = name.split("@")[0].split(/[\s._-]+/)[0];
  const shown = first ? first.charAt(0).toUpperCase() + first.slice(1) : "";

  return (
    <div className="mb-5 sm:mb-6">
      <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl">
        {greeting}
        {shown && `, ${shown}`}
      </h1>
      <p className="mt-1 min-h-6 text-muted">{date}</p>
    </div>
  );
}
