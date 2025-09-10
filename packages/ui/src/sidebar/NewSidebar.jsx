import React, { useState } from 'react';
import SidebarItem from './SidebarItem';

const NewSidebar = ({ 
  className = '',
  onItemClick,
  initialActiveItem = 'home'
}) => {
  const [activeItem, setActiveItem] = useState(initialActiveItem);

  const menuItems = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'tasks', label: 'My Tasks', icon: 'tasks' },
    { key: 'inbox', label: 'Inbox', icon: 'inbox' },
    { key: 'message', label: 'Message', icon: 'message' },
    { key: 'analytics', label: 'Analytics', icon: 'analytics' }
  ];

  const handleItemClick = (itemKey) => {
    setActiveItem(itemKey);
    if (onItemClick) {
      onItemClick(itemKey);
    }
  };

  return (
    <div className={`w-64 bg-white border-r border-gray-200 ${className}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Sidebar</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.key}
              label={item.label}
              icon={item.icon}
              active={activeItem === item.key}
              onClick={() => handleItemClick(item.key)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NewSidebar;
