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
    <div className="app-canvas">
      <div className="app-frame">
        <aside className="app-sidebar">
          <div className="flex flex-col items-center">
            <Link to="/" aria-label="Pizza Hut codes home">
              <HutLogo />
            </Link>
            <nav className="side-nav" aria-label="Primary navigation">
              {NAV.map((item) => {
                const active =
                  item.to === "/browse"
                    ? pathname === "/browse"
                    : pathname === "/" && (item.hash ? hash === item.hash : !hash || hash === "");
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    hash={item.hash}
                    aria-current={active ? "page" : undefined}
                    className={cn("side-nav-link", active && "side-nav-link-active")}
                  >
                    {active ? <span className="side-nav-indicator" aria-hidden="true" /> : null}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="app-panel">
          <div className="mobile-header">
            <Link to="/" aria-label="Pizza Hut codes home">
              <HutLogo size="sm" />
            </Link>
            <nav className="mobile-nav" aria-label="Primary navigation">
              {NAV.map((item) => {
                const active =
                  item.to === "/browse"
                    ? pathname === "/browse"
                    : pathname === "/" && (item.hash ? hash === item.hash : !hash || hash === "");
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    hash={item.hash}
                    aria-current={active ? "page" : undefined}
                    className={cn("mobile-nav-link", active && "text-foreground")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
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
    </div>
  );
}
