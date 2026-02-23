import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DocumentsManager } from "@/features/documents/components/documents-manager";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listDocuments } from "@/server/services/document.service";

export const metadata: Metadata = {
  title: "Documents",
};

export default async function DocumentsPage() {
  const documents = await listDocuments();

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
            <p className="text-muted-foreground mt-1.5">
              Upload files to chat with them and get answers cited to the source.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/studio/documents/chat">
              <MessageSquare className="size-4" />
              Chat with docs
            </Link>
          </Button>
        </header>

        <div className="mt-7">
          <DocumentsManager configured={isSupabaseConfigured} initialDocuments={documents} />
        </div>
      </div>
    </div>
  );
}
