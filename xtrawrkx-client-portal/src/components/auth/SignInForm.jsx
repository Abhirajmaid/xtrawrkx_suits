"use client";

import { useState } from "react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthToggle from "./AuthToggle";

export default function SignInForm({
  onForgotPassword,
  onSignUp,
  onSubmit,
  className = "",
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
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
        console.log("Sign in attempt:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      }
    } catch (error) {
      setErrors({
        general: error.message || "Sign in failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <AuthCard title="Welcome Back" subtitle="Sign in to access your projects">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <AuthButton type="submit" loading={loading} disabled={loading}>
            Login
          </AuthButton>

          <AuthToggle
            text="Don't have an account?"
            linkText="Sign Up"
            onClick={onSignUp}
            className="mt-6"
          />
        </form>
      </AuthCard>
    </div>
  );
}
