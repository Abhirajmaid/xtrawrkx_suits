"use client";

import React, { useState } from "react";
import { X, Upload, Plus } from "lucide-react";

const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState("");
  const [projectImage, setProjectImage] = useState(null);
  const [inviteMembers, setInviteMembers] = useState([
    "katrenajane@protonmail.com",
    "manualejezzari@gmail.com"
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (newMemberEmail.trim() && !inviteMembers.includes(newMemberEmail.trim())) {
      setInviteMembers([...inviteMembers, newMemberEmail.trim()]);
      setNewMemberEmail("");
    }
  };

  const handleRemoveMember = (email) => {
    setInviteMembers(inviteMembers.filter(member => member !== email));
  };

  const handleCreateProject = () => {
    if (projectName.trim()) {
      onCreateProject?.({
        name: projectName,
        image: projectImage,
        members: inviteMembers
      });
      // Reset form
      setProjectName("");
      setProjectImage(null);
      setNewMemberEmail("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Create a New Project</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Project Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Icon
            </label>
            <div className="text-xs text-gray-500 mb-2">
              400px x 400px, JPG or PNG, max 200kb
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <div className="w-10 h-10 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                Upload Image
              </button>
            </div>
          </div>

          {/* Invite Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Members
            </label>
            
            {/* Existing Members */}
            <div className="space-y-1.5 mb-2">
              {inviteMembers.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
                  <span className="text-sm text-gray-700">{email}</span>
                  <button
                    onClick={() => handleRemoveMember(email)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Member */}
            <div className="flex gap-2">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddMember();
                  }
                }}
              />
            </div>
            
            <button
              onClick={handleAddMember}
              className="mt-2 flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            disabled={!projectName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
