import { getProjectById, getProjects } from "@/actions/project";
import SprinCreationForm from "@/components/sprint-creation-form";
import { notFound } from "next/navigation";
import React from "react";

const SingleProject = async ({ params }) => {
  const { projectId } = params;
  const project = await getProjectById(projectId);

  console.log(project, "====project=====");

  if (!project) {
    notFound();
  }
  return (
    <div>
      {/* // <div>sprintcreation</div>
      // */}
      <SprinCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />
      {project.sprints?.length === 0 ? (
        <div> </div>
      ) : (
        <div>Create a sprint from button above</div>
      )}
    </div>
  );
};

export default SingleProject;
