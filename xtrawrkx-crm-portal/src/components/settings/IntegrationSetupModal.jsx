"use client";

import { useState } from "react";
import { Card, Button, Input, Select, Checkbox, Progress, Badge } from "../../../../../../../../components/ui";
import {
  X,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Info,
  Settings,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

export default function IntegrationSetupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [setupData, setSetupData] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);

  const integrationTemplates = [
    {
      id: "gdrive",
      name: "Google Drive",
      description: "Sync files and documents with Google Drive",
      icon: "📁",
      color: "bg-blue-500",
      category: "storage",
      steps: [
        {
          id: "auth",
          title: "Authentication",
          description: "Connect your Google account",
          fields: [
            { name: "email", label: "Google Email", type: "email", required: true },
            { name: "scope", label: "Access Scope", type: "select", required: true, options: [
              { value: "read", label: "Read Only" },
              { value: "write", label: "Read & Write" },
              { value: "full", label: "Full Access" },
            ]},
          ],
        },
        {
          id: "config",
          title: "Configuration",
          description: "Configure sync settings",
          fields: [
            { name: "syncFolders", label: "Sync Folders", type: "multiselect", required: true, options: [
              { value: "documents", label: "Documents" },
              { value: "shared", label: "Shared Files" },
              { value: "projects", label: "Projects" },
            ]},
            { name: "autoSync", label: "Auto Sync", type: "checkbox", required: false },
            { name: "syncFrequency", label: "Sync Frequency", type: "select", required: true, options: [
              { value: "realtime", label: "Real-time" },
              { value: "hourly", label: "Every Hour" },
              { value: "daily", label: "Daily" },
            ]},
          ],
        },
        {
          id: "permissions",
          title: "Permissions",
          description: "Review and approve permissions",
          fields: [
            { name: "permissions", label: "Required Permissions", type: "permission_list", required: true },
          ],
        },
        {
          id: "test",
          title: "Test Connection",
          description: "Verify the integration works",
          fields: [],
        },
      ],
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing campaigns and automation",
      icon: "📧",
      color: "bg-orange-500",
      category: "marketing",
      steps: [
        {
          id: "auth",
          title: "API Key",
          description: "Enter your Mailchimp API key",
          fields: [
            { name: "apiKey", label: "API Key", type: "password", required: true },
            { name: "server", label: "Server Prefix", type: "text", required: true },
          ],
        },
        {
          id: "config",
          title: "Configuration",
          description: "Configure email settings",
          fields: [
            { name: "listId", label: "Default List ID", type: "text", required: true },
            { name: "autoSync", label: "Auto Sync Contacts", type: "checkbox", required: false },
            { name: "syncFrequency", label: "Sync Frequency", type: "select", required: true, options: [
              { value: "hourly", label: "Every Hour" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
            ]},
          ],
        },
        {
          id: "test",
          title: "Test Connection",
          description: "Verify the integration works",
          fields: [],
        },
      ],
    },
  ];

  const handleIntegrationSelect = (integration) => {
    setSelectedIntegration(integration);
    setCurrentStep(1);
    setSetupData({});
  };

  const handleFieldChange = (fieldName, value) => {
    setSetupData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < selectedIntegration.steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsConnecting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    setIsOpen(false);
    setCurrentStep(1);
    setSelectedIntegration(null);
    setSetupData({});
  };

  const getCurrentStep = () => {
    return selectedIntegration?.steps[currentStep - 1];
  };

  const isStepValid = () => {
    const step = getCurrentStep();
    if (!step) return false;
    
    return step.fields.every(field => {
      if (!field.required) return true;
      return setupData[field.name] !== undefined && setupData[field.name] !== "";
    });
  };

  const renderField = (field) => {
    switch (field.type) {
      case "email":
      case "text":
      case "password":
        return (
          <Input
            type={field.type}
            label={field.label}
            value={setupData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      case "select":
        return (
          <Select
            label={field.label}
            value={setupData[field.name] || ""}
            onChange={(value) => handleFieldChange(field.name, value)}
            options={field.options}
            required={field.required}
          />
        );
      case "multiselect":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <div className="space-y-2">
              {field.options.map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={setupData[field.name]?.includes(option.value) || false}
                    onChange={(checked) => {
                      const current = setupData[field.name] || [];
                      const updated = checked
                        ? [...current, option.value]
                        : current.filter(v => v !== option.value);
                      handleFieldChange(field.name, updated);
                    }}
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2">
            <Checkbox
              checked={setupData[field.name] || false}
              onChange={(checked) => handleFieldChange(field.name, checked)}
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        );
      case "permission_list":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <div className="space-y-2">
              {[
                "Read files and folders",
                "Create and edit files",
                "Delete files",
                "Share files with others",
                "Access file metadata",
              ].map((permission) => (
                <div key={permission} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700">{permission}</span>
                  <Badge variant="outline" size="sm">Required</Badge>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <div className="mt-6">
        <Button onClick={() => setIsOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Setup Integration
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedIntegration ? `Setup ${selectedIntegration.name}` : "Choose Integration"}
              </h3>
              <p className="text-gray-600">
                {selectedIntegration ? "Follow the steps to connect your integration" : "Select an integration to get started"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!selectedIntegration ? (
            /* Integration Selection */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrationTemplates.map((integration) => (
                <div
                  key={integration.id}
                  onClick={() => handleIntegrationSelect(integration)}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {integration.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                      <Badge variant="outline" size="sm">{integration.category}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              ))}
            </div>
          ) : (
            /* Setup Steps */
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep} of {selectedIntegration.steps.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((currentStep / selectedIntegration.steps.length) * 100)}% Complete
                  </span>
                </div>
                <Progress value={(currentStep / selectedIntegration.steps.length) * 100} className="h-2" />
              </div>

              {/* Current Step */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {getCurrentStep()?.title}
                  </h4>
                  <p className="text-gray-600">{getCurrentStep()?.description}</p>
                </div>

                {/* Step Content */}
                {getCurrentStep()?.id === "test" ? (
                  /* Test Connection Step */
                  <div className="text-center py-8">
                    {isConnecting ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Settings className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">Testing Connection...</h5>
                          <p className="text-gray-600">Please wait while we verify your integration</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">Connection Successful!</h5>
                          <p className="text-gray-600">Your integration is ready to use</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Form Fields */
                  <div className="space-y-4">
                    {getCurrentStep()?.fields.map((field) => (
                      <div key={field.name}>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid() || isConnecting}
                    >
                      {currentStep === selectedIntegration.steps.length ? "Complete Setup" : "Next"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

