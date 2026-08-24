import { Link } from "@tanstack/react-router";
import { DropDialog } from "@/components/drop-dialog";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="text-sm font-medium tracking-tight text-foreground"
          aria-label="Code Jar home"
        >
          Code Jar
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/how-to"
            className={cn(
              "inline-flex h-11 items-center rounded-md px-3 text-sm",
              "text-muted-foreground transition-colors duration-150 hover:text-foreground",
            )}
          >
            How to
          </Link>
          <DropDialog />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 py-8 text-sm text-muted-foreground">
      <p>Pizza Hut codes only. No personal details.</p>
    </footer>
  );
}
