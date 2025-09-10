"use client";

import React, { useState, useCallback } from "react";
import { X, ArrowLeft, Settings, MoreVertical, UserPlus, Trash2, Mail, Check, User, Shield, UserX } from "lucide-react";
import { useWorkspace } from "../contexts/WorkspaceContext";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const ManageWorkspaceModal = ({ isOpen, onClose }) => {
  const { workspaces, activeWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();
  const [currentView, setCurrentView] = useState("list"); // "list" or "detail"
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [inviteEmails, setInviteEmails] = useState([""]);
  const [showMemberMenu, setShowMemberMenu] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Mock data for workspace details
  const workspaceDetails = {
    members: [
      {
        id: 1,
        name: "Marc Jenson",
        email: "marc@gmail.com",
        role: "owner",
        avatar: "MJ",
        color: "bg-blue-500"
      },
      {
        id: 2,
        name: "Susan Drake",
        email: "contact@susandrake.io",
        role: "manager",
        avatar: "SD",
        color: "bg-purple-500"
      },
      {
        id: 3,
        name: "Ronald Richards",
        email: "ronaldrichard@gmail.com",
        role: "guest",
        avatar: "RR",
        color: "bg-orange-500"
      }
    ]
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "owner":
        return "bg-green-100 text-green-700 border-green-200";
      case "manager":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "guest":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "owner":
        return "OWNER";
      case "manager":
        return "MANAGER";
      case "guest":
        return "GUEST";
      default:
        return "MEMBER";
    }
  };

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedWorkspace(null);
  };

  const handleAddInviteEmail = () => {
    setInviteEmails([...inviteEmails, ""]);
  };

  const handleInviteEmailChange = (index, value) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const handleRemoveInviteEmail = (index) => {
    if (inviteEmails.length > 1) {
      const newEmails = inviteEmails.filter((_, i) => i !== index);
      setInviteEmails(newEmails);
    }
  };

  const handleSendInvites = () => {
    const validEmails = inviteEmails.filter(email => email.trim() !== "");
    console.log("Sending invites to:", validEmails);
    // TODO: Implement actual invite functionality
    setInviteEmails([""]);
  };

  const handleDeleteWorkspace = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (selectedWorkspace) {
      deleteWorkspace(selectedWorkspace.id);
      setShowDeleteConfirmation(false);
      onClose();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleMemberRoleChange = (memberId, newRole) => {
    console.log(`Changing member ${memberId} role to ${newRole}`);
    // TODO: Implement role change functionality
    setShowMemberMenu(null);
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      console.log(`Removing member ${memberId}`);
      // TODO: Implement member removal functionality
      setShowMemberMenu(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {currentView === "detail" && (
              <button
                onClick={handleBackToList}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {currentView === "list" ? "Manage Workspace" : selectedWorkspace?.name || "Workspace Details"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentView === "list" ? (
            /* Workspace List View */
            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${workspace.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">{workspace.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
                      <p className="text-sm text-gray-500">
                        {workspace.isActive ? "Created by You 2 years ago" : "Invited by Kris Martin Jan 23, 2023"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(workspace.isActive ? "owner" : "manager")}`}>
                      {getRoleLabel(workspace.isActive ? "owner" : "manager")}
                    </span>
                    <button
                      onClick={() => handleWorkspaceSelect(workspace)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      {workspace.isActive ? "Settings" : "Details"}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      - Out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Workspace Detail View */
            <div className="space-y-8">
              {/* Workspace Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Workspace Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workspace</label>
                    <input
                      type="text"
                      value={selectedWorkspace?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Icon</label>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${selectedWorkspace?.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{selectedWorkspace?.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">400px, JPG or PNG, max 200kb</p>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Change Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Members Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Members</h3>
                <div className="space-y-3">
                  {workspaceDetails.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-medium text-sm">{member.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                          {getRoleLabel(member.role)}
                        </span>
                        <div className="relative">
                          <button
                            onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          {showMemberMenu === member.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => handleMemberRoleChange(member.id, "administrator")}
                                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 text-sm"
                              >
                                <Shield className="w-4 h-4" />
                                Set as Administrator
                              </button>
                              <button
                                onClick={() => handleMemberRoleChange(member.id, "guest")}
                                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 text-sm"
                              >
                                <User className="w-4 h-4" />
                                Set as Guest
                              </button>
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-red-50 text-red-600 text-sm"
                              >
                                <UserX className="w-4 h-4" />
                                Remove {member.name}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite Members Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Invite Members</h3>
                <div className="space-y-3">
                  {inviteEmails.map((email, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => handleInviteEmailChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      {inviteEmails.length > 1 && (
                        <button
                          onClick={() => handleRemoveInviteEmail(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddInviteEmail}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    + Add
                  </button>
                </div>
                <button
                  onClick={handleSendInvites}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Invites
                </button>
              </div>

              {/* Delete Workspace Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Delete Workspace</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. Your workspace will be deleted forever including all the data inside the workspace.
                </p>
                <button
                  onClick={handleDeleteWorkspace}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Question? Need a hand?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Support Can Help
            </a>
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        workspaceName={selectedWorkspace?.name || ""}
      />
    </div>
  );
};

export default ManageWorkspaceModal;
