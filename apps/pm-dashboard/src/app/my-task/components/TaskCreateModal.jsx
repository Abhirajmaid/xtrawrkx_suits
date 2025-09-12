"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Plus, ChevronDown, Calendar, User, MoreHorizontal } from "lucide-react";

const TaskCreateModal = ({ isOpen, onClose, onConfirm, defaultStatus }) => {
  const [taskName, setTaskName] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(defaultStatus || "To Do");
  const [subtasks, setSubtasks] = useState([
    { id: 1, name: "Collect Moodboard", status: "To Do" }
  ]);
  const [newSubtask, setNewSubtask] = useState("");
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const assigneeDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  const assignees = [
    { id: 1, name: "Susan Drake", avatar: "SD", color: "bg-blue-500" },
    { id: 2, name: "Darrel Steward", avatar: "DS", color: "bg-orange-500" }
  ];

  const statusOptions = [
    { value: "To Do", label: "To Do", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { value: "In Progress", label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "Done", label: "Done", color: "bg-green-100 text-green-700 border-green-200" },
    { value: "Backlog", label: "Backlog", color: "bg-gray-100 text-gray-700 border-gray-200" }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assigneeDropdownRef.current && !assigneeDropdownRef.current.contains(event.target)) {
        setShowAssigneeDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { 
        id: Date.now(), 
        name: newSubtask.trim(), 
        status: "To Do" 
      }]);
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onConfirm({
        name: taskName,
        assignee: selectedAssignee?.name || "Unassigned",
        dueDate: dueDate || new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: status,
        subtasks: subtasks,
        project: {
          name: "Default Project",
          color: "from-blue-400 to-blue-600",
          icon: "P"
        }
      });
      // Reset form
      setTaskName("");
      setSelectedAssignee(null);
      setDueDate("");
      setStatus(defaultStatus || "To Do");
      setSubtasks([{ id: 1, name: "Collect Moodboard", status: "To Do" }]);
      setNewSubtask("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Create a New Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Assignee
            </label>
            <div className="relative" ref={assigneeDropdownRef}>
              <button
                type="button"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <span className="text-gray-500">
                  {selectedAssignee ? selectedAssignee.name : "Select"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {showAssigneeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {assignees.map((assignee) => (
                    <button
                      key={assignee.id}
                      type="button"
                      onClick={() => {
                        setSelectedAssignee(assignee);
                        setShowAssigneeDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className={`w-8 h-8 ${assignee.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                        {assignee.avatar}
                      </div>
                      <span className="text-sm text-gray-900">{assignee.name}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Selected Assignees Display */}
              {selectedAssignee && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className={`w-6 h-6 ${selectedAssignee.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                    {selectedAssignee.avatar}
                  </div>
                  <span className="text-sm text-gray-700">{selectedAssignee.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Select Date"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Status
            </label>
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <span className="text-gray-500">
                  {status || "Select"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatus(option.value);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full flex items-center px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${option.color}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sub-Tasks */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Sub-Tasks
            </label>
            
            {/* Existing Subtasks */}
            <div className="space-y-1.5 mb-2">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
                  <span className="text-sm text-gray-900">{subtask.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex px-2 py-1 rounded text-xs font-medium border bg-orange-100 text-orange-700 border-orange-200">
                      {subtask.status}
                    </span>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <User className="w-3 h-3 text-gray-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(subtask.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreHorizontal className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Subtask */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a Sub-Task"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
            </div>
            
            <button
              type="button"
              onClick={handleAddSubtask}
              className="mt-2 flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Sub-Task
            </button>
          </div>

          {/* Create Task Button */}
          <button
            type="submit"
            disabled={!taskName.trim()}
            className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateModal;
