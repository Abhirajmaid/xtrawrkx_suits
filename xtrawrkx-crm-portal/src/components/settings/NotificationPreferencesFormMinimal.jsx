"use client";

import { useState } from "react";
import { Card, Button, Checkbox, Select, Badge } from "../../../../../../../../components/ui";
import {
  Bell,
  Mail,
  Smartphone,
  Desktop,
  Settings,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Clock,
  User,
  Shield,
  FileText,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";

// Custom Switch Component
const Switch = ({ checked, onChange, disabled = false, size = "md" }) => {
  const sizeClasses = size === "sm" ? "w-8 h-4" : "w-11 h-6";
  const thumbSizeClasses = size === "sm" ? "w-3 h-3" : "w-5 h-5";
  const translateClasses = size === "sm" ? "translate-x-4" : "translate-x-5";
  
  return (
    <button
      type="button"
      className={`${sizeClasses} relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
    >
      <span
        className={`${thumbSizeClasses} pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? translateClasses : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default function NotificationPreferencesFormMinimal() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [preferences, setPreferences] = useState({
    globalEnabled: true,
    frequency: "realtime",
  });

  const frequencyOptions = [
    { value: "realtime", label: "Real-time", description: "Immediate notifications" },
    { value: "hourly", label: "Hourly", description: "Batched every hour" },
    { value: "daily", label: "Daily", description: "Once per day" },
    { value: "weekly", label: "Weekly", description: "Once per week" },
  ];

  const handlePreferenceChange = (path, value) => {
    setPreferences(prev => ({
      ...prev,
      [path]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving notification preferences:", preferences);
    setIsEditing(false);
  };

  const handleReset = () => {
    setPreferences({
      globalEnabled: true,
      frequency: "realtime",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          <p className="text-sm text-gray-600">
            Configure how and when you receive notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Edit Preferences
            </Button>
          )}
        </div>
      </div>

      {/* Global Settings */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Global Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">Enable Notifications</h5>
              <p className="text-sm text-gray-600">Master switch for all notifications</p>
            </div>
            <Switch
              checked={preferences.globalEnabled}
              onChange={(checked) => handlePreferenceChange("globalEnabled", checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Frequency
              </label>
              <Select
                value={preferences.frequency}
                onChange={(value) => handlePreferenceChange("frequency", value)}
                options={frequencyOptions}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Preview */}
      {showPreview && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Notification Preview</h4>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-blue-900">New Lead Assigned</h5>
                  <p className="text-sm text-blue-700">Sarah Johnson from Tech Corp has been assigned to you</p>
                  <p className="text-xs text-blue-600 mt-1">2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
