"use client";

import { useState } from "react";
import { Card, Button, Badge } from "../../components/ui";
import {
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Info,
  Trash2,
  Edit,
} from "lucide-react";

export default function IntegrationItemCard() {
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const sampleIntegration = {
    id: "gdrive",
    name: "Google Drive",
    description: "Sync files and documents with Google Drive",
    category: "storage",
    status: "connected",
    icon: "📁",
    color: "bg-blue-500",
    lastSync: "2025-01-20 10:30",
    nextSync: "2025-01-20 11:30",
    syncFrequency: "Every hour",
    features: ["File Sync", "Document Sharing", "Version Control"],
    setupRequired: false,
    health: "excellent",
    dataTransferred: "2.4 GB",
    syncCount: 1247,
    errorCount: 0,
    configuration: {
      syncFolders: ["CRM Documents", "Shared Files"],
      autoSync: true,
      conflictResolution: "server_wins",
      fileTypes: ["pdf", "doc", "docx", "xlsx", "pptx"],
    },
    permissions: [
      "Read files",
      "Write files",
      "Share files",
      "Delete files",
    ],
    webhooks: [
      {
        id: "wh1",
        name: "File Uploaded",
        url: "https://api.xtrawrkx.com/webhooks/gdrive/upload",
        status: "active",
        lastTriggered: "2025-01-20 10:25",
      },
      {
        id: "wh2",
        name: "File Deleted",
        url: "https://api.xtrawrkx.com/webhooks/gdrive/delete",
        status: "active",
        lastTriggered: "2025-01-20 09:45",
      },
    ],
  };

  const getHealthColor = (health) => {
    switch (health) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "good":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Integration Details</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${sampleIntegration.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
              {sampleIntegration.icon}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{sampleIntegration.name}</h4>
              <p className="text-gray-600">{sampleIntegration.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="default"
                  size="sm"
                  className="bg-green-100 text-green-800"
                >
                  {sampleIntegration.status}
                </Badge>
                <div className="flex items-center gap-1">
                  {getHealthIcon(sampleIntegration.health)}
                  <span className={`text-sm font-medium ${getHealthColor(sampleIntegration.health)}`}>
                    {sampleIntegration.health}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{sampleIntegration.syncCount}</div>
            <div className="text-sm text-gray-600">Total Syncs</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{sampleIntegration.dataTransferred}</div>
            <div className="text-sm text-gray-600">Data Transferred</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{sampleIntegration.errorCount}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{sampleIntegration.syncFrequency}</div>
            <div className="text-sm text-gray-600">Sync Frequency</div>
          </div>
        </div>

        {/* Sync Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Sync Progress</span>
            <span className="text-sm text-gray-500">Next sync: {sampleIntegration.nextSync}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Last sync: {sampleIntegration.lastSync}</span>
            <span>75% complete</span>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-6">
            {/* Configuration */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Configuration</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sync Folders
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {sampleIntegration.configuration.syncFolders.map((folder) => (
                      <Badge key={folder} variant="outline" size="sm">
                        {folder}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto Sync
                  </label>
                  <Badge
                    variant="default"
                    size="sm"
                    className={sampleIntegration.configuration.autoSync ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {sampleIntegration.configuration.autoSync ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conflict Resolution
                  </label>
                  <span className="text-sm text-gray-600 capitalize">
                    {sampleIntegration.configuration.conflictResolution.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Types
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {sampleIntegration.configuration.fileTypes.map((type) => (
                      <Badge key={type} variant="outline" size="sm">
                        .{type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Permissions</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sampleIntegration.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhooks */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Webhooks</h5>
              <div className="space-y-3">
                {sampleIntegration.webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900">{webhook.name}</div>
                        <div className="text-sm text-gray-500">{webhook.url}</div>
                        <div className="text-xs text-gray-400">
                          Last triggered: {webhook.lastTriggered}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        size="sm"
                        className={getStatusColor(webhook.status)}
                      >
                        {webhook.status}
                      </Badge>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Configuration
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

