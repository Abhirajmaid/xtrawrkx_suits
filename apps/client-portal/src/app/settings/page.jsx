"use client";

import { useState } from "react";
import { BrandingForm, UserManagementTable, InviteUserModal, AccountPreferences } from "@/components/settings";

export default function SettingsPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Dummy data
  const branding = {
    logo: "/logos/client-logo.png",
    primaryColor: "#2563eb",
    domain: "portal.clientdomain.com",
  };

  const users = [
    { id: 1, name: "Jane Doe", email: "jane@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "John Smith", email: "john@example.com", role: "User", status: "Active" },
    { id: 3, name: "Mark Lee", email: "mark@example.com", role: "Staff", status: "Invited" },
    { id: 4, name: "Sarah Johnson", email: "sarah@example.com", role: "User", status: "Active" },
    { id: 5, name: "Mike Thompson", email: "mike@example.com", role: "Staff", status: "Active" },
  ];

  const preferences = {
    emailNotifications: true,
    portalNotifications: true,
    timezone: "UTC+5:30",
    language: "English",
  };

  const handleInviteUser = () => {
    setShowInviteModal(true);
  };

  const handleInviteSubmit = (inviteData) => {
    console.log('Inviting user:', inviteData);
    // Placeholder for invite functionality
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings, branding, and user permissions
        </p>
      </div>

      {/* Branding Section */}
      <BrandingForm branding={branding} />

      {/* User Management Section */}
      <UserManagementTable 
        users={users} 
        onInvite={handleInviteUser}
      />

      {/* Account Preferences Section */}
      <AccountPreferences preferences={preferences} />

      {/* Invite User Modal */}
      <InviteUserModal
        open={showInviteModal}
        onClose={handleCloseInviteModal}
        onSubmit={handleInviteSubmit}
      />
    </div>
  );
}
