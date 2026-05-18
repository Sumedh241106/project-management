"use client";

import React, { useState } from "react";
import { useCreateProjectMutation } from "@/state/api";
import { X, FolderPlus, Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalNewProject({ isOpen, onClose }: Props) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      await createProject({
        name: projectName,
        description: description.trim() || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        dueDate: endDate ? new Date(endDate).toISOString() : undefined,
      }).unwrap();

      setProjectName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      onClose();
    } catch (error) {
      console.error("Failed to construct new project asset block:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-dark-secondary border border-gray-200 dark:border-stroke-dark rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b dark:border-stroke-dark">
          <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <FolderPlus size={18} className="text-blue-600" />
            <span>Create New Project</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-gray-50 border rounded-xl dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-gray-50 border rounded-xl dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-gray-50 border rounded-xl dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-gray-50 border rounded-xl dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-500 disabled:bg-blue-600/40 transition"
          >
            {isLoading ? "Provisioning..." : "Build Project"}
          </button>
        </form>
      </div>
    </div>
  );
}