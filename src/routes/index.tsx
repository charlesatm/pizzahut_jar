import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CodeCard } from "@/components/code-card";
import { PizzaHero } from "@/components/pizza-hero";
import { ShareBar } from "@/components/share-bar";
import { listCodes } from "@/lib/codes";

export const Route = createFileRoute("/")({
  loader: async () => {
    const codes = await listCodes({ data: { sort: "recent" } });
    return { codes };
  },
  staleTime: 0,
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const [live, setLive] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    setLive(true);
  }, []);

  const codesQuery = useQuery({
    queryKey: ["codes", "open", "recent"],
    queryFn: () => listCodes({ data: { view: "open", sort: "recent" } }),
    enabled: live,
    placeholderData: initial.codes,
  });

  const recent = (codesQuery.data ?? []).slice(0, 8);

  return (
    <AppShell>
      <div className="flex min-h-0 flex-1 flex-col">
        <PizzaHero pulse={pulse} className="min-h-[42vh] flex-1" />
        <div className="shrink-0">
          <ShareBar onShared={() => setPulse((n) => n + 1)} />
        </div>

        <section className="mt-8 shrink-0">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Recently shared codes
          </h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              None yet. Share the first one.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {recent.map((code) => (
                <CodeCard key={code.id} code={code} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
