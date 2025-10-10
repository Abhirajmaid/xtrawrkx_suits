"use client";

import { useState, useMemo } from "react";
import { Card, Badge } from "../../../../../../../../components/ui";
import { formatDate } from "../../lib/utils";
import { Calendar, ChevronLeft, ChevronRight, Users } from "lucide-react";

export default function ProjectGanttView({ projects }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("months"); // months, weeks, days

  // Generate timeline based on view mode
  const timeline = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 4, 0);
    const timeline = [];

    if (viewMode === "months") {
      for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
        timeline.push({
          date: new Date(d),
          label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          key: `${d.getFullYear()}-${d.getMonth()}`
        });
      }
    }

    return timeline;
  }, [currentDate, viewMode]);

  // Calculate project bar position and width
  const getProjectBarStyle = (project) => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const timelineStart = timeline[0]?.date;
    const timelineEnd = timeline[timeline.length - 1]?.date;

    if (!timelineStart || !timelineEnd) return { display: 'none' };

    const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
    const projectStart = Math.max(startDate.getTime(), timelineStart.getTime());
    const projectEnd = Math.min(endDate.getTime(), timelineEnd.getTime());

    const leftPercent = ((projectStart - timelineStart.getTime()) / totalDuration) * 100;
    const widthPercent = ((projectEnd - projectStart) / totalDuration) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 2)}%`,
      display: widthPercent > 0 ? 'block' : 'none'
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "on-hold": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "text-red-600 bg-red-100";
      case "High": return "text-orange-600 bg-orange-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const navigateTimeline = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Card className="p-0 overflow-hidden">
      {/* Gantt Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
            <p className="text-sm text-gray-600">Gantt chart view of project schedules</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("months")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === "months" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Months
              </button>
              <button
                onClick={() => setViewMode("weeks")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === "weeks" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Weeks
              </button>
            </div>

            {/* Timeline Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTimeline('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigateTimeline('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex border-b border-gray-200">
            <div className="w-80 p-4 bg-gray-50 border-r border-gray-200">
              <div className="font-medium text-gray-900">Project</div>
            </div>
            <div className="flex-1 relative">
              <div className="flex h-12">
                {timeline.map((period) => (
                  <div
                    key={period.key}
                    className="flex-1 border-r border-gray-200 p-2 bg-gray-50"
                  >
                    <div className="text-xs font-medium text-gray-600 text-center">
                      {period.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Rows */}
          <div className="divide-y divide-gray-200">
            {projects.map((project) => (
              <div key={project.id} className="flex hover:bg-gray-50">
                {/* Project Info */}
                <div className="w-80 p-4 border-r border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {project.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {project.client}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          {project.team.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="flex-1 relative h-16 flex items-center">
                  <div className="absolute inset-0 flex">
                    {timeline.map((period) => (
                      <div
                        key={period.key}
                        className="flex-1 border-r border-gray-200"
                      ></div>
                    ))}
                  </div>
                  
                  {/* Project Bar */}
                  <div
                    className={`absolute h-6 rounded-md ${getStatusColor(project.status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                    style={getProjectBarStyle(project)}
                    title={`${project.name}: ${formatDate(project.startDate)} - ${formatDate(project.endDate)}`}
                  >
                    <div className="h-full flex items-center px-2">
                      <div className="text-xs text-white font-medium truncate">
                        {project.progress}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div
                    className="absolute h-6 bg-white border-2 border-gray-300 rounded-md opacity-90"
                    style={{
                      ...getProjectBarStyle(project),
                      width: `${(parseFloat(getProjectBarStyle(project).width) * project.progress) / 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Today Indicator */}
          <div className="absolute top-12 bottom-0 w-0.5 bg-red-500 opacity-60 pointer-events-none"
               style={{
                 left: `${80 + ((new Date().getTime() - timeline[0]?.date?.getTime()) / 
                   (timeline[timeline.length - 1]?.date?.getTime() - timeline[0]?.date?.getTime())) * 
                   (100 - 80)}%`
               }}>
            <div className="absolute -top-2 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-green-500 rounded"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">On Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-4 bg-red-500"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
