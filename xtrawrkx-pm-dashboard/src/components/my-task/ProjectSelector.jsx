"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Folder, Check } from "lucide-react";
import taskService from "../../lib/taskService";

const ProjectSelector = ({ task, projects, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Support multiple projects - use projects array if available, fallback to single project
  const [selectedProjectIds, setSelectedProjectIds] = useState(() => {
    if (task.projects && task.projects.length > 0) {
      return task.projects.map(p => p.id).filter(Boolean);
    }
    return task.project?.id ? [task.project.id] : [];
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Update selectedProjectIds when task changes
  useEffect(() => {
    if (task.projects && task.projects.length > 0) {
      setSelectedProjectIds(task.projects.map(p => p.id).filter(Boolean));
    } else if (task.project?.id) {
      setSelectedProjectIds([task.project.id]);
    } else {
      setSelectedProjectIds([]);
    }
  }, [task.projects, task.project?.id]);

  // Update dropdown position when editing
  useEffect(() => {
    if (isEditing && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right + window.scrollX,
      });
    }
  }, [isEditing]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      // Also close on scroll
      const handleScroll = () => setIsEditing(false);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleProjectToggle = async (projectId) => {
    const projectIdNum = projectId ? parseInt(projectId) : null;
    if (!projectIdNum) return;

    const newSelectedIds = selectedProjectIds.includes(projectIdNum)
      ? selectedProjectIds.filter(id => id !== projectIdNum)
      : [...selectedProjectIds, projectIdNum];

    setIsUpdating(true);
    try {
      // Update task with projects array (send empty array to clear, not null)
      await taskService.updateTask(task.id, {
        projects: newSelectedIds,
      });

      // Find the project objects
      const newProjects = newSelectedIds
        .map(id => projects.find(p => p.id === id))
        .filter(Boolean);

      // Update local state immediately
      const updatedTask = {
        ...task,
        projects: newProjects,
        project: newProjects[0] || null, // Keep first project for backward compatibility
      };

      // Update parent state
      if (onUpdate) {
        onUpdate(updatedTask);
      }

      setSelectedProjectIds(newSelectedIds);
    } catch (error) {
      console.error("Error updating projects:", error);
      // Revert on error
      if (task.projects && task.projects.length > 0) {
        setSelectedProjectIds(task.projects.map(p => p.id).filter(Boolean));
      } else if (task.project?.id) {
        setSelectedProjectIds([task.project.id]);
      } else {
        setSelectedProjectIds([]);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedProjects = projects.filter(p => selectedProjectIds.includes(p.id));

  const dropdownContent = isEditing ? (
    <div
      ref={dropdownRef}
      className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto min-w-[180px]"
      style={{
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
      }}
    >
          {projects.map((project, index) => {
            const isSelected = selectedProjectIds.includes(project.id);
            return (
              <div
                key={project.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectToggle(project.id);
                }}
                className={`px-3 py-2.5 text-sm cursor-pointer hover:bg-blue-50 flex items-center gap-2.5 transition-colors ${
                  index < projects.length - 1 ? "border-b border-gray-100" : ""
                } ${isSelected ? "bg-blue-50" : ""}`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-sm ${
                    project.color || "from-blue-500 to-blue-600"
                  }`}
                >
                  <span className="text-white font-bold text-xs">
                    {project.icon || project.name?.charAt(0)?.toUpperCase() || "P"}
                  </span>
                </div>
                <span className="text-gray-900 font-medium truncate flex-1">
                  {project.name}
                </span>
              </div>
            );
          })}
        </div>
  ) : null;

  return (
    <>
      <div className="relative" ref={triggerRef}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="text-sm px-2 py-1.5 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-2 group hover:bg-gray-50 border border-transparent hover:border-gray-200 whitespace-nowrap"
          title="Click to change project"
        >
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          ) : selectedProjects.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedProjects.slice(0, 2).map((project) => (
                <div
                  key={project.id}
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                    project.color || "from-blue-500 to-blue-600"
                  }`}
                  title={project.name}
                >
                  <span className="text-white font-bold text-xs">
                    {project.icon ||
                      project.name?.charAt(0)?.toUpperCase() ||
                      "P"}
                  </span>
                </div>
              ))}
              {selectedProjects.length > 2 && (
                <span className="text-xs text-gray-500 font-medium">
                  +{selectedProjects.length - 2}
                </span>
              )}
              <span className="text-gray-900 font-medium truncate">
                {selectedProjects.length === 1
                  ? selectedProjects[0].name
                  : `${selectedProjects.length} projects`}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          ) : (
            <>
              <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                <Folder className="w-3 h-3 text-gray-400" />
              </div>
              <span className="text-gray-500 truncate">No Project</span>
              <ChevronDown className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </>
          )}
        </div>
      </div>
      {typeof window !== "undefined" &&
        isEditing &&
        createPortal(dropdownContent, document.body)}
    </>
  );
};

export default ProjectSelector;

