"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";
import { User, Shield, Moon, Sun, Mail, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (!isLoaded) {
    return <div className="p-8 text-gray-500 font-medium">Loading security parameters...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1000px] mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">User Configuration Control</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage account session states and interface layout modes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* CORE PROFILE CARD */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary md:col-span-1 text-center flex flex-col items-center">
          <div className="relative h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-black text-white uppercase shadow-md">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              user?.username?.substring(0, 2) || "NX"
            )}
            <div className="absolute bottom-0 right-0 rounded-full bg-green-500 p-1.5 border-2 border-white dark:border-dark-secondary" />
          </div>
          <h2 className="text-md font-bold text-gray-900 dark:text-white mt-4">{user?.fullName || user?.username || "Nexus Member"}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{user?.primaryEmailAddress?.emailAddress}</p>
          
          <div className="mt-4 flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-2xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle size={12} /> Account Verified
          </div>
        </div>

        {/* PROFILE SETTINGS DETAILS MATRIX */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary md:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-stroke-dark pb-2">Workspace Layout & Theme</h3>
          
          {/* THEME TOGGLE ELEMENT */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-dark-tertiary">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2 text-gray-700 shadow-sm dark:bg-dark-secondary dark:text-gray-300">
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-white">Interface Theme Wrapper</h4>
                <p className="text-2xs text-gray-400">Toggle dark styling across layouts.</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                isDarkMode ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isDarkMode ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>

          {/* META ATTRIBUTE INFOS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-stroke-dark pb-2">Metadata Signatures</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <WidgetInfoRow label="User Account ID" value={user?.id || "N/A"} />
              <WidgetInfoRow label="Primary Username" value={user?.username || "Not assigned"} />
              <WidgetInfoRow label="Phone Contact" value={user?.primaryPhoneNumber?.phoneNumber || "No Verified Mobile"} />
              <WidgetInfoRow label="Last Sessions Synchronized" value={new Date().toLocaleDateString()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const WidgetInfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-stroke-dark dark:bg-dark-tertiary/50">
    <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
    <p className="text-xs font-bold text-gray-800 dark:text-white mt-0.5 truncate">{value}</p>
  </div>
);