import React from "react";
import { Clock, User, CheckCircle, AlertCircle } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "task_completed",
      user: "Marc Atenson",
      action: "completed task",
      target: "Design homepage mockup",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "task_assigned",
      user: "Susan Drake",
      action: "assigned you to",
      target: "Review brand guidelines",
      time: "4 hours ago",
      icon: User,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "deadline_approaching",
      user: "System",
      action: "deadline approaching for",
      target: "Project milestone review",
      time: "1 day ago",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      id: 4,
      type: "task_created",
      user: "Ronald Richards",
      action: "created task",
      target: "Update documentation",
      time: "2 days ago",
      icon: Clock,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl flex flex-col">
      <div className="px-6 py-5 border-b border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-500 mt-1">
              Latest updates from your team
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ${activity.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </span>
                    <span className="text-sm text-gray-600">
                      {activity.action}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {activity.target}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
