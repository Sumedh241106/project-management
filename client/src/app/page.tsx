"use client";

import React from "react";
import { useGetProjectsQuery, useGetTasksQuery, useGetUsersQuery } from "@/state/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { Briefcase, CheckCircle2, AlertTriangle, Users, TrendingUp, Clock } from "lucide-react";

export default function HomePage() {
  const { data: projects, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  
  // Aggregate tasks dataset safely by looking into project instances
  const firstProjectId = projects && projects.length > 0 ? projects[0].id : 1;
  const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery({ projectId: firstProjectId }, { skip: !projects });

  if (projectsLoading || usersLoading || tasksLoading) {
    return <div className="p-8 text-gray-500 font-medium">Assembling executive workspace metrics...</div>;
  }

  // 1. Calculate high-level summary KPIs
  const totalProjects = projects?.length || 0;
  const totalUsers = users?.length || 0;
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === "Completed").length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 2. Data transformation for Status Distribution
  const statusCounts = { "To Do": 0, "Work In Progress": 0, "Under Review": 0, "Completed": 0 };
  tasks?.forEach(t => {
    if (t.status && t.status in statusCounts) {
      statusCounts[t.status as keyof typeof statusCounts]++;
    }
  });
  const statusData = Object.keys(statusCounts).map(key => ({
    name: key,
    count: statusCounts[key as keyof typeof statusCounts]
  }));

  // 3. Data transformation for Priority Breakdown
  const priorityCounts = { "Urgent": 0, "High": 0, "Medium": 0, "Low": 0 };
  tasks?.forEach(t => {
    if (t.priority && t.priority in priorityCounts) {
      priorityCounts[t.priority as keyof typeof priorityCounts]++;
    }
  });
  const priorityData = Object.keys(priorityCounts).map(key => ({
    name: key,
    value: priorityCounts[key as keyof typeof priorityCounts]
  }));

  const PRIORITY_COLORS = ["#EF4444", "#F97316", "#3B82F6", "#6B7280"];

  return (
    <div className="space-y-6 p-2 md:p-6 max-w-[1600px] mx-auto">
      {/* HEADER ROW */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Workspace Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Real-time system operational metrics and project telemetry.</p>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <WidgetKPICard icon={<Briefcase className="text-blue-500" />} title="Active Projects" value={totalProjects} description="Managed repositories" />
        <WidgetKPICard icon={<Clock className="text-yellow-500" />} title="Total Tasks Tracking" value={totalTasks} description="Assigned pipeline tickets" />
        <WidgetKPICard icon={<CheckCircle2 className="text-green-500" />} title="Task Completion" value={`${completionRate}%`} description={`${completedTasks} closed items`} />
        <WidgetKPICard icon={<Users className="text-purple-500" />} title="Active Directory" value={totalUsers} description="Team members active" />
      </div>

      {/* CHARTS GRAPH SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* BAR CHART: PIPELINE STATUS DISTRIBUTION */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-md font-bold text-gray-800 dark:text-white">Workflow Pipeline Distribution</h3>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Live Feed</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ background: "#1f1f2e", borderRadius: "8px", border: "none", color: "#fff" }} />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART: PRIORITY DENSITY WEIGHT RATIOS */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-md font-bold text-gray-800 dark:text-white">Priority Density Weight</h3>
            <AlertTriangle size={16} className="text-gray-400" />
          </div>
          <div className="relative flex h-[250px] items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1f1f2e", borderRadius: "8px", border: "none", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* LEGEND MAPPERS */}
          <div className="flex justify-center gap-4 text-xs font-semibold mt-2">
            {priorityData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[index] }} />
                <span className="text-gray-500 dark:text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* REUSABLE COMPONENT WIDGET KPI CARD */
interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
}

const WidgetKPICard = ({ icon, title, value, description }: KPICardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-stroke-dark dark:bg-dark-secondary">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{title}</span>
        <div className="rounded-lg bg-gray-50 p-2 dark:bg-dark-tertiary">{icon}</div>
      </div>
      <div className="mt-2">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h2>
        <p className="mt-1 text-xs text-gray-400 font-medium">{description}</p>
      </div>
    </div>
  );
};