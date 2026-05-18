"use client";

import React from "react";
import { Shield, Briefcase, Users } from "lucide-react";

export default function TeamsPage() {
  const mockTeams = [
    { id: 1, teamName: "Core Backend Engineering", productOwner: "Sumedh", projectManager: "System Master" },
    { id: 2, teamName: "Frontend UX Architecture", productOwner: "Sumedh", projectManager: "Unassigned" }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Directory</h1>
        <p className="text-xs text-gray-400">Operational team divisions, ownership credentials, and internal engineering pods.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {mockTeams.map((team) => (
          <div key={team.id} className="bg-white border border-gray-200 dark:border-stroke-dark dark:bg-dark-secondary rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 dark:bg-dark-tertiary rounded-xl">
                <Users size={18} />
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{team.teamName}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50 dark:border-stroke-dark/40 text-xs">
              <div>
                <span className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">Product Owner</span>
                <span className="inline-flex items-center gap-1 font-bold text-gray-700 dark:text-gray-300">
                  <Shield size={12} className="text-blue-500" />
                  {team.productOwner}
                </span>
              </div>
              <div>
                <span className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">Project Manager</span>
                <span className="inline-flex items-center gap-1 font-bold text-gray-500 dark:text-gray-400">
                  <Briefcase size={12} className="text-yellow-500" />
                  {team.projectManager}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}