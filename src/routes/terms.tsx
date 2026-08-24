import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({ meta: [{ title: "Terms · Pizza Hut codes" }] }),
});

function TermsPage() {
  return (
    <AppShell>
      <h1 className="text-xl font-medium tracking-tight">Terms of Service</h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Codes are shared by whoever dropped them. No guarantee they still work.
        Do not post names, emails, accounts, or payment details. This site is
        not affiliated with Pizza Hut.
      </p>
    </AppShell>
  );
}
