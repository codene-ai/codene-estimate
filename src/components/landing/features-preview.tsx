import { DollarSign, Clock, ListChecks, Download } from 'lucide-react';

const features = [
  {
    icon: ListChecks,
    title: 'Itemized Breakdown',
    description: 'Every feature listed with its complexity tier, estimated hours, and cost range.',
  },
  {
    icon: Clock,
    title: 'Production Timeline',
    description: 'Phase-by-phase schedule from discovery through launch.',
  },
  {
    icon: DollarSign,
    title: 'Budget Range',
    description: 'Min and max cost estimates based on your selected features and platform.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download your estimate as a professional PDF to share with your team.',
  },
];

export function FeaturesPreview() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[--foreground] sm:text-3xl">
          What You&apos;ll Get
        </h2>
        <p className="mt-3 text-[--muted]">
          A comprehensive estimate to help you plan your project
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass-panel neu-touchable rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[--primary-light] p-3 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.35),inset_-2px_-2px_4px_rgba(228,228,235,0.03)]">
                <feature.icon className="h-5 w-5 text-[--primary-hover]" />
              </div>
              <div>
                <h3 className="font-semibold text-[--foreground]">{feature.title}</h3>
                <p className="mt-1 text-sm text-[--muted]">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
