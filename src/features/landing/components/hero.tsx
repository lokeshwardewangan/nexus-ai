"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categories } from "@/config/assistants";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="bg-hero-glow relative overflow-hidden">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
        <motion.span
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur"
        >
          <Sparkles className="text-primary size-3.5" />
          12 assistants · chat with your documents
        </motion.span>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl"
        >
          Every AI assistant, <span className="text-gradient-brand">one studio</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-muted-foreground mt-5 max-w-xl text-base text-pretty sm:text-lg"
        >
          A workspace of specialized assistants for writing, learning, coding, and work — plus the
          ability to upload your own documents and get answers with citations.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/studio">
              Open the studio
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#assistants">Browse assistants</Link>
          </Button>
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <span
                key={category.id}
                className="border-border bg-card/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur"
              >
                <Icon className="text-primary size-3.5" />
                {category.label}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
