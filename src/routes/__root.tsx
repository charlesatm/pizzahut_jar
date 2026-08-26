import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AuthProvider } from "@/lib/auth/provider";
import appCss from "../styles.css?url";

const APP_NAME = "Share a Slice · Pizza Promo Codes";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 8_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "Share leftover pizza promo codes. Grab one you will use.",
      },
      { name: "theme-color", content: "#141416" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/share-a-slice-icon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const [client] = useState(makeQueryClient);
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="h-full overflow-hidden">
        <PreviewHostBridge />
        <QueryClientProvider client={client}>
          <AuthProvider>
            <Outlet />
            <Toaster
              position="top-center"
              offset={12}
              toastOptions={{
                className: "font-sans",
                style: {
                  background: "#1c1c1f",
                  color: "#f4f4f5",
                  border: "1px solid #2e2e33",
                },
              }}
            />
          </AuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
