"use client";

import Header from "../../components/shared/Header";

export default function Settings() {
  const handleSearchClick = () => {
    // Search functionality can be implemented later
    console.log("Search clicked");
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Settings"
        subtitle="Manage your account and preferences"
        onSearchClick={handleSearchClick}
      />
      <div className="flex-1 p-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account Settings
          </h2>
          <p className="text-gray-600">
            Settings page content will be implemented later.
          </p>
        </div>
      </div>
    </div>
  );
}
