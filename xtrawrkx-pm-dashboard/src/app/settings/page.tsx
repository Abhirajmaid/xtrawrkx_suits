"use client";

import PageHeader from "../../components/shared/PageHeader";

export default function Settings() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <PageHeader
          title="Settings"
          subtitle="Manage your account and preferences"
          breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }]}
          showSearch={true}
          showActions={false}
        />
      </div>
      <div className="flex-1 px-6 pb-6">
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
