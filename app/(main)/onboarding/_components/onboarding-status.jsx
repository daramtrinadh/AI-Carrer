"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";

export default function OnboardingStatus() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data } = await getUserOnboardingStatus();
        if (data?.isOnboarded) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };
    checkOnboardingStatus();
  }, [router]);

  return null;
}