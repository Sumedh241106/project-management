"use client";

import React from "react";
import { useGetUsersQuery } from "@/state/api";
import Header from "@/components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppSelector } from "../redux";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div className="p-8">Loading users...</div>;
  if (isError || !users) return <div className="p-8">Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div className="mt-8 h-[600px] w-full">
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId || row.cognitoId}
          className={isDarkMode ? "bg-dark-secondary text-white" : "bg-white"}
          sx={{
            "& .MuiDataGrid-cell": {
              color: isDarkMode ? "white" : "black",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: isDarkMode ? "#1d1f21" : "#f3f4f6",
              color: isDarkMode ? "white" : "black",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Users;