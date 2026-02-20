import type { Metadata } from "next";

import { DocumentsManager } from "@/features/documents/components/documents-manager";

export const metadata: Metadata = {
  title: "Documents",
};

export default function DocumentsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1.5">
            Upload files to chat with them and get answers cited to the source.
          </p>
        </header>

        <div className="mt-7">
          <DocumentsManager />
        </div>
      </div>
    </div>
  );
}
