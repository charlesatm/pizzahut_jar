import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy · Share a Slice" }] }),
});

function PrivacyPage() {
  return (
    <AppShell>
      <div className="content-page">
        <h1 className="text-xl font-medium tracking-tight">Privacy Policy</h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          No accounts. Promo codes you share are public. A private management key is stored only in
          your browser so you can edit or delete your own codes. Do not include personal information
          in a code or note.
        </p>
        <h2 className="mt-8 text-base font-medium">Analytics</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          We use Google Analytics to understand visits, page usage, device types, and general
          traffic patterns so we can improve Share a Slice. Google Analytics may use cookies and
          receive information such as your browser, approximate location, and the pages you visit.
          We do not intentionally send promo codes or private management keys to Analytics.
        </p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          You can limit this collection using your browser&apos;s cookie and privacy controls. Learn
          more in{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </p>
      </div>
    </AppShell>
  );
}
