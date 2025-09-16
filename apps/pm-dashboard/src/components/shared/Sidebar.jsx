"use client";

import {
  Home,
  CheckSquare,
  Inbox,
  MessageCircle,
  BarChart3,
  Plus,
  ChevronDown,
} from "lucide-react";
import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useEffect,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWorkspace } from "../../contexts/WorkspaceContext";

const Sidebar = memo(function Sidebar({ onOpenWorkspaceModal }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const workspaceDropdownRef = useRef(null);

  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();

  // Close workspace dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        workspaceDropdownRef.current &&
        !workspaceDropdownRef.current.contains(event.target)
      ) {
        setShowWorkspaceDropdown(false);
      }
    };

    if (showWorkspaceDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWorkspaceDropdown]);

  // Memoize the active item calculation with improved path matching
  const activeItem = useMemo(() => {
    // Handle root and home routes
    if (pathname === "/" || pathname === "/home" || pathname === "/dashboard")
      return "home";
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
  const navigationItems = useMemo(
    () => [
      { id: "home", label: "Home", icon: Home, path: "/dashboard" },
      {
        id: "my-tasks",
        label: "My Tasks",
        icon: CheckSquare,
        path: "/my-task",
      },
      { id: "inbox", label: "Inbox", icon: Inbox, path: "/inbox" },
      {
        id: "message",
        label: "Message",
        icon: MessageCircle,
        path: "/message",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        path: "/analytics",
      },
    ],
    []
  );

  // Memoize projects to prevent re-creation on every render
  const projects = useMemo(
    () => [
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
    ],
    []
  );

  // Optimized navigation handler with loading state and performance improvements
  const handleNavigation = useCallback(
    async (path) => {
      if (isNavigating || pathname === path) return; // Prevent duplicate navigation

      setIsNavigating(true);
      try {
        await router.push(path);
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        // Reset loading state after a short delay to show the transition
        setTimeout(() => setIsNavigating(false), 100);
      }
    },
    [router, pathname, isNavigating]
  );

  // Optimized project navigation handler with loading state
  const handleProjectNavigation = useCallback(
    async (projectName) => {
      if (isNavigating) return; // Prevent navigation during loading

      const projectSlug = projectName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/&/g, "")
        .replace(/\//g, "-");
      const projectPath = `/projects/${projectSlug}`;

      if (pathname === projectPath) return; // Prevent duplicate navigation

      setIsNavigating(true);
      try {
        await router.push(projectPath);
      } catch (error) {
        console.error("Project navigation error:", error);
      } finally {
        setTimeout(() => setIsNavigating(false), 100);
      }
    },
    [router, pathname, isNavigating]
  );

  // Workspace management handlers
  const handleWorkspaceSwitch = useCallback(
    (workspaceId) => {
      switchWorkspace(workspaceId);
      setShowWorkspaceDropdown(false);
    },
    [switchWorkspace]
  );

  // Handle create project - navigate to add project page
  const handleCreateProject = useCallback(() => {
    router.push("/projects/add");
  }, [router]);

  // Handle load more projects
  const handleLoadMoreProjects = useCallback(() => {
    setShowAllProjects(true);
  }, []);

  // Get projects to display (limited initially)
  const displayedProjects = useMemo(() => {
    return showAllProjects ? projects : projects.slice(0, 3);
  }, [projects, showAllProjects]);

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">📋</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">taskhub</h1>
        </div>

        {/* Workspace Dropdown */}
        <div className="relative" ref={workspaceDropdownRef}>
          <button
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div
              className={`w-6 h-6 ${activeWorkspace?.color || "bg-green-500"} rounded flex items-center justify-center`}
            >
              <span className="text-white font-bold text-xs">
                {activeWorkspace?.icon || "4"}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 flex-1 text-left">
              {activeWorkspace?.name || "Fourtwo Studio"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${showWorkspaceDropdown ? "rotate-180" : ""}`}
            />
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
                      workspace.isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 ${workspace.color} rounded flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-xs">
                        {workspace.icon}
                      </span>
                    </div>
                    <span className="text-sm font-medium flex-1 text-left">
                      {workspace.name}
                    </span>
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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 flex flex-col min-h-0">
        <nav className="space-y-1 flex-shrink-0">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                disabled={isNavigating}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-gray-100 text-gray-900 font-bold shadow-sm rounded-r-lg"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                } ${isNavigating ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                <Icon
                  className={`w-5 h-5 mr-0 ${isActive ? "text-teal-700" : "text-gray-500 group-hover:text-gray-700"} transition-colors duration-200`}
                />
                <span>{item.label}</span>
                {isNavigating && isActive && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Projects Section */}
        <div className="mt-8 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 px-4 flex-shrink-0">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Projects
            </h3>
            <button
              onClick={handleCreateProject}
              className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors group"
              title="Create New Project"
            >
              <Plus className="w-3 h-3 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {displayedProjects.map((project) => {
              return (
                <button
                  key={project.id}
                  onClick={() => handleProjectNavigation(project.name)}
                  disabled={isNavigating}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 group ${
                    isNavigating ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-gradient-to-br ${project.color} rounded flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white font-bold text-xs">
                      {project.icon}
                    </span>
                  </div>
                  <span className="font-medium truncate">{project.name}</span>
                </button>
              );
            })}

            {/* Load More Button */}
            {!showAllProjects && projects.length > 3 && (
              <button
                onClick={handleLoadMoreProjects}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group mt-2"
              >
                <span className="font-medium">Load More</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer group">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Get Started</p>
            <p className="text-xs text-gray-500">5/6 Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Sidebar;
