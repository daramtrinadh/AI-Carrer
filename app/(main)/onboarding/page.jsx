import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import OnboardingStatus from "./_components/onboarding-status";

export default function OnboardingPage({ searchParams }) {
  const industry = searchParams?.industry;

  return (
    <main>
      <OnboardingStatus />
      <OnboardingForm
        industries={industries}
        initialIndustry={industry}
        redirectTo="/dashboard"
      />
    </main>
  );
}
