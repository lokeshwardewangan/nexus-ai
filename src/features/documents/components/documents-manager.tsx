"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DocStatus = "processing" | "ready";

interface StudioDocument {
  id: string;
  name: string;
  size: string;
  status: DocStatus;
}

const initialDocuments: StudioDocument[] = [
  { id: "seed-1", name: "Q3-financial-report.pdf", size: "2.4 MB", status: "ready" },
  { id: "seed-2", name: "product-spec.pdf", size: "812 KB", status: "ready" },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsManager() {
  const [documents, setDocuments] = useState<StudioDocument[]>(initialDocuments);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files?.length) return;

    const added: StudioDocument[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: formatSize(file.size),
      status: "processing",
    }));

    setDocuments((prev) => [...added, ...prev]);
    toast.success(`${added.length} document${added.length > 1 ? "s" : ""} uploaded`);

    // Simulate the embedding pipeline; replaced by the real RAG flow later.
    for (const doc of added) {
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((item) => (item.id === doc.id ? { ...item, status: "ready" } : item)),
        );
      }, 1600);
    }
  }

  return (
    <div>
      {/* Upload zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30",
        )}
      >
        <span className="bg-secondary flex size-12 items-center justify-center rounded-xl">
          <Upload className="size-5" />
        </span>
        <p className="mt-4 text-sm font-medium">Drop files here, or click to upload</p>
        <p className="text-muted-foreground mt-1 text-xs">PDF, TXT, or Markdown · up to 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>

      {/* Document list */}
      <div className="mt-8">
        <h2 className="text-sm font-medium">
          Your documents <span className="text-muted-foreground">({documents.length})</span>
        </h2>

        {documents.length === 0 ? (
          <p className="text-muted-foreground mt-8 text-center text-sm">
            No documents yet. Upload one to start chatting with it.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onRemove={() => setDocuments((prev) => prev.filter((item) => item.id !== doc.id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentRow({ document, onRemove }: { document: StudioDocument; onRemove: () => void }) {
  return (
    <div className="border-border flex items-center gap-4 rounded-xl border p-4">
      <span className="bg-secondary flex size-10 shrink-0 items-center justify-center rounded-lg">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{document.name}</p>
        <p className="text-muted-foreground text-xs">{document.size}</p>
      </div>

      {document.status === "processing" ? (
        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
          <Loader2 className="size-3.5 animate-spin" />
          Processing
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Ready
        </span>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        aria-label={`Remove ${document.name}`}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
