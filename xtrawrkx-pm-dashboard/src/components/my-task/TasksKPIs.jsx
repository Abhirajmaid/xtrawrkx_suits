"use client";

import { Card } from "../ui";

export default function TasksKPIs({ statusStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statusStats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={stat.label}
            glass={true}
            className="p-4 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-brand-text-light mb-1">
                  {stat.label} Tasks
                </p>
                <p className="text-3xl font-bold text-brand-foreground">
                  {stat.count}
                </p>
                <div className="mt-2 flex items-center text-xs text-brand-text-light">
                  <span
                    className={`w-2 h-2 ${stat.color.replace(
                      "-50",
                      "-400"
                    )} rounded-full mr-2`}
                  ></span>
                  {stat.count === 0
                    ? "No tasks"
                    : `${stat.count} ${stat.count === 1 ? "task" : "tasks"}`}
                </div>
              </div>
              <div
                className={`w-14 h-14 ${stat.color} backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm border ${stat.borderColor}`}
              >
                <IconComponent className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
