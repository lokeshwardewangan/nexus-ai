"use client";

import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";

/**
 * App-wide client providers. Theme is outermost so every consumer (including
 * data-fetching UI) can read the resolved color scheme.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
