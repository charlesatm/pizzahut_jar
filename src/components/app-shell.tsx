import { Link, useRouterState } from "@tanstack/react-router";
import { CirclePlus, Home, Tags } from "lucide-react";
import type { ReactNode } from "react";
import { SiteLogo } from "@/components/site-logo";
import { cn } from "@/lib/utils";

const NAV = [
  {
    to: "/",
    label: "Home",
    mobileLabel: "Home",
    hash: undefined as string | undefined,
    icon: Home,
  },
  {
    to: "/",
    label: "Share Code",
    mobileLabel: "Share",
    hash: "share",
    icon: CirclePlus,
  },
  {
    to: "/browse",
    label: "Browse Codes",
    mobileLabel: "Browse",
    hash: undefined,
    icon: Tags,
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });

  return (
    <div className="app-canvas">
      <div className="app-frame">
        <aside className="app-sidebar">
          <div className="flex flex-col items-center">
            <Link to="/" aria-label="Share a Slice home">
              <SiteLogo />
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
            <Link to="/" aria-label="Share a Slice home" className="mobile-brand">
              <SiteLogo size="sm" />
            </Link>
            <span className="mobile-header-note">shareaslice.lk</span>
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
          <nav className="mobile-nav" aria-label="Primary navigation">
            {NAV.map((item) => {
              const active =
                item.to === "/browse"
                  ? pathname === "/browse"
                  : pathname === "/" && (item.hash ? hash === item.hash : !hash || hash === "");
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  aria-current={active ? "page" : undefined}
                  className={cn("mobile-nav-link", active && "mobile-nav-link-active")}
                >
                  <Icon className="mobile-nav-icon" aria-hidden="true" />
                  <span>{item.mobileLabel}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
