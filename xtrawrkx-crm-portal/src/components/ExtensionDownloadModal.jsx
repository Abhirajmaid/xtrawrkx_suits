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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        glass={true}
        className="w-full max-w-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400/20 to-orange-500/20 backdrop-blur-md border border-orange-300/40 rounded-xl flex items-center justify-center shadow-lg">
                <Chrome className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-sm text-gray-600">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/80 backdrop-blur-sm rounded-lg transition-colors border border-white/40"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Simple Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index + 1 <= currentStep ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Import LinkedIn Data Instantly
                </h3>
                <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                  Save time by importing LinkedIn profiles, company pages, and
                  search results directly into your Xtrawrkx CRM.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-md">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400/20 to-orange-500/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-orange-300/40 shadow-lg">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">
                    Profiles
                  </h4>
                  <p className="text-xs text-gray-600">
                    Import contact details
                  </p>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-md">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400/20 to-orange-500/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-orange-300/40 shadow-lg">
                    <Building className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">
                    Companies
                  </h4>
                  <p className="text-xs text-gray-600">Add business data</p>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-md">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400/20 to-orange-500/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-orange-300/40 shadow-lg">
                    <Search className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 text-sm">
                    Search
                  </h4>
                  <p className="text-xs text-gray-600">Bulk import results</p>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg transition-all duration-300"
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
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400/20 to-orange-500/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-orange-300/40 shadow-lg">
                  <Download className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Download from Chrome Web Store
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Click the button below to open the Chrome Web Store and
                  install the extension.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/40 shadow-md">
                <h4 className="font-medium text-gray-900 mb-4 text-sm">
                  Installation Steps:
                </h4>
                <ol className="text-left text-gray-600 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      1
                    </span>
                    <span>Click "Add to Chrome" in the Web Store</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      2
                    </span>
                    <span>Confirm by clicking "Add extension"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      3
                    </span>
                    <span>Pin the extension for easy access</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    window.open(
                      "https://chromewebstore.google.com/detail/xtrawrkx-linkedin-extensi/idjlfloiebpnjijhoaeapdkndlpmjkim?utm_source=item-share-cb",
                      "_blank"
                    );
                    handleInstallationComplete();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg transition-all duration-300"
                >
                  <span>Open Chrome Web Store</span>
                  <div className="btn-icon">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </Button>
                <Button
                  onClick={handleInstallationComplete}
                  variant="outline"
                  className="px-6 py-2.5 bg-white/80 backdrop-blur-sm border border-white/40 hover:bg-white/90"
                >
                  <span>I've Installed It</span>
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400/20 to-orange-500/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-orange-300/40 shadow-lg">
                  <Settings className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Configure Your Extension
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Set up the extension to connect with your Xtrawrkx CRM
                  account.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/40 shadow-md">
                <h4 className="font-medium text-gray-900 mb-4 text-sm">
                  Configuration Steps:
                </h4>
                <ol className="text-left text-gray-600 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      1
                    </span>
                    <span>Click the Xtrawrkx icon in your browser toolbar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      2
                    </span>
                    <span>Click "Settings" to open configuration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      3
                    </span>
                    <span>Enter your CRM URL and sign in</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/40 shadow-md">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">Your CRM URL:</p>
                  <p className="text-sm text-gray-900 font-mono bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/40">
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : ""}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg transition-all duration-300"
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
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400/20 to-green-500/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-green-300/40 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  You're All Set!
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Your LinkedIn extension is ready to use. Start importing data
                  from LinkedIn pages.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/40 shadow-md">
                <h4 className="font-medium text-gray-900 mb-4 text-sm">
                  How to Use:
                </h4>
                <ol className="text-left text-gray-600 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      1
                    </span>
                    <span>Visit any LinkedIn profile or company page</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      2
                    </span>
                    <span>Click the "Import to Xtrawrkx" button</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 shadow-md">
                      3
                    </span>
                    <span>Data will be automatically added to your CRM</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.open("https://linkedin.com", "_blank")}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg transition-all duration-300"
                >
                  <span>Try It on LinkedIn</span>
                  <div className="btn-icon">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="px-6 py-2.5 bg-white/80 backdrop-blur-sm border border-white/40 hover:bg-white/90"
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
