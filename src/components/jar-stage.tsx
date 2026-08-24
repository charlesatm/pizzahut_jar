import { useEffect, useState } from "react";
import { CodeTicket } from "@/components/code-ticket";
import type { PromoCode } from "@/lib/codes";
import { useDropStore, type IncomingDrop } from "@/lib/drop-store";
import { cn } from "@/lib/utils";

const PULL_MS = 1100;
const DROP_MS = 1700;

export function JarStage({
  codes,
  error,
}: {
  codes: PromoCode[];
  error?: boolean;
}) {
  const [phase, setPhase] = useState<"jar" | "pulling" | "ticket">("jar");
  const [pulled, setPulled] = useState<PromoCode | null>(null);
  const [cursor, setCursor] = useState(0);
  const [shake, setShake] = useState(false);
  const [pop, setPop] = useState(0);
  const [dropSlip, setDropSlip] = useState<IncomingDrop | null>(null);

  const incoming = useDropStore((s) => s.incoming);
  const clearIncoming = useDropStore((s) => s.clear);

  useEffect(() => {
    if (pulled && !codes.some((c) => c.id === pulled.id && c.status === "open")) {
      setPulled(null);
      setPhase("jar");
    }
  }, [codes, pulled]);

  useEffect(() => {
    if (!incoming) return;
    setPhase("jar");
    setPulled(null);
    setDropSlip(incoming);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      clearIncoming();
      setDropSlip(null);
      return;
    }
    const t = window.setTimeout(() => {
      clearIncoming();
      setDropSlip(null);
    }, DROP_MS);
    return () => window.clearTimeout(t);
  }, [incoming, clearIncoming]);

  const dropping = Boolean(dropSlip);

  function reachIn() {
    if (phase !== "jar" || dropping) return;
    if (!codes.length) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    const next = codes[cursor % codes.length];
    if (!next) return;
    setPulled(next);
    setCursor((c) => (c + 1) % codes.length);
    setPop((n) => n + 1);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("ticket");
      return;
    }
    setPhase("pulling");
    window.setTimeout(() => setPhase("ticket"), PULL_MS);
  }

  function backToJar() {
    setPhase("jar");
    setPulled(null);
  }

  const caption = dropping
    ? "In the jar"
    : !codes.length
      ? "Empty"
      : "Tap";

  if (phase === "ticket" && pulled && !dropping) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 sm:py-12">
        <div key={`${pulled.id}-${pop}`} className="drawn-ticket w-full max-w-md">
          <CodeTicket code={pulled} />
        </div>
        <button
          type="button"
          onClick={backToJar}
          className="min-h-11 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-6 sm:py-8">
      <button
        type="button"
        onClick={reachIn}
        disabled={phase === "pulling" || dropping}
        className={cn(
          "reach-jar",
          shake && "is-shaking",
          phase === "pulling" && "is-pulling",
          dropping && "is-dropping",
        )}
        aria-label={
          dropping
            ? `${dropSlip?.code} dropped in the jar`
            : codes.length
              ? `Reach into the jar. ${codes.length} open codes, soonest expiry first.`
              : "The jar is empty. Drop a code."
        }
      >
        <span className="reach-stage">
          <img
            src="/jar-full.png"
            alt=""
            width={580}
            height={1220}
            draggable={false}
            className="reach-photo"
          />
          {dropping && dropSlip ? (
            <span className="home-drop-slip" aria-hidden="true">
              <span className="ticket-holes" />
              <span className="block px-3 pb-3 pt-2">
                <span className="block font-mono text-sm font-semibold tracking-[0.16em]">
                  {dropSlip.code}
                </span>
                <span className="mt-1 block font-display text-sm">
                  {dropSlip.discount}
                </span>
              </span>
            </span>
          ) : null}
          {phase === "pulling" && pulled ? (
            <span className="pull-slip" aria-hidden="true">
              <span className="ticket-holes" />
              <span className="block px-3 pb-3 pt-2">
                <span className="block font-mono text-sm font-semibold tracking-[0.16em]">
                  {pulled.code}
                </span>
                <span className="mt-1 block font-display text-sm">
                  {pulled.discount}
                </span>
              </span>
            </span>
          ) : null}
        </span>
        <span className="mt-3 block text-sm text-muted-foreground">
          {phase === "pulling" ? "…" : caption}
        </span>
        {error ? (
          <span className="mt-1 block text-sm text-muted-foreground">
            Could not load the jar. Tap to try, or refresh.
          </span>
        ) : null}
      </button>
    </div>
  );
}
