"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Share2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Activity,
  GitBranch,
  Flag,
  Tag,
  Plus,
  X,
  ChevronDown,
  Paperclip,
  Link as LinkIcon,
  Check,
  Eye,
  Trash2,
  Search,
} from "lucide-react";
import confetti from "canvas-confetti";
import PageHeader from "../../../components/shared/PageHeader";
import taskService from "../../../lib/taskService";
import commentService from "../../../lib/commentService";
import projectService from "../../../lib/projectService";
import apiClient from "../../../lib/apiClient";
import {
  transformTask,
  transformComment,
  transformProject,
  formatDate,
} from "../../../lib/dataTransformers";
import CommentsSection from "../../../components/shared/CommentsSection";
import CollaboratorModal from "../../../components/my-task/CollaboratorModal";
import ProjectSelector from "../../../components/my-task/ProjectSelector";
import { Table, Button } from "../../../components/ui";
import subtaskService from "../../../lib/subtaskService";
import {
  transformSubtask,
  transformStatusToStrapi,
  transformPriorityToStrapi,
} from "../../../lib/dataTransformers";
import SubtaskDetailModal from "../../../components/shared/SubtaskDetailModal";

export default function TaskDetailPage({ params: paramsProp }) {
  const router = useRouter();
  const paramsFromHook = useParams();
  const [params, setParams] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [task, setTask] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [collaboratorModal, setCollaboratorModal] = useState({
    isOpen: false,
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);

  // Subtask table state
  const [subtaskSearchQuery, setSubtaskSearchQuery] = useState("");
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editingSubtaskName, setEditingSubtaskName] = useState("");
  const [subtaskDetailModal, setSubtaskDetailModal] = useState({
    isOpen: false,
    subtaskId: null,
  });
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [newSubtaskData, setNewSubtaskData] = useState({
    title: "",
    assignee: "",
    dueDate: "",
    status: "SCHEDULED",
    priority: "MEDIUM",
  });

  // Handle params (can be Promise in Next.js 15+)
  useEffect(() => {
    const resolveParams = async () => {
      if (paramsProp instanceof Promise) {
        const resolved = await paramsProp;
        setParams(resolved);
      } else if (paramsProp) {
        setParams(paramsProp);
      } else if (paramsFromHook) {
        setParams(paramsFromHook);
      }
    };
    resolveParams();
  }, [paramsProp, paramsFromHook]);

  // Load task data
  useEffect(() => {
    const loadTask = async () => {
      if (!params?.slug && !params?.id) return;

      // Try to parse as ID first (numeric slug)
      const taskId = params?.id || params?.slug;
      let parsedId;

      try {
        setIsLoading(true);
        setError(null);

        parsedId = parseInt(taskId, 10);

        if (isNaN(parsedId)) {
          throw new Error("Invalid task ID");
        }

        // Fetch task with essential relations only (simplified)
        // Use "projects" (plural) to match the schema
        const fullTaskData = await taskService.getTaskById(parsedId, [
          "projects",
          "assignee",
          "createdBy",
          "collaborators",
        ]);

        // Transform to frontend format
        const transformedTask = transformTask(fullTaskData);

        // Format due date for display
        const formattedDueDate = transformedTask.scheduledDate
          ? formatDate(transformedTask.scheduledDate)
          : "No due date";

        // Fetch comments for this task
        let commentsData = [];
        try {
          const commentsResponse = await commentService.getTaskComments(
            parsedId
          );
          commentsData = commentsResponse.data?.map(transformComment) || [];
        } catch (commentError) {
          console.error("Error fetching comments:", commentError);
        }

        // Load subtasks separately to avoid nested populate issues
        let subtasksData = [];
        try {
          const subtasksResponse = await subtaskService.getRootSubtasksByTask(
            parsedId,
            {
              populate: ["assignee", "childSubtasks"],
            }
          );
          let rawSubtasks = [];
          if (Array.isArray(subtasksResponse.data)) {
            rawSubtasks = subtasksResponse.data;
          } else if (
            subtasksResponse.data?.data &&
            Array.isArray(subtasksResponse.data.data)
          ) {
            rawSubtasks = subtasksResponse.data.data;
          } else if (Array.isArray(subtasksResponse)) {
            rawSubtasks = subtasksResponse;
          }
          subtasksData = rawSubtasks.map(transformSubtask).filter(Boolean);
        } catch (subtaskError) {
          console.error("Error fetching subtasks:", subtaskError);
        }

        const taskForPage = {
          ...transformedTask,
          dueDate: formattedDueDate,
          description: transformedTask.description || "",
          subtasks: subtasksData,
          comments: commentsData,
        };

        setTask(taskForPage);
        setIsComplete(
          taskForPage.status === "Done" ||
            taskForPage.status === "COMPLETED" ||
            taskForPage.status?.toLowerCase() === "done"
        );
        setEditedDescription(taskForPage.description || "");

        // TODO: Fetch activities when available
        setActivities([]);
      } catch (error) {
        console.error("Error loading task:", error);
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
          taskId: parsedId || taskId || "unknown",
          params: params,
        });

        // Provide more helpful error messages
        let errorMessage =
          error.message || "Failed to load task. Please try again.";

        if (
          error.message?.includes("Network error") ||
          error.message?.includes("Failed to fetch") ||
          error.message?.includes("Cannot connect")
        ) {
          errorMessage =
            "Cannot connect to backend server. Please check: 1. The Strapi backend is running on http://localhost:1337 2. CORS is configured correctly 3. Check browser console for more details";
        } else if (
          error.message?.includes("Invalid key") ||
          error.message?.includes("Cannot create property")
        ) {
          errorMessage =
            "Backend configuration error. Please ensure Strapi backend has been restarted after recent changes.";
        } else if (error.message?.includes("Invalid task ID")) {
          errorMessage = "Invalid task ID. Please check the URL and try again.";
        } else if (
          error.message?.includes("not found") ||
          error.message?.includes("404")
        ) {
          errorMessage =
            "Task not found. The task you're looking for doesn't exist.";
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.slug || params?.id) {
      loadTask();
    }
  }, [params]);

  // Load projects and users
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          projectService.getAllProjects({ pageSize: 100 }),
          apiClient.get("/api/xtrawrkx-users", {
            "pagination[pageSize]": 100,
            "filters[isActive][$eq]": "true",
          }),
        ]);

        const transformedProjects =
          projectsResponse.data?.map(transformProject) || [];
        setProjects(transformedProjects);

        let usersData = [];
        if (usersResponse?.data && Array.isArray(usersResponse.data)) {
          usersData = usersResponse.data;
        } else if (Array.isArray(usersResponse)) {
          usersData = usersResponse;
        }

        const transformedUsers = usersData
          .filter((user) => user && user.id)
          .map((user) => {
            const userData = user.attributes || user;
            const firstName = userData.firstName || "";
            const lastName = userData.lastName || "";
            const email = userData.email || "";
            const name =
              `${firstName} ${lastName}`.trim() || email || "Unknown User";

            return {
              id: user.id,
              firstName,
              lastName,
              email,
              name,
            };
          });

        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status) => {
    const statusLower = (status || "To Do")?.toLowerCase().replace(/\s+/g, "-");

    const statusColors = {
      "to-do": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-400",
      },
      "in-progress": {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-400",
      },
      "in-review": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-400",
      },
      done: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-400",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-400",
      },
      cancelled: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-400",
      },
    };

    const colors = statusColors[statusLower] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-400",
    };

    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM":
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW":
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAssigneeAvatar = (assignee) => {
    if (assignee) {
      const name = typeof assignee === "object" ? assignee?.name : assignee;
      const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "??";
      return {
        initials,
        color: "bg-blue-500",
      };
    }
    return {
      initials: "??",
      color: "bg-gray-500",
    };
  };

  const handleToggleComplete = async () => {
    if (!task) return;
    const newStatus = isComplete ? "To Do" : "Done";
    const isMarkingComplete = !isComplete;

    try {
      await taskService.updateTask(task.id, {
        status: newStatus,
      });
      setIsComplete(!isComplete);

      // Show confetti when marking as complete
      if (isMarkingComplete) {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 99999,
        };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        // Update all canvas elements to have high z-index
        const updateCanvasZIndex = () => {
          const canvases = document.querySelectorAll("canvas");
          canvases.forEach((canvas) => {
            // Check if it's a confetti canvas (usually has specific dimensions)
            if (canvas.width > 0 && canvas.height > 0) {
              canvas.style.zIndex = "99999";
              canvas.style.position = "fixed";
              canvas.style.top = "0";
              canvas.style.left = "0";
              canvas.style.pointerEvents = "none";
            }
          });
        };

        const interval = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);

          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });

          // Update z-index after confetti is created
          requestAnimationFrame(updateCanvasZIndex);
        }, 250);

        // Update z-index immediately and continuously
        const zIndexInterval = setInterval(() => {
          updateCanvasZIndex();
        }, 50);

        // Clear z-index update interval when confetti ends
        setTimeout(() => {
          clearInterval(zIndexInterval);
        }, duration + 100);
      }

      // Reload task to get updated status
      const fullTaskData = await taskService.getTaskById(task.id, [
        "projects",
        "assignee",
        "createdBy",
        "collaborators",
      ]);
      const transformedTask = transformTask(fullTaskData);
      setTask({ ...task, ...transformedTask, status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDescriptionSave = async () => {
    if (!task) return;
    try {
      await taskService.updateTask(task.id, {
        description: editedDescription,
      });
      setIsEditingDescription(false);
      setTask({ ...task, description: editedDescription });
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!task) return;
    try {
      await taskService.updateTask(task.id, {
        status: newStatus,
      });
      setTask({ ...task, status: newStatus });
      setIsComplete(
        newStatus === "Done" ||
          newStatus === "COMPLETED" ||
          newStatus?.toLowerCase() === "done"
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityUpdate = async (newPriority) => {
    if (!task) return;
    try {
      await taskService.updateTask(task.id, {
        priority: newPriority,
      });
      setTask({ ...task, priority: newPriority });
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleDueDateUpdate = async (newDate) => {
    if (!task) return;
    try {
      const dateValue = newDate ? new Date(newDate).toISOString() : null;
      await taskService.updateTask(task.id, {
        scheduledDate: dateValue,
      });
      const formattedDate = newDate ? formatDate(dateValue) : "No due date";
      setTask({ ...task, scheduledDate: dateValue, dueDate: formattedDate });
    } catch (error) {
      console.error("Error updating due date:", error);
    }
  };

  const handleAssigneeUpdate = async (newAssigneeId) => {
    if (!task) return;
    try {
      await taskService.updateTask(task.id, {
        assignee: newAssigneeId || null,
      });

      // Reload task to get updated assignee with full data
      const fullTaskData = await taskService.getTaskById(task.id, [
        "projects",
        "assignee",
        "createdBy",
        "collaborators",
      ]);
      const transformedTask = transformTask(fullTaskData);
      setTask({ ...task, ...transformedTask });
    } catch (error) {
      console.error("Error updating assignee:", error);
    }
  };

  const handleEditTask = () => {
    router.push(`/my-task/${task.id}/edit`);
  };

  const handleShareTask = () => {
    setCollaboratorModal({ isOpen: true });
  };

  const handleCopyTaskLink = async () => {
    try {
      const taskUrl = `${window.location.origin}/my-task/${task.id}`;
      await navigator.clipboard.writeText(taskUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
      alert("Failed to copy link. Please try again.");
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachedFiles((prev) => [...prev, ...files]);
    // TODO: Upload files to backend
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Subtask handlers
  const handleSubtaskStatusUpdate = async (subtaskId, newStatus) => {
    if (!task) return;
    try {
      await subtaskService.updateSubtaskStatus(
        subtaskId,
        transformStatusToStrapi(newStatus)
      );
      // Reload task to get updated subtasks
      const fullTaskData = await taskService.getTaskById(task.id, [
        "projects",
        "assignee",
        "createdBy",
        "subtasks",
        "subtasks.assignee",
        "subtasks.childSubtasks",
        "collaborators",
      ]);
      const transformedTask = transformTask(fullTaskData);
      setTask({
        ...task,
        ...transformedTask,
        subtasks: transformedTask.subtasks || [],
      });
    } catch (error) {
      console.error("Error updating subtask status:", error);
    }
  };

  const handleSubtaskPriorityUpdate = async (subtaskId, newPriority) => {
    if (!task) return;
    try {
      await subtaskService.updateSubtask(subtaskId, {
        priority: transformPriorityToStrapi(newPriority),
      });
      // Reload task to get updated subtasks
      const fullTaskData = await taskService.getTaskById(task.id, [
        "projects",
        "assignee",
        "createdBy",
        "subtasks",
        "subtasks.assignee",
        "subtasks.childSubtasks",
        "collaborators",
      ]);
      const transformedTask = transformTask(fullTaskData);
      setTask({
        ...task,
        ...transformedTask,
        subtasks: transformedTask.subtasks || [],
      });
    } catch (error) {
      console.error("Error updating subtask priority:", error);
    }
  };

  const handleSubtaskDueDateUpdate = async (subtaskId, newDate) => {
    if (!task) return;
    try {
      const dueDate = newDate
        ? new Date(newDate + "T00:00:00").toISOString()
        : null;
      await subtaskService.updateSubtask(subtaskId, {
        dueDate: dueDate,
      });
      // Reload task to get updated subtasks
      const fullTaskData = await taskService.getTaskById(task.id, [
        "projects",
        "assignee",
        "createdBy",
        "subtasks",
        "subtasks.assignee",
        "subtasks.childSubtasks",
        "collaborators",
      ]);
      const transformedTask = transformTask(fullTaskData);
      setTask({
        ...task,
        ...transformedTask,
        subtasks: transformedTask.subtasks || [],
      });
    } catch (error) {
      console.error("Error updating subtask due date:", error);
    }
  };

  const handleSubtaskClick = (subtask) => {
    setSubtaskDetailModal({
      isOpen: true,
      subtaskId: subtask.id,
    });
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!task) return;
    if (!confirm("Are you sure you want to delete this subtask?")) return;
    try {
      await subtaskService.deleteSubtask(subtaskId);
      // Reload task to get updated subtasks
      const fullTaskData = await taskService.getTaskById(task.id, [
        "projects",
        "assignee",
        "createdBy",
        "subtasks",
        "subtasks.assignee",
        "subtasks.childSubtasks",
        "collaborators",
      ]);
      const transformedTask = transformTask(fullTaskData);
      setTask({
        ...task,
        ...transformedTask,
        subtasks: transformedTask.subtasks || [],
      });
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  // Get root subtasks (no parent)
  const rootSubtasks = (task?.subtasks || []).filter((st) => {
    return (
      !st.parentSubtask ||
      st.parentSubtask === null ||
      (typeof st.parentSubtask === "object" && !st.parentSubtask.id)
    );
  });

  // Filter subtasks by search query
  const filteredSubtasks = rootSubtasks.filter((subtask) => {
    if (!subtaskSearchQuery.trim()) return true;
    const query = subtaskSearchQuery.toLowerCase();
    const name = (subtask.name || subtask.title || "").toLowerCase();
    const assigneeName =
      typeof subtask.assignee === "object"
        ? (subtask.assignee?.name || "").toLowerCase()
        : (subtask.assignee || "").toLowerCase();
    return name.includes(query) || assigneeName.includes(query);
  });

  // Transform subtasks for table
  const transformedSubtasks = filteredSubtasks
    .map((st) => transformSubtask(st))
    .filter(Boolean);

  const tabItems = [
    { key: "overview", label: "Overview", icon: FileText },
    { key: "subtasks", label: "Subtasks", icon: GitBranch },
    { key: "comments", label: "Comments", icon: MessageSquare },
    { key: "activity", label: "Activity", icon: Activity },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error ? "Error Loading Task" : "Task not found"}
          </h2>
          <div className="text-gray-600 mb-4 max-w-md mx-auto">
            {error ? (
              <div className="space-y-1 text-sm text-left">
                {error.includes("1. The Strapi") ? (
                  <>
                    <p className="font-medium mb-2">
                      Cannot connect to backend server. Please check:
                    </p>
                    <ul className="list-decimal list-inside space-y-1 ml-2">
                      <li>
                        The Strapi backend is running on http://localhost:1337
                      </li>
                      <li>CORS is configured correctly</li>
                      <li>Check browser console for more details</li>
                    </ul>
                  </>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            ) : (
              <p>The task you&apos;re looking for doesn&apos;t exist.</p>
            )}
          </div>
          <button
            onClick={() => router.push("/my-task")}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const assigneeAvatar = getAssigneeAvatar(task.assignee);

  // Subtask columns configuration
  const subtaskColumnsTable = [
    {
      key: "name",
      label: "SUBTASK NAME",
      render: (_, subtask) => {
        const isDone =
          subtask.status?.toLowerCase() === "done" ||
          subtask.status?.toLowerCase() === "completed";
        const isEditing = editingSubtaskId === subtask.id;

        const handleNameClick = (e) => {
          e.stopPropagation();
          setEditingSubtaskId(subtask.id);
          setEditingSubtaskName(subtask.name || subtask.title || "");
        };

        const handleNameBlur = async () => {
          if (editingSubtaskId === subtask.id) {
            const newName = editingSubtaskName.trim();
            if (newName && newName !== (subtask.name || subtask.title)) {
              try {
                await subtaskService.updateSubtask(subtask.id, {
                  title: newName,
                });
                // Reload task
                const fullTaskData = await taskService.getTaskById(task.id, [
                  "project",
                  "assignee",
                  "createdBy",
                  "subtasks",
                  "subtasks.assignee",
                  "subtasks.childSubtasks",
                  "collaborators",
                ]);
                const transformedTask = transformTask(fullTaskData);
                setTask({
                  ...task,
                  ...transformedTask,
                  subtasks: transformedTask.subtasks || [],
                });
              } catch (error) {
                console.error("Error updating subtask name:", error);
              }
            }
            setEditingSubtaskId(null);
            setEditingSubtaskName("");
          }
        };

        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSubtaskStatusUpdate(
                  subtask.id,
                  isDone ? "To Do" : "Done"
                );
              }}
              className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                isDone
                  ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                  : "border-gray-300 hover:border-green-500 hover:bg-green-50 cursor-pointer"
              }`}
            >
              {isDone && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editingSubtaskName}
                  onChange={(e) => setEditingSubtaskName(e.target.value)}
                  onBlur={handleNameBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleNameBlur();
                    } else if (e.key === "Escape") {
                      setEditingSubtaskId(null);
                      setEditingSubtaskName("");
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full font-medium px-2 py-1 rounded border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDone ? "line-through text-gray-500" : "text-gray-900"
                  }`}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    onClick={handleNameClick}
                    className={`font-medium truncate cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors flex-1 min-w-0 ${
                      isDone ? "line-through text-gray-500" : "text-gray-900"
                    }`}
                    title="Click to edit subtask name"
                  >
                    {subtask.name || subtask.title}
                  </div>
                  {(() => {
                    const childCount =
                      subtask.childSubtasks?.length ||
                      subtask.subtasks?.length ||
                      0;
                    if (childCount > 0) {
                      return (
                        <div
                          className="flex items-center gap-1 flex-shrink-0 px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                          title={`${childCount} ${
                            childCount === 1 ? "subtask" : "subtasks"
                          }`}
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {childCount}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "assignee",
      label: "ASSIGNEE",
      render: (_, subtask) => {
        const assignee = subtask.assignee;
        const hasAssignee = assignee && assignee !== "Unassigned";
        const assigneeName =
          typeof assignee === "object"
            ? assignee?.name ||
              (assignee?.firstName && assignee?.lastName
                ? `${assignee.firstName} ${assignee.lastName}`
                : assignee?.firstName || assignee?.lastName || "Unassigned")
            : assignee || "Unassigned";
        const initial = assigneeName.charAt(0).toUpperCase() || "U";

        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCollaboratorModal({
                isOpen: true,
                task: { ...task, subtasks: [subtask] },
              });
            }}
            className="flex items-center gap-2 min-w-[140px] hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors text-left"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                hasAssignee
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {initial}
            </div>
            <span className="text-sm text-gray-600 truncate">
              {hasAssignee ? assigneeName : "Click to assign"}
            </span>
          </button>
        );
      },
    },
    {
      key: "dueDate",
      label: "DUE DATE",
      render: (_, subtask) => {
        const getDateValue = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const currentValue = getDateValue(
          subtask.dueDate || subtask.scheduledDate
        );

        return (
          <div
            className="flex items-center gap-2 min-w-[150px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <input
              type="date"
              value={currentValue}
              onChange={(e) => {
                handleSubtaskDueDateUpdate(subtask.id, e.target.value);
              }}
              className="flex-1 text-sm text-gray-700 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="No due date"
            />
          </div>
        );
      },
    },
    {
      key: "status",
      label: "STATUS",
      render: (_, subtask) => {
        const statusOptions = [
          { value: "To Do", label: "To Do" },
          { value: "In Progress", label: "In Progress" },
          { value: "In Review", label: "In Review" },
          { value: "Done", label: "Done" },
          { value: "Cancelled", label: "Cancelled" },
        ];

        const currentStatus = subtask.status || "To Do";
        const status = currentStatus?.toLowerCase().replace(/\s+/g, "-") || "";

        const statusColors = {
          "to-do": {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-400",
          },
          "in-progress": {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-400",
          },
          "in-review": {
            bg: "bg-purple-100",
            text: "text-purple-800",
            border: "border-purple-400",
          },
          done: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-400",
          },
          completed: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-400",
          },
          cancelled: {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-400",
          },
        };

        const colors = statusColors[status] || {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-400",
        };

        return (
          <div className="min-w-[140px]" onClick={(e) => e.stopPropagation()}>
            <select
              value={currentStatus}
              onChange={(e) => {
                e.stopPropagation();
                handleSubtaskStatusUpdate(subtask.id, e.target.value);
              }}
              className={`w-full ${colors.bg} ${colors.text} ${colors.border} border-2 rounded-lg px-3 py-2 font-bold text-xs text-center shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                paddingRight: "2rem",
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
    {
      key: "priority",
      label: "PRIORITY",
      render: (_, subtask) => {
        const priorityOptions = [
          { value: "Low", label: "Low" },
          { value: "Medium", label: "Medium" },
          { value: "High", label: "High" },
        ];

        const currentPriority = subtask.priority || "Medium";
        const priorityLower = currentPriority.toLowerCase();

        const priorityColors = {
          high: {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-400",
          },
          medium: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-400",
          },
          low: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-400",
          },
        };

        const colors = priorityColors[priorityLower] || {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-400",
        };

        return (
          <div className="min-w-[120px]" onClick={(e) => e.stopPropagation()}>
            <select
              value={currentPriority}
              onChange={(e) => {
                e.stopPropagation();
                handleSubtaskPriorityUpdate(subtask.id, e.target.value);
              }}
              className={`w-full ${colors.bg} ${colors.text} ${colors.border} border-2 rounded-lg px-3 py-2 font-bold text-xs text-center shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                paddingRight: "2rem",
              }}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
    {
      key: "progress",
      label: "PROGRESS",
      render: (_, subtask) => {
        const progress = subtask.progress || 0;
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 min-w-[3rem]">
              {progress}%
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, subtask) => {
        return (
          <div className="flex items-center gap-2 min-w-[100px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSubtaskClick(subtask);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSubtask(subtask.id);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete subtask"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 space-y-4">
        <PageHeader
          title={task.name}
          subtitle={`${
            task.projects && task.projects.length > 0
              ? task.projects.map((p) => p.name).join(", ")
              : task.project?.name || "No Project"
          } • ${task.status || "Unknown Status"}`}
          breadcrumb={[
            { label: "Dashboard", href: "/" },
            { label: "My Tasks", href: "/my-task" },
            {
              label: task.name,
              href: `/my-task/${task.id}`,
            },
          ]}
          showProfile={true}
          actions={[
            {
              icon: Edit,
              onClick: handleEditTask,
              className: "",
              title: "Edit Task",
            },
            {
              icon: linkCopied ? Check : LinkIcon,
              onClick: handleCopyTaskLink,
              className: linkCopied ? "text-green-600" : "",
              title: linkCopied ? "Link Copied!" : "Copy Task Link",
            },
            {
              icon: Share2,
              onClick: handleShareTask,
              className: "",
              title: "Share Task",
            },
          ]}
        />

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-2 shadow-lg">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-transparent text-gray-700 hover:bg-white/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Task Details, Description, Attachments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task Details Card */}
              <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
                {/* Mark Complete Bar */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <button
                    onClick={handleToggleComplete}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isComplete
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {isComplete && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {isComplete ? "Task completed" : "Mark as complete"}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Task Details
                </h3>
                <div className="space-y-3">
                  {/* Assignee */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Assignee
                    </label>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      {editingField === "assignee" ? (
                        <select
                          value={editingValue || ""}
                          onChange={(e) => {
                            handleAssigneeUpdate(e.target.value);
                            setEditingField(null);
                          }}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Unassigned</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          <div
                            className={`w-8 h-8 ${assigneeAvatar.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                          >
                            {assigneeAvatar.initials}
                          </div>
                          <span
                            className="text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                            onClick={() => {
                              setEditingValue(
                                task.assignee?.id?.toString() || ""
                              );
                              setEditingField("assignee");
                            }}
                          >
                            {typeof task.assignee === "object"
                              ? task.assignee?.name || "Unassigned"
                              : task.assignee || "Unassigned"}
                          </span>
                          {task.assignee && (
                            <button
                              onClick={() => handleAssigneeUpdate(null)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingValue(
                                task.assignee?.id?.toString() || ""
                              );
                              setEditingField("assignee");
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Due date
                    </label>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {editingField === "dueDate" ? (
                        <input
                          type="date"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => {
                            handleDueDateUpdate(editingValue);
                            setEditingField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleDueDateUpdate(editingValue);
                              setEditingField(null);
                            } else if (e.key === "Escape") {
                              setEditingField(null);
                            }
                          }}
                          autoFocus
                          className="text-sm text-gray-900 px-2 py-1 rounded border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <>
                          <span
                            className="text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                            onClick={() => {
                              const dateValue = task.scheduledDate
                                ? new Date(task.scheduledDate)
                                    .toISOString()
                                    .split("T")[0]
                                : "";
                              setEditingValue(dateValue);
                              setEditingField("dueDate");
                            }}
                          >
                            {task.dueDate || "No due date"}
                          </span>
                          {task.dueDate && (
                            <button
                              onClick={() => handleDueDateUpdate(null)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Status
                    </label>
                    <div className="flex-1 flex justify-end">
                      {editingField === "status" ? (
                        <select
                          value={editingValue}
                          onChange={(e) => {
                            handleStatusUpdate(e.target.value);
                            setEditingField(null);
                          }}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className={`px-3 py-1.5 rounded-lg border-2 font-bold text-xs text-center shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                            editingValue
                          )}`}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="In Review">In Review</option>
                          <option value="Done">Done</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingValue(task.status || "To Do");
                            setEditingField("status");
                          }}
                          className={`inline-block px-3 py-1.5 rounded-lg border-2 font-bold text-xs uppercase cursor-pointer hover:shadow-md transition-all ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status || "To Do"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Priority
                    </label>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      <Flag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {editingField === "priority" ? (
                        <select
                          value={editingValue}
                          onChange={(e) => {
                            handlePriorityUpdate(e.target.value);
                            setEditingField(null);
                          }}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className={`px-3 py-1.5 rounded-lg border-2 font-bold text-xs text-center shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${getPriorityColor(
                            editingValue
                          )}`}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingValue(task.priority || "Medium");
                            setEditingField("priority");
                          }}
                          className={`inline-block px-3 py-1.5 rounded-lg border-2 font-bold text-xs uppercase cursor-pointer hover:shadow-md transition-all ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority || "Medium"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Project
                    </label>
                    <div className="flex-1 flex items-center justify-end">
                      <ProjectSelector
                        task={task}
                        projects={projects}
                        onUpdate={(updatedTask) => {
                          setTask(updatedTask);
                        }}
                      />
                    </div>
                  </div>

                  {/* Collaborators */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Collaborators
                    </label>
                    <div className="flex-1 flex items-center gap-2 justify-end flex-wrap">
                      {task.collaborators && task.collaborators.length > 0 ? (
                        <>
                          {task.collaborators
                            .slice(0, 3)
                            .map((collab, index) => {
                              const name =
                                collab?.name ||
                                (collab?.firstName && collab?.lastName
                                  ? `${collab.firstName} ${collab.lastName}`
                                  : collab?.firstName ||
                                    collab?.lastName ||
                                    "Unknown");
                              const initial =
                                name?.charAt(0)?.toUpperCase() || "U";
                              return (
                                <div
                                  key={collab?.id || index}
                                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                                  title={name}
                                  style={{
                                    marginLeft: index > 0 ? "-4px" : "0",
                                    zIndex: 10 - index,
                                  }}
                                >
                                  {initial}
                                </div>
                              );
                            })}
                          {task.collaborators.length > 3 && (
                            <div
                              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold border-2 border-white"
                              title={`${task.collaborators.length - 3} more`}
                              style={{ marginLeft: "-4px", zIndex: 7 }}
                            >
                              +{task.collaborators.length - 3}
                            </div>
                          )}
                          <button
                            onClick={() =>
                              setCollaboratorModal({ isOpen: true })
                            }
                            className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Manage
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setCollaboratorModal({ isOpen: true })}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Add collaborators
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dependencies */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <label className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
                      Dependencies
                    </label>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      <span className="text-sm text-gray-600">
                        No dependencies
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                {isEditingDescription ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="What is this task about?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={6}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDescriptionSave}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingDescription(false);
                          setEditedDescription(task.description || "");
                        }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditingDescription(true)}
                    className="w-full px-3 py-2 border border-transparent rounded-lg hover:border-gray-300 cursor-text min-h-[120px]"
                  >
                    {task.description ? (
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">
                        What is this task about? Click to add description.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attachments
                </h3>
                <div className="space-y-2">
                  {attachedFiles.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {attachedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Paperclip className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-gray-700 block truncate">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="p-1.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Paperclip className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {attachedFiles.length > 0
                        ? "Add more files"
                        : "Attach files"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Quick Actions and Information */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleEditTask}
                    className="w-full flex items-center justify-start px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Task
                  </button>
                  <button
                    onClick={() => setActiveTab("subtasks")}
                    className="w-full flex items-center justify-start px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subtask
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className="w-full flex items-center justify-start px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </button>
                  <button
                    onClick={handleCopyTaskLink}
                    className="w-full flex items-center justify-start px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-green-600">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Copy Task Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Task Info */}
              <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Updated
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {task.updatedAt
                          ? new Date(task.updatedAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subtasks" && (
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Subtasks</h3>
              <Button
                size="sm"
                onClick={() => setShowAddSubtaskModal(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subtask
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search subtasks..."
                  value={subtaskSearchQuery}
                  onChange={(e) => setSubtaskSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white/70 transition-all duration-300 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Subtasks Table - Full Width */}
            {transformedSubtasks.length > 0 ? (
              <div className="rounded-3xl overflow-hidden w-full">
                <div className="overflow-x-auto">
                  <Table
                    columns={subtaskColumnsTable}
                    data={transformedSubtasks}
                    onRowClick={handleSubtaskClick}
                    className="min-w-[1200px] w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">📋</div>
                <p className="text-gray-600">
                  {subtaskSearchQuery.trim()
                    ? `No subtasks match your search "${subtaskSearchQuery}"`
                    : "No subtasks found for this task"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {subtaskSearchQuery.trim()
                    ? "Try a different search term"
                    : "Add subtasks to break down this task"}
                </p>
                {!subtaskSearchQuery.trim() && (
                  <Button
                    onClick={() => setShowAddSubtaskModal(true)}
                    className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subtask
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6 h-[calc(100vh-300px)] flex flex-col min-h-0">
            <CommentsSection task={task} />
          </div>
        )}

        {activeTab === "activity" && (
          <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Activity Log
              </h3>
            </div>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-4 bg-white/50 rounded-lg border border-white/30"
                  >
                    <Activity className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No activity yet</p>
                <p className="text-sm">
                  Activity will appear here as the task progresses
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collaborator Modal */}
      <CollaboratorModal
        isOpen={collaboratorModal.isOpen}
        onClose={() => setCollaboratorModal({ isOpen: false })}
        task={task}
        onUpdate={async () => {
          // Reload task data to get updated collaborators from server
          if (task?.id) {
            try {
              const fullTaskData = await taskService.getTaskById(task.id, [
                "project",
                "assignee",
                "createdBy",
                "subtasks",
                "subtasks.assignee",
                "subtasks.childSubtasks",
                "collaborators",
              ]);
              const transformedTask = transformTask(fullTaskData);
              const formattedDueDate = transformedTask.scheduledDate
                ? formatDate(transformedTask.scheduledDate)
                : "No due date";

              let commentsData = [];
              try {
                const commentsResponse = await commentService.getTaskComments(
                  task.id
                );
                commentsData =
                  commentsResponse.data?.map(transformComment) || [];
              } catch (commentError) {
                console.error("Error fetching comments:", commentError);
              }

              const taskForPage = {
                ...transformedTask,
                dueDate: formattedDueDate,
                description: transformedTask.description || "",
                subtasks:
                  transformedTask.subtasks || fullTaskData.subtasks || [],
                comments: commentsData,
              };

              setTask(taskForPage);
              setComments(commentsData);
            } catch (error) {
              console.error(
                "Error reloading task after collaborator update:",
                error
              );
            }
          }
        }}
      />

      {/* Subtask Detail Modal */}
      <SubtaskDetailModal
        isOpen={subtaskDetailModal.isOpen}
        onClose={() =>
          setSubtaskDetailModal({ isOpen: false, subtaskId: null })
        }
        subtaskId={subtaskDetailModal.subtaskId}
        task={task}
        onTaskRefresh={async () => {
          // Reload task data
          if (task?.id) {
            const fullTaskData = await taskService.getTaskById(task.id, [
              "project",
              "assignee",
              "createdBy",
              "subtasks",
              "subtasks.assignee",
              "subtasks.childSubtasks",
              "subtasks.childSubtasks.assignee",
              "collaborators",
            ]);
            const transformedTask = transformTask(fullTaskData);
            const formattedDueDate = transformedTask.scheduledDate
              ? formatDate(transformedTask.scheduledDate)
              : "No due date";

            let commentsData = [];
            try {
              const commentsResponse = await commentService.getTaskComments(
                task.id
              );
              commentsData = commentsResponse.data?.map(transformComment) || [];
            } catch (commentError) {
              console.error("Error fetching comments:", commentError);
            }

            const taskForPage = {
              ...transformedTask,
              dueDate: formattedDueDate,
              description: transformedTask.description || "",
              subtasks: transformedTask.subtasks || fullTaskData.subtasks || [],
              comments: commentsData,
            };

            setTask(taskForPage);
          }
        }}
        onNavigateToSubtask={(subtaskId) => {
          setSubtaskDetailModal({
            isOpen: true,
            subtaskId: subtaskId,
          });
        }}
        onNavigateToTask={(taskId) => {
          router.push(`/my-task/${taskId}`);
        }}
      />

      {/* Add Subtask Modal */}
      {showAddSubtaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add Subtask
                </h2>
                <button
                  onClick={() => {
                    setShowAddSubtaskModal(false);
                    setNewSubtaskData({
                      title: "",
                      assignee: "",
                      dueDate: "",
                      status: "SCHEDULED",
                      priority: "MEDIUM",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!task?.id || !newSubtaskData.title.trim()) return;

                  try {
                    const subtaskData = {
                      title: newSubtaskData.title.trim(),
                      task: task.id,
                      status: newSubtaskData.status,
                      priority: newSubtaskData.priority,
                      progress: 0,
                      depth: 0,
                    };

                    if (newSubtaskData.assignee) {
                      const assigneeId =
                        typeof newSubtaskData.assignee === "string"
                          ? parseInt(newSubtaskData.assignee, 10)
                          : newSubtaskData.assignee;
                      if (assigneeId && !isNaN(assigneeId)) {
                        subtaskData.assignee = assigneeId;
                      }
                    }

                    if (newSubtaskData.dueDate) {
                      subtaskData.dueDate = new Date(
                        newSubtaskData.dueDate + "T00:00:00"
                      ).toISOString();
                    }

                    await subtaskService.createSubtask(subtaskData);

                    // Reload task to get updated subtasks
                    const fullTaskData = await taskService.getTaskById(
                      task.id,
                      [
                        "project",
                        "assignee",
                        "createdBy",
                        "subtasks",
                        "subtasks.assignee",
                        "subtasks.childSubtasks",
                        "collaborators",
                      ]
                    );
                    const transformedTask = transformTask(fullTaskData);
                    const formattedDueDate = transformedTask.scheduledDate
                      ? formatDate(transformedTask.scheduledDate)
                      : "No due date";

                    let commentsData = [];
                    try {
                      const commentsResponse =
                        await commentService.getTaskComments(task.id);
                      commentsData =
                        commentsResponse.data?.map(transformComment) || [];
                    } catch (commentError) {
                      console.error("Error fetching comments:", commentError);
                    }

                    const taskForPage = {
                      ...transformedTask,
                      dueDate: formattedDueDate,
                      description: transformedTask.description || "",
                      subtasks:
                        transformedTask.subtasks || fullTaskData.subtasks || [],
                      comments: commentsData,
                    };

                    setTask(taskForPage);
                    setShowAddSubtaskModal(false);
                    setNewSubtaskData({
                      title: "",
                      assignee: "",
                      dueDate: "",
                      status: "SCHEDULED",
                      priority: "MEDIUM",
                    });
                  } catch (error) {
                    console.error("Error creating subtask:", error);
                    alert("Failed to create subtask. Please try again.");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtask Name *
                  </label>
                  <input
                    type="text"
                    value={newSubtaskData.title}
                    onChange={(e) =>
                      setNewSubtaskData({
                        ...newSubtaskData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter subtask name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignee
                    </label>
                    <select
                      value={newSubtaskData.assignee}
                      onChange={(e) =>
                        setNewSubtaskData({
                          ...newSubtaskData,
                          assignee: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newSubtaskData.dueDate}
                      onChange={(e) =>
                        setNewSubtaskData({
                          ...newSubtaskData,
                          dueDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newSubtaskData.status}
                      onChange={(e) =>
                        setNewSubtaskData({
                          ...newSubtaskData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="SCHEDULED">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="COMPLETED">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newSubtaskData.priority}
                      onChange={(e) =>
                        setNewSubtaskData({
                          ...newSubtaskData,
                          priority: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowAddSubtaskModal(false);
                      setNewSubtaskData({
                        title: "",
                        assignee: "",
                        dueDate: "",
                        status: "SCHEDULED",
                        priority: "MEDIUM",
                      });
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
                  >
                    Add Subtask
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
