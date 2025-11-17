"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Calendar,
  User,
  Target,
  Building2,
  Tag,
  Plus,
  X,
  Clock,
  AlertCircle,
  CheckSquare,
} from "lucide-react";
import { Card } from "../../../components/ui/Card.jsx";
import { Input } from "../../../components/ui/Input.jsx";
import { Select } from "../../../components/ui/Select.jsx";
import { teamMembers, projects, clients } from "../../../data/centralData";

export default function AddTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectId: "",
    assigneeId: "",
    dueDate: "",
    time: "",
    priority: "medium",
    status: "To Do",
    tags: [],
    progress: 0,
  });

  const [newTag, setNewTag] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [errors, setErrors] = useState({});

  // Early return if data is not available
  if (!projects || !teamMembers || !clients) {
    return (
      <div className="min-h-screen bg-white p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading task data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Priority options
  const priorityOptions = [
    {
      value: "low",
      label: "Low",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      value: "high",
      label: "High",
      color: "bg-red-100 text-red-700 border-red-200",
    },
  ];

  // Status options
  const statusOptions = [
    {
      value: "To Do",
      label: "To Do",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      value: "In Progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      value: "In Review",
      label: "In Review",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      value: "Done",
      label: "Done",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      value: "Backlog",
      label: "Backlog",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
  ];

  // Project options
  const projectOptions = Object.values(projects).map((project) => ({
    value: project.id,
    label: project.name,
    color: project.color,
    icon: project.icon,
  }));

  // Team member options
  const teamOptions = Object.values(teamMembers).map((member) => ({
    value: member.id,
    label: member.name,
    role: member.role,
    avatar: member.avatar,
    color: member.color,
  }));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskObj = {
        id: Date.now(),
        name: newSubtask.trim(),
        status: "To Do",
      };
      setSubtasks([...subtasks, newSubtaskObj]);
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== subtaskId));
  };

  const handleSubtaskStatusChange = (subtaskId, newStatus) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Task name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = "Assignee is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get project and assignee details
      const project = projects[formData.projectId];
      const assignee = teamMembers[formData.assigneeId];

      // Format due date
      const dueDate = new Date(formData.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Create new task data
      const newTask = {
        id: Date.now(), // In a real app, this would be generated by the backend
        name: formData.name,
        description: formData.description,
        project: {
          name: project.name,
          color: project.color,
          icon: project.icon,
        },
        assignee: assignee.name,
        dueDate: dueDate,
        time: formData.time || null,
        status: formData.status,
        progress: formData.progress,
        hasMultipleAssignees: false,
        borderColor: `border-${formData.priority === "high" ? "red" : formData.priority === "medium" ? "yellow" : "green"}-400`,
        projectId: formData.projectId,
        assigneeId: formData.assigneeId,
        priority: formData.priority,
        tags: formData.tags,
        subtasks: subtasks,
      };

      // In a real app, you would save this to your backend
      console.log("New task data:", newTask);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to tasks page
      router.push("/my-task");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProject = formData.projectId
    ? projects[formData.projectId]
    : null;
  const selectedAssignee = formData.assigneeId
    ? teamMembers[formData.assigneeId]
    : null;

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-6">
          <PageHeader
            title="Create New Task"
            subtitle="Add a new task and assign it to a team member"
            breadcrumb={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "My Tasks", href: "/my-task" },
              { label: "Create Task", href: "/tasks/add" },
            ]}
            showSearch={false}
            showActions={false}
          />
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Task Name"
                    placeholder="Enter task name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={errors.name}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Description
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      placeholder="Describe the task requirements and goals"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className={`block w-full rounded-lg border shadow-sm px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none ${
                        errors.description
                          ? "border-red-300 text-red-900"
                          : "border-gray-300"
                      }`}
                      rows={4}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Project"
                      value={formData.projectId}
                      onChange={(e) =>
                        handleInputChange("projectId", e.target.value)
                      }
                      options={projectOptions}
                      placeholder="Select a project"
                      error={errors.projectId}
                      required
                    />

                    <Select
                      label="Assignee"
                      value={formData.assigneeId}
                      onChange={(e) =>
                        handleInputChange("assigneeId", e.target.value)
                      }
                      options={teamOptions}
                      placeholder="Select an assignee"
                      error={errors.assigneeId}
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Task Details */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Task Details
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Due Date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      error={errors.dueDate}
                      required
                    />

                    <Input
                      label="Time (Optional)"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        handleInputChange("time", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Priority"
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange("priority", e.target.value)
                      }
                      options={priorityOptions}
                    />

                    <Select
                      label="Status"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      options={statusOptions}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) =>
                        handleInputChange("progress", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="font-medium">{formData.progress}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tags */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Subtasks */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Subtasks
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a subtask"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubtask();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {subtasks.length > 0 && (
                    <div className="space-y-2">
                      {subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <select
                            value={subtask.status}
                            onChange={(e) =>
                              handleSubtaskStatusChange(
                                subtask.id,
                                e.target.value
                              )
                            }
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                          <span className="flex-1 text-sm">{subtask.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtask(subtask.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Preview */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Task Preview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {selectedProject && (
                      <div
                        className={`w-8 h-8 bg-gradient-to-br ${selectedProject.color} rounded-lg flex items-center justify-center shadow-sm`}
                      >
                        <span className="text-white font-bold text-sm">
                          {selectedProject.icon}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {formData.name || "Task Name"}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {selectedProject?.name || "Select a project"}
                      </p>
                    </div>
                  </div>

                  {selectedAssignee && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 ${selectedAssignee.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {selectedAssignee.avatar}
                      </div>
                      <span className="text-sm text-gray-600">
                        {selectedAssignee.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        priorityOptions.find(
                          (p) => p.value === formData.priority
                        )?.color || "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {formData.priority.charAt(0).toUpperCase() +
                        formData.priority.slice(1)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        statusOptions.find((s) => s.value === formData.status)
                          ?.color || "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {formData.status}
                    </span>
                  </div>

                  {formData.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(formData.dueDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{formData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${formData.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtasks</span>
                    <span className="text-sm font-medium">
                      {subtasks.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tags</span>
                    <span className="text-sm font-medium">
                      {formData.tags.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-medium">
                      {subtasks.filter((s) => s.status === "Done").length}/
                      {subtasks.length || 0}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tasks
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Task...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
