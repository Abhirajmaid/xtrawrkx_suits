"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Search, 
  ArrowUpDown, 
  User, 
  Calendar, 
  MoreHorizontal,
  MessageSquare,
  CheckCircle
} from "lucide-react";

const GlobalSearchModal = ({ isOpen, onClose, initialQuery = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedItems, setSelectedItems] = useState([]);

  // Update search query when initialQuery changes
  useEffect(() => {
    if (isOpen && initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Mock data for recent tasks
  const recentTasks = [
    {
      id: 1,
      name: "Social Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H"
      },
      dueDate: "Jan 12",
      progress: 85,
      status: "In Progress",
      assignee: "You"
    },
    {
      id: 2,
      name: "First Sketch",
      project: {
        name: "Hajime Illustration", 
        color: "from-green-400 to-green-600",
        icon: "H"
      },
      dueDate: "Jan 24",
      progress: 60,
      status: "In Progress",
      assignee: "Multiple"
    },
    {
      id: 3,
      name: "Landing Page Options",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C"
      },
      dueDate: "Jan 19",
      progress: 45,
      status: "In Progress",
      assignee: "You"
    },
    {
      id: 4,
      name: "Onboarding Flow",
      project: {
        name: "Futurework",
        color: "from-blue-400 to-blue-600",
        icon: "F"
      },
      dueDate: "Jan 20",
      progress: 30,
      status: "In Progress",
      assignee: "Multiple"
    }
  ];

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      user: {
        name: "Jane Cooper",
        avatar: "JC",
        color: "bg-blue-500"
      },
      action: "commented",
      description: "Hi, I have checked all the links and confir...",
      time: "1 min ago"
    },
    {
      id: 2,
      user: {
        name: "Susan Drake",
        avatar: "SD",
        color: "bg-purple-500"
      },
      action: "commented",
      description: "Hi here's the update https://figma.com/fil...",
      time: "30 min ago"
    },
    {
      id: 3,
      user: {
        name: "Mark Atenson",
        avatar: "MA",
        color: "bg-green-500"
      },
      action: "commented",
      description: "Thanks, I will dig more about it",
      time: "Jan 28"
    }
  ];

  const handleItemSelect = (itemId, type) => {
    const key = `${type}-${itemId}`;
    setSelectedItems(prev => 
      prev.includes(key) 
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  };

  const isItemSelected = (itemId, type) => {
    return selectedItems.includes(`${type}-${itemId}`);
  };

  const CircularProgress = ({ percentage }) => {
    const radius = 8;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={20} height={20} className="transform -rotate-90">
          <circle
            cx={10}
            cy={10}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={2}
            fill="transparent"
          />
          <circle
            cx={10}
            cy={10}
            r={radius}
            stroke="#3b82f6"
            strokeWidth={2}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-[70] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              autoFocus
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Sorting Options */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">Sort</span>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
            <User className="w-3 h-3" />
            Assignee
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
            <User className="w-3 h-3" />
            Created by
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
            <Calendar className="w-3 h-3" />
            Date
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
            Status
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Recent Tasks Section */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              RECENT TASKS
            </h3>
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleItemSelect(task.id, 'task')}
                >
                  <input
                    type="checkbox"
                    checked={isItemSelected(task.id, 'task')}
                    onChange={() => handleItemSelect(task.id, 'task')}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  
                  <div className={`w-6 h-6 bg-gradient-to-br ${task.project.color} rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {task.project.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {task.name}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {task.assignee === "Multiple" ? (
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 bg-blue-500 rounded-full border border-white"></div>
                        <div className="w-5 h-5 bg-green-500 rounded-full border border-white"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    )}
                    
                    <CircularProgress percentage={task.progress} />
                    
                    <span className="text-xs text-gray-500 min-w-[3rem] text-right">
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              RECENT ACTIVITY
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${activity.user.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {activity.user.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{activity.user.name}</span>
                      <span className="text-gray-600 ml-1">{activity.action}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {activity.description}
                    </p>
                  </div>
                  
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded transition-colors">
              <CheckCircle className="w-3 h-3" />
              Select
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded transition-colors">
              <MoreHorizontal className="w-3 h-3" />
              Open
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            {selectedItems.length > 0 && `${selectedItems.length} selected`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
