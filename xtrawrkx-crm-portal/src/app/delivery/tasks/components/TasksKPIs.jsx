import { CheckSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function TasksKPIs({ stats }) {
  const statusStats = [
    {
      label: "Total",
      count: stats.total,
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      icon: CheckSquare,
    },
    {
      label: "Pending",
      count: stats.pending,
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      icon: Clock,
    },
    {
      label: "In Progress",
      count: stats.inProgress,
      color: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-600",
      icon: Clock,
    },
    {
      label: "Completed",
      count: stats.completed,
      color: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      icon: CheckCircle,
    },
    {
      label: "Overdue",
      count: stats.overdue,
      color: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statusStats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  {stat.label} Tasks
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stat.count}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${stat.color.replace(
                      "-50",
                      "-500"
                    )}`}
                  ></span>
                  {stat.count === 0
                    ? "No tasks"
                    : `${stat.count} ${stat.count === 1 ? "task" : "tasks"}`}
                </div>
              </div>
              <div
                className={`w-16 h-16 ${stat.color} backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border ${stat.borderColor}`}
              >
                <IconComponent className={`w-8 h-8 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

