"use client";

import React, { useState } from "react";
import { useCreateTaskMutation } from "@/state/api";
import { X, ClipboardPlus, Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
};

export default function ModalCreateTask({ isOpen, onClose, projectId }: Props) {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const result = await createTask({
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
        projectId,
        authorUserId: 1, // Controller handles fallback if user table is uninitialized
        assignedUserId: assignedUserId ? parseInt(assignedUserId) : undefined,
      }).unwrap();

      console.log("Task mapped and saved successfully:", result);

      // Clean inputs upon successful transaction
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setPriority("Medium");
      setTags("");
      setStartDate("");
      setDueDate("");
      setAssignedUserId("");
      onClose();
    } catch (err: any) {
      // Extrapolate exact error strings out of the RTK Query container layout
      const serverErrorMessage = err?.data?.message || err?.message || JSON.stringify(err);
      console.error("Critical Server Rejection Message:", serverErrorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-dark-secondary border border-gray-200 dark:border-stroke-dark rounded-2xl shadow-xl overflow-hidden transform animate-in zoom-in-95 duration-200">
        
        {/* HEADER BLOCK */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-stroke-dark/60">
          <div className="flex items-center gap-2">
            <ClipboardPlus className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h2 className="text-md font-black text-gray-900 dark:text-white uppercase tracking-tight">Create Task</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg transition">
            <X size={18} />
          </button>
        </div>

        {/* INPUT FORM VIEW */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Integrate Auth Guard middleware"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition"
            />
          </div>

          <div>
            <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
            <textarea
              placeholder="Outline specific sub-tasks or execution steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition"
              >
                <option value="To Do">To Do</option>
                <option value="Work In Progress">Work In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="frontend, bug, optimization"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition"
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

          <div>
            <label className="block text-3xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Assignee User ID</label>
            <input
              type="number"
              placeholder="Leave blank for unassigned"
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white transition"
            />
          </div>

          {/* ACTION BUTTONS FOOTER */}
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl shadow-md shadow-blue-500/10 transition"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Add Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}