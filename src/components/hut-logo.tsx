import { cn } from "@/lib/utils";

export function HutLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const width = size === "sm" ? 54 : 104;
  const height = Math.round(width * (149.24 / 187.086));
  return (
    <img
      src="/pizza-hut-logo.svg"
      alt="Pizza Hut"
      width={width}
      height={height}
      className={cn(
        "hut-wordmark",
        size === "sm" ? "hut-wordmark-sm" : "hut-wordmark-md",
        className,
      )}
    />
  );
}
