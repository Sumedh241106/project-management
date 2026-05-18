"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useRealTimeWebSockets } from "@/hooks/useRealTimeWebSockets";

const AuthGatekeeper = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Run the background subscription pipeline
  useRealTimeWebSockets();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      if (pathname !== "/sign-in" && pathname !== "/sign-up") {
        router.push("/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="text-sm font-semibold text-gray-500">Initializing workspace session...</div>
      </div>
    );
  }

  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return <>{children}</>;
  }

  return <>{children}</>;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100">
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "pl-64"
        } transition-all duration-300`}
      >
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <StoreProvider>
        <AuthGatekeeper>
          <DashboardLayout>{children}</DashboardLayout>
        </AuthGatekeeper>
      </StoreProvider>
    </ClerkProvider>
  );
};

export default DashboardWrapper;