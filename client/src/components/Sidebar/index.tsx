"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  FolderLock, 
  Home, 
  PlusCircle, 
  Search, 
  Settings, 
  GanttChart, 
  User, 
  Users 
} from "lucide-react";

export default function Sidebar() {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const pathname = usePathname();

  const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black bg-white w-64`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%]" flex-col="true" justify-start="true">
        {/* TOP LOGO */}
        <div className="flex w-full items-center justify-between px-6 pt-3 h-14">
          <div className="text-xl font-bold tracking-wide text-gray-800 dark:text-white">
            EDLIST
          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="flex items-center gap-3 border-y border-gray-200 px-8 py-4 dark:border-gray-700">
          <Briefcase className="h-6 w-6 text-gray-500 dark:text-gray-200" />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              ROHCON TEAM
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <FolderLock className="h-3 w-3" /> Private
            </p>
          </div>
        </div>

        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full px-2 py-4">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={GanttChart} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>
      </div>
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
    <Link href={href} className="w-full">
      <div
        className={`relative flex items-center gap-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-3 ${
          isActive ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-white" : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-[5px] bg-blue-600" />
        )}
        <Icon className="h-6 w-6 text-gray-500 dark:text-gray-200" />
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {label}
        </span>
      </div>
    </Link>
  );
};