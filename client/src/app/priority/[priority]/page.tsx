"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetTasksQuery, useGetProjectsQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AlertCircle, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

const COLUMNS_SCHEMA: GridColDef[] = [
  { field: "title", headerName: "Task Title", width: 220, renderCell: (params) => <span className="font-bold">{params.value}</span> },
  { field: "status", headerName: "Current Status", width: 140, renderCell: (params) => (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-500">{params.value}</span>
  )},
  { field: "priority", headerName: "Priority Weight", width: 120 },
  { field: "tags", headerName: "Tags Mapped", width: 150 },
  { field: "dueDate", headerName: "Target Deadline", width: 150, renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : "No Deadline" },
];

export default function PriorityControlRoomPage() {
  const params = useParams();
  
  // Cleanly capitalize the priority slug string parameter (e.g. urgent -> Urgent)
  const plainPrioritySlug = String(params.priority || "medium");
  const capitalizedPriority = plainPrioritySlug.charAt(0).toUpperCase() + plainPrioritySlug.slice(1);

  const { data: projects } = useGetProjectsQuery();
  const firstProjectId = projects && projects.length > 0 ? projects[0].id : 1;
  
  const { data: tasks, isLoading, isError } = useGetTasksQuery({ projectId: firstProjectId }, { skip: !projects });

  // Filter tasks to only match the selected priority criteria
  const priorityFilteredTasks = tasks?.filter((task) => task.priority === capitalizedPriority) || [];

  if (isLoading) return <div className="p-8 text-gray-500 font-medium">Parsing target task density metrics...</div>;
  if (isError) return <div className="p-8 text-red-500 font-bold">Failed to pull operational weights data grids.</div>;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* BANNER LAYOUT */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className={`rounded-xl p-3 text-white ${
          capitalizedPriority === "Urgent" ? "bg-red-500" :
          capitalizedPriority === "High" ? "bg-orange-500" :
          capitalizedPriority === "Medium" ? "bg-blue-500" : "bg-gray-500"
        }`}>
          {capitalizedPriority === "Urgent" && <ShieldAlert size={24} />}
          {capitalizedPriority === "High" && <AlertTriangle size={24} />}
          {capitalizedPriority === "Medium" && <AlertCircle size={24} />}
          {capitalizedPriority === "Low" && <CheckCircle2 size={24} />}
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{capitalizedPriority} Pipeline Tasks</h1>
          <p className="text-xs text-gray-400">Isolated overview of operational tickets running at {capitalizedPriority} weight indexes.</p>
        </div>
      </div>

      {/* CORE DATA GRID LAYOUT CONTAINER */}
      <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        {priorityFilteredTasks.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 font-medium">No tasks found currently operating under the "{capitalizedPriority}" weight parameter.</div>
        ) : (
          <div className="h-[550px] w-full">
            <DataGrid
              rows={priorityFilteredTasks}
              columns={COLUMNS_SCHEMA}
              getRowId={(row) => row.id}
              className="border-none text-gray-900 dark:text-white"
              sx={{
                "& .MuiDataGrid-cell": { borderBottom: "1px solid var(--stroke-dark, #f3f4f6)" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "transparent", borderBottom: "2px solid var(--stroke-dark, #e5e7eb)" },
                dark: {
                  "& .MuiDataGrid-cell": { borderBottom: "1px solid #2d3748" },
                  "& .MuiDataGrid-columnHeaders": { borderBottom: "2px solid #2d3748" },
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}