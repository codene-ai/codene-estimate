import { ClipboardList, MousePointerClick, FileBarChart } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Describe Your App',
    description:
      'Tell us about your project, target audience, and platform preferences.',
  },
  {
    icon: MousePointerClick,
    title: 'Select Features',
    description:
      'Choose from 60+ common app features organized by category, or describe custom ones.',
  },
  {
    icon: FileBarChart,
    title: 'Get Your Estimate',
    description:
      'Receive an instant itemized budget, production timeline, and downloadable PDF.',
  },
];

export function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[--foreground] sm:text-3xl">
          How It Works
        </h2>
        <p className="mt-3 text-[--muted]">
          Three simple steps to your project estimate
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(184,115,51,0.10)] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.35),inset_-2px_-2px_4px_rgba(228,228,235,0.03)]">
              <step.icon className="h-7 w-7 text-[--primary-hover]" />
            </div>
            <div className="mt-2 text-sm font-bold text-[--accent]">
              Step {index + 1}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-[--foreground]">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[--muted]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
