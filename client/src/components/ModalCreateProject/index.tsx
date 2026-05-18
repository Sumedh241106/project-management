"use client";

import React, { useState } from "react";
import { useCreateProjectMutation } from "@/state/api";
import { X, FolderPlus, Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalCreateProject({ isOpen, onClose }: Props) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createProject({
        name,
        description,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
      }).unwrap();
      
      // Reset form states and close close overlay
      setName("");
      setDescription("");
      setStartDate("");
      setDueDate("");
      onClose();
    } catch (error) {
      console.error("Failed to register project operational matrix:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-dark-secondary border border-gray-200 dark:border-stroke-dark rounded-2xl shadow-xl overflow-hidden transform animate-in zoom-in-95 duration-200">
        
        {/* DIALOG HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-stroke-dark/60">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h2 className="text-md font-black text-gray-900 dark:text-white uppercase tracking-tight">Create Project</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* DIALOG BODY FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Q4 Product Rollout"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition"
            />
          </div>

          <div>
            <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
            <textarea
              placeholder="Brief summary of repository scope and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition"
              />
            </div>
            <div>
              <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition"
              />
            </div>
          </div>

          {/* ACTION BUTTONS FOOTER CONTAINER */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50 dark:border-stroke-dark/40 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-dark-tertiary rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl shadow-md shadow-blue-500/10 transition dynamic-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Provisioning...</span>
                </>
              ) : (
                <span>Build Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}