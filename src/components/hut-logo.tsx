import { cn } from "@/lib/utils";

export function HutLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const px = size === "sm" ? 38 : 80;
  return (
    <img
      src="/logo.jpg"
      alt="Pizza Hut"
      width={px}
      height={px}
      className={cn("brand-mark object-cover", size === "sm" ? "size-10" : "size-20", className)}
    />
  );
}
