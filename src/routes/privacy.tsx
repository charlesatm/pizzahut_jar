import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy · Pizza Hut codes" }] }),
});

function PrivacyPage() {
  return (
    <AppShell>
      <div className="content-page">
        <h1 className="text-xl font-medium tracking-tight">Privacy Policy</h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          No accounts. Promo codes you share are public. Do not include personal information in a
          code or note.
        </p>
      </div>
    </AppShell>
  );
}
