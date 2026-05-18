"use client";

import React, { useState } from "react";
import { useCreateTaskMutation } from "@/state/api";
import { X, ClipboardPlus } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

export default function ModalNewTask({ isOpen, onClose, id }: Props) {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status: "To Do",
        priority: "Medium",
        tags: tags.trim() || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        projectId: Number(id),
        authorUserId: 1,
      }).unwrap();

      setTitle("");
      setDescription("");
      setTags("");
      setStartDate("");
      setDueDate("");
      onClose();
    } catch (error) {
      console.error("Failed to construct task entry node payload:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-dark-secondary border border-gray-200 dark:border-stroke-dark rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b dark:border-stroke-dark">
          <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <ClipboardPlus size={18} className="text-blue-600" />
            <span>Create New Task Ticket</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-gray-50 border rounded-xl dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white"
          />
          <textarea
            placeholder="Task description metrics..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-gray-50 border rounded-xl dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white resize-none"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-gray-50 border rounded-xl dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white"
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
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-gray-50 border rounded-xl dark:bg-dark-tertiary dark:border-stroke-dark dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-500 disabled:bg-blue-600/40 transition"
          >
            {isLoading ? "Provisioning..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}