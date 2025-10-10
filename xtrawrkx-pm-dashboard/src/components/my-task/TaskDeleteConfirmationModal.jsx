"use client";

import React from "react";
import { Trash2 } from "lucide-react";

const TaskDeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Deleting {taskName} Task...
          </h2>
          
          {/* Count */}
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">4</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg transition-all shadow-lg"
            >
              Delete {taskName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDeleteConfirmationModal;
