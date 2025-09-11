import React, { useState } from 'react';
import { Search, Bell, Settings, ChevronDown } from 'lucide-react';

const Header = ({ onToggleData, onSearchClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuItems = [
    'Account Settings',
    'Upgrade to Plus',
    'Help Center', 
    'Language',
    'Product Updates',
    'Logout'
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Home</h1>
            <p className="text-sm text-gray-600">Monitor all of your projects and tasks here</p>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Global Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search anything"
                onClick={onSearchClick}
                readOnly
                className="pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64 cursor-pointer"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-xs text-gray-400">⌘ K</span>
              </div>
            </div>

            {/* Notification Bell */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JB</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {userMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (item === 'Account Settings' && onToggleData) {
                          onToggleData(); // Toggle between empty and filled states
                        }
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
