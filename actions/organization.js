"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!slug) {
    throw new Error("Organization slug is required");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get the organization details by slug
  const organization = await clerkClient.organizations.getOrganization({ slug });
  if (!organization) {
    throw new Error("Organization not found");
  }

  console.log("Organization ID:", organization.id);

  // Get membership list
  const { data: membership } =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  console.log("Membership List:", membership);

  // Check if user belongs to the organization
  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId
  );

  if (!userMembership) {
    return null;
  }

  return organization;
}
