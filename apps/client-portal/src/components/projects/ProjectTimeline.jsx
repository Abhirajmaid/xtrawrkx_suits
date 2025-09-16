"use client";

export default function ProjectTimeline({ milestones }) {
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = (completedCount / milestones.length) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Project Timeline</h2>
          <span className="text-sm font-medium text-gray-500">
            {completedCount} of {milestones.length} milestones completed
          </span>
        </div>
      </div>
      <div className="p-6">

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-center mt-3">
            <span className="text-sm font-bold text-gray-700">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div 
            key={milestone.id}
            className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
          >
            {/* Status Indicator */}
            <div className="flex-shrink-0 mt-1">
              {milestone.status === 'completed' ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                </div>
              )}
            </div>

            {/* Milestone Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                <span className="text-sm text-gray-500">{milestone.dueDate}</span>
              </div>
              {milestone.description && (
                <p className="text-sm text-gray-600">{milestone.description}</p>
              )}
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  milestone.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : milestone.status === 'in progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {milestone.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
