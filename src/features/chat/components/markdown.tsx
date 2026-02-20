import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders assistant messages as markdown with tailwind-styled elements.
 * (No typography plugin — each element is styled explicitly for full control.)
 */
const components: Components = {
  p: ({ children }) => <p className="leading-relaxed [&:not(:first-child)]:mt-3">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline underline-offset-2"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => <h1 className="mt-4 mb-2 text-lg font-semibold">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-4 mb-2 text-base font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-3 mb-1.5 font-semibold">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="border-border text-muted-foreground my-3 border-l-2 pl-3">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="bg-secondary my-3 overflow-x-auto rounded-lg p-3 text-sm">{children}</pre>
  ),
  code: ({ className, children }) => {
    const isBlock = (className ?? "").includes("language-");
    if (isBlock) {
      return <code className="font-mono text-sm">{children}</code>;
    }
    return (
      <code className="bg-secondary rounded px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>
    );
  },
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
