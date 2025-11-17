"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, ChevronRight } from "lucide-react";

const AppDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const appCategories = {
    "Customer Relationship": [
      {
        id: "crm",
        name: "CRM Portal",
        description: "Manage customer relationships and sales",
        color: "from-blue-500 to-blue-600",
        href: "https://crm.xtrawrkx.com",
        status: "active",
      },
      {
        id: "client-portal",
        name: "Client Portal",
        description: "Client-facing project management",
        color: "from-indigo-500 to-indigo-600",
        href: "https://crm.xtrawrkx.com/clients/accounts",
        status: "active",
      },
    ],
    "Project & Operations": [
      {
        id: "pm",
        name: "PM Dashboard",
        description: "Project management and tracking",
        color: "from-purple-500 to-purple-600",
        href: "https://pm.xtrawrkx.com",
        status: "active",
      },
    ],
    Manufacturing: [
      {
        id: "xmb",
        name: "XMB CRM",
        description: "CRM for manufacturing sector",
        color: "from-orange-500 to-orange-600",
        href: "#",
        status: "coming-soon",
      },
      {
        id: "oms",
        name: "Order Management",
        description: "Manufacturing order system",
        color: "from-amber-500 to-amber-600",
        href: "#",
        status: "coming-soon",
      },
    ],
    "Supply Chain": [
      {
        id: "srm",
        name: "SRM Portal",
        description: "Supplier relationship management",
        color: "from-green-500 to-green-600",
        href: "#",
        status: "coming-soon",
      },
      {
        id: "srm-client",
        name: "SRM Client Portal",
        description: "External supplier portal",
        color: "from-emerald-500 to-emerald-600",
        href: "#",
        status: "coming-soon",
      },
    ],
    "Human Resources": [
      {
        id: "hr",
        name: "HR Dashboard",
        description: "Employee management system",
        color: "from-pink-500 to-pink-600",
        href: "#",
        status: "coming-soon",
      },
    ],
    "Business Network": [
      {
        id: "bnm",
        name: "BNM Platform",
        description: "Business networking manager",
        color: "from-cyan-500 to-cyan-600",
        href: "#",
        status: "coming-soon",
      },
    ],
    Administration: [
      {
        id: "accounts",
        name: "User Accounts",
        description: "User management & authentication",
        color: "from-gray-500 to-gray-600",
        href: "https://account.xtrawrkx.com",
        status: "active",
      },
    ],
  };

  const allApps = Object.values(appCategories).flat();
  const activeAppsCount = allApps.filter(
    (app) => app.status === "active"
  ).length;

  const drawerContent = (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          style={{
            zIndex: 999998,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          zIndex: 999999,
          position: "fixed",
        }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Xtrawrkx Apps
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Access all your business applications
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Apps List */}
        <div className="h-[calc(100vh-180px)] overflow-y-auto p-6">
          <div className="space-y-8">
            {Object.entries(appCategories).map(([category, apps]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                </div>

                {/* Apps in Category */}
                <div className="space-y-2">
                  {apps.map((app) => (
                    <a
                      key={app.id}
                      href={app.status === "active" ? app.href : "#"}
                      target={app.status === "active" ? "_blank" : undefined}
                      rel={app.status === "active" ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (app.status === "coming-soon") {
                          e.preventDefault();
                        } else {
                          setIsOpen(false);
                        }
                      }}
                      className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                        app.status === "active"
                          ? "hover:bg-gray-50 hover:shadow-md cursor-pointer border border-gray-100"
                          : "opacity-60 cursor-not-allowed border border-gray-100"
                      }`}
                    >
                      {/* App Icon */}
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center shadow-lg text-white flex-shrink-0`}
                      >
                        {app.id === "crm" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        )}
                        {app.id === "client-portal" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                        {app.id === "pm" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                        )}
                        {app.id === "xmb" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        )}
                        {app.id === "oms" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                        {app.id === "srm" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        )}
                        {app.id === "srm-client" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                        {app.id === "hr" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        )}
                        {app.id === "bnm" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                          </svg>
                        )}
                        {app.id === "accounts" && (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        )}
                      </div>

                      {/* App Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {app.name}
                          </h4>
                          {app.status === "active" && (
                            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {app.description}
                        </p>
                        {app.status === "coming-soon" && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>

                      {/* External Link Icon */}
                      {app.status === "active" && (
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="font-medium">Xtrawrkx Suite v2.0</span>
            <span>
              <span className="font-semibold text-primary-600">
                {activeAppsCount}
              </span>{" "}
              Active Apps
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="glass-button p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
        title="Xtrawrkx Apps"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>

      {/* Render drawer using Portal at body level */}
      {mounted && typeof document !== "undefined"
        ? createPortal(drawerContent, document.body)
        : null}
    </>
  );
};

export default AppDrawer;
