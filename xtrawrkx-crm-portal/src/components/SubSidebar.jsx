"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function SubSidebar({
  isOpen,
  onClose,
  currentSection,
  navigationData,
  onNavigate,
}) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const isActive = (href) => {
    if (!href || href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderNavigationItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isItemActive = isActive(item.href);

    return (
      <div key={item.id} className="w-full">
        {/* Main Item */}
        <div className="flex items-center justify-between">
          {item.href ? (
            <Link
              href={item.href}
              onClick={() => onNavigate(item.href)}
              className={`flex-1 flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 ${
                isItemActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                if (hasChildren) {
                  toggleItem(item.id);
                }
              }}
              className={`flex-1 flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 text-left ${
                isItemActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )}

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => toggleItem(item.id)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-2 space-y-1">
            {item.children.map((child) =>
              renderNavigationItem(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen || !currentSection) return null;

  const sectionData = navigationData.find((item) => item.id === currentSection);

  if (!sectionData) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 z-40 lg:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Mobile Sub Sidebar */}
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {sectionData.label}
                </h2>
                <p className="text-sm text-gray-600">Navigation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation Content */}
          <div className="p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
            {sectionData.children?.map((item) => renderNavigationItem(item))}
          </div>
        </div>
      </div>

      {/* Desktop Sub Sidebar */}
      <div className="hidden lg:block">
        {/* Desktop Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-20"
            onClick={onClose}
          />
        )}

        <div
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {sectionData.label}
                </h2>
                <p className="text-sm text-gray-600">Navigation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation Content */}
          <div className="p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
            {sectionData.children?.map((item) => renderNavigationItem(item))}
          </div>
        </div>
      </div>
    </>
  );
}
