import { cn } from "@/lib/utils";

export function JarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <rect x="11" y="5" width="10" height="2.6" rx="0.8" fill="var(--color-background)" />
      <rect
        x="12.2"
        y="7.6"
        width="7.6"
        height="1.6"
        rx="0.4"
        fill="var(--color-background)"
      />
      <path
        fill="var(--color-background)"
        d="M10 10.2h12l-1.05 14.1A2.6 2.6 0 0 1 18.38 27h-4.76a2.6 2.6 0 0 1-2.57-2.7L10 10.2z"
      />
    </svg>
  );
}
