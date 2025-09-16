import React from "react";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

const StatsCards = ({ data }) => {
  const stats = [
    {
      title: "Total Project",
      value: data.totalProjects,
      trend: "+2",
      isPositive: true,
      color: "text-blue-600",
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      trend: "+4",
      isPositive: true,
      color: "text-green-600",
    },
    {
      title: "Assigned Tasks",
      value: data.assignedTasks,
      trend: "-3",
      isPositive: false,
      color: "text-orange-600",
    },
    {
      title: "Completed Tasks",
      value: data.completedTasks,
      trend: "+1",
      isPositive: true,
      color: "text-green-600",
    },
    {
      title: "Overdue Tasks",
      value: data.overdueTasks,
      trend: "+2",
      isPositive: true,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="space-y-3">
            {/* Header with title and trend */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  stat.isPositive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{stat.trend}</span>
              </div>
            </div>

            {/* Main value */}
            <div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
