import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CodeCard } from "@/components/code-card";
import { PizzaHero } from "@/components/pizza-hero";
import { ShareBar } from "@/components/share-bar";
import { listCodes } from "@/lib/codes";

export const Route = createFileRoute("/")({
  loader: async () => {
    const codes = await listCodes({ data: { view: "all", sort: "recent" } });
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
    queryKey: ["codes", "all", "recent"],
    queryFn: () => listCodes({ data: { view: "all", sort: "recent" } }),
    enabled: live,
    placeholderData: initial.codes,
  });

  const recent = (codesQuery.data ?? []).slice(0, 8);

  return (
    <AppShell>
      <div className="home-layout">
        <h1 className="sr-only">Share Pizza Hut loyalty and GES promo codes</h1>
        <PizzaHero pulse={pulse} className="home-pizza" />
        <div className="share-wrap">
          <ShareBar onShared={() => setPulse((n) => n + 1)} />
          <p className="share-support-note">
            <Info aria-hidden="true" />
            Currently supports Pizza Hut Sri Lanka promo codes only.
          </p>
        </div>

        <section className="recent-section">
          <h2 className="section-label">Recently shared codes</h2>
          {recent.length === 0 ? (
            <p className="empty-copy">None yet. Share the first one.</p>
          ) : (
            <div className="recent-grid codes-grid">
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
