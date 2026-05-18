"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery();

  const [activeIndex, setActiveIndex] = useState(0);
  const currentProjectId = projects?.[activeIndex]?.id || 0;

  const {
    data: tasks,
    isLoading: isTasksLoading,
    isError,
  } = useGetTasksQuery(
    { projectId: currentProjectId },
    { skip: currentProjectId === 0 }
  );

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Day,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    return tasks.map((task) => ({
      start: task.startDate ? new Date(task.startDate) : new Date(),
      end: task.dueDate ? new Date(task.dueDate) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      name: task.title,
      id: `Task-${task.id}`,
      type: "task" as const,
      progress: task.status === "Completed" ? 100 : 0,
      isDisabled: false,
      styles: {
        progressColor: "#3b82f6",
        progressSelectedColor: "#2563eb",
        barColor: "#93c5fd",
        barSelectedColor: "#60a5fa",
      },
    }));
  }, [tasks]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isProjectsLoading || isTasksLoading) return <div className="p-8">Loading timeline...</div>;
  if (isError) return <div className="p-8">Error fetching timeline data</div>;

  // SAFE GUARD: If there are no active projects or zero tasks, return a clean notice instead of crashing
  if (!projects || projects.length === 0) {
    return (
      <div className="max-w-full p-8">
        <Header name="Project Timeline" />
        <div className="mt-8 rounded bg-white p-6 text-center shadow dark:bg-dark-secondary dark:text-white">
          <p className="text-gray-500 dark:text-gray-400">No active projects found. Create a project using the '+' button in the sidebar to view a timeline.</p>
        </div>
      </div>
    );
  }

  if (ganttTasks.length === 0) {
    return (
      <div className="max-w-full p-8">
        <Header name="Project Timeline" />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4 dark:border-stroke-dark">
          <div className="flex gap-2">
            {projects.map((project, idx) => (
              <button
                key={project.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2 text-sm font-semibold rounded ${
                  activeIndex === idx ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 dark:bg-dark-tertiary dark:text-gray-300"
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded bg-white p-6 text-center shadow dark:bg-dark-secondary dark:text-white">
          <p className="text-gray-500 dark:text-gray-400">This project does not contain any tasks yet. Head over to the Board tab to add your first task!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between gap-2 border-b border-gray-200 pb-4 dark:border-stroke-dark">
        <Header name="Project Timeline" />
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-400 focus:outline-none dark:border-stroke-dark dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>

      <div className="mb-4 flex gap-2">
        {projects.map((project, idx) => (
          <button
            key={project.id}
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-2 text-sm font-semibold rounded ${
              activeIndex === idx ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 dark:bg-dark-tertiary dark:text-gray-300"
            }`}
          >
            {project.name}
          </button>
        ))}
      </div>

      <div className="gantt-container-custom overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary">
        <div className="overflow-x-auto">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="150px"
            barBackgroundColor={isDarkMode ? "#101214" : "#a3e635"}
            barBackgroundSelectedColor={isDarkMode ? "#1d1f21" : "#84cc16"}
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;