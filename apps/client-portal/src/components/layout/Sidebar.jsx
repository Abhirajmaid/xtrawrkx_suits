"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Crown,
  Calendar,
  Clock,
  Activity,
  FolderOpen,
  Archive,
  List,
  Grid3X3,
  Calendar as CalendarIcon,
  Plus,
  User,
  Bell,
  CreditCard,
  Key,
  Star,
  ChevronDown,
  Settings,
  HelpCircle,
  Shield,
  FileText,
  Ticket,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ModernButton from "@/components/ui/ModernButton";

// Communities data
const communitiesData = [
  {
    id: 1,
    name: "XEN",
    fullName: "XEN Entrepreneurs Network",
    category: "Business Division",
    href: "/communities/xen",
    isMember: true,
    userTier: "x3",
    userTierName: "Growth Member",
    submenu: [
      { name: "Overview", href: "/communities/xen/overview", icon: Home },
      { name: "Members", href: "/communities/xen/members", icon: Users },
      { name: "Key Features", href: "/communities/xen/features", icon: Star },
      {
        name: "Meeting Schedule",
        href: "/communities/xen/schedule",
        icon: Calendar,
      },
      { name: "Join/Upgrade", href: "/communities/xen/upgrade", icon: Crown },
    ],
  },
  {
    id: 2,
    name: "XEV.FiN",
    fullName: "XEV Financial Network",
    category: "Investment Division",
    href: "/communities/xevfin",
    isMember: false,
    submenu: [
      { name: "Overview", href: "/communities/xevfin/overview", icon: Home },
      { name: "Members", href: "/communities/xevfin/members", icon: Users },
      {
        name: "Key Features",
        href: "/communities/xevfin/features",
        icon: Star,
      },
      {
        name: "Meeting Schedule",
        href: "/communities/xevfin/schedule",
        icon: Calendar,
      },
      {
        name: "Join/Upgrade",
        href: "/communities/xevfin/upgrade",
        icon: Crown,
      },
    ],
  },
  {
    id: 3,
    name: "XEVTG",
    fullName: "XEV Tech Talent Group",
    category: "Technology Division",
    href: "/communities/xevtg",
    isMember: true,
    userTier: "x1",
    userTierName: "Starter Member",
    submenu: [
      { name: "Overview", href: "/communities/xevtg/overview", icon: Home },
      { name: "Members", href: "/communities/xevtg/members", icon: Users },
      { name: "Key Features", href: "/communities/xevtg/features", icon: Star },
      {
        name: "Meeting Schedule",
        href: "/communities/xevtg/schedule",
        icon: Calendar,
      },
      { name: "Join/Upgrade", href: "/communities/xevtg/upgrade", icon: Crown },
    ],
  },
];

