"use client";

import React, { useState, use } from "react";
import ProjectHeader from "./ProjectHeader";
import BoardView from "./BoardView";
import ListView from "./ListView";
import ProjectTimeline from "./ProjectTimeline";
import TableView from "./TableView";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProjectPage({ params }: Props) {
  const unwrappedParams = use(params);
  const projectId = parseInt(unwrappedParams.id);
  const [activeTab, setActiveTab] = useState("Board");

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-dark-tertiary">
      <ProjectHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        projectId={projectId} 
      />

      <main className="flex-1 overflow-y-auto">
        {activeTab === "Board" && (
          <BoardView 
            id={unwrappedParams.id} 
            setIsModalNewTaskOpen={() => {}} 
          />
        )}

        {activeTab === "List" && (
          <ListView 
            id={unwrappedParams.id} 
            setIsModalNewTaskOpen={() => {}} 
          />
        )}

        {activeTab === "Timeline" && (
          <ProjectTimeline 
            id={unwrappedParams.id} 
            setIsModalNewTaskOpen={() => {}} 
          />
        )}

        {activeTab === "Urgent" && (
          <TableView 
            id={unwrappedParams.id} 
            setIsModalNewTaskOpen={() => {}} 
          />
        )}
      </main>
    </div>
  );
}