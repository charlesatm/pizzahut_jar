import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { HutLogo } from "@/components/hut-logo";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", hash: undefined as string | undefined },
  { to: "/", label: "Share Code", hash: "share" },
  { to: "/browse", label: "Browse Codes", hash: undefined },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });

  return (
    <div className="flex h-svh w-full bg-background">
      <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-border bg-[#101012] lg:flex">
        <div className="flex flex-col items-center px-5 pt-8">
          <Link to="/" aria-label="Pizza Hut codes home">
            <HutLogo />
          </Link>
          <nav className="mt-10 flex flex-col gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/browse"
                  ? pathname === "/browse"
                  : pathname === "/" &&
                    (item.hash ? hash === item.hash : !hash || hash === "");
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active ? (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 lg:hidden">
          <Link to="/" aria-label="Pizza Hut codes home">
            <HutLogo size="sm" />
          </Link>
          <nav className="flex gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
        <footer className="shrink-0 border-t border-border px-4 py-3 text-center text-xs text-muted-foreground sm:px-8">
          <Link to="/how-to" className="hover:text-foreground">
            How to
          </Link>
          <span className="mx-2">·</span>
          <Link to="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <span className="mx-2">·</span>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </footer>
      </div>
    </div>
  );
}
