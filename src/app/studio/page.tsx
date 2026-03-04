import type { Metadata } from "next";

import { assistants } from "@/config/assistants";
import { LibraryBrowser } from "@/features/studio/components/library-browser";

export const metadata: Metadata = {
  title: "Library",
};

export default function StudioPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Assistant library</h1>
          <p className="text-muted-foreground mt-1.5">
            Pick a specialist to start a conversation, or search across all {assistants.length}.
          </p>
        </header>

        <div className="mt-7">
          <LibraryBrowser />
        </div>
      </div>
    </div>
  );
}
