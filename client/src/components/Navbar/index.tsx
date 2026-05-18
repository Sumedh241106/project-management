"use client";

import React from "react";
import { Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux"; // 1. Import the hooks
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state"; // 2. Import the actions

const Navbar = () => {
  const dispatch = useAppDispatch(); // Setup the messenger
  
  // 3. Grab the current dark mode status from Redux
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black transition-colors duration-300">
      <div className="flex items-center gap-8">
        {isSidebarCollapsed && (
          <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
        {/* Search Input stays here */}
      </div>

      <div className="flex items-center">
        {/* 4. THE DARK MODE TOGGLE BUTTON */}
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))} // This sends the message to Redux!
          className={`rounded p-2 ${isDarkMode ? 'dark:hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>
        
        <Link href="/settings" className="h-min w-min rounded p-2 dark:hover:bg-gray-700">
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;