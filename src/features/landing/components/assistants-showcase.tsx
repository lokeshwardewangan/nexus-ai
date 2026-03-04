"use client";

import { motion } from "motion/react";

import { assistants, categories, type Assistant, type Category } from "@/config/assistants";

export function AssistantsShowcase() {
  return (
    <section id="assistants" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          A specialist for <span className="text-gradient-brand">every task</span>
        </h2>
        <p className="text-muted-foreground mt-4 text-base text-pretty">
          {assistants.length} assistants across {categories.length} categories — each tuned for what
          it does best.
        </p>
      </div>

      <div className="mt-12 grid gap-5">
        {categories.map((category, index) => (
          <CategoryPanel
            key={category.id}
            index={index}
            category={category}
            items={assistants.filter((assistant) => assistant.category === category.id)}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryPanel({
  index,
  category,
  items,
}: {
  index: number;
  category: Category;
  items: Assistant[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="border-border bg-card/40 rounded-2xl border p-6 sm:p-7"
    >
      {/* Category header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-primary/70 text-sm font-semibold tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{category.label}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{category.description}</p>
          </div>
        </div>
        <span className="text-muted-foreground border-border shrink-0 rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap">
          {items.length} assistants
        </span>
      </div>

      {/* Divider */}
      <div className="bg-border my-5 h-px" />

      {/* Assistants in this category */}
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {items.map((assistant) => (
          <div key={assistant.id} className="group flex gap-3">
            <span className="bg-primary/70 group-hover:bg-primary mt-2 size-1.5 shrink-0 rounded-full transition-colors" />
            <div className="min-w-0">
              <h4 className="font-medium">{assistant.name}</h4>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {assistant.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
