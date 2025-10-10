"use client";

import { useState } from "react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthToggle from "./AuthToggle";

export default function SignUpForm({ onSignIn, onSubmit, className = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Basic validation
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default behavior - just log for now
        console.log("Sign up attempt:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      }
    } catch (error) {
      setErrors({
        general: error.message || "Sign up failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <AuthCard
        title="Create Your Account"
        subtitle="Enter your details to get started with OTP verification"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <AuthInput
            type="text"
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />

          <AuthInput
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />

          <AuthInput
            type="tel"
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            required
          />

          <AuthButton type="submit" loading={loading} disabled={loading}>
            {loading ? "Processing..." : "Continue to Verification"}
          </AuthButton>

          <AuthToggle
            text="Already have an account?"
            linkText="Sign In"
            onClick={onSignIn}
            className="mt-6"
          />
        </form>
      </AuthCard>
    </div>
  );
}
