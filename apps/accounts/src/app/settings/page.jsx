"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Bell, Key, Building } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Manage system settings and configurations
            </p>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "General Settings",
            description: "Basic system configuration",
            icon: Settings,
            href: "/settings/general",
          },
          {
            title: "Notifications",
            description: "Email and push notification settings",
            icon: Bell,
            href: "/settings/notifications",
          },
          {
            title: "Security",
            description: "Security policies and access controls",
            icon: Shield,
            href: "/security",
          },
          {
            title: "Authentication",
            description: "Login and authentication methods",
            icon: Key,
            href: "/auth",
          },
          {
            title: "Organization",
            description: "Company and team settings",
            icon: Building,
            href: "/organization",
          },
          {
            title: "Integrations",
            description: "Third-party service connections",
            icon: Settings,
            href: "/coming-soon",
          },
        ].map((setting, index) => (
          <motion.div
            key={setting.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => (window.location.href = setting.href)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <setting.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {setting.title}
                </h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
