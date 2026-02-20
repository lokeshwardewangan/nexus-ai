import Link from "next/link";

import { Logo } from "./logo";
import { siteConfig } from "@/config/site";

const sections = [
  {
    title: "Explore",
    links: [
      { label: "Assistants", href: "#assistants" },
      { label: "Documents", href: "#documents" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Open studio", href: "/studio" },
      { label: "Chat with docs", href: "/studio/documents" },
    ],
  },
];

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-border/60 border-t">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Logo />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:gap-20">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold tracking-[0.14em] uppercase">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border/60 mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">Built with Next.js & the Vercel AI SDK</p>
        </div>
      </div>
    </footer>
  );
}
