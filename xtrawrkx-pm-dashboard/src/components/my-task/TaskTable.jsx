"use client";

import React, { useState } from "react";
import { ChevronDown, MoreHorizontal, GitBranch } from "lucide-react";
import TaskRowDropdown from "./TaskRowDropdown";

const TaskTable = ({
  tasks = [],
  project = null,
  onTaskClick = () => {},
  onContextMenuOpen = () => {},
  onTaskComplete = () => {},
  TaskRowDropdownComponent = TaskRowDropdown,
}) => {
  // Row dropdown state
  const [rowDropdown, setRowDropdown] = useState({
    isOpen: false,
    taskId: null,
  });

  // Handle row dropdown toggle
  const handleRowDropdownToggle = (taskId) => {
    setRowDropdown((prev) => ({
      isOpen: prev.taskId === taskId ? !prev.isOpen : true,
      taskId: taskId,
    }));
  };

  // Handle task completion
  const handleTaskComplete = (task, completed) => {
    const newStatus = completed ? "Done" : "To Do";
    onTaskComplete(task.id, newStatus);
  };

  // Status color function matching my-task page
  const getStatusColor = (status) => {
    switch (status) {
      case "In Review":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Done":
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "To Do":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Backlog":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Overdue":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden w-full">
      <div className="w-full">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                />
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Name
              </th>
              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="w-12 px-4 py-3 text-left">
                {/* Empty header for actions */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <React.Fragment key={task.id}>
                <tr
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={task.status === "Done"}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTaskComplete(task, e.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium truncate transition-all duration-200 ${
                          task.status === "Done"
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {task.name}
                      </span>
                      {task.subtaskCount && task.subtaskCount > 0 && (
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-0.5">
                          <span className="text-xs text-gray-600 font-medium">
                            {task.subtaskCount}
                          </span>
                          <GitBranch className="h-3 w-3 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {task.assignee && task.assignee !== "Multiple" ? (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {task.assignee
                            ? task.assignee
                                .split(" ")
                                .map((n) => n.charAt(0))
                                .join("")
                            : "?"}
                        </div>
                        <span className="text-sm text-gray-700">
                          {task.assignee || "Unassigned"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white">
                          M
                        </div>
                        <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white">
                          J
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {task.dueTime && (
                        <span className="text-orange-500 font-medium">
                          , {task.dueTime}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 min-w-[2rem]">
                        {task.progress}%
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 text-right relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        id={`row-trigger-${task.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowDropdownToggle(task.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Expand row details"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform ${
                            rowDropdown.isOpen && rowDropdown.taskId === task.id
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onContextMenuOpen(e, task);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row Dropdown */}
                {rowDropdown.isOpen && rowDropdown.taskId === task.id && (
                  <tr>
                    <td colSpan="7" className="px-4 py-0">
                      <div id={`row-dropdown-${task.id}`}>
                        <TaskRowDropdownComponent
                          isOpen={
                            rowDropdown.isOpen && rowDropdown.taskId === task.id
                          }
                          task={task}
                          project={project}
                          onClose={() =>
                            setRowDropdown({ isOpen: false, taskId: null })
                          }
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-600">{tasks.length} Tasks</div>
      </div>
    </div>
  );
};

export default TaskTable;
