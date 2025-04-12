"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";

export default function OnboardingStatus() {
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data } = await getUserOnboardingStatus();
        if (data?.isOnboarded) {
          redirect("/dashboard");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };
    checkOnboardingStatus();
  }, []);

  return null;
}