"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
// IMPORT YOUR LOCAL REDUX PROVIDER WRAPPER HERE 
// (If your provider component is in state/StoreProvider, modify this import path accordingly)
import StoreProvider from "@/state"; 

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100">
        {/* Sidebar Component Fixed to Left */}
        <Sidebar />
        
        {/* Main App Page Layout on the Right Side */}
        <main className="flex flex-col w-full pl-64">
          <div className="p-6 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </StoreProvider>
  );
}