// Contextual navigation based on active top nav
const getContextualNavigation = (activeSection) => {
  const sections = {
    dashboard: [
      { name: "Overview", href: "/dashboard", icon: Home },
      { name: "Upcoming Deadlines", href: "/dashboard/deadlines", icon: Clock },
      { name: "Activity Feed", href: "/dashboard/activity", icon: Activity },
    ],
    projects: [
      { name: "All", href: "/projects", icon: FolderOpen },
      { name: "Active", href: "/projects/active", icon: CheckSquare },
      { name: "Archived", href: "/projects/archived", icon: Archive },
      {
        name: "Views",
        href: "#",
        icon: Grid3X3,
        hasSubmenu: true,
        submenu: [
          { name: "List", href: "/projects?view=list", icon: List },
          { name: "Board", href: "/projects?view=board", icon: Grid3X3 },
          { name: "Timeline", href: "/projects?view=timeline", icon: Calendar },
          {
            name: "Calendar",
            href: "/projects?view=calendar",
            icon: CalendarIcon,
          },
        ],
      },
    ],
    tasks: [
      { name: "My Tasks", href: "/tasks", icon: CheckSquare },
      { name: "Raised by Me", href: "/tasks/raised", icon: User },
      { name: "Shared with Me", href: "/tasks/shared", icon: Users },
      { name: "Completed", href: "/tasks/completed", icon: CheckSquare },
      { name: "Raise Task", href: "/tasks/new", icon: Plus, isButton: true },
    ],
    messages: [
      { name: "All Messages", href: "/messages", icon: MessageCircle },
      { name: "Unread", href: "/messages?filter=unread", icon: Bell },
      { name: "Team Chat", href: "/messages?filter=team", icon: Users },
      { name: "Archived", href: "/messages?filter=archived", icon: Archive },
    ],
    events: [
      { name: "My Events", href: "/events", icon: Ticket },
      { name: "Upcoming", href: "/events?filter=upcoming", icon: Calendar },
      { name: "Past Events", href: "/events?filter=completed", icon: Archive },
      { name: "Browse Events", href: "/events/browse", icon: Plus },
    ],
    communities: [
      { name: "All Communities", href: "/communities", icon: Users },
      {
        name: "My Communities",
        href: "#",
        icon: Crown,
        hasSubmenu: true,
        submenu: communitiesData.map((community) => ({
          name: community.name,
          href: community.href,
          icon: community.isMember ? Crown : Users,
          isMember: community.isMember,
          tier: community.userTier,
          hasSubmenu: true,
          submenu: community.submenu,
        })),
      },
    ],
    services: [
      { name: "All Services", href: "/services", icon: CheckCircle },
      {
        name: "Included Services",
        href: "/services?filter=included",
        icon: CheckSquare,
      },
      {
        name: "Available Services",
        href: "/services?filter=available",
        icon: Plus,
      },
      { name: "Service History", href: "/services/history", icon: Archive },
      { name: "Billing & Usage", href: "/services/billing", icon: CreditCard },
      {
        name: "Upgrade to X4",
        href: "/services/upgrade",
        icon: Crown,
        isButton: true,
      },
    ],
  };

  return sections[activeSection] || sections.dashboard;
};

// Settings navigation
const settingsNavigation = [
  { name: "Profile", href: "/settings/profile", icon: User },
  { name: "Notifications", href: "/settings/notifications", icon: Bell },
  { name: "Account/Billing", href: "/settings/billing", icon: CreditCard },
  { name: "API Keys", href: "/settings/api-keys", icon: Key },
];

// Footer links
const footerLinks = [
  { name: "About", href: "/about", icon: HelpCircle },
  { name: "Privacy Policy", href: "/privacy", icon: Shield },
  { name: "Terms of Service", href: "/terms", icon: FileText },
];

