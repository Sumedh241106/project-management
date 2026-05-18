"use client";

import React from "react";
import { useGetTasksQuery } from "@/state/api";
import { Clock, Activity, FileText, CheckCircle2, AlertOctagon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Props = {
  id: string;
};

export default function ActivityView({ id }: Props) {
  const { data: tasks, isLoading, isError } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div className="p-6 text-gray-500 font-medium">Loading history audit index matrices...</div>;
  if (isError) return <div className="p-6 text-red-500 font-bold">Failed to load project activity logs.</div>;
  
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 rounded-2xl dark:border-stroke-dark">
        <Activity size={32} className="text-gray-300 dark:text-gray-600 animate-pulse" />
        <p className="mt-2 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">No logged actions recorded yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-md font-black text-gray-900 dark:text-white uppercase tracking-tight">System Logs</h2>
        <p className="text-2xs text-gray-400">Verifiable trace record log of system events, state switches, and workflow execution.</p>
      </div>

      <div className="relative border-l-2 border-gray-100 pl-6 space-y-6 dark:border-stroke-dark">
        {tasks.map((task) => (
          <div key={task.id} className="relative group animate-in fade-in slide-in-from-left-4 duration-200">
            <div className="absolute -left-[35px] top-0 flex h-6 w-6 items-center justify-center rounded-full border bg-blue-50 border-blue-200 text-blue-600 dark:bg-dark-tertiary dark:border-stroke-dark">
              <Clock size={12} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition hover:shadow-md dark:bg-dark-secondary dark:border-stroke-dark">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-2xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Task Generated
                </span>
                <span className="text-3xs font-medium text-gray-400">
                  {task.startDate ? formatDistanceToNow(new Date(task.startDate), { addSuffix: true }) : "Just now"}
                </span>
              </div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">{task.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}