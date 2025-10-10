"use client";

import React, { useState } from "react";
import { KanbanBoard, KanbanCard } from "./index";
// import { useDragDropBoard } from "../../lib/dragdrop"; // Removed - using react-beautiful-dnd now
import { formatDate } from "../../lib/utils";
import { Plus, Filter, Search, Calendar, Users, Clock } from "lucide-react";
import { ProjectBoardExport, AddProjectBoardModal } from "../projects";

// Custom Project Card Component
function ProjectCard({ item, columnId, itemIndex, isDragging, onDragStart, onDragEnd, onClick }) {

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planning":
        return "badge-gray";
      case "in-progress":
        return "badge-primary";
      case "review":
        return "badge-warning";
      case "completed":
        return "badge-success";
      case "on-hold":
        return "badge-error";
      default:
        return "badge-gray";
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(item)}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : 'hover:border-brand-primary/50'
      }`}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate mb-1">
            {item.name}
          </h4>
          <p className="text-sm text-gray-600 truncate">
            {item.client}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {item.progress}%
          </div>
          <div className="text-xs text-gray-500">
            {item.health}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Manager:</span>
          <span className="font-medium text-gray-900">{item.manager}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Team:</span>
          <span className="font-medium text-gray-900">{item.teamSize} members</span>
        </div>
        
        {item.dueDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Due:</span>
            <span className="font-medium text-gray-900">
              {formatDate(item.dueDate, 'en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Status and Tags */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          <span className={`badge ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
          {item.priority && (
            <span className={`badge ${
              item.priority === 'high' ? 'badge-error' : 
              item.priority === 'medium' ? 'badge-warning' : 'badge-success'
            }`}>
              {item.priority}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{item.estimatedHours}h</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsBoard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetStage, setTargetStage] = useState("planning");

  // Mock initial data
  const initialColumns = [
    {
      id: "planning",
      title: "Planning",
      color: "#fef3c7",
      items: [
        {
          id: "p1",
          name: "E-commerce Platform Redesign",
          client: "RetailCorp",
          progress: 15,
          health: "On Track",
          status: "planning",
          priority: "high",
          manager: "Sarah Johnson",
          teamSize: 5,
          dueDate: "2024-03-15",
          estimatedHours: 120,
        },
        {
          id: "p2",
          name: "Mobile App Development",
          client: "StartupXYZ",
          progress: 5,
          health: "At Risk",
          status: "planning",
          priority: "medium",
          manager: "Mike Chen",
          teamSize: 3,
          dueDate: "2024-04-01",
          estimatedHours: 200,
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "#dbeafe",
      items: [
        {
          id: "p3",
          name: "CRM Integration Project",
          client: "TechCorp",
          progress: 65,
          health: "On Track",
          status: "in-progress",
          priority: "high",
          manager: "John Smith",
          teamSize: 4,
          dueDate: "2024-02-28",
          estimatedHours: 80,
        },
        {
          id: "p4",
          name: "Website Migration",
          client: "Global Solutions",
          progress: 45,
          health: "On Track",
          status: "in-progress",
          priority: "medium",
          manager: "Jane Doe",
          teamSize: 2,
          dueDate: "2024-02-15",
          estimatedHours: 60,
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "#e0e7ff",
      items: [
        {
          id: "p5",
          name: "Analytics Dashboard",
          client: "DataCorp",
          progress: 90,
          health: "On Track",
          status: "review",
          priority: "low",
          manager: "Alex Wilson",
          teamSize: 3,
          dueDate: "2024-01-30",
          estimatedHours: 40,
        },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      color: "#d1fae5",
      items: [
        {
          id: "p6",
          name: "Brand Identity Package",
          client: "CreativeCo",
          progress: 100,
          health: "On Track",
          status: "completed",
          priority: "medium",
          manager: "Lisa Brown",
          teamSize: 2,
          dueDate: "2024-01-15",
          estimatedHours: 30,
        },
      ],
    },
  ];

  const handleItemDrop = (item, sourceColumnId, targetColumnId, newIndex) => {
    console.log("Project moved:", {
      item: item.name,
      from: sourceColumnId,
      to: targetColumnId,
      index: newIndex,
    });
    
    // Here you would typically make an API call to update the project status
    // Example:
    // fetch(`/api/projects/${item.id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: targetColumnId })
    // });
  };

  const handleProjectClick = (project, columnId) => {
    console.log("Project clicked:", project.name, "in column:", columnId);
    // Navigate to project detail page
    // router.push(`/delivery/projects/${project.id}`);
  };

  const handleAddProject = (column) => {
    setTargetStage(column.id);
    setIsAddModalOpen(true);
  };

  const handleAddProjectFromModal = (newProject, stage) => {
    console.log("Adding new project:", newProject, "to stage:", stage);
    // Here you would typically make an API call to create the project
    // Then update the local state or refetch data
    setIsAddModalOpen(false);
  };

  const handleExport = (format, data) => {
    console.log(`Exporting ${data.length} projects as ${format}`);
  };

  return (
    <div className="space-y-4 w-full max-w-full">

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Active Projects</div>
          <div className="text-2xl font-bold text-gray-900">6</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Team Members</div>
          <div className="text-2xl font-bold text-gray-900">19</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Progress</div>
          <div className="text-2xl font-bold text-gray-900">53%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">On Track</div>
          <div className="text-2xl font-bold text-gray-900">5/6</div>
        </div>
      </div>

      {/* Projects Board */}
      <div className="bg-white rounded-xl shadow-card border border-brand-border/50 p-6 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <KanbanBoard
            initialColumns={initialColumns}
            onItemDrop={handleItemDrop}
            onItemClick={handleProjectClick}
            onColumnClick={handleAddProject}
            cardComponent={ProjectCard}
            showColumnStats={true}
            className="min-h-[600px]"
          />
        </div>
      </div>

      {/* Add Project Modal */}
      <AddProjectBoardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={handleAddProjectFromModal}
        targetStage={targetStage}
      />
    </div>
  );
}
