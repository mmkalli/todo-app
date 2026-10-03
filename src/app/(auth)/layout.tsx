export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white">✓</span>
          Todo
        </div>
        <div className="card p-6">{children}</div>
      </div>
    </main>
  );
}
