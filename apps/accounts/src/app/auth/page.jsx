"use client";

import { motion } from "framer-motion";
import { Key, Shield, Lock, Smartphone } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Authentication</h1>
            <p className="text-gray-600">
              Manage authentication methods and policies
            </p>
          </div>
        </div>
      </div>

      {/* Auth Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Multi-Factor Auth",
            description: "Two-factor authentication settings",
            icon: Smartphone,
            href: "/auth/mfa",
            status: "Enabled",
          },
          {
            title: "Single Sign-On",
            description: "SSO configuration and providers",
            icon: Shield,
            href: "/auth/sso",
            status: "Disabled",
          },
          {
            title: "Password Policy",
            description: "Password requirements and rules",
            icon: Lock,
            href: "/auth/password",
            status: "Active",
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === "Enabled" || item.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
