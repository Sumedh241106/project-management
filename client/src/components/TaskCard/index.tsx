import { Task, useDeleteTaskMutation } from "@/state/api";
import { format } from "date-fns";
import { Trash2, Calendar, Tag, AlertCircle } from "lucide-react";
import React from "react";

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  const [deleteTask] = useDeleteTaskMutation();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this task ticket?")) {
      try {
        await deleteTask(task.id).unwrap();
      } catch (error) {
        console.error("Failed to delete task from operational index:", error);
      }
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "Urgent": return "text-red-600 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20";
      case "High": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20";
      case "Medium": return "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-500/10 border-gray-200 dark:border-gray-500/20";
    }
  };

  return (
    <div className="bg-white dark:bg-dark-secondary border border-gray-200 dark:border-stroke-dark rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group relative">
      
      {/* DELETE TRIGGER ACTION ICON */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-tertiary transition opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Delete Task Entry"
      >
        <Trash2 size={14} />
      </button>

      <div className="space-y-3.5">
        {/* HEADER META DATA METRICS */}
        <div className="flex flex-wrap items-center gap-2">
          {task.priority && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-3xs font-extrabold uppercase border tracking-wider ${getPriorityColor(task.priority)}`}>
              <AlertCircle size={10} />
              {task.priority}
            </span>
          )}
          {task.status && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-3xs font-extrabold uppercase tracking-wider bg-gray-100 dark:bg-dark-tertiary text-gray-600 dark:text-gray-400 border border-transparent dark:border-stroke-dark/40">
              {task.status}
            </span>
          )}
        </div>

        {/* CORE INFORMATION LAYOUT DESCRIPTION */}
        <div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-snug pr-6">{task.title}</h3>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* TAG PIPELINES */}
        {task.tags && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {task.tags.split(",").map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-3xs font-bold text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-dark-tertiary/20 px-2 py-0.5 rounded-md border border-gray-100 dark:border-stroke-dark/20">
                <Tag size={8} />
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* CALENDAR BOUNDARY DATETIME TIMELINE OVERVIEW */}
        {(task.startDate || task.dueDate) && (
          <div className="flex items-center gap-1.5 text-3xs font-bold text-gray-400 pt-2 border-t border-gray-50 dark:border-stroke-dark/40">
            <Calendar size={11} />
            <span>
              {task.startDate ? format(new Date(task.startDate), "MMM dd") : "TBD"}
              {" — "}
              {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "TBD"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}