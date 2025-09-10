import React, { useState } from 'react';
import { ChevronDown, MoreHorizontal, Eye, Calendar, X, Clock, User, Tag } from 'lucide-react';

const AssignedTasks = ({ data }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">You don&apos;t assigned any task</p>
      <p className="text-gray-400 text-xs mt-1">Start your work for complete your assigned task</p>
    </div>
  );

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const TaskCard = ({ task }) => {

    return (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{task.name}</h4>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{task.project}</span>
              <span className="text-xs text-gray-500">•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600 font-semibold">{task.dueDate}</span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => handleViewTask(task)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="View task details"
        >
          <Eye className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    );
  };

  const TaskDetailModal = () => {
    if (!selectedTask) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedTask.name}</h3>
              <p className="text-gray-600">Detailed task information and description</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Project</p>
                  <p className="font-medium text-gray-900">{selectedTask.project}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium text-orange-600">{selectedTask.dueDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium text-gray-900">You</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">In Progress</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Description</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  This is a detailed description of the task. It includes all the requirements, 
                  specifications, and any additional information needed to complete the task successfully.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Assigned Tasks</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>Nearest Due Date</span>
                <ChevronDown className="h-3 w-3" />
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          {data.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-1">
              {data.slice(0, 3).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {data.length > 0 && (
                <div className="pt-2">
                  <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-2">
                    Show All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isModalOpen && <TaskDetailModal />}
    </>
  );
};

export default AssignedTasks;
