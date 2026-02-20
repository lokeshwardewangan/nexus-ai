"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { assistants, categories, type Assistant } from "@/config/assistants";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LibraryBrowser() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assistants.filter((assistant) => {
      const matchesCategory = activeCategory === "all" || assistant.category === activeCategory;
      const matchesQuery =
        !q ||
        assistant.name.toLowerCase().includes(q) ||
        assistant.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search assistants…"
          className="pl-9"
        />
      </div>

      {/* Category filter */}
      <div className="mt-5 flex flex-wrap gap-2">
        <FilterPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
          All
        </FilterPill>
        {categories.map((category) => (
          <FilterPill
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </FilterPill>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">
          No assistants match “{query}”.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((assistant) => (
            <AssistantCard key={assistant.id} assistant={assistant} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
      )}
    >
      {children}
    </button>
  );
}

function AssistantCard({ assistant }: { assistant: Assistant }) {
  const Icon = assistant.icon;

  return (
    <Link
      href={`/studio/chat/${assistant.id}`}
      className="group border-border hover:border-primary/40 hover:bg-card flex flex-col rounded-xl border p-5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="bg-secondary text-foreground flex size-9 items-center justify-center rounded-lg">
          <Icon className="size-4.5" />
        </span>
        <h3 className="font-medium">{assistant.name}</h3>
      </div>
      <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-relaxed">
        {assistant.description}
      </p>
      <span className="text-primary mt-4 inline-flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
        Start chat <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}
