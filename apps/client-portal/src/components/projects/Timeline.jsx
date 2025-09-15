"use client";

import { CheckCircle, Circle, Clock } from "lucide-react";

export default function Timeline({ 
  milestones = [],
  className = "" 
}) {
  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (milestone) => {
    if (milestone.completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (milestone.overdue) {
      return <Clock className="w-5 h-5 text-red-500" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (milestone) => {
    if (milestone.completed) {
      return "border-green-200 bg-green-50";
    } else if (milestone.overdue) {
      return "border-red-200 bg-red-50";
    } else {
      return "border-gray-200 bg-white";
    }
  };

  if (milestones.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-neutral-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Project Timeline</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No milestones defined yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Project Timeline</h3>
      
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative">
            {/* Timeline Line */}
            {index < milestones.length - 1 && (
              <div className="absolute left-6 top-8 w-0.5 h-8 bg-gray-200" />
            )}
            
            <div className={`flex items-start gap-4 p-4 rounded-lg border ${getStatusColor(milestone)}`}>
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(milestone)}
              </div>
              
              {/* Milestone Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h4 className={`font-medium ${
                    milestone.completed ? "text-green-900" : 
                    milestone.overdue ? "text-red-900" : 
                    "text-neutral-900"
                  }`}>
                    {milestone.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(milestone.dueDate)}</span>
                  </div>
                </div>
                
                {milestone.description && (
                  <p className="text-sm text-gray-600 mt-2">{milestone.description}</p>
                )}
                
                {/* Progress Bar for Incomplete Milestones */}
                {!milestone.completed && milestone.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, milestone.progress))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
