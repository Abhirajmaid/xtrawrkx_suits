"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function BrandingForm({ branding }) {
  const [formData, setFormData] = useState({
    logo: branding?.logo || "",
    primaryColor: branding?.primaryColor || "#2563eb",
    domain: branding?.domain || ""
  });

  const [logoPreview, setLogoPreview] = useState(branding?.logo || "");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          logo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Saving branding:', formData);
    // Placeholder for save functionality
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Branding Settings</h2>
      
      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Company Logo
          </label>
          <div className="flex items-center space-x-6">
            {/* Logo Preview */}
            <div className="w-24 h-24 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">No logo</span>
                </div>
              )}
            </div>
            
            {/* Upload Button */}
            <div>
              <input
                type="file"
                id="logo-upload"
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <label htmlFor="logo-upload">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Upload Logo
                </Button>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Recommended: 200x200px, PNG or JPG
              </p>
            </div>
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => handleInputChange('primaryColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => handleInputChange('primaryColor', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="#2563eb"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            This color will be used for buttons, links, and accents
          </p>
        </div>

        {/* Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Domain
          </label>
          <input
            type="text"
            value={formData.domain}
            onChange={(e) => handleInputChange('domain', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="portal.yourcompany.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            Optional: Use your own domain for the client portal
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Save Branding Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
