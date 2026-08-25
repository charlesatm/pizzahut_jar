import { cn } from "@/lib/utils";

export function SiteLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const width = size === "sm" ? 118 : 148;
  const height = Math.round(width * (96 / 260));
  return (
    <img
      src="/sliceshare-logo.svg"
      alt="SliceShare"
      width={width}
      height={height}
      className={cn(
        "site-wordmark",
        size === "sm" ? "site-wordmark-sm" : "site-wordmark-md",
        className,
      )}
    />
  );
}
