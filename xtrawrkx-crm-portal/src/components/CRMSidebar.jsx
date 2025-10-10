"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  UserCheck,
  Package,
  FileText,
  Receipt,
  Mail,
  Phone,
  CheckSquare,
  FolderOpen,
  HeadphonesIcon,
  BarChart3,
  Settings,
  Shield,
  Calendar,
  Target,
  DollarSign,
  FileCheck,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  GitBranch,
  Inbox,
  Clock,
  UserPlus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Bell,
  Star,
  Plus,
} from "lucide-react";
import SubSidebar from "./SubSidebar";

export default function CRMSidebar({ collapsed = false, onToggle }) {
  const [collapsedSections, setCollapsedSections] = useState({
    sales: false,
    delivery: false,
    analytics: false,
    admin: false,
    favorites: false,
  });

  const [subSidebarOpen, setSubSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const pathname = usePathname();

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (href) => {
    if (!href || href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isSalesActive = () => {
    return pathname.startsWith('/sales/');
  };

  const isDeliveryActive = () => {
    return pathname.startsWith('/delivery/');
  };

  const handleTopLevelClick = (sectionId, sectionLabel) => {
    setCurrentSection(sectionId);
    setSubSidebarOpen(true);
  };

  const closeSubSidebar = () => {
    setSubSidebarOpen(false);
    setCurrentSection(null);
  };

  const handleNavigate = (href) => {
    closeSubSidebar();
    // Navigation will be handled by Next.js Link component
  };

  const toggleQuickActions = () => {
    setQuickActionsOpen(!quickActionsOpen);
  };

  const quickActionItems = [
    { label: "Add Lead", icon: Users, href: "/sales/leads/new" },
    { label: "Add Deal", icon: Briefcase, href: "/sales/deals/new" },
    { label: "Add Contact", icon: UserCheck, href: "/sales/contacts/new" },
    { label: "Add Task", icon: CheckSquare, href: "/sales/tasks/new" },
    { label: "Add Project", icon: FolderOpen, href: "/delivery/projects/new" },
    {
      label: "Add Ticket",
      icon: HeadphonesIcon,
      href: "/delivery/support/new",
    },
  ];

  const mainNavigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      color: "bg-gray-800",
      hasSubNav: false,
      priority: "high",
    },
    {
      id: "sales",
      label: "Sales",
      icon: DollarSign,
      color: "bg-gray-100",
      hasSubNav: true,
      href: undefined,
      priority: "high",
    },
    {
      id: "delivery",
      label: "Delivery",
      icon: FolderOpen,
      color: "bg-gray-100",
      hasSubNav: true,
      href: undefined,
      priority: "high",
    },
    {
      id: "client-portal",
      label: "Client Portal",
      icon: UserCheck,
      color: "bg-gray-100",
      hasSubNav: true,
      href: undefined,
      priority: "high",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      color: "bg-gray-100",
      hasSubNav: true,
      href: undefined,
      priority: "low",
    },
    {
      id: "admin",
      label: "Admin",
      icon: Settings,
      color: "bg-gray-100",
      hasSubNav: true,
      href: undefined,
      priority: "low",
    },
  ];

  const favoriteItems = [
    { label: "Pipeline Overview", icon: Target, href: "/sales/deals/pipeline" },
    { label: "Key Metrics", icon: BarChart3, href: "/analytics/reports" },
    { label: "Recent Activities", icon: Clock, href: "/dashboard" },
  ];

  const crmTools = [
    {
      label: "Priority / Automation Rules",
      icon: Target,
      href: "/sales/tasks/automation",
    },
    { label: "Documents", icon: FileText, href: "/delivery/documents" },
    { label: "Invoices & Payments", icon: Receipt, href: "/sales/invoices" },
    { label: "Meetings & Calls", icon: Phone, href: "/sales/meetings" },
    { label: "Calendar", icon: Calendar, href: "/sales/meetings/calendar" },
    { label: "Integrations", icon: GitBranch, href: "/integrations" },
  ];

  // Navigation data for sub-sidebar
  const navigationData = [
    {
      id: "sales",
      label: "Sales",
      children: [
        {
          id: "leads",
          label: "Leads",
          icon: Users,
          href: "/sales/leads",
          children: [
            { id: "leads-list", label: "List", href: "/sales/leads" },
            {
              id: "leads-board",
              label: "Board (Kanban)",
              href: "/sales/leads/board",
            },
            {
              id: "leads-detail",
              label: "Lead Detail",
              href: "/sales/leads/[id]",
            },
            {
              id: "leads-import",
              label: "Import / Segmentation Rules",
              href: "/sales/leads/import",
            },
          ],
        },
        {
          id: "opportunities",
          label: "Opportunities / Deals",
          icon: Briefcase,
          href: "/sales/deals",
          children: [
            {
              id: "pipeline-board",
              label: "Pipeline Board",
              href: "/sales/deals/pipeline",
            },
            { id: "deals-list", label: "Deals List", href: "/sales/deals" },
            {
              id: "deal-detail",
              label: "Deal Detail (Activity, Notes, Files)",
              href: "/sales/deals/[id]",
            },
          ],
        },
        {
          id: "accounts",
          label: "Accounts",
          icon: Building2,
          href: "/sales/accounts",
          children: [
            {
              id: "accounts-list",
              label: "Accounts List",
              href: "/sales/accounts",
            },
            {
              id: "account-detail",
              label: "Account Detail (Overview • People • Activity • Docs)",
              href: "/sales/accounts/[id]",
            },
          ],
        },
        {
          id: "contacts",
          label: "Contacts",
          icon: UserCheck,
          href: "/sales/contacts",
          children: [
            {
              id: "contacts-list",
              label: "Contacts List",
              href: "/sales/contacts",
            },
            {
              id: "contact-detail",
              label: "Contact Detail (360° • Client Activity Timeline)",
              href: "/sales/contacts/[id]",
            },
          ],
        },
        {
          id: "campaigns",
          label: "Campaigns",
          icon: Mail,
          href: "/sales/campaigns",
          children: [
            {
              id: "campaigns-list",
              label: "Campaigns",
              href: "/sales/campaigns",
            },
            {
              id: "new-campaign",
              label: "New Campaign (Template • Segments)",
              href: "/sales/campaigns/new",
            },
            {
              id: "templates",
              label: "Templates",
              href: "/sales/campaigns/templates",
            },
            {
              id: "performance",
              label: "Performance Analytics",
              href: "/sales/campaigns/analytics",
            },
          ],
        },
        {
          id: "meetings",
          label: "Meetings & Calls",
          icon: Phone,
          href: "/sales/meetings",
          children: [
            {
              id: "calendar",
              label: "Calendar",
              href: "/sales/meetings/calendar",
            },
            {
              id: "call-logs",
              label: "Call Logs",
              href: "/sales/meetings/calls",
            },
            {
              id: "integrations",
              label: "Integrations",
              href: "/sales/meetings/integrations",
            },
          ],
        },
      ],
    },
    {
      id: "delivery",
      label: "Delivery",
      children: [
        {
          id: "tasks",
          label: "Tasks",
          icon: CheckSquare,
          href: "/delivery/tasks",
          children: [
            {
              id: "my-tasks",
              label: "My Tasks",
              href: "/delivery/tasks",
            },
            {
              id: "team-boards",
              label: "Team Boards",
              href: "/delivery/tasks/boards",
            },
            {
              id: "automation-rules",
              label: "Priority / Automation Rules",
              href: "/delivery/tasks/automation",
            },
          ],
        },
        {
          id: "documents",
          label: "Documents",
          icon: FileText,
          href: "/delivery/documents",
          children: [
            {
              id: "repository",
              label: "Repository (Folders • Versioning)",
              href: "/delivery/documents/repository",
            },
            {
              id: "linked-records",
              label: "Linked Records",
              href: "/delivery/documents/linked",
            },
          ],
        },
        {
          id: "projects",
          label: "Projects",
          icon: FolderOpen,
          href: "/delivery/projects",
          children: [
            {
              id: "all-projects",
              label: "All Projects",
              href: "/delivery/projects",
            },
            {
              id: "project-detail",
              label: "Project Detail (Kanban • Gantt • Milestones)",
              href: "/delivery/projects/[id]",
            },
            {
              id: "time-costs",
              label: "Time/Costs",
              href: "/delivery/projects/time-costs",
            },
          ],
        },
        {
          id: "support",
          label: "Support Tickets",
          icon: HeadphonesIcon,
          href: "/delivery/support",
          children: [
            {
              id: "queues",
              label: "Queues / Inbox",
              href: "/delivery/support",
            },
            {
              id: "ticket-detail",
              label: "Ticket Detail (SLA • Comments • Attachments)",
              href: "/delivery/support/[id]",
            },
            {
              id: "chat-widget",
              label: "Chat Widget (Embed Reference)",
              href: "/delivery/support/chat-widget",
            },
          ],
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      children: [
        {
          id: "reports",
          label: "Reports & Forecasts",
          icon: BarChart3,
          href: "/analytics/reports",
          children: [
            {
              id: "executive-dashboards",
              label: "Executive Dashboards (Funnel • Sales • CSAT)",
              href: "/analytics/reports/executive",
            },
            {
              id: "drilldowns",
              label: "Drilldowns",
              href: "/analytics/reports/drilldowns",
            },
            {
              id: "exports",
              label: "Exports",
              href: "/analytics/reports/exports",
            },
          ],
        },
      ],
    },
    {
      id: "admin",
      label: "Admin",
      children: [
        {
          id: "settings",
          label: "Settings & RBAC",
          icon: Shield,
          href: "/admin/settings",
          children: [],
        },
        {
          id: "users-roles",
          label: "Users & Roles",
          icon: Users,
          href: "/admin/users",
          children: [
            {
              id: "user-management",
              label: "User Management",
              href: "/admin/users/management",
            },
            {
              id: "role-permissions",
              label: "Role & Permissions",
              href: "/admin/users/roles",
            },
            {
              id: "access-control",
              label: "Access Control",
              href: "/admin/users/access",
            },
          ],
        },
        {
          id: "field-customization",
          label: "Field Customization",
          icon: Settings,
          href: "/admin/fields",
          children: [
            {
              id: "custom-fields",
              label: "Custom Fields",
              href: "/admin/fields/custom",
            },
            {
              id: "field-validation",
              label: "Field Validation",
              href: "/admin/fields/validation",
            },
            {
              id: "field-layouts",
              label: "Field Layouts",
              href: "/admin/fields/layouts",
            },
          ],
        },
        {
          id: "automations",
          label: "Automations / Workflows",
          icon: Target,
          href: "/admin/automations",
          children: [
            {
              id: "workflow-builder",
              label: "Workflow Builder",
              href: "/admin/automations/workflows",
            },
            {
              id: "automation-rules",
              label: "Automation Rules",
              href: "/admin/automations/rules",
            },
            {
              id: "triggers",
              label: "Triggers & Actions",
              href: "/admin/automations/triggers",
            },
          ],
        },
        {
          id: "integrations",
          label: "Integrations",
          icon: GitBranch,
          href: "/admin/integrations",
          children: [
            {
              id: "api-management",
              label: "API Management",
              href: "/admin/integrations/api",
            },
            {
              id: "webhooks",
              label: "Webhooks",
              href: "/admin/integrations/webhooks",
            },
            {
              id: "third-party",
              label: "Third-party Apps",
              href: "/admin/integrations/apps",
            },
          ],
        },
        {
          id: "audit-logs",
          label: "Audit Logs",
          icon: FileText,
          href: "/admin/audit",
          children: [
            {
              id: "activity-logs",
              label: "Activity Logs",
              href: "/admin/audit/activity",
            },
            {
              id: "security-logs",
              label: "Security Logs",
              href: "/admin/audit/security",
            },
            {
              id: "data-changes",
              label: "Data Changes",
              href: "/admin/audit/changes",
            },
          ],
        },
      ],
    },
    {
      id: "client-portal",
      label: "Client Portal",
      children: [
        {
          id: "client-proposals",
          label: "Proposals",
          icon: FileText,
          href: "/client-portal/proposals",
          children: [
            {
              id: "view-proposals",
              label: "View Proposals",
              href: "/client-portal/proposals",
            },
            {
              id: "proposal-history",
              label: "Proposal History",
              href: "/client-portal/proposals/history",
            },
          ],
        },
        {
          id: "client-invoices",
          label: "Invoices",
          icon: Receipt,
          href: "/client-portal/invoices",
          children: [
            {
              id: "view-invoices",
              label: "View Invoices",
              href: "/client-portal/invoices",
            },
            {
              id: "payment-history",
              label: "Payment History",
              href: "/client-portal/invoices/payments",
            },
          ],
        },
        {
          id: "client-documents",
          label: "Documents",
          icon: FolderOpen,
          href: "/client-portal/documents",
          children: [
            {
              id: "shared-documents",
              label: "Shared Documents",
              href: "/client-portal/documents",
            },
            {
              id: "document-downloads",
              label: "Document Downloads",
              href: "/client-portal/documents/downloads",
            },
          ],
        },
        {
          id: "client-tickets",
          label: "Support Tickets",
          icon: HeadphonesIcon,
          href: "/client-portal/tickets",
          children: [
            {
              id: "my-tickets",
              label: "My Tickets",
              href: "/client-portal/tickets",
            },
            {
              id: "create-ticket",
              label: "Create New Ticket",
              href: "/client-portal/tickets/new",
            },
          ],
        },
        {
          id: "client-meetings",
          label: "Meetings",
          icon: Calendar,
          href: "/client-portal/meetings",
          children: [
            {
              id: "scheduled-meetings",
              label: "Scheduled Meetings",
              href: "/client-portal/meetings",
            },
            {
              id: "meeting-history",
              label: "Meeting History",
              href: "/client-portal/meetings/history",
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <div className={`${collapsed ? 'w-16' : 'w-64'} h-full bg-white/30 backdrop-blur-xl border-r border-white/30 flex flex-col shadow-xl overflow-y-auto transition-[width] duration-300 flex-shrink-0`}>
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            {!collapsed && (
              <span className="font-bold text-xl text-brand-foreground">
                Xtrawrkx CRM
              </span>
            )}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg"
            >
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
          <div className="relative">
            <button
              onClick={toggleQuickActions}
              className={`w-full bg-white/15 backdrop-blur-md border border-white/25 text-brand-foreground rounded-xl py-3 px-4 flex items-center ${collapsed ? 'justify-center' : 'justify-center gap-2'} shadow-lg`}
            >
              <Plus className="w-4 h-4 text-brand-primary" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium">Quick Actions</span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-text-light transition-transform duration-300 ${quickActionsOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {/* Quick Actions Dropdown */}
            {quickActionsOpen && !collapsed && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 z-50 overflow-hidden">
                <div className="p-2">
                  {quickActionItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setQuickActionsOpen(false)}
                        className="flex items-center gap-3 p-3 text-sm text-brand-foreground rounded-lg"
                      >
                        <div className="w-8 h-8 bg-white/30 backdrop-blur-md border border-white/40 rounded-lg flex items-center justify-center shadow-sm">
                          <Icon className="w-4 h-4 text-brand-primary" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
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
          <div className={`grid gap-3 ${collapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {mainNavigationItems
              .filter((item) => item.priority === "high")
              .map((item) => {
                const Icon = item.icon;
                const active = item.href ? isActive(item.href) : false;
                const isSalesSection = item.id === 'sales' && isSalesActive();
                const isDeliverySection = item.id === 'delivery' && isDeliveryActive();

                if (item.hasSubNav) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTopLevelClick(item.id, item.label)}
                      className={`${
                        isSalesSection || isDeliverySection
                          ? 'bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 border-yellow-300/50 text-yellow-800' 
                          : 'bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground hover:bg-white/30 hover:border-white/40'
                      } rounded-xl p-4 flex flex-col items-center gap-3 transition-[background-color,border-color] duration-300 shadow-lg group`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      {!collapsed && (
                        <span className="text-xs font-medium text-center">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href || "/"}
                    className={`${active ? "bg-brand-primary text-white border-brand-primary/50" : "bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground hover:bg-white/30 hover:border-white/40"} 
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

        {/* CRM Tools Section */}
        {!collapsed && (
          <div className="flex-1">
            <div className="px-4 mb-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-sm font-medium text-brand-foreground mb-3">
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Tools
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </div>

                <div className="space-y-2">
                  {crmTools.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center gap-3 text-xs text-brand-text-light p-2 rounded-lg"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
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
                <span className="text-xs text-brand-text-light font-medium">
                  System
                </span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>
            )}

            {/* System Navigation Grid */}
            <div className={`grid gap-3 ${collapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {mainNavigationItems
                .filter((item) => item.priority === "low")
                .map((item) => {
                  const Icon = item.icon;
                  const active = item.href ? isActive(item.href) : false;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTopLevelClick(item.id, item.label)}
                      className="bg-white/15 backdrop-blur-md border border-white/25 text-brand-text-light rounded-xl p-3 flex flex-col items-center gap-2 shadow-md"
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      {!collapsed && (
                        <span className="text-xs font-medium text-center">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Footer - User Profile */}
          <div className="p-4 border-t border-white/20">
            <div className={`flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-brand-primary text-sm font-medium">
                  OC
                </span>
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-foreground truncate">
                      Oscar Carol
                    </p>
                    <p className="text-xs text-brand-text-light truncate">
                      Lead Manager
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

      {/* Sub Sidebar */}
      <SubSidebar
        isOpen={subSidebarOpen}
        onClose={closeSubSidebar}
        currentSection={currentSection}
        navigationData={navigationData}
        onNavigate={handleNavigate}
      />
    </>
  );
}
