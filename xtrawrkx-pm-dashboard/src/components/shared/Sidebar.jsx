"use client";

import {
  LayoutDashboard,
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
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import projectService from "../../lib/projectService";
import { transformProject } from "../../lib/dataTransformers";

const Sidebar = memo(function Sidebar({ collapsed = false, onToggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [toolsCollapsed, setToolsCollapsed] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const quickActionsRef = useRef(null);

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

  // Memoize navigation items to prevent re-creation on every render
  const navigationItems = useMemo(
    () => [
      {
        id: "home",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
        priority: "high",
      },
      {
        id: "my-tasks",
        label: "My Tasks",
        icon: CheckSquare,
        path: "/my-task",
        priority: "high",
      },
      {
        id: "inbox",
        label: "Inbox",
        icon: Inbox,
        path: "/inbox",
        priority: "high",
      },
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

  // Fetch real projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await projectService.getAllProjects({
          pageSize: 50,
          populate: ["projectManager"],
        });

        const transformedProjects = (response.data || []).map((project) => {
          const transformed = transformProject(project);
          return {
            id: transformed.id,
            name: transformed.name,
            slug: transformed.slug || project.slug,
            color: transformed.color || "from-blue-400 to-blue-600",
            bgColor: transformed.bgColor || "bg-blue-100",
            icon:
              transformed.icon ||
              transformed.name?.charAt(0)?.toUpperCase() ||
              "P",
          };
        });

        setProjects(transformedProjects);
      } catch (error) {
        console.error("Error fetching projects for sidebar:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Optimized project navigation handler with loading state
  const handleProjectNavigation = useCallback(
    async (project) => {
      if (isNavigating) return; // Prevent navigation during loading

      // Use slug if available, otherwise generate from name
      const projectSlug =
        project.slug ||
        project.name
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

  // Handle create project - navigate to add project page
  const handleCreateProject = useCallback(() => {
    router.push("/projects/add");
  }, [router]);

  // Get projects to display (limited initially - show 4 recent projects)
  const displayedProjects = useMemo(() => {
    if (loadingProjects) return [];
    return showAllProjects ? projects : projects.slice(0, 4);
  }, [projects, showAllProjects, loadingProjects]);

  const isActive = (href) => {
    if (!href || href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleQuickActions = () => {
    setQuickActionsOpen(!quickActionsOpen);
  };

  // Helper function to generate coming-soon URL with feature name
  const comingSoonUrl = (featureName) => {
    return `/coming-soon?feature=${encodeURIComponent(featureName)}`;
  };

  // PM Tools section
  const pmTools = [
    {
      label: "Documents",
      icon: FileText,
      href: comingSoonUrl("Documents"),
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: comingSoonUrl("Calendar"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: comingSoonUrl("Settings"),
    },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-full bg-white backdrop-blur-xl border-r border-white/30 flex flex-col shadow-xl overflow-y-auto transition-[width] duration-300 flex-shrink-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <span className="font-bold text-xl text-brand-foreground">
              PM Dashboard
            </span>
          )}
          <button onClick={onToggle} className="p-2 rounded-lg">
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-brand-foreground" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-brand-foreground" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/25 transition-[background-color,border-color,box-shadow] duration-300 text-sm placeholder:text-brand-text-light shadow-lg"
            />
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
            } text-brand-foreground rounded-xl py-3 px-4 flex items-center ${
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
          className={`grid gap-3 ${collapsed ? "grid-cols-1" : "grid-cols-2"}`}
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
                      ? "bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 border-yellow-300/50 text-yellow-800"
                      : "bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground hover:bg-white/30 hover:border-white/40"
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

      {/* Projects Section - Moved to top */}
      {!collapsed && (
        <div className="flex-1">
          <div className="px-3 mb-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-2.5 shadow-lg">
              <div className="flex items-center justify-between text-sm font-medium text-brand-foreground mb-2">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" />
                  Projects
                </span>
                <button
                  onClick={handleCreateProject}
                  className="w-5 h-5 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 group shadow-sm border border-white/20"
                  title="Create New Project"
                >
                  <Plus className="w-2.5 h-2.5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {loadingProjects ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-orange-500"></div>
                  </div>
                ) : displayedProjects.length === 0 ? (
                  <div className="text-center py-2 text-xs text-brand-text-light">
                    No projects yet
                  </div>
                ) : (
                  displayedProjects.map((project) => {
                    const projectSlug =
                      project.slug ||
                      project.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/&/g, "")
                        .replace(/\//g, "-");
                    const isProjectActive = pathname.startsWith(
                      `/projects/${projectSlug}`
                    );

                    return (
                      <button
                        key={project.id}
                        onClick={() => handleProjectNavigation(project)}
                        disabled={isNavigating}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs text-brand-text-light hover:bg-white/20 transition-all duration-200 ${
                          isProjectActive
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : ""
                        } ${
                          isNavigating ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-gradient-to-br ${project.color} rounded flex items-center justify-center flex-shrink-0 shadow-sm`}
                        >
                          <span className="text-white font-bold text-[10px]">
                            {project.icon}
                          </span>
                        </div>
                        <span className="font-medium truncate flex-1 text-left">
                          {project.name}
                        </span>
                      </button>
                    );
                  })
                )}

                {/* Load More / Show Less Buttons */}
                {!showAllProjects && projects.length > 4 && (
                  <button
                    onClick={() => setShowAllProjects(true)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 group mt-1.5 rounded-lg"
                  >
                    <span className="font-medium">Load More</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                )}
                {showAllProjects && projects.length > 4 && (
                  <button
                    onClick={() => setShowAllProjects(false)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 group mt-1.5 rounded-lg"
                  >
                    <span className="font-medium">Show Less</span>
                    <ChevronDown className="w-2.5 h-2.5 rotate-180" />
                  </button>
                )}

                {/* Show All Projects Button */}
                {projects.length > 0 && (
                  <button
                    onClick={() => router.push("/projects")}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 group mt-1.5 rounded-lg border border-orange-200"
                  >
                    <span>Show All Projects</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PM Tools Section - Moved below Projects and made collapsible */}
          <div className="px-4 mb-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-lg">
              <button
                onClick={() => setToolsCollapsed(!toolsCollapsed)}
                className="w-full flex items-center justify-between text-sm font-medium text-brand-foreground mb-3"
              >
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Tools
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    toolsCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>

              {!toolsCollapsed && (
                <div className="space-y-2">
                  {pmTools.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center gap-3 text-xs text-brand-text-light p-2 rounded-lg hover:bg-white/20 hover:text-gray-900 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
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
              <span className="text-xs text-brand-text-light font-medium">
                System
              </span>
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
                        ? "border-yellow-300/50 bg-yellow-50/30 text-yellow-800"
                        : "border-white/25 text-brand-text-light"
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
            <div className="w-10 h-10 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-brand-primary text-sm font-medium">
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
                  <p className="text-sm font-semibold text-brand-foreground truncate">
                    {user
                      ? user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.name || user.email || "User"
                      : "User"}
                  </p>
                  <p className="text-xs text-brand-text-light truncate">
                    {user
                      ? user.primaryRole?.name || user.role || "Team Member"
                      : "Team Member"}
                  </p>
                </div>
                <button className="text-brand-text-light">
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
