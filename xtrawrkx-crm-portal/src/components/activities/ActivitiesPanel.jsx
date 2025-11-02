"use client";

import { useState } from "react";
import { MessageSquare, CheckSquare } from "lucide-react";
import ChatTab from "./ChatTab";
import TaskTab from "./TaskTab";

const ActivitiesPanel = ({
  entityType,
  entityId,
  entityName,
  onActivityCreated,
}) => {
  const [activeTab, setActiveTab] = useState("tasks");

  const tabItems = [
    { key: "tasks", label: "Tasks", icon: CheckSquare },
    { key: "chat", label: "Chat", icon: MessageSquare },
  ];

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeTab === "chat" ? "Team Chat" : "Task Management"}
          </h3>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/50 backdrop-blur-sm rounded-xl p-1 justify-start">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat View */}
        {activeTab === "chat" && (
          <ChatTab entityType={entityType} entityId={entityId} />
        )}

        {/* Tasks View */}
        {activeTab === "tasks" && (
          <TaskTab
            entityType={entityType}
            entityId={entityId}
            onActivityCreated={onActivityCreated}
          />
        )}
      </div>
    </>
  );
};

export default ActivitiesPanel;
