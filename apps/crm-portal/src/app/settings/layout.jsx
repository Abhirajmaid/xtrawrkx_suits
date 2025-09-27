"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  Users,
  Shield,
  GitBranch,
  FileText,
  Bell,
  Palette,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function SettingsLayout({ children }) {
  const [collapsedSections, setCollapsedSections] = useState({
    general: false,
    security: false,
    integrations: false,
    notifications: false,
  });

  const pathname = usePathname();

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (href) => {
    if (!href || href === "/settings") return pathname === "/settings";
    return pathname.startsWith(href);
  };

  const settingsSections = [
    {
      id: "general",
      label: "General",
      icon: Settings,
      items: [
        { label: "Company Information", href: "/settings" },
        { label: "Branding & Themes", href: "/settings/branding" },
        { label: "Data Management", href: "/settings/data" },
      ],
    },
    {
      id: "security",
      label: "Security & Access",
      icon: Shield,
      items: [
        { label: "Users & Roles", href: "/settings/users" },
        { label: "Permissions", href: "/settings/permissions" },
        { label: "Field Security", href: "/settings/field-security" },
        { label: "Team Visibility", href: "/settings/team-visibility" },
      ],
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: GitBranch,
      items: [
        { label: "Available Integrations", href: "/settings/integrations" },
        { label: "API Management", href: "/settings/api" },
        { label: "Webhooks", href: "/settings/webhooks" },
      ],
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      items: [
        { label: "Email Preferences", href: "/settings/notifications" },
        { label: "In-App Alerts", href: "/settings/alerts" },
        { label: "Mobile Push", href: "/settings/mobile" },
      ],
    },
    {
      id: "audit",
      label: "Audit & Logs",
      icon: FileText,
      items: [
        { label: "Activity Logs", href: "/settings/audit" },
        { label: "Security Logs", href: "/settings/security-logs" },
        { label: "Data Changes", href: "/settings/data-changes" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Settings Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>

            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.label}</span>
                      </div>
                      {collapsedSections[section.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {collapsedSections[section.id] && (
                      <div className="ml-8 mt-2 space-y-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(item.href)
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {pathname === "/settings" ? "General Settings" : "Settings"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your CRM configuration and preferences
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

