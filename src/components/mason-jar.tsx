export function MasonJar({
  className,
  variant,
  uid = "jar",
}: {
  className?: string;
  variant: "back" | "front";
  uid?: string;
}) {
  const glass = `${uid}-glass`;
  const lid = `${uid}-lid`;

  return (
    <svg className={className} viewBox="0 0 200 250" aria-hidden="true">
      {variant === "back" ? (
        <>
          <path
            d="M52 78h96l8 14v108c0 18-18 32-56 32s-56-14-56-32V92z"
            fill="var(--color-primary)"
            opacity="0.35"
          />
          <ellipse
            cx="100"
            cy="76"
            rx="52"
            ry="12"
            fill="var(--color-foreground)"
            opacity="0.4"
          />
        </>
      ) : (
        <>
          <defs>
            <linearGradient id={glass} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-card)" stopOpacity="0.2" />
              <stop
                offset="55%"
                stopColor="var(--color-primary)"
                stopOpacity="0.18"
              />
              <stop
                offset="100%"
                stopColor="var(--color-primary)"
                stopOpacity="0.32"
              />
            </linearGradient>
            <linearGradient id={lid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary-foreground)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
          <path
            d="M50 76h100l9 16v110c0 20-20 36-59 36s-59-16-59-36V92z"
            fill={`url(#${glass})`}
            stroke="var(--color-primary)"
            strokeWidth="2.2"
          />
          <path
            d="M64 96c10-6 22-8 36-8 16 0 30 3 40 10"
            fill="none"
            stroke="var(--color-card)"
            strokeOpacity="0.5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <ellipse
            cx="100"
            cy="74"
            rx="48"
            ry="9"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
          />
          <rect
            x="58"
            y="54"
            width="84"
            height="16"
            rx="3"
            fill="var(--color-primary)"
          />
          <rect x="62" y="42" width="76" height="14" rx="3" fill={`url(#${lid})`} />
          <rect
            x="78"
            y="32"
            width="44"
            height="12"
            rx="3"
            fill="var(--color-primary)"
          />
        </>
      )}
    </svg>
  );
}
