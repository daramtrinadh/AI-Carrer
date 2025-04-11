import { redirect } from "next/navigation"
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";

export default async function OnboardingPage({ searchParams }) {  
  try {
    const { user } = await getUserOnboardingStatus();
    const industry = searchParams?.industry;

    return (
      <main>
        <OnboardingForm
          industries={industries}
          initialIndustry={industry}
          user={user}
          redirectTo="/dashboard"
        />
      </main>
    );
  } catch (error) {
    console.error("Error fetching user onboarding status:", error);
    redirect("/");
  }
}
