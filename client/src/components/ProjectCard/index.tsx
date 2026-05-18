import { Project } from "@/state/api";
import React from "react";

type Props = { project: Project };

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="rounded border p-4 shadow dark:bg-dark-secondary dark:text-white">
      <h3 className="font-bold">{project.name}</h3>
      <p className="text-sm">{project.description}</p>
      <p className="text-xs text-gray-400 mt-2">ID: {project.id}</p>
    </div>
  );
};

export default ProjectCard;