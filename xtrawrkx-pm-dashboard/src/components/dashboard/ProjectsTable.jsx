"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table } from "../ui";
import {
  Plus,
  Eye,
  Calendar,
  Users,
  X,
  ArrowRight,
} from "lucide-react";

const ProjectsTable = ({ data }) => {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProject = (project) => {
    if (project?.slug) {
      router.push(`/projects/${project.slug}`);
    } else if (project?.id) {
      router.push(`/projects/${project.id}`);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase().replace(/\s+/g, "-") || "";
    switch (statusLower) {
      case "active":
      case "in-progress":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-400",
        };
      case "planning":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-400",
        };
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-400",
        };
      case "on-hold":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-400",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-400",
        };
    }
  };

  const columns = [
    {
      key: "name",
      label: "PROJECT",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${row.color || "from-blue-400 to-blue-600"} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            <span className="text-white text-sm font-bold">
              {row.initials || value?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {value}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "dueDate",
      label: "DUE DATE",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-700">{value || "No due date"}</span>
        </div>
      ),
    },
  ];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <p className="text-gray-900 font-semibold text-base mb-2">
        You don&apos;t have any projects
      </p>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Create your first project to get started.
      </p>
    </div>
  );

  const NewProjectCard = () => (
    <div
      onClick={() => router.push("/projects/add")}
      className="rounded-2xl bg-gradient-to-br from-orange-50/80 to-pink-50/60 backdrop-blur-md border-2 border-dashed border-orange-200/70 p-4 hover:from-orange-100/90 hover:to-pink-100/70 hover:border-orange-300/80 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center min-h-[80px] group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center group-hover:from-orange-600 group-hover:to-pink-600 transition-all duration-300 shadow-md">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
            Create New Project
          </span>
          <p className="text-xs text-gray-500">Start a new project</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Projects</h3>
            <p className="text-sm text-gray-500 mt-1">
              Track your current projects and progress
            </p>
          </div>
          <button
            onClick={() => router.push("/projects")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-x-auto">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <NewProjectCard />
            <div className="rounded-3xl overflow-hidden">
              <Table
                columns={columns}
                data={data}
                onRowClick={handleViewProject}
                className="min-w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTable;
