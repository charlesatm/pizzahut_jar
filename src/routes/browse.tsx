import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CodeCard } from "@/components/code-card";
import { listCodes } from "@/lib/codes";

export const Route = createFileRoute("/browse")({
  loader: async () => {
    const codes = await listCodes({ data: { sort: "expiry" } });
    return { codes };
  },
  staleTime: 0,
  component: Browse,
});

function Browse() {
  const initial = Route.useLoaderData();
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
  }, []);

  const codesQuery = useQuery({
    queryKey: ["codes", "open", "expiry"],
    queryFn: () => listCodes({ data: { view: "open", sort: "expiry" } }),
    enabled: live,
    placeholderData: initial.codes,
  });

  const codes = codesQuery.data ?? [];

  return (
    <AppShell>
      <h1 className="text-xl font-medium tracking-tight">Browse codes</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Soonest expiry first. Tap a card to copy.
      </p>
      {codes.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No open codes.</p>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {codes.map((code) => (
            <CodeCard key={code.id} code={code} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
