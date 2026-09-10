import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CodeCard } from "@/components/code-card";
import { PizzaHero } from "@/components/pizza-hero";
import { ShareBar } from "@/components/share-bar";
import { listCodes } from "@/lib/codes";

type RecentFilter = "all" | "open" | "claimed" | "invalid" | "expired";

const RECENT_FILTERS: Array<{ value: RecentFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "open", label: "Unused" },
  { value: "claimed", label: "Used" },
  { value: "invalid", label: "Not good" },
  { value: "expired", label: "Expired" },
];

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
  const [recentFilter, setRecentFilter] = useState<RecentFilter>("all");

  useEffect(() => {
    setLive(true);
  }, []);

  const codesQuery = useQuery({
    queryKey: ["codes", "all", "recent"],
    queryFn: () => listCodes({ data: { view: "all", sort: "recent" } }),
    enabled: live,
    placeholderData: initial.codes,
  });

  const allCodes = codesQuery.data ?? [];
  const recent = allCodes
    .filter((code) => recentFilter === "all" || code.status === recentFilter)
    .slice(0, 8);
  const selectedFilter = RECENT_FILTERS.find((filter) => filter.value === recentFilter);

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
          <div className="recent-toolbar">
            <h2 className="section-label">Recently shared codes</h2>
            <div className="recent-filters scrollbar-none" role="group" aria-label="Filter codes">
              {RECENT_FILTERS.map((filter) => {
                const count =
                  filter.value === "all"
                    ? allCodes.length
                    : allCodes.filter((code) => code.status === filter.value).length;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    className="recent-filter"
                    aria-pressed={recentFilter === filter.value}
                    onClick={() => setRecentFilter(filter.value)}
                  >
                    <span>{filter.label}</span>
                    <span className="recent-filter-count" aria-label={`${count} codes`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {recent.length === 0 ? (
            <p className="empty-copy">
              {allCodes.length === 0
                ? "None yet. Share the first one."
                : `No ${selectedFilter?.label.toLowerCase()} codes right now.`}
            </p>
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
