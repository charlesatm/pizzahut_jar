import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MasonJar } from "@/components/mason-jar";
import { CODE_LIFE_DAYS } from "@/lib/expiry";

const PLAY_MS = 1900;
const REDUCED_MS = 700;

export function DropIntoJar({
  code,
  discount,
  onDone,
}: {
  code: string;
  discount: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(onDone, reduce ? REDUCED_MS : PLAY_MS);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return createPortal(
    <div
      className="drop-overlay"
      onClick={onDone}
      role="status"
      aria-live="polite"
    >
      <div className="drop-stage">
        <MasonJar className="drop-jar drop-jar-back" variant="back" uid="dropb" />
        <div className="drop-slip" aria-hidden="true">
          <div className="ticket-holes" />
          <div className="px-3 pb-3 pt-2">
            <p className="font-mono text-sm font-semibold tracking-[0.16em]">
              {code}
            </p>
            <p className="mt-1 font-display text-sm">{discount}</p>
          </div>
        </div>
        <MasonJar className="drop-jar drop-jar-front" variant="front" uid="dropf" />

        <p className="drop-caption font-display text-lg font-semibold tracking-tight text-primary-foreground">
          Dropped in the jar
        </p>
        <p className="sr-only">
          {code} is in the jar. {discount}. Lasts {CODE_LIFE_DAYS} days.
        </p>
      </div>
    </div>,
    document.body,
  );
}
