"use client";

import {
  Home,
  CheckSquare,
  Inbox,
  MessageCircle,
  BarChart3,
  FolderOpen,
  Plus,
  Activity,
  ChevronDown,
} from "lucide-react";
import React, { useState, useCallback, useMemo, memo, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWorkspace } from "../contexts/WorkspaceContext";

const Sidebar = memo(function Sidebar({ onOpenWorkspaceModal, onOpenManageWorkspaceModal }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const workspaceDropdownRef = useRef(null);
  
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();

  // Close workspace dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setShowWorkspaceDropdown(false);
      }
    };

    if (showWorkspaceDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWorkspaceDropdown]);
  
  // Memoize the active item calculation with improved path matching
  const activeItem = useMemo(() => {
    // Handle root and home routes
    if (pathname === "/" || pathname === "/home" || pathname === "/dashboard") return "home";
    // Handle my-tasks routes (including dynamic routes)
    if (pathname.startsWith("/my-task")) return "my-tasks";
    // Handle inbox routes
    if (pathname.startsWith("/inbox")) return "inbox";
    // Handle message routes
    if (pathname.startsWith("/message")) return "message";
    // Handle analytics routes
    if (pathname.startsWith("/analytics")) return "analytics";
    // Handle projects routes (including dynamic routes)
    if (pathname.startsWith("/projects")) return "projects";
    return "home";
  }, [pathname]);

  // Memoize navigation items to prevent re-creation on every render
  const navigationItems = useMemo(() => [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "my-tasks", label: "My Tasks", icon: CheckSquare, path: "/my-task" },
    { id: "inbox", label: "Inbox", icon: Inbox, path: "/inbox" },
    { id: "message", label: "Message", icon: MessageCircle, path: "/message" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  ], []);

  // Memoize projects to prevent re-creation on every render
  const projects = useMemo(() => [
    {
      id: 1,
      name: "Yellow Branding",
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-100",
      icon: "Y",
    },
    {
      id: 2,
      name: "Mogo Web Design",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-100",
      icon: "M",
    },
    {
      id: 3,
      name: "Futurework",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-100",
      icon: "F",
    },
    {
      id: 4,
      name: "Resto Dashboard",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-100",
      icon: "R",
    },
    {
      id: 5,
      name: "Hajime Illustration",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-100",
      icon: "H",
    },
    {
      id: 6,
      name: "Carl UI/UX",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-100",
      icon: "C",
    },
    {
      id: 7,
      name: "The Run Branding & Graphic",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-100",
      icon: "T",
    },
  ], []);

  // Memoize conversations data
  const conversations = useMemo(() => [
    {
      id: 1,
      user: "Floyd Miles",
      avatar: "FM",
      time: "10y",
      message: "changed thought about color...",
      color: "bg-orange-500"
    },
    {
      id: 2,
      user: "Brooklyn Simmons", 
      avatar: "BS",
      time: "11y",
      message: "",
      color: "bg-blue-500"
    },
    {
      id: 3,
      user: "Jerome Bell",
      avatar: "JB", 
      time: "12h",
      message: "Hi, I had these if you could add...",
      color: "bg-green-500"
    },
    {
      id: 4,
      user: "Arlene G",
      avatar: "AG",
      time: "2d", 
      message: "Great job! you good...",
      color: "bg-blue-600"
    }
  ], []);

  // Optimized navigation handler with loading state and performance improvements
  const handleNavigation = useCallback(async (path) => {
    if (isNavigating || pathname === path) return; // Prevent duplicate navigation
    
    setIsNavigating(true);
    try {
      await router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset loading state after a short delay to show the transition
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [router, pathname, isNavigating]);

  // Optimized project navigation handler with loading state
  const handleProjectNavigation = useCallback(async (projectName) => {
    if (isNavigating) return; // Prevent navigation during loading
    
    const projectSlug = projectName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/\//g, '-');
    const projectPath = `/projects/${projectSlug}`;
    
    if (pathname === projectPath) return; // Prevent duplicate navigation
    
    setIsNavigating(true);
    try {
      await router.push(projectPath);
    } catch (error) {
      console.error('Project navigation error:', error);
    } finally {
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [router, pathname, isNavigating]);

  // Workspace management handlers
  const handleWorkspaceSwitch = useCallback((workspaceId) => {
    switchWorkspace(workspaceId);
    setShowWorkspaceDropdown(false);
  }, [switchWorkspace]);

  return (
    <div className="w-64 h-screen overflow-hidden bg-gradient-glass backdrop-blur-xl border-r border-white/30 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">X</span>
          </div>
          <h1 className="text-lg font-semibold text-brand-foreground">
            xtrawrkx
          </h1>
        </div>

        {/* Workspace Dropdown */}
        <div className="relative mb-4" ref={workspaceDropdownRef}>
          <button
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="w-full flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <div className={`w-6 h-6 ${activeWorkspace?.color || 'bg-green-500'} rounded flex items-center justify-center`}>
              <span className="text-white font-bold text-xs">{activeWorkspace?.icon || '4'}</span>
            </div>
            <span className="text-sm font-medium text-gray-700 flex-1 text-left">{activeWorkspace?.name || 'Fourtwo Studio'}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showWorkspaceDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Workspace Dropdown Menu */}
          {showWorkspaceDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-2">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleWorkspaceSwitch(workspace.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      workspace.isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className={`w-5 h-5 ${workspace.color} rounded flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">{workspace.icon}</span>
                    </div>
                    <span className="text-sm font-medium flex-1 text-left">{workspace.name}</span>
                    {workspace.isActive && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <button
                  onClick={() => {
                    onOpenWorkspaceModal();
                    setShowWorkspaceDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <div className="w-5 h-5 bg-gray-300 rounded flex items-center justify-center">
                    <Plus className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">+ New Workspace</span>
                </button>
                
                <button
                  onClick={() => {
                    onOpenManageWorkspaceModal();
                    setShowWorkspaceDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <div className="w-5 h-5 bg-gray-300 rounded flex items-center justify-center">
                    <Activity className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">Manage Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/20 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-brand-foreground mb-1">
            Start Your Day
          </h2>
          <h2 className="text-base font-semibold text-brand-foreground mb-2">
            & Be Productive 🌟
          </h2>
          <p className="text-xs text-brand-text-light italic">
            "Every great achievement starts with a single step forward."
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              disabled={isNavigating}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-white text-gray-800 shadow-lg border border-white/20"
                  : "text-brand-text-light hover:bg-white/15 hover:text-brand-foreground"
              } ${isNavigating ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-gray-700" : "text-brand-text-light group-hover:text-brand-foreground"} transition-colors duration-200 ${
                  isNavigating && !isActive ? "animate-pulse" : ""
                }`}
              />
              <span className={`text-sm font-medium ${isActive ? "text-gray-800" : ""}`}>{item.label}</span>
              {isNavigating && isActive && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          );
        })}

        {/* Projects Section */}
        <div className="pt-6 mt-6 border-t border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-brand-text-light uppercase tracking-wider">
              Projects
            </h3>
            <button className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center hover:bg-white/25 transition-colors group">
              <Plus className="w-3 h-3 text-brand-text-light group-hover:text-brand-foreground transition-colors" />
            </button>
          </div>

          <div className="space-y-2">
            {projects.map((project) => {
              const projectSlug = project.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/\//g, '-');
              return (
                <button
                  key={project.id}
                  onClick={() => handleProjectNavigation(project.name)}
                  disabled={isNavigating}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-brand-text-light hover:bg-white/15 hover:text-brand-foreground transition-all duration-300 group shadow-none ${
                    isNavigating ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-gradient-to-br ${project.color} rounded-md flex items-center justify-center`}
                    style={{ boxShadow: 'none' }}
                  >
                    <span className="text-white font-bold text-xs">
                      {project.icon}
                    </span>
                  </div>
                  <span className="text-sm font-medium truncate">
                    {project.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversations Section */}
        <div className="pt-6 mt-6 border-t border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-brand-text-light uppercase tracking-wider">
              Conversations
            </h3>
            <button className="text-brand-text-light hover:text-brand-foreground text-xs">
              Show more
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 1,
                user: "Floyd Miles",
                avatar: "FM",
                time: "10y",
                message: "changed thought about color...",
                color: "bg-orange-500"
              },
              {
                id: 2,
                user: "Brooklyn Simmons", 
                avatar: "BS",
                time: "11y",
                message: "",
                color: "bg-blue-500"
              },
              {
                id: 3,
                user: "Jerome Bell",
                avatar: "JB", 
                time: "12h",
                message: "Hi, I had these if you could add...",
                color: "bg-green-500"
              },
              {
                id: 4,
                user: "Arlene G",
                avatar: "AG",
                time: "2d", 
                message: "Great job! you good...",
                color: "bg-blue-600"
              }
            ].map((conversation) => (
              <div key={conversation.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <div className={`w-8 h-8 ${conversation.color} rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                  {conversation.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-brand-foreground truncate">{conversation.user}</span>
                    <span className="text-xs text-brand-text-light">{conversation.time}</span>
                  </div>
                  {conversation.message && (
                    <p className="text-xs text-brand-text-light truncate">{conversation.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 cursor-pointer group">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            {/* Progress ring */}
            <svg
              className="absolute -inset-1 w-10 h-10 transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="25, 80"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Get Started
            </p>
            <p className="text-xs text-gray-500">5/6 Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Sidebar;
