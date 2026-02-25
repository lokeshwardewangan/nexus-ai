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

const steps = [
  {
    title: "Upload your files",
    description: "PDF, Word, Excel, CSV, Markdown, or text — up to 10 MB each.",
  },
  {
    title: "We read & index them",
    description: "Each file is processed in a few seconds (Processing → Ready).",
  },
  {
    title: "Chat with citations",
    description: "Open “Chat with docs” and ask — answers quote the source.",
  },
];

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

        {/* How it works */}
        <ol className="border-border bg-card/40 mt-6 grid gap-5 rounded-2xl border p-5 sm:grid-cols-3 sm:gap-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3 sm:flex-col sm:gap-2.5">
              <span className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-7">
          <DocumentsManager configured={isSupabaseConfigured} initialDocuments={documents} />
        </div>
      </div>
    </div>
  );
}
