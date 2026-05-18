"use client";

import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type Props = {
  id: string | null;
  setIsModalNewTaskOpen: () => void;
};

const ProjectTimeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  
  const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasksQuery({ projectId: Number(id) }, { skip: !id });

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

  if (isLoading) return <div className="py-4">Loading timeline...</div>;
  if (isError) return <div className="py-4 text-red-500">Error fetching timeline data</div>;

  // SAFE GUARD: If there are zero tasks, return a clean notice instead of running <Gantt /> and crashing
  if (ganttTasks.length === 0) {
    return (
      <div className="mt-4 rounded-lg bg-white p-8 text-center shadow dark:bg-dark-secondary">
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          There are no tasks assigned to this project timeline yet.
        </p>
        <button
          onClick={setIsModalNewTaskOpen}
          className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Add First Task
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-end">
        <div className="relative inline-block w-48">
          <select
            className="block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 leading-tight shadow focus:outline-none dark:border-stroke-dark dark:bg-dark-secondary dark:text-white text-sm"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
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

export default ProjectTimeline;