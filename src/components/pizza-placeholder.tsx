export function PizzaPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <svg
        viewBox="0 0 280 220"
        className="h-[min(46vh,22rem)] w-auto max-w-[22rem] pizza-float"
      >
        <ellipse cx="148" cy="168" rx="78" ry="14" fill="#000" opacity="0.28" />
        <path
          d="M48 148 L140 36 L236 152 Q140 176 48 148 Z"
          fill="#c47a32"
        />
        <path
          d="M64 142 L140 52 L220 146 Q140 166 64 142 Z"
          fill="#f0c14a"
        />
        <circle cx="118" cy="108" r="14" fill="#9b1c1c" />
        <circle cx="158" cy="96" r="13" fill="#9b1c1c" />
        <circle cx="146" cy="128" r="12" fill="#9b1c1c" />
        <circle cx="176" cy="124" r="11" fill="#9b1c1c" />
        <rect
          x="128"
          y="88"
          width="28"
          height="8"
          rx="2"
          fill="#3f7d4e"
          transform="rotate(-28 142 92)"
        />
      </svg>
    </div>
  );
}
