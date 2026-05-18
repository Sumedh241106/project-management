"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { Plus, MessageSquare, Paperclip, EllipsisVertical } from "lucide-react";
import { format } from "date-fns";

type Props = {
  id: string;
  setIsModalNewTaskOpen: () => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: Props) => {
  // FIX: Force RTK Query to skip the network call until Next.js fully hydrates the ID string
  const projectIdNumber = Number(id);
  const { data: tasks, isLoading, isError } = useGetTasksQuery(
    { projectId: projectIdNumber },
    { skip: !id || isNaN(projectIdNumber) }
  );
  
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const taskId = Number(draggableId.replace("task-", ""));
    const newStatus = destination.droppableId;

    try {
      await updateTaskStatus({ taskId, status: newStatus }).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  if (isLoading) return <div className="py-6 text-gray-500">Loading board columns...</div>;
  if (isError) return <div className="py-6 text-red-500">Error loading project board. Check backend connectivity.</div>;
  if (!tasks) return <div className="py-6 text-gray-500">No tasks array found.</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => {
          const filteredTasks = tasks.filter((t) => t.status === status);

          return (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="rounded-lg bg-gray-100 p-4 dark:bg-dark-secondary min-h-[500px] flex flex-col"
                >
                  {/* COLUMN HEADER */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${
                        status === "To Do" ? "bg-gray-400" :
                        status === "Work In Progress" ? "bg-blue-500" :
                        status === "Under Review" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                      <h3 className="text-md font-bold text-gray-700 dark:text-gray-200">{status}</h3>
                      <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-dark-tertiary dark:text-gray-400">
                        {filteredTasks.length}
                      </span>
                    </div>
                    <button onClick={setIsModalNewTaskOpen} className="text-gray-500 hover:text-blue-500">
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* CARDS CONTAINER */}
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {filteredTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-stroke-dark dark:bg-dark-tertiary hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                task.priority === "Urgent" ? "bg-red-100 text-red-700" :
                                task.priority === "High" ? "bg-orange-100 text-orange-700" :
                                "bg-blue-100 text-blue-700"
                              }`}>
                                {task.priority}
                              </span>
                              <EllipsisVertical size={16} className="text-gray-400" />
                            </div>

                            <h4 className="mt-2 text-md font-bold text-gray-800 dark:text-white">{task.title}</h4>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {task.description || "No description provided."}
                            </p>

                            {task.tags && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {task.tags.split(",").map((tag) => (
                                  <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-dark-bg dark:text-gray-400">
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400 dark:border-stroke-dark">
                              <span>{task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No due date"}</span>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-0.5"><MessageSquare size={12} /> 2</span>
                                <span className="flex items-center gap-0.5"><Paperclip size={12} /> 1</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default BoardView;