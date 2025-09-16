"use client";

import { Badge } from "@/components/ui";

export default function ProjectHeader({ 
  title, 
  description, 
  status, 
  owner, 
  dueDate, 
  completion 
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <Badge className={`${getStatusColor(status)} px-3 py-1 text-sm font-medium`}>
              {status}
            </Badge>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">{description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Project Progress</span>
          <span className="text-sm font-bold text-gray-900">{completion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Project Owner</span>
          <p className="text-lg font-semibold text-gray-900">{owner}</p>
        </div>
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Due Date</span>
          <p className="text-lg font-semibold text-gray-900">{dueDate}</p>
        </div>
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completion</span>
          <p className="text-lg font-semibold text-gray-900">{completion}%</p>
        </div>
      </div>
    </div>
  );
}