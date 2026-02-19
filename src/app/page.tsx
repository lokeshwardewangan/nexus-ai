import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/features/landing/components/hero";
import { FeatureRag } from "@/features/landing/components/feature-rag";
import { AssistantsShowcase } from "@/features/landing/components/assistants-showcase";
import { HowItWorks } from "@/features/landing/components/how-it-works";
import { CtaSection } from "@/features/landing/components/cta-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureRag />
        <AssistantsShowcase />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
