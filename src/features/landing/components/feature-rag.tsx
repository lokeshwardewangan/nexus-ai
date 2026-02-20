"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, FileText, Quote, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

const points = [
  "Upload PDFs, notes, or reports",
  "Ask questions in plain language",
  "Answers cite the exact source passage",
];

export function FeatureRag() {
  return (
    <section id="documents" className="border-border/60 scroll-mt-20 border-t">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <Sparkle /> Flagship feature
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Chat with <span className="text-gradient-brand">your documents</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-base text-pretty">
            Bring your own knowledge. Nexus reads your files, finds the relevant passages, and
            answers with citations you can trust — no more scrolling through PDFs.
          </p>

          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm">
                <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>

          <Button asChild className="mt-8">
            <Link href="/studio/documents">
              Try document chat
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Mock preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="border-border bg-card/70 rounded-2xl border p-5 shadow-xl backdrop-blur"
        >
          <div className="border-border/60 flex items-center gap-3 border-b pb-4">
            <span className="bg-brand-gradient flex size-9 items-center justify-center rounded-lg text-white">
              <FileText className="size-4.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Q3-financial-report.pdf</p>
              <p className="text-muted-foreground text-xs">24 pages · ready</p>
            </div>
            <span className="text-muted-foreground ml-auto inline-flex items-center gap-1 text-xs">
              <Upload className="size-3" /> Uploaded
            </span>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-end">
              <p className="bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm">
                What was the revenue growth this quarter?
              </p>
            </div>

            <div className="flex justify-start">
              <div className="bg-secondary max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                <p className="text-sm leading-relaxed">
                  Revenue grew <strong>18% quarter-over-quarter</strong>, driven mainly by the new
                  enterprise plans.
                </p>
                <p className="border-border/60 text-muted-foreground mt-2 flex items-start gap-1.5 border-t pt-2 text-xs">
                  <Quote className="mt-0.5 size-3 shrink-0" />
                  &ldquo;…total revenue increased 18% over Q2…&rdquo; — page 4
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
      <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
    </svg>
  );
}
