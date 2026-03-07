import type { Metadata } from "next";
import { Zap } from "lucide-react";

import { assistants } from "@/config/assistants";
import { LibraryBrowser } from "@/features/studio/components/library-browser";
import { getProfile } from "@/server/services/profile.service";

export const metadata: Metadata = {
  title: "Library",
};

function formatTokens(value: number): string {
  if (value < 1000) return String(value);
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}K`;
  return `${(value / 1_000_000).toFixed(1)}M`;
}

export default async function StudioPage() {
  const profile = await getProfile();

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Assistant library</h1>
            <p className="text-muted-foreground mt-1.5">
              Pick a specialist to start a conversation, or search across all {assistants.length}.
            </p>
          </div>

          {profile && (
            <div className="border-border bg-card flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-2.5">
              <Zap className="text-primary size-4 shrink-0" />
              <div className="leading-none">
                <p className="text-muted-foreground text-[11px]">Tokens used</p>
                <p className="mt-1 text-sm font-semibold tabular-nums">
                  {formatTokens(profile.tokensUsed)}
                </p>
              </div>
            </div>
          )}
        </header>

        <div className="mt-7">
          <LibraryBrowser />
        </div>
      </div>
    </div>
  );
}
