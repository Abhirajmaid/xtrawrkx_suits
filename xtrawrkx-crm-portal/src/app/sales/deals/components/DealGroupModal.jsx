"use client";

import { useState, useEffect } from "react";
import { Button, Input, Textarea, Select } from "../../../../components/ui";
import dealGroupService from "../../../../lib/api/dealGroupService";
import { useAuth } from "../../../../contexts/AuthContext";
import { FolderPlus, X, Trash2, Edit, Save } from "lucide-react";

export default function DealGroupModal({ isOpen, onClose, onGroupCreated, onGroupUpdated, onGroupDeleted }) {
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
      const groupsData = Array.isArray(response) ? response : response?.data || [];
      setGroups(groupsData);
    } catch (error) {
      console.error("Error fetching deal groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
      const groupData = {
        ...formData,
        createdBy: user?.id || user?.documentId || null,
      };
      await dealGroupService.create(groupData);
      await fetchGroups();
      setShowCreateForm(false);
      setFormData({ name: "", description: "", department: "", team: "" });
      if (onGroupCreated) onGroupCreated();
    } catch (error) {
      console.error("Error creating deal group:", error);
      setErrors({ submit: "Failed to create group. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm() || !editingGroup) return;

    try {
      setLoading(true);
      await dealGroupService.update(editingGroup.id || editingGroup.documentId, formData);
      await fetchGroups();
      setEditingGroup(null);
      setFormData({ name: "", description: "", department: "", team: "" });
      if (onGroupUpdated) onGroupUpdated();
    } catch (error) {
      console.error("Error updating deal group:", error);
      setErrors({ submit: "Failed to update group. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    if (!confirm("Are you sure you want to delete this group? Deals in this group will not be deleted, but they will no longer be grouped.")) {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Deal Groups</h2>
            <p className="text-sm text-gray-600">Organize deals by department or team</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Create/Edit Form */}
          {(showCreateForm || editingGroup) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Optional description for this group"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
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
                    className="flex-1"
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
                onClick={() => setShowCreateForm(true)}
                className="w-full mb-4"
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
                <p className="text-sm mt-1">Create a group to organize your deals</p>
              </div>
            ) : (
              groups.map((group) => {
                const groupData = group.attributes || group;
                const isEditing = editingGroup?.id === group.id || editingGroup?.documentId === group.documentId;
                
                if (isEditing) return null;

                return (
                  <div
                    key={group.id || group.documentId}
                    className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{groupData.name}</h4>
                        {groupData.description && (
                          <p className="text-sm text-gray-600 mt-1">{groupData.description}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          {groupData.department && (
                            <span>Dept: {groupData.department}</span>
                          )}
                          {groupData.team && (
                            <span>Team: {groupData.team}</span>
                          )}
                          {group.deals && Array.isArray(group.deals) && (
                            <span>{group.deals.length} deal{group.deals.length !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(group)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id || group.documentId)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="p-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}


