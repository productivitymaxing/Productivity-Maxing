import BusinessContextQuestionnaire from '@/components/BusinessContextQuestionnaire';

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <BusinessContextQuestionnaire />
      </div>
    </main>
  );
}