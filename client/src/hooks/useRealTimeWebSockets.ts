import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAppDispatch } from "@/app/redux";
import { api } from "@/state/api";

export const useRealTimeWebSockets = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("WebSocket client synchronization established cleanly.");
    });

    socket.on("tasks_mutation_triggered", (payload: { projectId: number }) => {
      console.log(`Real-Time Update: Task mutational shift detected for project ${payload.projectId}. Refetching state...`);
      // Force RTK Query to cleanly sweep and reload data elements matching tag schemas
      dispatch(api.util.invalidateTags(["Tasks"]));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};