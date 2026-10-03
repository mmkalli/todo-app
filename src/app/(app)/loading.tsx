export default function Loading() {
  return (
    <div className="flex flex-col gap-4 sm:gap-5" aria-busy="true" aria-label="Loading todos">
      <div className="mb-1 flex flex-col gap-2">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-subtle" />
        <div className="h-5 w-40 animate-pulse rounded-lg bg-subtle" />
      </div>
      <div className="h-20 animate-pulse rounded-2xl bg-subtle" />
      <div className="h-12 animate-pulse rounded-2xl bg-subtle sm:w-2/3" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-subtle" />
      ))}
    </div>
  );
}
