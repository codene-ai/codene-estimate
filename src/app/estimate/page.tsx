import { FormWizard } from '@/components/estimate-form/form-wizard';

export const metadata = {
  title: 'Get Your App Estimate — Codene',
  description: 'Tell us about your app idea and get an instant project estimate with itemized budget and timeline.',
};

export default function EstimatePage() {
  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-embossed text-3xl font-bold tracking-tight sm:text-4xl">
            App Estimate Request
          </h1>
          <p className="mt-3 text-lg text-muted">
            Tell us about your project and get an instant estimate
          </p>
        </div>
        <FormWizard />
      </div>
    </main>
  );
}
