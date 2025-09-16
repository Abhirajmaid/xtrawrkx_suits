"use client";

import React, { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

const TaskCalendar = ({
  tasks = [],
  project = null,
  onTaskClick = () => {},
  onDateClick = () => {},
  onAddTask = () => {},
}) => {
  // Calendar state
  const [month, setMonth] = useState(() => {
    if (typeof window !== "undefined") {
      return new Date().getMonth();
    }
    return 0; // Default month for SSR
  });

  const [year, setYear] = useState(() => {
    if (typeof window !== "undefined") {
      return new Date().getFullYear();
    }
    return 2024; // Default year for SSR
  });

  // Navigate between months
  const navigateMonth = (direction) => {
    if (direction === "next") {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    } else {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    }
  };

  const currentYear = year;
  const currentMonthIndex = month;

  const firstDay = new Date(currentYear, currentMonthIndex, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const currentDate = new Date(startDate);

  // Generate exactly 6 weeks (42 days) to ensure we cover all possible month layouts
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get tasks for a specific date
  const getTasksForCalendarDate = (date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="bg-white w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 px-6 pt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonthIndex]} {currentYear}
          </h2>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border border-gray-300">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="border-r border-gray-300 last:border-r-0 px-4 py-3 text-center text-sm font-medium text-gray-600 bg-gray-100"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonthIndex;
          const dayTasks = getTasksForCalendarDate(date);
          const dayNumber = date.getDate();

          return (
            <div
              key={index}
              className={`border-r border-b border-gray-300 last:border-r-0 h-40 p-1.5 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              } relative group cursor-pointer`}
              onClick={() => {
                if (isCurrentMonth) {
                  onDateClick(date);
                }
              }}
            >
              {/* Day Number */}
              <div
                className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {dayNumber}
              </div>

              {/* Plus button for adding new task */}
              {isCurrentMonth && (
                <button
                  className="absolute top-1 right-1 w-5 h-5 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTask(date);
                  }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}

              {/* Tasks for this date */}
              <div className="space-y-1 overflow-hidden">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border-l-4 border-l-green-400 border border-gray-200 rounded-md p-1.5 shadow-sm cursor-pointer hover:shadow-md transition-shadow text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                  >
                    {/* Task Title */}
                    <div className="font-medium text-gray-800 mb-1 leading-tight truncate">
                      {task.name}
                    </div>

                    {/* Task Footer - Profile, Project, Progress */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {task.assignee ? task.assignee.charAt(0) : "U"}
                        </div>
                        <div
                          className={`w-3 h-3 bg-gradient-to-br ${project?.color || "from-blue-500 to-blue-600"} rounded-sm flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-xs">
                            {project?.icon || "P"}
                          </span>
                        </div>
                      </div>

                      {/* Progress Circle */}
                      <div className="w-4 h-4 rounded-full border border-gray-300 bg-white flex items-center justify-center relative">
                        <svg
                          width="16"
                          height="16"
                          className="transform -rotate-90"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="5"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                            fill="transparent"
                          />
                          <circle
                            cx="8"
                            cy="8"
                            r="5"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            fill="transparent"
                            strokeDasharray={`${(task.progress / 100) * 31.4} 31.4`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show More Tasks */}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskCalendar;
