"use client";

import React, { useState } from "react";
import KanbanBoard from "../../../../components/kanban/KanbanBoard";
import {
  Card,
  Avatar,
  Badge,
} from "../../../../../../../../../../components/ui";
// import { formatDate } from '@xtrawrkx/utils';
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { PageHeader } from "../../../../components/layout";
import { TaskFilterModal, NewTaskModal } from "../../../../components/tasks";

export default function TasksBoardPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [targetStage, setTargetStage] = useState("todo");
  const [filters, setFilters] = useState({
    assignee: "",
    priority: "",
    status: "",
    project: "",
  });

  // Tasks data in the new format
  const tasksData = {
    todo: [
      {
        id: "t1",
        title: "Design new landing page",
        description:
          "Create wireframes and mockups for the new landing page design",
        status: "todo",
        priority: "high",
        project: "Website Redesign",
        assignee: "Sarah Johnson",
        dueDate: "2024-02-15",
        estimatedHours: 8,
        tags: ["design", "frontend"],
      },
      {
        id: "t2",
        title: "Update API documentation",
        description: "Document the new endpoints and update the API reference",
        status: "todo",
        priority: "medium",
        project: "API Development",
        assignee: "Mike Chen",
        dueDate: "2024-02-20",
        estimatedHours: 4,
        tags: ["documentation", "api"],
      },
      {
        id: "t3",
        title: "Review client feedback",
        description:
          "Analyze and categorize feedback from the latest client survey",
        status: "todo",
        priority: "low",
        project: "Client Portal",
        assignee: "Jane Doe",
        dueDate: "2024-02-25",
        estimatedHours: 3,
        tags: ["feedback", "analysis"],
      },
    ],
    "in-progress": [
      {
        id: "t4",
        title: "Implement user authentication",
        description: "Set up OAuth2 and JWT token management",
        status: "in-progress",
        priority: "urgent",
        project: "CRM System",
        assignee: "John Smith",
        dueDate: "2024-02-10",
        estimatedHours: 12,
        tags: ["backend", "security"],
      },
      {
        id: "t5",
        title: "Database optimization",
        description: "Optimize queries and add proper indexing",
        status: "in-progress",
        priority: "high",
        project: "Performance",
        assignee: "Alex Wilson",
        dueDate: "2024-02-18",
        estimatedHours: 6,
        tags: ["database", "optimization"],
      },
    ],
    review: [
      {
        id: "t6",
        title: "Code review for payment module",
        description:
          "Review the implementation of the new payment processing module",
        status: "review",
        priority: "high",
        project: "Payment System",
        assignee: "Lisa Brown",
        dueDate: "2024-02-12",
        estimatedHours: 2,
        tags: ["code-review", "payments"],
      },
    ],
    completed: [
      {
        id: "t7",
        title: "Setup CI/CD pipeline",
        description: "Configure automated testing and deployment pipeline",
        status: "completed",
        priority: "medium",
        project: "DevOps",
        assignee: "Tom Davis",
        dueDate: "2024-01-30",
        estimatedHours: 8,
        tags: ["devops", "automation"],
      },
      {
        id: "t8",
        title: "Update user interface",
        description: "Apply the new design system to all components",
        status: "completed",
        priority: "high",
        project: "UI/UX",
        assignee: "Sarah Johnson",
        dueDate: "2024-02-05",
        estimatedHours: 16,
        tags: ["ui", "design-system"],
      },
    ],
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    console.log("Applied filters:", newFilters);
  };

  const handleNewTask = () => {
    setTargetStage("todo");
    setIsNewTaskModalOpen(true);
  };

  const handleColumnClick = (column) => {
    setTargetStage(column.id);
    setIsNewTaskModalOpen(true);
  };

  const handleAddTask = (newTask) => {
    console.log("Adding new task:", newTask, "to stage:", targetStage);
    setIsNewTaskModalOpen(false);
  };

  // Handle drag end - update task status
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Find the dragged task
    const sourceTasks = tasksData[source.droppableId];
    const draggedTask = sourceTasks.find(
      (task) => task.id.toString() === draggableId
    );

    if (draggedTask) {
      console.log("Task moved:", {
        task: draggedTask.title,
        from: source.droppableId,
        to: destination.droppableId,
        index: destination.index,
      });
    }
  };

  const handleTaskClick = (task) => {
    console.log("Task clicked:", task.title);
    // Navigate to task detail page
  };

  // Render individual task card
  const renderTaskCard = (task) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case "urgent":
          return "bg-red-100 text-red-800";
        case "high":
          return "bg-orange-100 text-orange-800";
        case "medium":
          return "bg-blue-100 text-blue-800";
        case "low":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case "completed":
          return <CheckCircle className="w-4 h-4 text-green-600" />;
        case "in-progress":
          return <Clock className="w-4 h-4 text-blue-600" />;
        case "blocked":
          return <AlertCircle className="w-4 h-4 text-red-600" />;
        default:
          return <Clock className="w-4 h-4 text-gray-400" />;
      }
    };

    const isOverdue = (dueDate) => {
      return new Date(dueDate) < new Date() && task.status !== "completed";
    };

    return (
      <Card
        className={`p-4 cursor-move bg-white border border-gray-200 hover:shadow-md transition-all ${
          isOverdue(task?.dueDate) ? "border-red-200 bg-red-50" : ""
        }`}
        onClick={() => handleTaskClick(task)}
      >
        {/* Task Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {getStatusIcon(task?.status)}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate mb-1">
                {task?.title || "Unknown"}
              </h4>
              {task?.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                task?.priority
              )}`}
            >
              {task?.priority || "N/A"}
            </span>
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-2 mb-3">
          {task?.project && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Project:</span>
              <span className="font-medium text-gray-900">{task.project}</span>
            </div>
          )}

          {task?.assignee && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Assignee:</span>
              <span className="font-medium text-gray-900">{task.assignee}</span>
            </div>
          )}

          {task?.dueDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Due:</span>
              <span
                className={`font-medium ${
                  isOverdue(task.dueDate) ? "text-red-600" : "text-gray-900"
                }`}
              >
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Task Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task?.tags &&
              task.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            {task?.tags && task.tags.length > 2 && (
              <span className="text-xs text-gray-400">
                +{task.tags.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {task?.estimatedHours && (
              <span className="text-xs text-gray-500">
                {task.estimatedHours}h
              </span>
            )}
            {isOverdue(task?.dueDate) && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      </Card>
    );
  };

  // Render column headers
  const renderColumnHeader = (columnId, cardsCount) => {
    const columnConfig = {
      todo: { title: "To Do", color: "border-gray-500", bg: "bg-gray-50" },
      "in-progress": {
        title: "In Progress",
        color: "border-blue-500",
        bg: "bg-blue-50",
      },
      review: {
        title: "Review",
        color: "border-yellow-500",
        bg: "bg-yellow-50",
      },
      completed: {
        title: "Completed",
        color: "border-green-500",
        bg: "bg-green-50",
      },
    };

    const config = columnConfig[columnId] || {
      title: columnId,
      color: "border-gray-500",
      bg: "bg-gray-50",
    };

    return (
      <div
        className={`${config.bg} rounded-lg p-4 mb-4 border-l-4 ${config.color}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">
            {config.title}
          </h3>
          <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
            {cardsCount}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tasks Board"
        subtitle="Organize and track your team's tasks"
        breadcrumbs={["Dashboard", "Delivery", "Tasks", "Board"]}
        actions={["filter", "new"]}
        searchPlaceholder="Search tasks..."
        onFilter={() => setIsFilterModalOpen(true)}
        onNew={handleNewTask}
      />

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900">8</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-gray-900">2</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-gray-900">2</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-red-600">1</div>
        </div>
      </div>

      {/* Tasks Board */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <KanbanBoard
          columns={tasksData}
          onDragEnd={handleDragEnd}
          renderCard={renderTaskCard}
          renderColumnHeader={renderColumnHeader}
          className="min-w-[1600px]"
        />
      </div>

      {/* Filter Modal */}
      <TaskFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={filters}
        setFilters={setFilters}
      />

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
        targetStage={targetStage}
      />
    </div>
  );
}
