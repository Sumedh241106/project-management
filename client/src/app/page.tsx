"use client";

import React from "react";
import { useGetProjectsQuery } from "@/state/api";

export default function Home() {
  const { data: projects, isLoading, error } = useGetProjectsQuery();

  if (isLoading) return <div className="p-4">Loading application metrics...</div>;
  if (error) return <div className="p-4 text-red-500">Error fetching system metrics.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Assembling executive workspace metrics...
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project: any) => (
          <div 
            key={project.id} 
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black"
          >
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{project.description || "No description provided."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}