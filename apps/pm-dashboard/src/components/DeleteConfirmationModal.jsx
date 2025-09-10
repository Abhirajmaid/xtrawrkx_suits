"use client";

import React from "react";
import { X } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, workspaceName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-2 border-dashed border-blue-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Delete Confirmation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Warning Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">!</span>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Are you sure you want to delete {workspaceName} workspace forever?
              </h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone. Your workspace will be deleted forever including all the data inside the workspace.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium text-sm"
            >
              Delete {workspaceName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
