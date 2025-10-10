"use client";

import { useState } from "react";
import { Button, Card, Input, Textarea, Badge } from "@xtrawrkx/ui";
import {
  Code,
  Copy,
  Eye,
  Settings,
  Globe,
  Palette,
  CheckCircle,
  ExternalLink
} from "lucide-react";

export default function LeadWebFormSnippet({ onClose }) {
  const [activeTab, setActiveTab] = useState("preview");
  const [formConfig, setFormConfig] = useState({
    title: "Get Started Today",
    description: "Fill out the form below and we'll get back to you within 24 hours.",
    buttonText: "Submit",
    buttonColor: "#2563eb",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderColor: "#d1d5db",
    borderRadius: "8px",
    showCompany: true,
    showPhone: true,
    showMessage: true,
    requiredFields: ["name", "email", "company"]
  });

  const [copied, setCopied] = useState(false);

  const generateHTML = () => {
    const config = formConfig;
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lead Capture Form</title>
    <style>
        .lead-form {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 2rem;
            background-color: ${config.backgroundColor};
            border: 1px solid ${config.borderColor};
            border-radius: ${config.borderRadius};
            color: ${config.textColor};
        }
        .lead-form h2 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
            font-weight: 600;
        }
        .lead-form p {
            margin: 0 0 1.5rem 0;
            color: #6b7280;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid ${config.borderColor};
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: ${config.buttonColor};
            box-shadow: 0 0 0 3px ${config.buttonColor}20;
        }
        .required {
            color: #ef4444;
        }
        .submit-btn {
            background-color: ${config.buttonColor};
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .submit-btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <form class="lead-form" action="https://your-crm.com/api/leads" method="POST">
        <h2>${config.title}</h2>
        <p>${config.description}</p>
        
        <div class="form-group">
            <label for="name">Name <span class="required">*</span></label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <input type="email" id="email" name="email" required>
        </div>
        
        ${config.showCompany ? `
        <div class="form-group">
            <label for="company">Company <span class="required">*</span></label>
            <input type="text" id="company" name="company" required>
        </div>
        ` : ''}
        
        ${config.showPhone ? `
        <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone">
        </div>
        ` : ''}
        
        ${config.showMessage ? `
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="4"></textarea>
        </div>
        ` : ''}
        
        <button type="submit" class="submit-btn">${config.buttonText}</button>
    </form>
</body>
</html>`;
  };

  const generateEmbedCode = () => {
    return `<iframe src="https://your-crm.com/forms/lead-capture" 
        width="100%" 
        height="600" 
        frameborder="0"
        style="border: none; border-radius: ${formConfig.borderRadius};">
</iframe>`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "preview", label: "Preview", icon: Eye },
    { id: "html", label: "HTML Code", icon: Code },
    { id: "embed", label: "Embed Code", icon: Globe },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-brand-foreground">Web Form Snippet</h2>
        <p className="text-brand-text-light">Generate embeddable forms to capture leads on your website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-semibold text-brand-foreground">Form Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Form Title
                </label>
                <Input
                  value={formConfig.title}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter form title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Description
                </label>
                <Textarea
                  value={formConfig.description}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-foreground mb-2">
                  Button Text
                </label>
                <Input
                  value={formConfig.buttonText}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Submit"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-2">
                    Button Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formConfig.buttonColor}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, buttonColor: e.target.value }))}
                      className="w-8 h-8 rounded border border-brand-border"
                    />
                    <Input
                      value={formConfig.buttonColor}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, buttonColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-2">
                    Border Radius
                  </label>
                  <Input
                    value={formConfig.borderRadius}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, borderRadius: e.target.value }))}
                    placeholder="8px"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-brand-foreground">Form Fields</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-foreground">Company Field</span>
                  <input
                    type="checkbox"
                    checked={formConfig.showCompany}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, showCompany: e.target.checked }))}
                    className="rounded border-brand-border"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-foreground">Phone Field</span>
                  <input
                    type="checkbox"
                    checked={formConfig.showPhone}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, showPhone: e.target.checked }))}
                    className="rounded border-brand-border"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-foreground">Message Field</span>
                  <input
                    type="checkbox"
                    checked={formConfig.showMessage}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, showMessage: e.target.checked }))}
                    className="rounded border-brand-border"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview and Code Panel */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 border-b border-brand-border">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-brand-text-light hover:text-brand-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === "preview" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-brand-foreground">Form Preview</h4>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
                
                <div className="border border-brand-border rounded-lg p-4 bg-gray-50">
                  <div 
                    className="max-w-md mx-auto"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      backgroundColor: formConfig.backgroundColor,
                      border: `1px solid ${formConfig.borderColor}`,
                      borderRadius: formConfig.borderRadius,
                      padding: '2rem',
                      color: formConfig.textColor
                    }}
                  >
                    <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>
                      {formConfig.title}
                    </h2>
                    <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
                      {formConfig.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name *</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input 
                          type="email" 
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      {formConfig.showCompany && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Company *</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter company name"
                          />
                        </div>
                      )}
                      
                      {formConfig.showPhone && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <input 
                            type="tel" 
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter phone number"
                          />
                        </div>
                      )}
                      
                      {formConfig.showMessage && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Message</label>
                          <textarea 
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="3"
                            placeholder="Enter your message"
                          />
                        </div>
                      )}
                      
                      <button 
                        className="w-full py-2 px-4 text-white font-medium rounded"
                        style={{ backgroundColor: formConfig.buttonColor }}
                      >
                        {formConfig.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "html" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-brand-foreground">HTML Code</h4>
                  <Button 
                    size="sm" 
                    onClick={() => copyToClipboard(generateHTML())}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
                
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generateHTML()}</code>
                </pre>
              </div>
            )}

            {activeTab === "embed" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-brand-foreground">Embed Code</h4>
                  <Button 
                    size="sm" 
                    onClick={() => copyToClipboard(generateEmbedCode())}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800">
                    <code>{generateEmbedCode()}</code>
                  </pre>
                </div>
                
                <div className="text-sm text-brand-text-light">
                  <p>Add this code to your website's HTML where you want the form to appear.</p>
                  <p className="mt-2">
                    <strong>Note:</strong> Make sure to replace "your-crm.com" with your actual domain.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <h4 className="font-medium text-brand-foreground">Integration Settings</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-foreground mb-2">
                      Webhook URL
                    </label>
                    <Input
                      value="https://your-crm.com/api/leads"
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-brand-text-light mt-1">
                      This is where form submissions will be sent
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brand-foreground mb-2">
                      API Key
                    </label>
                    <Input
                      value="sk_live_1234567890abcdef"
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-brand-text-light mt-1">
                      Include this in your form's hidden field for authentication
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Setup Instructions</h5>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Copy the HTML code from the "HTML Code" tab</li>
                      <li>Replace the action URL with your webhook URL</li>
                      <li>Add a hidden field with your API key</li>
                      <li>Test the form submission</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border mt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button>
          <CheckCircle className="w-4 h-4 mr-2" />
          Save Form
        </Button>
      </div>
    </div>
  );
}
