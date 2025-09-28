"use client";

import { useState } from "react";
import { Input, Select, Button } from "@xtrawrkx/ui";
import { X, Users } from "lucide-react";
import { BaseModal } from "../ui";

export default function AddRoleModal({ isOpen, onClose, onAddRole }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
    permissions: []
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleColors = [
    { value: "bg-red-500", label: "Red" },
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-yellow-500", label: "Yellow" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-gray-500", label: "Gray" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-pink-500", label: "Pink" }
  ];

  const modules = ["Leads", "Contacts", "Deals", "Activities", "Files", "Settings"];
  const permissionActions = ["create", "read", "update", "delete", "share", "export"];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Role name is required";
    if (!formData.description.trim()) errors.description = "Role description is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newRole = {
        id: `role_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        users: 0,
        permissions: formData.permissions
      };

      onAddRole(newRole);
      handleClose();
    } catch (error) {
      console.error('Error adding role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      color: "bg-blue-500",
      permissions: []
    });
    setFormErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePermissionChange = (module, action, checked) => {
    const permissionKey = `${module}_${action}`;
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionKey]
        : prev.permissions.filter(p => p !== permissionKey)
    }));
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="big">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 backdrop-blur-md border border-yellow-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <Users className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Add New Role</h2>
              <p className="text-xs text-gray-600">Create a new user role</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter role name"
                error={formErrors.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <Select
                value={formData.color}
                onChange={(value) => handleInputChange('color', value)}
                options={roleColors}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter role description"
              error={formErrors.description}
            />
          </div>

          {/* Permissions Matrix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-600">
                  <div>Module</div>
                  {permissionActions.map(action => (
                    <div key={action} className="text-center capitalize">{action}</div>
                  ))}
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {modules.map(module => (
                  <div key={module} className="border-b border-gray-100 last:border-b-0">
                    <div className="grid grid-cols-7 gap-2 p-3 items-center">
                      <div className="font-medium text-sm text-gray-900">{module}</div>
                      {permissionActions.map(action => {
                        const permissionKey = `${module}_${action}`;
                        const isChecked = formData.permissions.includes(permissionKey);
                        return (
                          <div key={action} className="flex justify-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleClose} className="px-4 py-2 text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white border-0 shadow-lg"
            >
              {isSubmitting ? "Adding..." : "Add Role"}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}
