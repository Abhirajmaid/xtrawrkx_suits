"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function InviteUserModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    role: "User"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Inviting user:', formData);
      onSubmit(formData);
      setFormData({ email: "", role: "User" });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Invite New User</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="User">Client User</option>
                <option value="Admin">Client Admin</option>
                <option value="Staff">Internal Staff</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {formData.role === 'Admin' && 'Full access to all features and user management'}
                {formData.role === 'User' && 'Limited access to assigned projects and features'}
                {formData.role === 'Staff' && 'Internal team member with extended permissions'}
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.email.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                {isSubmitting ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
