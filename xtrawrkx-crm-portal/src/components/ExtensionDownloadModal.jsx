"use client";

import { useState, useEffect } from "react";
import {
  X,
  Download,
  Chrome,
  CheckCircle,
  ExternalLink,
  User,
  Building,
  Search,
  Settings,
} from "lucide-react";
import { Card, Button } from "./ui";

export default function ExtensionDownloadModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);

  useEffect(() => {
    // Check if extension is installed by looking for a specific element or message
    const checkExtensionInstalled = () => {
      // This would be set by the extension when it's active
      return window.xtrawrkxExtensionInstalled === true;
    };

    if (isOpen) {
      const interval = setInterval(() => {
        if (checkExtensionInstalled()) {
          setIsExtensionInstalled(true);
          setCurrentStep(4);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleDownload = () => {
    // In production, this would be the Chrome Web Store URL
    // For now, we'll provide instructions for manual installation
    setCurrentStep(2);
  };

  const handleInstallationComplete = () => {
    setCurrentStep(3);
  };

  const handleClose = () => {
    // Just close the modal - allow showing again on next reload
    onClose();
  };

  const steps = [
    {
      title: "Boost Your Productivity",
      description:
        "Import leads and contacts directly from LinkedIn with our browser extension",
      icon: <Download className="w-8 h-8" />,
    },
    {
      title: "Download Extension",
      description:
        "Get the XtraWrkx LinkedIn Importer from the Chrome Web Store",
      icon: <Chrome className="w-8 h-8" />,
    },
    {
      title: "Install & Configure",
      description: "Follow the installation steps and connect to your CRM",
      icon: <ExternalLink className="w-8 h-8" />,
    },
    {
      title: "Ready to Import!",
      description:
        "Start importing LinkedIn profiles and companies with one click",
      icon: <CheckCircle className="w-8 h-8" />,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <Card
        glass={true}
        className="relative w-full max-w-2xl mx-auto p-0 overflow-hidden shadow-2xl border border-white/20 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="relative bg-white/5 backdrop-blur-sm border-b border-white/10 p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-brand-text-light" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Chrome className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="text-xl font-semibold text-brand-foreground mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-brand-text-light text-sm">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* Simple Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index + 1 <= currentStep ? "bg-brand-primary" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4 pt-4">
          {currentStep === 1 && (
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-brand-foreground mb-3">
                  Import LinkedIn Data Instantly
                </h3>
                <p className="text-brand-text-light text-sm mb-4 max-w-md mx-auto">
                  Save time by importing LinkedIn profiles, company pages, and
                  search results directly into your Xtrawrkx CRM.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <User className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h4 className="font-medium text-brand-foreground mb-1 text-sm">
                    Profiles
                  </h4>
                  <p className="text-xs text-brand-text-light">
                    Import contact details
                  </p>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Building className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h4 className="font-medium text-brand-foreground mb-1 text-sm">
                    Companies
                  </h4>
                  <p className="text-xs text-brand-text-light">
                    Add business data
                  </p>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h4 className="font-medium text-brand-foreground mb-1 text-sm">
                    Search
                  </h4>
                  <p className="text-xs text-brand-text-light">
                    Bulk import results
                  </p>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="btn-primary bg-brand-primary hover:bg-brand-primary/90"
              >
                <span>Get Extension</span>
                <div className="btn-icon">
                  <Download className="w-4 h-4" />
                </div>
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Download className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-lg font-medium text-brand-foreground mb-3">
                  Download from Chrome Web Store
                </h3>
                <p className="text-brand-text-light text-sm max-w-md mx-auto">
                  Click the button below to open the Chrome Web Store and
                  install the extension.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                <h4 className="font-medium text-brand-foreground mb-4 text-sm">
                  Installation Steps:
                </h4>
                <ol className="text-left text-brand-text-light space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Click "Add to Chrome" in the Web Store</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Confirm by clicking "Add extension"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Pin the extension for easy access</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    // In production, open Chrome Web Store
                    window.open("https://chrome.google.com/webstore", "_blank");
                    handleInstallationComplete();
                  }}
                  className="btn-primary bg-brand-primary hover:bg-brand-primary/90"
                >
                  <span>Open Chrome Web Store</span>
                  <div className="btn-icon">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </Button>
                <Button
                  onClick={handleInstallationComplete}
                  variant="secondary"
                  className="btn-secondary"
                >
                  <span>I've Installed It</span>
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Settings className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-lg font-medium text-brand-foreground mb-3">
                  Configure Your Extension
                </h3>
                <p className="text-brand-text-light text-sm max-w-md mx-auto">
                  Set up the extension to connect with your Xtrawrkx CRM
                  account.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                <h4 className="font-medium text-brand-foreground mb-4 text-sm">
                  Configuration Steps:
                </h4>
                <ol className="text-left text-brand-text-light space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Click the Xtrawrkx icon in your browser toolbar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Click "Settings" to open configuration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Enter your CRM URL and sign in</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                <div className="text-center">
                  <p className="text-xs text-brand-text-light mb-2">
                    Your CRM URL:
                  </p>
                  <p className="text-sm text-brand-foreground font-mono bg-white/10 px-3 py-2 rounded-lg">
                    {window.location.origin}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setCurrentStep(4)}
                className="btn-primary bg-brand-primary hover:bg-brand-primary/90"
              >
                <span>I've Configured It</span>
                <div className="btn-icon">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-brand-foreground mb-3">
                  You're All Set!
                </h3>
                <p className="text-brand-text-light text-sm max-w-md mx-auto">
                  Your LinkedIn extension is ready to use. Start importing data
                  from LinkedIn pages.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                <h4 className="font-medium text-brand-foreground mb-4 text-sm">
                  How to Use:
                </h4>
                <ol className="text-left text-brand-text-light space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Visit any LinkedIn profile or company page</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Click the "Import to Xtrawrkx" button</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Data will be automatically added to your CRM</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.open("https://linkedin.com", "_blank")}
                  className="btn-primary"
                >
                  <span>Try It on LinkedIn</span>
                  <div className="btn-icon">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </Button>
                <Button
                  onClick={handleClose}
                  variant="secondary"
                  className="btn-secondary"
                >
                  <span>Close</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
