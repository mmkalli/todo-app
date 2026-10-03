import { CheckIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex flex-1 items-center justify-center px-4 py-10">
      <div className="absolute right-3 top-3 sm:right-5 sm:top-5">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight">
          <span className="grid size-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <CheckIcon className="size-6" />
          </span>
          Todo
        </div>
        <div className="card p-6 shadow-sm sm:p-8">{children}</div>
      </div>
    </main>
  );
}
