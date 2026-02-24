import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FeaturesPreview } from '@/components/landing/features-preview';
import { CTASection } from '@/components/landing/cta-section';
import { CodeneBg } from '@/components/landing/codene-bg';

export default function HomePage() {
  return (
    <main className="horizontal-scroll">
      <CodeneBg />

      <section className="scroll-section">
        <Hero />
      </section>
      <section className="scroll-section">
        <HowItWorks />
      </section>
      <section className="scroll-section">
        <FeaturesPreview />
      </section>
      <section className="scroll-section">
        <CTASection />
        <footer className="!absolute bottom-6 left-0 right-0 z-10 text-center text-sm text-[--muted]">
          &copy; {new Date().getFullYear()} Codene. All rights reserved.
        </footer>
      </section>
    </main>
  );
}
