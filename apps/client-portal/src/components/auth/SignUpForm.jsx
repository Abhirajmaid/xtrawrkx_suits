"use client";

import { useState } from "react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthToggle from "./AuthToggle";

export default function SignUpForm({ 
  onSignIn, 
  onSubmit,
  className = "" 
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
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
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      }
    } catch (error) {
      setErrors({ general: error.message || "Sign up failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <AuthCard
        title="Create Your Account"
        subtitle="Join the portal to collaborate on projects"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
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
            type="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />

          <AuthInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
          />

          <AuthButton
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Sign Up
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
