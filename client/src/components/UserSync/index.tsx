"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import axios from "axios";

const UserSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && user) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
          
          await axios.post(`${baseUrl}/users`, {
            username: user.username || user.firstName || "User",
            cognitoId: user.id, 
            email: user.emailAddresses[0].emailAddress,
            profilePictureUrl: user.imageUrl || "i1.jpg",
          });
          
          console.log("Database Sync Complete");
        } catch (error) {
          console.error("Sync failed:", error);
        }
      }
    };

    syncUser();
  }, [isLoaded, user]);

  return null;
};

export default UserSync;