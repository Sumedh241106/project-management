"use client";

import React, { useState, useEffect } from "react";
import { useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import { Search, Briefcase, CheckSquare, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 4000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: projects, isLoading: projectsLoading } = useGetProjectsQuery();

  const filteredProjects = projects?.filter((p) => 
    p.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(debouncedTerm.toLowerCase())
  ) || [];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Search Hub</h1>
        <p className="text-xs text-gray-400">Query globally indexed entities, repository descriptions, and pipeline entries.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects by metadata, title descriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-secondary dark:border-stroke-dark dark:text-white shadow-xs transition"
        />
      </div>

      <div className="space-y-4">
        {debouncedTerm && (
          <h3 className="text-3xs font-extrabold uppercase tracking-widest text-gray-400">
            Results for: {debouncedTerm}
          </h3>
        )}

        {projectsLoading ? (
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold py-6">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            <span>Searching database logs...</span>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-3">
            {filteredProjects.map((project) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.id}`}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500/40 hover:shadow-md transition dark:bg-dark-secondary dark:border-stroke-dark"
              >
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-dark-tertiary">
                  <Briefcase size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{project.name}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{project.description || "No description provided."}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          debouncedTerm && (
            <div className="flex items-center gap-2 p-4 bg-gray-50 text-gray-400 rounded-xl dark:bg-dark-secondary/40 border dark:border-stroke-dark/40 text-xs font-bold">
              <AlertCircle size={14} />
              <span>No matching records discovered in active repository clusters.</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}