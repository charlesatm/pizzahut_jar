import { lazy, Suspense, useEffect, useState } from "react";
import { Rotate3D } from "lucide-react";
import { cn } from "@/lib/utils";

const PizzaScene = lazy(() => import("@/components/pizza-scene"));

if (typeof window !== "undefined") {
  void import("@/components/pizza-scene");
}

export function PizzaHero({ pulse = 0, className }: { pulse?: number; className?: string }) {
  const [live, setLive] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setLive(true);
  }, []);

  return (
    <div
      className={cn("pizza-hero relative w-full", className)}
      data-dragging={dragging ? "true" : "false"}
    >
      {live ? (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <PizzaScene pulse={pulse} onDraggingChange={setDragging} />
          </div>
        </Suspense>
      ) : null}
      <div className="pizza-interaction-hint" aria-hidden="true">
        <Rotate3D size={14} strokeWidth={1.8} />
        <span className="pizza-hint-pointer">Drag to rotate</span>
        <span className="pizza-hint-touch">Swipe to rotate</span>
      </div>
    </div>
  );
}
