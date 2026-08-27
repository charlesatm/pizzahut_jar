import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/how-to")({
  component: HowToPage,
  head: () => ({
    meta: [{ title: "How to · Share a Slice" }],
  }),
});

function HowToPage() {
  return (
    <AppShell>
      <div className="content-page">
        <h1 className="text-xl font-medium tracking-tight">How to</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Pizza Hut codes only. Default deal is 15% off. Codes last 14 days unless you set a sooner
          expiry.
        </p>
        <ol className="mt-8 max-w-lg list-decimal space-y-4 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Share a spare code on Home, or browse for one that expires soon.</li>
          <li>
            Codes you share can be edited or deleted from the same browser. Clearing its site data
            removes that private access.
          </li>
          <li>Copy it, then paste it at Pizza Hut checkout.</li>
          <li>Mark it used if it worked, or no good if it did not.</li>
        </ol>
      </div>
    </AppShell>
  );
}
