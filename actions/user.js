"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Generate new insights
      const insights = await generateAIInsights(data.industry);
      if (!insights) {
        throw new Error("Failed to generate AI insights");
      }
      // 2. Update user information and associate new insights
      const updatedUser = await tx.user.update({
        where: { clerkUserId: userId },
        data: {
          name: data.name,
          email: data.email,
          job: data.job,
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
          insight: {
            upsert: {
              where: { userId: userId },
              update: {
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
              create: {
                industry: data.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
        include: {
          insight: true,
        },
      });
      if (!updatedUser) {
        throw new Error("Failed to update user profile");
      }
      revalidatePath("/");
      return updatedUser;
    });
    return { data: result };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function updateIndustryInsights(industry) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const insights = await generateAIInsights(industry);
    if (!insights) throw new Error("Failed to generate insights");

    const result = await db.insight.update({
      where: { userId: userId },
      data: { ...insights, nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });

    revalidatePath("/");
    return { data: result };
  } catch (error) {
    console.error("Error updating industry insights:", error.message);
    return { error: "Failed to update user insights" };
  }
}






export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const result = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
        name: true,
        email: true,
        job: true,
      },
    });
    const isOnboarded = !!result?.industry;
    const data = { isOnboarded, ...result };
    return { data };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}