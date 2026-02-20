import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="border-border bg-card relative isolate overflow-hidden rounded-3xl border px-6 py-16 text-center sm:px-12 sm:py-20">
        {/* Ambient violet glow — same language as the hero */}
        <div aria-hidden className="bg-hero-glow pointer-events-none absolute inset-0" />
        {/* Faint dotted texture, faded toward the edges */}
        <div
          aria-hidden
          className="text-foreground/6 pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 72%)",
          }}
        />

        <div className="relative">
          <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
            Start free
          </p>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Your entire AI toolkit, <span className="text-gradient-brand">in one place</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-base text-pretty">
            Twelve specialized assistants and document chat — no sign-up required to start.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/studio">
                Open the studio
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#assistants">Browse assistants</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
