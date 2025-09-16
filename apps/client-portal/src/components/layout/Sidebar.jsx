import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const Sidebar = ({ className, collapsed = false, onToggle, children }) => {
  return (
    <div
      className={cn(
        'flex flex-col bg-white border-r border-neutral-200 h-screen transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {children}
    </div>
  );
};

const SidebarHeader = ({ children, className }) => {
  return (
    <div className={cn('p-4 border-b border-neutral-200', className)}>
      {children}
    </div>
  );
};

const SidebarContent = ({ children, className }) => {
  return (
    <div className={cn('flex-1 overflow-y-auto py-4', className)}>
      {children}
    </div>
  );
};

const SidebarFooter = ({ children, className }) => {
  return (
    <div className={cn('p-4 border-t border-neutral-200', className)}>
      {children}
    </div>
  );
};

const SidebarNav = ({ children }) => {
  return (
    <nav className="space-y-1 px-2">
      {children}
    </nav>
  );
};

const SidebarNavItem = ({ 
  icon, 
  label, 
  badge,
  active = false, 
  collapsed = false,
  onClick,
  href,
  children
}) => {
  const content = (
    <div
      className={cn(
        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
        active 
          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
          : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
      )}
      onClick={onClick}
    >
      {icon && (
        <span className="flex-shrink-0 w-5 h-5 mr-3">
          {icon}
        </span>
      )}
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {badge && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-600">
              {badge}
            </span>
          )}
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
};

const SidebarNavSection = ({ title, children, collapsed = false }) => {
  return (
    <div className="px-2 mb-6">
      {!collapsed && title && (
        <h3 className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

const WorkspaceSelector = ({ workspace, collapsed = false, onWorkspaceChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (collapsed) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
          {workspace?.name?.[0] || 'T'}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
          {workspace?.name?.[0] || 'T'}
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-neutral-900">
            {workspace?.name || 'Taskhub'}
          </div>
          <div className="text-xs text-neutral-500">
            {workspace?.plan || 'Free Plan'}
          </div>
        </div>
        <svg 
          className={cn('w-4 h-4 text-neutral-400 transition-transform', isOpen && 'rotate-180')}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-modal z-50">
          <div className="p-2">
            <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
              <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                F
              </div>
              <span className="text-sm text-neutral-700">Fourtwo Studio</span>
            </button>
            <hr className="my-2" />
            <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm text-neutral-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarNav, 
  SidebarNavItem, 
  SidebarNavSection,
  WorkspaceSelector
};