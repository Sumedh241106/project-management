"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Briefcase, 
  FolderLock, 
  Home, 
  Search, 
  Settings, 
  GanttChart, 
  User, 
  Users 
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 bottom-0 flex flex-col h-full w-64 border-r border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black z-40">
      {/* TOP LOGO */}
      <div className="flex h-16 w-full items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
        <div className="text-xl font-bold tracking-wide text-gray-800 dark:text-white">
          EDLIST
        </div>
      </div>

      {/* TEAM SECTION */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200">
            ROHCON TEAM
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
            <FolderLock className="h-3 w-3" /> Private
          </p>
        </div>
      </div>

      {/* NAVBAR LINKS */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <SidebarLink icon={Home} label="Home" href="/" />
        <SidebarLink icon={GanttChart} label="Timeline" href="/timeline" />
        <SidebarLink icon={Search} label="Search" href="/search" />
        <SidebarLink icon={Settings} label="Settings" href="/settings" />
        <SidebarLink icon={User} label="Users" href="/users" />
        <SidebarLink icon={Users} label="Teams" href="/teams" />
      </nav>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href === "/" && pathname === "");

  return (
    <Link href={href} className="block w-full">
      <div
        className={`group relative flex items-center gap-3 rounded-md px-4 py-2.5 transition-colors font-medium text-sm ${
          isActive 
            ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-white" 
            : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-2 bottom-2 h-5 w-[3px] rounded-r bg-blue-600" />
        )}
        <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-blue-600 dark:text-white" : "text-gray-400 group-hover:text-gray-500"}`} />
        <span>{label}</span>
      </div>
    </Link>
  );
};