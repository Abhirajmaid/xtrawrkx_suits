"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Filter,
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  Settings,
  User,
  Share,
  Bell,
  Image,
} from "lucide-react";
import { Card } from "./ui";
import { useAuth } from "../contexts/AuthContext";
import GlobalSearchModal from "./GlobalSearchModal";

export default function PageHeader({
  title,
  subtitle,
  breadcrumb = [],
  showSearch = false,
  showActions = false,
  showProfile = true,
  searchPlaceholder,
  onSearchChange,
  onAddClick,
  onFilterClick,
  onImportClick,
  onExportClick,
  onShareImageClick,
  actions,
  children,
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  // Handle keyboard shortcut (Cmd/Ctrl + K) to open global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (showSearch) {
          setShowGlobalSearch(true);
        }
      }
      // Also handle Escape to close
      if (e.key === "Escape" && showGlobalSearch) {
        setShowGlobalSearch(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearch, showGlobalSearch]);

  const getUserInitials = () => {
    if (!user) {
      return "U";
    }

    // Handle different user data structures
    const userData = user.attributes || user;

    const firstName = userData.firstName || userData.name?.split(" ")[0] || "";
    const lastName = userData.lastName || userData.name?.split(" ")[1] || "";

    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    if (initials && initials !== " " && initials.length === 2) {
      return initials;
    }

    // Fallback to email first letter
    if (userData.email) {
      return userData.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  const getUserDisplayName = () => {
    if (!user) {
      return "User";
    }

    // Handle different user data structures
    const userData = user.attributes || user;

    // Try firstName and lastName first
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`.trim();
    }

    // Try firstName only
    if (userData.firstName) {
      return userData.firstName;
    }

    // Try name field
    if (userData.name) {
      return userData.name;
    }

    // Try username
    if (userData.username) {
      return userData.username;
    }

    // Fallback to email
    if (userData.email) {
      return userData.email.split("@")[0];
    }

    return "User";
  };

  const getUserRole = () => {
    if (!user) {
      return "User";
    }

    // Handle different user data structures
    const userData = user.attributes || user;

    // Try primaryRole first
    if (userData.primaryRole) {
      const roleName =
        typeof userData.primaryRole === "object"
          ? userData.primaryRole.name ||
            userData.primaryRole.attributes?.name ||
            userData.primaryRole.data?.attributes?.name ||
            userData.primaryRole.data?.name
          : userData.primaryRole;
      if (roleName) {
        return roleName;
      }
    }

    // Try userRoles array
    if (
      userData.userRoles &&
      Array.isArray(userData.userRoles) &&
      userData.userRoles.length > 0
    ) {
      const firstRole = userData.userRoles[0];
      const roleName =
        typeof firstRole === "object"
          ? firstRole.name ||
            firstRole.attributes?.name ||
            firstRole.data?.attributes?.name ||
            firstRole.data?.name
          : firstRole;
      if (roleName) {
        return roleName;
      }
    }

    // Fallback to role field
    if (userData.role) {
      const roleName =
        typeof userData.role === "object"
          ? userData.role.name ||
            userData.role.attributes?.name ||
            userData.role.data?.attributes?.name ||
            userData.role.data?.name ||
            userData.role
          : userData.role;
      if (roleName) {
        return roleName;
      }
    }

    return "User";
  };

  // Build breadcrumb from pathname if not provided
  const breadcrumbItems =
    breadcrumb.length > 0
      ? breadcrumb.map((item) => {
          // Handle both string and object formats
          if (typeof item === "string") {
            // If it's a string, create a href from pathname segments
            const segments = pathname.split("/").filter(Boolean);
            const itemIndex = breadcrumb.findIndex((b) => b === item);
            if (itemIndex >= 0 && itemIndex < segments.length) {
              const href = "/" + segments.slice(0, itemIndex + 1).join("/");
              return { label: item, href };
            }
            // Fallback: use item as label, try to construct href
            return { label: item, href: "#" };
          }
          // If it's already an object, ensure it has href
          return {
            label: item.label || item,
            href: item.href || "#",
          };
        })
      : pathname
          .split("/")
          .filter(Boolean)
          .map((segment, index, array) => {
            const href = "/" + array.slice(0, index + 1).join("/");
            const label =
              segment.charAt(0).toUpperCase() +
              segment.slice(1).replace(/-/g, " ");
            return { label, href };
          });

  return (
    <Card glass={true} className="relative z-[40]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Breadcrumb */}
          {breadcrumbItems.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-brand-text-light mb-2">
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index === breadcrumbItems.length - 1 ? (
                    <span className="text-brand-foreground font-medium">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-brand-text-light hover:text-brand-foreground transition-colors duration-200 cursor-pointer"
                    >
                      {item.label}
                    </Link>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Title and Subtitle */}
          <h1 className="text-5xl font-light text-brand-foreground mb-1 tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-brand-text-light">{subtitle}</p>}
        </div>

        {/* Custom content or default actions */}
        {(children || showSearch || showActions || actions) && (
          <div className="flex items-center gap-4 ml-4">
            {/* Search Bar */}
            {showSearch && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-light" />
                <input
                  type="text"
                  placeholder={searchPlaceholder || "Search... (⌘K)"}
                  onFocus={() => {
                    // If no custom search handler, open global search modal
                    if (!onSearchChange) {
                      setShowGlobalSearch(true);
                    }
                  }}
                  onClick={() => {
                    // If no custom search handler, open global search modal
                    if (!onSearchChange) {
                      setShowGlobalSearch(true);
                    }
                  }}
                  value={searchInputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchInputValue(value);
                    // If custom handler provided, use it
                    if (onSearchChange) {
                      onSearchChange(value);
                    }
                    // Don't auto-open modal on typing - user can press Enter to open
                  }}
                  onKeyDown={(e) => {
                    // Open global search modal on Enter key
                    if (e.key === "Enter") {
                      e.preventDefault();
                      // Open modal with current search value
                      setShowGlobalSearch(true);
                    }
                  }}
                  className="w-64 pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary focus:bg-white/15 transition-all duration-300 placeholder:text-brand-text-light shadow-lg cursor-pointer"
                />
              </div>
            )}

            {/* Actions */}
            {children ||
              (showActions && (
                <div className="flex items-center gap-2">
                  {onAddClick && (
                    <button
                      onClick={onAddClick}
                      className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-brand-primary rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg"
                    >
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    </button>
                  )}

                  {onFilterClick && (
                    <button
                      onClick={onFilterClick}
                      className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
                    >
                      <Filter className="w-5 h-5 text-brand-text-light" />
                    </button>
                  )}

                  {onImportClick && (
                    <button
                      onClick={onImportClick}
                      className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
                    >
                      <Upload className="w-5 h-5 text-brand-text-light" />
                    </button>
                  )}

                  {onExportClick && (
                    <button
                      onClick={onExportClick}
                      className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
                    >
                      <Download className="w-5 h-5 text-brand-text-light" />
                    </button>
                  )}

                  {onShareImageClick && (
                    <button
                      onClick={onShareImageClick}
                      className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
                      title="Share Image"
                    >
                      <Image className="w-5 h-5 text-brand-text-light" />
                    </button>
                  )}
                </div>
              ))}

            {/* Custom Actions */}
            {actions &&
              actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg ${
                    action.className || ""
                  }`}
                >
                  {action.icon && (
                    <action.icon className="w-5 h-5 text-brand-text-light" />
                  )}
                </button>
              ))}
          </div>
        )}

        {/* User Profile */}
        {showProfile && (
          <div className="flex items-center ml-4">
            <div className="relative">
              <button
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300"
                onMouseEnter={() => setShowProfileDropdown(true)}
                onMouseLeave={() => setShowProfileDropdown(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-brand-primary text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-brand-foreground">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-brand-text-light">
                      {getUserRole()}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-brand-text-light transition-transform ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-[99998]"
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <div
                    className="fixed right-6 top-20 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 z-[99999]"
                    onMouseEnter={() => setShowProfileDropdown(true)}
                    onMouseLeave={() => setShowProfileDropdown(false)}
                    style={{ zIndex: 99999 }}
                  >
                    <div className="p-4 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-brand-primary text-sm font-medium">
                            {getUserInitials()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-brand-foreground">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-sm text-brand-text-light">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-brand-hover rounded-lg transition-colors">
                        <User className="w-4 h-4 text-brand-text-light" />
                        <span className="text-sm text-brand-foreground">
                          View Profile
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-brand-hover rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-brand-text-light" />
                        <span className="text-sm text-brand-foreground">
                          Settings
                        </span>
                      </button>
                      <div className="h-px bg-brand-border my-2 mx-3"></div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <Share className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global Search Modal */}
      {showSearch && (
        <GlobalSearchModal
          isOpen={showGlobalSearch}
          onClose={() => {
            setShowGlobalSearch(false);
            // Optionally clear search input when closing
            // setSearchInputValue("");
          }}
          initialQuery={searchInputValue}
        />
      )}
    </Card>
  );
}
