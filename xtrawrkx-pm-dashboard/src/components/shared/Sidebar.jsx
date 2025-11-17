"use client";

import {
  Home,
  CheckSquare,
  Inbox,
  MessageCircle,
  BarChart3,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Target,
  FileText,
  Calendar,
  Settings,
  FolderOpen,
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
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";

const Sidebar = memo(function Sidebar({
  onOpenWorkspaceModal,
  onOpenManageWorkspaceModal,
  collapsed = false,
  onToggle,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const workspaceDropdownRef = useRef(null);
  const quickActionsRef = useRef(null);

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

  // Close quick actions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        quickActionsRef.current &&
        !quickActionsRef.current.contains(event.target)
      ) {
        setQuickActionsOpen(false);
      }
    };

    if (quickActionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [quickActionsOpen]);

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
      { id: "home", label: "Dashboard", icon: Home, path: "/dashboard", priority: "high" },
      {
        id: "my-tasks",
        label: "My Tasks",
        icon: CheckSquare,
        path: "/my-task",
        priority: "high",
      },
      { id: "inbox", label: "Inbox", icon: Inbox, path: "/inbox", priority: "high" },
      {
        id: "message",
        label: "Message",
        icon: MessageCircle,
        path: "/message",
        priority: "high",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        path: "/analytics",
        priority: "low",
      },
    ],
    []
  );

  // Quick action items
  const quickActionItems = [
    {
      label: "New Task",
      icon: CheckSquare,
      href: "/my-task/new",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      label: "New Project",
      icon: FolderOpen,
      href: "/projects/add",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "New Workspace",
      icon: Target,
      href: "#",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      onClick: () => {
        onOpenWorkspaceModal();
        setQuickActionsOpen(false);
      },
    },
  ];

  // Handle quick action navigation
  const handleQuickActionClick = (href, onClick) => {
    setQuickActionsOpen(false);
    if (onClick) {
      onClick();
    } else if (href && href !== "#") {
      router.push(href);
    }
  };

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

  const isActive = (href) => {
    if (!href || href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleQuickActions = () => {
    setQuickActionsOpen(!quickActionsOpen);
  };

  // PM Tools section
  const pmTools = [
    {
      label: "Documents",
      icon: FileText,
      href: "#",
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: "#",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "#",
    },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-72"
      } h-full bg-white backdrop-blur-xl border-r border-white/30 flex flex-col shadow-xl overflow-y-auto transition-[width] duration-300 flex-shrink-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <span className="font-bold text-xl text-gray-900">
              PM Dashboard
            </span>
          )}
          <button onClick={onToggle} className="p-2 rounded-lg">
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-900" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white/25 transition-[background-color,border-color,box-shadow] duration-300 text-sm placeholder:text-gray-500 shadow-lg"
            />
          </div>
        )}

        {/* Workspace Dropdown */}
        {!collapsed && (
          <div className="relative mb-3" ref={workspaceDropdownRef}>
            <button
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
              className="w-full flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-300 shadow-lg"
            >
              <div
                className={`w-6 h-6 bg-gradient-to-br ${
                  activeWorkspace?.color || "from-green-400 to-green-600"
                } rounded flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white font-bold text-xs">
                  {activeWorkspace?.icon || "4"}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 flex-1 text-left truncate">
                {activeWorkspace?.name || "Fourtwo Studio"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform flex-shrink-0 ${
                  showWorkspaceDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Workspace Dropdown Menu */}
            {showWorkspaceDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30 z-10">
                <div className="p-2">
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => handleWorkspaceSwitch(workspace.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-200 ${
                        workspace.isActive
                          ? "bg-orange-50 text-orange-700 shadow-sm"
                          : "text-gray-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-gradient-to-br ${workspace.color} rounded flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-white font-bold text-xs">
                          {workspace.icon}
                        </span>
                      </div>
                      <span className="text-sm font-medium flex-1 text-left truncate">
                        {workspace.name}
                      </span>
                      {workspace.isActive && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-white/20 my-2"></div>

                  <button
                    onClick={() => {
                      onOpenWorkspaceModal();
                      setShowWorkspaceDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-200 text-gray-700"
                  >
                    <div className="w-5 h-5 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
                      <Plus className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium">+ New Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Button */}
        <div className="relative" ref={quickActionsRef}>
          <button
            onClick={toggleQuickActions}
            className={`w-full bg-gradient-to-r from-orange-500/20 to-orange-600/10 backdrop-blur-md border ${
              quickActionsOpen
                ? "border-orange-300/60"
                : "border-white/30 hover:border-orange-200/50"
            } text-gray-900 rounded-xl py-3 px-4 flex items-center ${
              collapsed ? "justify-center" : "justify-between gap-2"
            } shadow-lg hover:shadow-xl transition-all duration-300 group`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-4 h-4 text-white" />
              </div>
              {!collapsed && (
                <span className="text-sm font-semibold text-gray-800">
                  Quick Actions
                </span>
              )}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                  quickActionsOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {/* Quick Actions Dropdown */}
          {quickActionsOpen && !collapsed && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                <div className="px-3 py-2 mb-1 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Quick Create
                  </p>
                </div>
                {quickActionItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() =>
                        handleQuickActionClick(item.href, item.onClick)
                      }
                      className="w-full flex items-center gap-3 p-3.5 text-sm text-gray-800 rounded-xl hover:bg-gray-50 transition-all duration-200 group/item"
                    >
                      <div
                        className={`w-10 h-10 ${item.bgColor} ${item.borderColor} border rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:shadow-md transition-all duration-200`}
                      >
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="font-medium text-gray-900 flex-1 text-left">
                        {item.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Grid */}
      <div className="p-4 space-y-4">
        {/* Primary Navigation - Top 4 */}
        <div
          className={`grid gap-3 ${
            collapsed ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {navigationItems
            .filter((item) => item.priority === "high")
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`${
                    active
                      ? "bg-orange-500 text-white border-orange-500/50"
                      : "bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 hover:bg-white/30 hover:border-white/40"
                  } 
                    rounded-xl p-4 flex flex-col items-center gap-3 transition-[background-color,border-color,color] duration-300 shadow-lg group`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  {!collapsed && (
                    <span className="text-xs font-medium text-center">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
        </div>
      </div>

      {/* PM Tools Section */}
      {!collapsed && (
        <div className="flex-1">
          <div className="px-4 mb-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-sm font-medium text-gray-900 mb-3">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Tools
                </span>
                <ChevronDown className="w-4 h-4" />
              </div>

              <div className="space-y-2">
                {pmTools.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 text-xs text-gray-600 p-2 rounded-lg hover:bg-white/20 hover:text-gray-900 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="px-4 mb-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-sm font-medium text-gray-900 mb-3">
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Projects
                </span>
                <button
                  onClick={handleCreateProject}
                  className="w-6 h-6 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 group shadow-sm border border-white/20"
                  title="Create New Project"
                >
                  <Plus className="w-3 h-3 text-gray-600 group-hover:text-gray-900 transition-colors" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {displayedProjects.map((project) => {
                  const isProjectActive = pathname.startsWith(
                    `/projects/${project.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/&/g, "")
                      .replace(/\//g, "-")}`
                  );
                  return (
                    <button
                      key={project.id}
                      onClick={() => handleProjectNavigation(project.name)}
                      disabled={isNavigating}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-xs text-gray-700 hover:bg-white/20 transition-all duration-200 ${
                        isProjectActive
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : ""
                      } ${isNavigating ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      <div
                        className={`w-4 h-4 bg-gradient-to-br ${project.color} rounded flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-white font-bold text-xs">
                          {project.icon}
                        </span>
                      </div>
                      <span className="font-medium truncate flex-1 text-left">
                        {project.name}
                      </span>
                    </button>
                  );
                })}

                {/* Load More Button */}
                {!showAllProjects && projects.length > 3 && (
                  <button
                    onClick={handleLoadMoreProjects}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 group mt-2 rounded-lg"
                  >
                    <span className="font-medium">Load More</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Navigation - Bottom Section */}
      <div className="mt-auto">
        <div className="px-4 mb-4">
          {/* Divider */}
          {!collapsed && (
            <div className="flex items-center gap-4 px-2 mb-4">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-xs text-gray-500 font-medium">System</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
          )}

          {/* System Navigation Grid */}
          <div className="flex flex-col gap-3">
            {navigationItems
              .filter((item) => item.priority === "low")
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`w-full bg-white/15 backdrop-blur-md border ${
                      active
                        ? "border-orange-300/50 bg-orange-50/30 text-orange-700"
                        : "border-white/25 text-gray-600"
                    } rounded-xl p-3 flex flex-col items-center gap-2 shadow-md hover:bg-white/20 hover:border-white/30 transition-all duration-200 group`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    {!collapsed && (
                      <span className="text-xs font-medium text-center">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Footer - User Profile */}
        <div className="p-4 border-t border-white/20">
          <div
            className={`flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-orange-500 text-sm font-medium">
                {user
                  ? (user.firstName?.charAt(0) ||
                      user.name?.charAt(0) ||
                      user.email?.charAt(0) ||
                      "U") +
                    (user.lastName?.charAt(0) ||
                      user.name?.split(" ")[1]?.charAt(0) ||
                      "")
                  : "U"}
              </span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user
                      ? user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.name || user.email || "User"
                      : "User"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user
                      ? user.primaryRole?.name || user.role || "User"
                      : "User"}
                  </p>
                </div>
                <button className="text-gray-600">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Sidebar;
