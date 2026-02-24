import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <div className="mx-auto max-w-3xl px-6 text-center">
      <div className="glass-pill mb-6 inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-[--foreground]">
        <Sparkles className="h-4 w-4 text-[--primary]" />
        Instant project estimates
      </div>

      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        <span className="text-[--foreground]">Get an Instant</span>
        <span className="block text-[#d4944c]">
          App Estimate
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[--muted]">
        Tell us about your mobile app idea, select the features you need, and
        receive a detailed cost breakdown and production timeline in minutes.
      </p>

      <div className="mt-10">
        <Link
          href="/estimate"
          className="gel-btn neu-touchable inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold"
        >
          Start Your Estimate
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
