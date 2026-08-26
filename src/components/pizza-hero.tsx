import { lazy, Suspense, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PizzaScene = lazy(() => import("@/components/pizza-scene"));

if (typeof window !== "undefined") {
  void import("@/components/pizza-scene");
}

export function PizzaHero({ pulse = 0, className }: { pulse?: number; className?: string }) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
  }, []);

  return (
    <div className={cn("pizza-hero relative w-full", className)}>
      {live ? (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <PizzaScene pulse={pulse} />
          </div>
        </Suspense>
      ) : null}
    </div>
  );
}
