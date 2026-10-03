"use client";

export default function TodosError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-4 p-10 text-center">
      <p className="text-[1.0625rem] font-medium">Something went wrong loading your todos.</p>
      <button type="button" onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
