"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Globe, Calendar, Clock, Building } from "lucide-react";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Xtrawrkx",
    companyEmail: "admin@xtrawrkx.com",
    timezone: "UTC-8",
    dateFormat: "MM/DD/YYYY",
    language: "en",
    currency: "INR",
    workingHours: {
      start: "09:00",
      end: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              General Settings
            </h1>
            <p className="text-gray-600">
              Configure basic system settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Company Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) =>
                    setSettings({ ...settings, companyName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, companyEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Localization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Localization
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC">UTC</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    setSettings({ ...settings, dateFormat: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Working Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Working Hours
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        start: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        end: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.workingHours.days.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings({
                            ...settings,
                            workingHours: {
                              ...settings.workingHours,
                              days: [...settings.workingHours.days, day],
                            },
                          });
                        } else {
                          setSettings({
                            ...settings,
                            workingHours: {
                              ...settings.workingHours,
                              days: settings.workingHours.days.filter(
                                (d) => d !== day
                              ),
                            },
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <div className="space-y-6">
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

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Version</span>
                <span className="font-medium text-gray-900">v2.1.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium text-gray-900">2 days ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Users</span>
                <span className="font-medium text-gray-900">47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
