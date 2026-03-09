"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface UsageContextValue {
  /** Total tokens to display — the persisted count plus any in-flight estimate. */
  tokensUsed: number;
  /** Set a live, optimistic estimate for the response currently streaming. */
  setLiveEstimate: (tokens: number) => void;
  /** Re-fetch the authoritative total from the server (call when a response ends). */
  refresh: () => Promise<void>;
}

const UsageContext = createContext<UsageContextValue | null>(null);

export function UsageProvider({
  initialTokens,
  children,
}: {
  initialTokens: number;
  children: ReactNode;
}) {
  const [committed, setCommitted] = useState(initialTokens);
  const [live, setLive] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/usage", { cache: "no-store" });
      if (!res.ok) return;
      const data: { tokensUsed?: number } = await res.json();
      if (typeof data.tokensUsed === "number") {
        // Reconcile the estimate with the real total in one update to avoid a dip.
        setCommitted(data.tokensUsed);
        setLive(0);
      }
    } catch {
      // Usage is a non-critical stat; leave the last known value in place.
    }
  }, []);

  return (
    <UsageContext.Provider
      value={{ tokensUsed: committed + live, setLiveEstimate: setLive, refresh }}
    >
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage(): UsageContextValue {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error("useUsage must be used within a UsageProvider");
  return ctx;
}
