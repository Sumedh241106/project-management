"use client";

import React from "react";
import { useGetTasksQuery, Task } from "@/state/api";
import TaskCard from "@/components/TaskCard";
import { Loader2, Plus } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

export default function ListView({ id, setIsModalNewTaskOpen }: Props) {
  const { data: tasks, isLoading, isError } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-xs font-bold p-6">
        <Loader2 className="animate-spin text-blue-600" size={16} />
        <span>Fetching active pipeline tasks...</span>
      </div>
    );
  }

  if (isError) return <div className="p-6 text-xs font-bold text-red-500">An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6 space-y-4">
      <div className="flex items-center justify-between pt-5">
        <h2 className="text-md font-black text-gray-900 dark:text-white uppercase tracking-tight">List View</h2>
        <button
          onClick={() => setIsModalNewTaskOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-xs"
        >
          <Plus size={14} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}