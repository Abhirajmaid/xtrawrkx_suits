"use client";

import {
  Home,
  CheckSquare,
  Inbox,
  MessageCircle,
  BarChart3,
  FolderOpen,
  Plus,
  Activity,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("home");

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "my-tasks", label: "My Tasks", icon: CheckSquare },
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "message", label: "Message", icon: MessageCircle },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const projects = [
    {
      id: 1,
      name: "Yellow Branding",
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-100",
      icon: "Y",
    },
    {
      id: 2,
      name: "Mogo Web Design",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-100",
      icon: "M",
    },
    {
      id: 3,
      name: "Futurework",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-100",
      icon: "F",
    },
    {
      id: 4,
      name: "Resto Dashboard",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-100",
      icon: "R",
    },
    {
      id: 5,
      name: "Hajime Illustration",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-100",
      icon: "H",
    },
    {
      id: 6,
      name: "Carl UI/UX",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-100",
      icon: "C",
    },
    {
      id: 7,
      name: "The Run Branding & Graphic",
      color: "from-teal-400 to-teal-600",
      bgColor: "bg-teal-100",
      icon: "T",
    },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-glass backdrop-blur-xl border-r border-white/30 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="text-lg font-semibold text-brand-foreground">
            taskhub
          </h1>
        </div>

        {/* Studio Selector */}
        <div className="flex items-center justify-between p-3 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">4</span>
            </div>
            <span className="text-sm font-medium text-brand-foreground">
              Fourtwo Studio
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-brand-text-light group-hover:text-brand-foreground transition-colors" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-white/25 backdrop-blur-sm border border-white/30 text-brand-foreground shadow-lg"
                  : "text-brand-text-light hover:bg-white/15 hover:text-brand-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-brand-primary" : "text-brand-text-light group-hover:text-brand-foreground"} transition-colors`}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Projects Section */}
        <div className="pt-6 mt-6 border-t border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-brand-text-light uppercase tracking-wider">
              Projects
            </h3>
            <button className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center hover:bg-white/25 transition-colors group">
              <Plus className="w-3 h-3 text-brand-text-light group-hover:text-brand-foreground transition-colors" />
            </button>
          </div>

          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-brand-text-light hover:bg-white/15 hover:text-brand-foreground transition-all duration-300 group"
              >
                <div
                  className={`w-5 h-5 bg-gradient-to-br ${project.color} rounded-md flex items-center justify-center shadow-sm`}
                >
                  <span className="text-white font-bold text-xs">
                    {project.icon}
                  </span>
                </div>
                <span className="text-sm font-medium truncate">
                  {project.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 p-3 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            {/* Progress ring */}
            <svg
              className="absolute -inset-1 w-10 h-10 transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="20, 80"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-brand-foreground">
              Get Started
            </p>
            <p className="text-xs text-brand-text-light">5/6 Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
