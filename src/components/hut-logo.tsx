import { cn } from "@/lib/utils";

export function HutLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const px = size === "sm" ? 40 : 96;
  return (
    <img
      src="/logo.jpg"
      alt="Pizza Hut"
      width={px}
      height={px}
      className={cn(
        "rounded-full object-cover shadow-[0_0_0_2px_rgba(228,0,43,0.35)]",
        size === "sm" ? "size-10" : "size-24",
        className,
      )}
    />
  );
}
