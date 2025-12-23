"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
} from "../../../../components/ui";
import dealGroupService from "../../../../lib/api/dealGroupService";
import { useAuth } from "../../../../contexts/AuthContext";
import { FolderPlus, X, Trash2, Edit, Save } from "lucide-react";

export default function DealGroupModal({
  isOpen,
  onClose,
  onGroupCreated,
  onGroupUpdated,
  onGroupDeleted,
}) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    team: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await dealGroupService.getAll({
        pagination: { pageSize: 1000 },
        sort: ["name:asc"],
      });
      const groupsData = Array.isArray(response)
        ? response
        : response?.data || [];
      setGroups(groupsData);
    } catch (error) {
      console.error("Error fetching deal groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error and submit error when user starts typing
    if (errors[field] || errors.submit) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (errors[field]) newErrors[field] = "";
        if (errors.submit) delete newErrors.submit;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Group name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({}); // Clear any previous errors
      const groupData = {
        ...formData,
        // Removed createdBy to avoid relation errors - not essential for functionality
      };
      const response = await dealGroupService.create(groupData);

      // Check if creation was successful
      if (response && (response.id || response.documentId || response.data)) {
        await fetchGroups();
        setShowCreateForm(false);
        setFormData({ name: "", description: "", department: "", team: "" });
        setErrors({}); // Clear errors on success
        if (onGroupCreated) onGroupCreated();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error creating deal group:", error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Failed to create group. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm() || !editingGroup) return;

    try {
      setLoading(true);
      setErrors({}); // Clear any previous errors
      const response = await dealGroupService.update(
        editingGroup.id || editingGroup.documentId,
        formData
      );

      // Check if update was successful
      if (response && (response.id || response.documentId || response.data)) {
        await fetchGroups();
        setEditingGroup(null);
        setFormData({ name: "", description: "", department: "", team: "" });
        setErrors({}); // Clear errors on success
        if (onGroupUpdated) onGroupUpdated();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating deal group:", error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Failed to update group. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    if (
      !confirm(
        "Are you sure you want to delete this group? Deals in this group will not be deleted, but they will no longer be grouped."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await dealGroupService.delete(groupId);
      await fetchGroups();
      if (onGroupDeleted) onGroupDeleted();
    } catch (error) {
      console.error("Error deleting deal group:", error);
      alert("Failed to delete group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name || group.attributes?.name || "",
      description: group.description || group.attributes?.description || "",
      department: group.department || group.attributes?.department || "",
      team: group.team || group.attributes?.team || "",
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingGroup(null);
    setFormData({ name: "", description: "", department: "", team: "" });
    setShowCreateForm(false);
    setErrors({}); // Clear errors when canceling
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        glass={true}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        padding={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Deal Groups
              </h2>
              <p className="text-sm text-gray-500">
                Organize deals by department or team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Create/Edit Form */}
          {(showCreateForm || editingGroup) && (
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingGroup ? "Edit Group" : "Create New Group"}
              </h3>
              <div className="space-y-4">
                <Input
                  label="Group Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                  placeholder="e.g., Sales Team Q4, Engineering Deals"
                />
                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Optional description for this group"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    placeholder="e.g., Sales, Engineering"
                  />
                  <Input
                    label="Team"
                    value={formData.team}
                    onChange={(e) => handleInputChange("team", e.target.value)}
                    placeholder="e.g., Team A, Team B"
                  />
                </div>
                {errors.submit && (
                  <p className="text-sm text-red-600">{errors.submit}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={editingGroup ? handleUpdate : handleCreate}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : editingGroup ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Create
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    disabled={loading}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Groups List */}
          <div className="space-y-3">
            {!showCreateForm && !editingGroup && (
              <Button
                onClick={() => {
                  setShowCreateForm(true);
                  setErrors({}); // Clear errors when opening create form
                  setFormData({
                    name: "",
                    description: "",
                    department: "",
                    team: "",
                  });
                }}
                className="w-full mb-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Create New Group
              </Button>
            )}

            {loading && !showCreateForm && !editingGroup ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading groups...</p>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderPlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No deal groups yet</p>
                <p className="text-sm mt-1">
                  Create a group to organize your deals
                </p>
              </div>
            ) : (
              groups.map((group) => {
                const groupData = group.attributes || group;
                const isEditing =
                  editingGroup?.id === group.id ||
                  editingGroup?.documentId === group.documentId;

                if (isEditing) return null;

                return (
                  <div
                    key={group.id || group.documentId}
                    className="p-5 rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          {groupData.name}
                        </h4>
                        {groupData.description && (
                          <p className="text-sm text-gray-600 mt-1 mb-2">
                            {groupData.description}
                          </p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          {groupData.department && (
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-lg font-medium">
                              Dept: {groupData.department}
                            </span>
                          )}
                          {groupData.team && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                              Team: {groupData.team}
                            </span>
                          )}
                          {group.deals && Array.isArray(group.deals) && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                              {group.deals.length} deal
                              {group.deals.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEdit(group)}
                          className="p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 border border-blue-100"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(group.id || group.documentId)
                          }
                          className="p-2.5 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 border border-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/30">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
