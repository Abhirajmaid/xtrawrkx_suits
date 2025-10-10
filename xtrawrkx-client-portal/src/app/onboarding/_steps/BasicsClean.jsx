"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Label } from "@/components/ui";
import { Building, Mail, Phone, MapPin, Globe, Users } from "lucide-react";

export function BasicsStep({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyWebsite: "",
    companySize: "",
    industry: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const isFormValid =
    formData.companyName &&
    formData.companyEmail &&
    formData.companyPhone &&
    formData.industry;

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Tell us about your company
        </h1>
        <p className="text-gray-600 text-base">
          Help us understand your business better.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Name *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Acme Corporation"
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Company Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Label
            htmlFor="companyEmail"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Email *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="companyEmail"
              type="email"
              value={formData.companyEmail}
              onChange={(e) => handleChange("companyEmail", e.target.value)}
              placeholder="hello@acmecorp.com"
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Company Phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Label
            htmlFor="companyPhone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Phone *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="companyPhone"
              type="tel"
              value={formData.companyPhone}
              onChange={(e) => handleChange("companyPhone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Company Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Label
            htmlFor="companyAddress"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="companyAddress"
              type="text"
              value={formData.companyAddress}
              onChange={(e) => handleChange("companyAddress", e.target.value)}
              placeholder="123 Business St, City, State 12345"
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Company Website */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Label
            htmlFor="companyWebsite"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Website
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="companyWebsite"
              type="url"
              value={formData.companyWebsite}
              onChange={(e) => handleChange("companyWebsite", e.target.value)}
              placeholder="https://www.acmecorp.com"
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Company Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Label
            htmlFor="companySize"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Size
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="companySize"
              value={formData.companySize}
              onChange={(e) => handleChange("companySize", e.target.value)}
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white"
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
        </motion.div>

        {/* Industry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Label
            htmlFor="industry"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Industry *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white"
            >
              <option value="">Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Transportation">Transportation</option>
              <option value="Energy">Energy</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Fashion">Fashion</option>
              <option value="Sports">Sports</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Consulting">Consulting</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          className="pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 text-base font-medium rounded-lg transition-all duration-300 ${
              isFormValid
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
