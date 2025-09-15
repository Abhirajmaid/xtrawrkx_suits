"use client";

import { useState } from "react";
import { MessageCircle, Clock } from "lucide-react";

export default function ProjectChatList({ 
  projects = [],
  activeProjectId,
  onProjectSelect,
  className = "" 
}) {
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Project Chats</h2>
        <p className="text-sm text-gray-500">Select a project to view messages</p>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No project chats available</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect && onProjectSelect(project.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  activeProjectId === project.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Project Avatar */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeProjectId === project.id 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200'
                  }`}>
                    <span className={`text-sm font-semibold ${
                      activeProjectId === project.id ? 'text-white' : 'text-gray-600'
                    }`}>
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium truncate ${
                        activeProjectId === project.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {project.name}
                      </h3>
                      {project.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                          {project.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {project.lastMessage && (
                      <p className={`text-sm truncate mb-1 ${
                        activeProjectId === project.id ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {truncateText(project.lastMessage.text)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {project.lastMessage 
                          ? formatTime(project.lastMessage.timestamp)
                          : 'No messages'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
