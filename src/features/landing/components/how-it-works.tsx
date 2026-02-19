import { FileUp, MessagesSquare, MousePointerClick } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Pick an assistant",
    description: "Choose from 12 specialists across writing, learning, coding, and work.",
  },
  {
    icon: FileUp,
    title: "Chat or upload",
    description: "Start a conversation, or drop in your own documents to ground the answers.",
  },
  {
    icon: MessagesSquare,
    title: "Get instant answers",
    description: "Nexus streams back clear, useful responses — with citations when you use docs.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-border/60 scroll-mt-20 border-t">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="text-muted-foreground mt-4 text-base">
            From awkward to articulate in three steps.
          </p>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative text-center">
                <span className="bg-secondary text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
                  <Icon className="size-6" />
                </span>
                <span className="text-muted-foreground mt-4 block text-sm font-semibold">
                  Step {index + 1}
                </span>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm leading-relaxed">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
