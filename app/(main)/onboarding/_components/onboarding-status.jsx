"use client";

import { useEffect } from "react";
import { getUserOnboardingStatus } from "@/actions/user";

export default function OnboardingStatus() {
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data } = await getUserOnboardingStatus();
        console.log("Onboarding status:", data);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    };
    checkOnboardingStatus();
  }, []);

  return null;
}