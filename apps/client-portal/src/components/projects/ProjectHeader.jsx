"use client";

import { Calendar, ArrowLeft, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectHeader({ 
  projectName = "Project Name",
  status = "active",
  dueDate,
  clientLogo,
  clientName,
  className = "" 
}) {
  const router = useRouter();

  const statusConfig = {
    active: {
      label: "Active",
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
    },
    completed: {
      label: "Completed",
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    pending: {
      label: "Pending",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    onHold: {
      label: "On Hold",
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    },
  };

  const selectedStatus = statusConfig[status] || statusConfig.active;

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 shadow-sm ${className}`}>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-sm text-gray-700">{projectName}</span>
      </div>

      {/* Project Info */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Client Logo */}
          {clientLogo ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={clientLogo}
                alt={clientName || "Client Logo"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2 truncate">
              {projectName}
            </h1>
            {clientName && (
              <p className="text-gray-600 text-sm mb-2">{clientName}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedStatus.bg} ${selectedStatus.text} ${selectedStatus.border} border`}>
                {selectedStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Due Date */}
        {dueDate && (
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            <Calendar className="w-4 h-4" />
            <div className="text-sm">
              <span className="font-medium">Due Date:</span>
              <span className="ml-1">{formatDate(dueDate)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
