import BusinessContextQuestionnaire from '@/components/BusinessContextQuestionnaire';

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <BusinessContextQuestionnaire />
      </div>
    </main>
  );
}