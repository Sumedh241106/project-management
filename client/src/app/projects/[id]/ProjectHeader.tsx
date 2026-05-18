"use client";

import React, { useState } from "react";
import { Grid3X3, List, Clock, ShieldAlert, PlusSquare } from "lucide-react";
import ModalNewTask from "@/components/ModalNewTask";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  projectId: number;
};

export default function ProjectHeader({ activeTab, setActiveTab, projectId }: Props) {
  const [isModalCreateTaskOpen, setIsModalCreateTaskOpen] = useState(false);

  const tabs = [
    { name: "Board", icon: Grid3X3 },
    { name: "List", icon: List },
    { name: "Timeline", icon: Clock },
    { name: "Urgent", icon: ShieldAlert },
  ];

  return (
    <div className="px-6 py-4 bg-white dark:bg-dark-secondary border-b border-gray-200 dark:border-stroke-dark">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* TABS SELECTION STRIP */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gray-100 dark:bg-dark-tertiary text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-dark-tertiary/40"
                }`}
              >
                <Icon size={14} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* TASK CREATION MODAL TOGGLE TRIGGER */}
        <button
          onClick={() => setIsModalCreateTaskOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-500/10 transition self-start sm:self-auto"
        >
          <PlusSquare size={14} />
          <span>New Task</span>
        </button>
      </div>

      <ModalNewTask
        isOpen={isModalCreateTaskOpen}
        onClose={() => setIsModalCreateTaskOpen(false)}
        id={projectId.toString()}
      />
    </div>
  );
}