export function Sidebar({
  isOpen,
  onClose,
  collapsed,
  onCollapseChange,
  activeSection = "dashboard",
}) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState({
    views: false,
    myCommunities: false,
    xen: false,
    xevfin: false,
    xevtg: false,
    settings: false,
  });

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Get contextual navigation based on active section
  const navigation = getContextualNavigation(activeSection);

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-gray-600/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Fixed Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/50 shadow-2xl transition-all duration-300",
          "flex flex-col",
          collapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:mx-2 lg:my-2 lg:rounded-3xl lg:h-[calc(100vh-1rem)]"
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-white/50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Collapse Toggle - Desktop only */}
        <div className="hidden lg:flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapseChange(!collapsed)}
            className="hover:bg-white/50 text-gray-600 h-8 w-8 rounded-full"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className={cn("px-3 space-y-1", collapsed && "px-2")}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const menuKey = item.name.toLowerCase().replace(/[^a-z]/g, "");
              const isExpanded = expandedMenus[menuKey];

              return (
                <div key={item.name}>
                  {item.isButton ? (
                    <div className="px-3 py-2">
                      <ModernButton
                        type="primary"
                        text={item.name}
                        size="sm"
                        icon={Icon}
                        className="w-full"
                      />
                    </div>
                  ) : item.hasSubmenu ? (
                    <button
                      onClick={() => !collapsed && toggleMenu(menuKey)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-white/80 text-blue-700 shadow-sm border border-blue-200/50"
                          : "text-gray-700 hover:bg-white/50 hover:text-gray-900",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="ml-3 flex-1 text-left">
                            {item.name}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-white/80 text-blue-700 shadow-sm border border-blue-200/50"
                          : "text-gray-700 hover:bg-white/50 hover:text-gray-900",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </Link>
                  )}

                  {/* Submenu */}
                  {item.submenu && !collapsed && (
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden ml-6 mt-1 space-y-1"
                        >
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = pathname === subItem.href;
                            const subMenuKey = subItem.name
                              .toLowerCase()
                              .replace(/[^a-z]/g, "");
                            const isSubExpanded = expandedMenus[subMenuKey];

                            return (
                              <div key={subItem.name}>
                                {subItem.hasSubmenu ? (
                                  <button
                                    onClick={() => toggleMenu(subMenuKey)}
                                    className={cn(
                                      "flex items-center w-full px-3 py-2 rounded-xl text-sm transition-all duration-200",
                                      isSubActive
                                        ? "bg-white/80 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                                    )}
                                  >
                                    <SubIcon className="h-4 w-4 mr-3" />
                                    <div className="flex-1 flex items-center justify-between">
                                      <span className="text-sm">
                                        {subItem.name}
                                      </span>
                                      {subItem.isMember && subItem.tier && (
                                        <span className="text-xs bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-2 py-1 rounded-lg font-bold">
                                          {subItem.tier.toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                    <ChevronDown
                                      className={cn(
                                        "h-3 w-3 transition-transform",
                                        isSubExpanded && "rotate-180"
                                      )}
                                    />
                                  </button>
                                ) : (
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      "flex items-center px-3 py-2 rounded-xl text-sm transition-all duration-200",
                                      isSubActive
                                        ? "bg-white/80 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                                    )}
                                  >
                                    <SubIcon className="h-4 w-4 mr-3" />
                                    <div className="flex-1 flex items-center justify-between">
                                      <span className="text-sm">
                                        {subItem.name}
                                      </span>
                                      {subItem.isMember && subItem.tier && (
                                        <span className="text-xs bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-2 py-1 rounded-lg font-bold">
                                          {subItem.tier.toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                )}

                                {/* Nested Submenu */}
                                {subItem.submenu && (
                                  <AnimatePresence>
                                    {isSubExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden ml-6 mt-1 space-y-1"
                                      >
                                        {subItem.submenu.map((nestedItem) => {
                                          const NestedIcon = nestedItem.icon;
                                          const isNestedActive =
                                            pathname === nestedItem.href;

                                          return (
                                            <Link
                                              key={nestedItem.name}
                                              href={nestedItem.href}
                                              className={cn(
                                                "flex items-center px-3 py-2 rounded-xl text-sm transition-all duration-200",
                                                isNestedActive
                                                  ? "bg-white/80 text-blue-700 shadow-sm"
                                                  : "text-gray-500 hover:bg-white/50 hover:text-gray-700"
                                              )}
                                            >
                                              <NestedIcon className="h-3 w-3 mr-3" />
                                              <span className="text-sm">
                                                {nestedItem.name}
                                              </span>
                                            </Link>
                                          );
                                        })}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Settings Section */}
        <div className="border-t border-white/20 py-4">
          <nav className={cn("px-3 space-y-1", collapsed && "px-2")}>
            <button
              onClick={() => !collapsed && toggleMenu("settings")}
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                "text-gray-700 hover:bg-white/50 hover:text-gray-900",
                collapsed && "justify-center px-2"
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left">Settings</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedMenus.settings && "rotate-180"
                    )}
                  />
                </>
              )}
            </button>

            {/* Settings Submenu */}
            {!collapsed && (
              <AnimatePresence>
                {expandedMenus.settings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-6 mt-1 space-y-1"
                  >
                    {settingsNavigation.map((settingItem) => {
                      const SettingIcon = settingItem.icon;
                      const isSettingActive = pathname === settingItem.href;

                      return (
                        <Link
                          key={settingItem.name}
                          href={settingItem.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-xl text-sm transition-all duration-200",
                            isSettingActive
                              ? "bg-white/80 text-blue-700 shadow-sm"
                              : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                          )}
                        >
                          <SettingIcon className="h-4 w-4 mr-3" />
                          <span className="text-sm">{settingItem.name}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </nav>
        </div>

        {/* Footer Links */}
        <div className="border-t border-white/20 py-4">
          <nav className={cn("px-3 space-y-1", collapsed && "px-2")}>
            {footerLinks.map((footerItem) => {
              const FooterIcon = footerItem.icon;
              const isFooterActive = pathname === footerItem.href;

              return (
                <Link
                  key={footerItem.name}
                  href={footerItem.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-xl text-sm transition-all duration-200",
                    isFooterActive
                      ? "bg-white/80 text-blue-700 shadow-sm"
                      : "text-gray-500 hover:bg-white/50 hover:text-gray-700",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <FooterIcon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3">{footerItem.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
