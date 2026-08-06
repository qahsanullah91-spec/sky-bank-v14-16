import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 14a5 5 0 0 1 1-9.9A6 6 0 0 1 20 8a4 4 0 0 1 0 8H6a3 3 0 0 1-2-5" />
        </svg>
      </div>
      <span className="text-lg font-semibold tracking-tight text-foreground">Sky Bank</span>
    </div>
  )
}
