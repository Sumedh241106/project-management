"use client";

import React, { useState } from "react";
import { 
  Home, 
  Timeline, 
  Search, 
  Settings, 
  User as UserIcon, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  PlusCircle, 
  FolderLock,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetProjectsQuery } from "@/state/api";
import ModalCreateProject from "@/components/ModalCreateProject";

export default function Sidebar() {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriorities, setShowPriorities] = useState(true);
  const [isModalCreateProjectOpen, setIsModalCreateProjectOpen] = useState(false);

  const pathname = usePathname();
  const { data: projects } = useGetProjectsQuery();

  const sidebarLinks = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Timeline, label: "Timeline", href: "/timeline" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: UserIcon, label: "Users", href: "/users" },
    { icon: Users, label: "Teams", href: "/teams" },
  ];

  return (
    <div className="fixed flex flex-col h-full w-64 bg-white dark:bg-dark-secondary border-r border-gray-200 dark:border-stroke-dark z-50 transition-all duration-300">
      {/* SIDEBAR HEADER / BRANDING */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-stroke-dark">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <span className="text-xl font-black text-gray-900 dark:text-white tracking-wider uppercase">NEXUS</span>
        </div>
      </div>

      {/* USER PROFILE CARD */}
      <div className="flex items-center gap-3 px-6 py-4 mx-4 my-3 bg-gray-50 dark:bg-dark-tertiary rounded-xl border border-gray-100 dark:border-stroke-dark/40">
        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-xs uppercase">
          S
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-none">Sumedh</h3>
          <span className="inline-flex items-center gap-1 text-3xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            <FolderLock size={8} /> Private Hub
          </span>
        </div>
      </div>

      {/* CORE NAVIGATION LINKS */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-dark-tertiary hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <hr className="my-4 border-gray-100 dark:border-stroke-dark/40" />

        {/* PROJECTS SECTION LAYER */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-4 py-2 text-3xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            <button
              onClick={() => setShowProjects(!showProjects)}
              className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              <span>Projects</span>
              {showProjects ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            
            {/* REAL MODAL CREATION OPEN TRIGGER */}
            <button
              onClick={() => setIsModalCreateProjectOpen(true)}
              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150 transform hover:scale-110"
              title="Create New Project Pipeline"
            >
              <PlusCircle size={15} />
            </button>
          </div>

          {showProjects && (
            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
              {projects && projects.length > 0 ? (
                projects.map((project) => {
                  const isActive = pathname === `/projects/${project.id}`;
                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? "bg-gray-100 dark:bg-dark-tertiary text-blue-600 dark:text-blue-400"
                          : "text-gray-500 hover:bg-gray-50/60 dark:text-gray-400 dark:hover:bg-dark-tertiary/40"
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${isActive ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`} />
                      <span className="truncate">{project.name}</span>
                    </Link>
                  );
                })
              ) : (
                <p className="px-4 py-2 text-3xs font-bold text-gray-400/80 italic tracking-wide">
                  No active repositories found
                </p>
              )}
            </div>
          )}
        </div>

        <hr className="my-4 border-gray-100 dark:border-stroke-dark/40" />

        {/* PRIORITIES ACCORDION SECTION */}
        <div className="space-y-1">
          <button
            onClick={() => setShowPriorities(!showPriorities)}
            className="flex items-center gap-1 w-full px-4 py-2 text-3xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition text-left"
          >
            <span>Priorities</span>
            {showPriorities ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showPriorities && (
            <div className="space-y-0.5">
              {[
                { label: "Urgent", color: "text-red-500 bg-red-500" },
                { label: "High", color: "text-yellow-500 bg-yellow-500" },
                { label: "Medium", color: "text-blue-500 bg-blue-500" },
                { label: "Low", color: "text-gray-400 bg-gray-400" },
              ].map((prio) => (
                <Link
                  key={prio.label}
                  href={`/priority/${prio.label.toLowerCase()}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-dark-tertiary"
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${prio.color}`} />
                  <span>{prio.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* CREATE PROJECT DIALOG FORM WINDOW */}
      <ModalCreateProject 
        isOpen={isModalCreateProjectOpen} 
        onClose={() => setIsModalCreateProjectOpen(false)} 
      />
    </div>
  );
}