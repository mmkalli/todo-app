export default function Loading() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading todos">
      <div className="h-12 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      ))}
    </div>
  );
}
