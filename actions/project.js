"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data) {
  const { orgId, userId } = auth();

  if (!userId) {
    throw new Error("not Authorized");
  }
  if (!orgId) {
    throw new Error("no Organization selected");
  }
  const { data: membership } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
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

export async function getProjects(orgId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("user not found");
  }
  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

export async function deleteProject(projectId) {
  const { userId, orgId, orgRole } = auth();
  if (!userId || !orgId) {
    throw new Error("unauthorized");
  }
  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found  or you have an access to  delete the project"
    );
  }
  await db.project.delete({
    where: { id: projectId },
  });
  return { success: true };
}
