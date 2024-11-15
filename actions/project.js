import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createProject(data) {
  const { orgId, userId } = auth();

  if (!userId) {
    throw new Error("not Authorized");
  }
  if (!orgId) {
    throw new Error("no Organization selected");
  }
  const { data: membership } =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId
  );
  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only Organization admin can create project");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });
    return project;
  } catch (error) {
    throw new Error("Error creating a project" + error.message);
  }
}
