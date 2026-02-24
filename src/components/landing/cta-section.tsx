import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <div className="mx-auto max-w-2xl px-6 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-[--foreground] sm:text-3xl">
        Ready to Get Started?
      </h2>
      <p className="mt-4 text-lg text-[--muted]">
        Get your free, instant app estimate in minutes. No commitment required.
      </p>
      <div className="mt-8">
        <Link
          href="/estimate"
          className="gel-btn neu-touchable inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold text-white"
        >
          Get Your Free Estimate
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
