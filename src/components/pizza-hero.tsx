import { lazy, Suspense, useEffect, useState } from "react";
import { PizzaPlaceholder } from "@/components/pizza-placeholder";
import { cn } from "@/lib/utils";

const PizzaScene = lazy(() => import("@/components/pizza-scene"));

if (typeof window !== "undefined") {
  void import("@/components/pizza-scene");
}

export function PizzaHero({ pulse = 0, className }: { pulse?: number; className?: string }) {
  const [live, setLive] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setLive(true);
  }, []);

  return (
    <div className={cn("pizza-hero relative w-full", className)}>
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          shown ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <PizzaPlaceholder />
      </div>
      {live ? (
        <Suspense fallback={null}>
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              shown ? "opacity-100" : "opacity-0",
            )}
          >
            <PizzaScene pulse={pulse} onReady={() => setShown(true)} />
          </div>
        </Suspense>
      ) : null}
    </div>
  );
}
