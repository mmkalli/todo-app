"use client";

export default function TodosError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-4 p-8 text-center">
      <p className="font-medium">Something went wrong loading your todos.</p>
      <button type="button" onClick={reset} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">
        Try again
      </button>
    </div>
  );
}
