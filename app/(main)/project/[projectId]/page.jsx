import { getProjectById, getProjects } from "@/actions/project";
import { notFound } from "next/navigation";
import React from "react";

const SingleProject = async ({ params }) => {
  const { projectId } = params;
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }
  return <div>singleProject</div>;
};

export default SingleProject;
