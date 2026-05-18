"use client";

import { useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import Header from "@/components/Header";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const columns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "priority", headerName: "Priority", width: 130 },
  { field: "dueDate", headerName: "Due Date", width: 200 },
  { field: "authorUserId", headerName: "Author ID", width: 150 },
];

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const { data: tasks, isLoading, isError } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div className="p-5">Loading...</div>;
  if (isError) return <div className="p-5">Error fetching tasks</div>;

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
        />
      </div>
      <DataGrid
        rows={tasks || []}
        columns={columns}
        className="bg-white shadow dark:bg-dark-tertiary dark:text-white"
        sx={{
          "& .MuiDataGrid-cell": { color: "inherit" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "inherit" },
        }}
      />
    </div>
  );
};

export default TableView;