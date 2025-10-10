"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  AlertTriangle,
  Save,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function NotificationSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: {
      enabled: true,
      userSignup: true,
      passwordReset: true,
      securityAlerts: true,
      weeklyReports: false,
      dailyDigest: true,
    },
    push: {
      enabled: true,
      userSignup: true,
      securityAlerts: true,
      systemUpdates: false,
      maintenance: true,
    },
    sms: {
      enabled: false,
      securityAlerts: true,
      emergencyAlerts: true,
      twoFactor: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const toggleNotification = (category, type) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const toggleCategory = (category) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        enabled: !prev[category].enabled,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Notification Settings
            </h1>
            <p className="text-gray-600">
              Configure how you receive notifications and alerts
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Types */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Email Notifications
                  </h2>
                  <p className="text-sm text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleCategory("email")}
                className="flex items-center gap-2"
              >
                {notifications.email.enabled ? (
                  <ToggleRight className="w-6 h-6 text-primary-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "userSignup",
                  label: "New User Signups",
                  desc: "Get notified when new users join",
                },
                {
                  key: "passwordReset",
                  label: "Password Reset Requests",
                  desc: "Security alerts for password changes",
                },
                {
                  key: "securityAlerts",
                  label: "Security Alerts",
                  desc: "Important security notifications",
                },
                {
                  key: "weeklyReports",
                  label: "Weekly Reports",
                  desc: "Summary of weekly activity",
                },
                {
                  key: "dailyDigest",
                  label: "Daily Digest",
                  desc: "Daily summary of important events",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification("email", item.key)}
                    disabled={!notifications.email.enabled}
                    className="flex items-center gap-2 disabled:opacity-50"
                  >
                    {notifications.email[item.key] ? (
                      <ToggleRight className="w-5 h-5 text-primary-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Push Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Push Notifications
                  </h2>
                  <p className="text-sm text-gray-600">
                    Browser and mobile push notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleCategory("push")}
                className="flex items-center gap-2"
              >
                {notifications.push.enabled ? (
                  <ToggleRight className="w-6 h-6 text-primary-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "userSignup",
                  label: "New User Signups",
                  desc: "Real-time notifications for new users",
                },
                {
                  key: "securityAlerts",
                  label: "Security Alerts",
                  desc: "Immediate security notifications",
                },
                {
                  key: "systemUpdates",
                  label: "System Updates",
                  desc: "Updates about system maintenance",
                },
                {
                  key: "maintenance",
                  label: "Maintenance Windows",
                  desc: "Scheduled maintenance notifications",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification("push", item.key)}
                    disabled={!notifications.push.enabled}
                    className="flex items-center gap-2 disabled:opacity-50"
                  >
                    {notifications.push[item.key] ? (
                      <ToggleRight className="w-5 h-5 text-primary-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SMS Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    SMS Notifications
                  </h2>
                  <p className="text-sm text-gray-600">
                    Critical alerts via SMS
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleCategory("sms")}
                className="flex items-center gap-2"
              >
                {notifications.sms.enabled ? (
                  <ToggleRight className="w-6 h-6 text-primary-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "securityAlerts",
                  label: "Security Alerts",
                  desc: "Critical security breaches",
                },
                {
                  key: "emergencyAlerts",
                  label: "Emergency Alerts",
                  desc: "System-wide emergencies",
                },
                {
                  key: "twoFactor",
                  label: "Two-Factor Authentication",
                  desc: "2FA verification codes",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification("sms", item.key)}
                    disabled={!notifications.sms.enabled}
                    className="flex items-center gap-2 disabled:opacity-50"
                  >
                    {notifications.sms[item.key] ? (
                      <ToggleRight className="w-5 h-5 text-primary-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>

          {/* Notification Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Today</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Week</span>
                <span className="font-medium text-gray-900">89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Unread</span>
                <span className="font-medium text-primary-600">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email Rate</span>
                <span className="font-medium text-green-600">98%</span>
              </div>
            </div>
          </motion.div>

          {/* Test Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Test Notifications
            </h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                Send Test Email
              </button>
              <button className="w-full px-3 py-2 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                Send Test Push
              </button>
              <button className="w-full px-3 py-2 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                Send Test SMS
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
