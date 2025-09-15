"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInForm, SignUpForm, ForgotPasswordForm } from "@/components/auth";

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState("signin");
  const router = useRouter();

  const handleSignIn = async (formData) => {
    console.log("Sign in:", formData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Redirect to dashboard after successful login
    router.push("/dashboard");
  };

  const handleSignUp = async (formData) => {
    console.log("Sign up:", formData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Redirect to dashboard after successful signup
    router.push("/dashboard");
  };

  const handleForgotPassword = async (formData) => {
    console.log("Forgot password:", formData);
    // Implement your forgot password logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      {activeForm === "signin" && (
        <SignInForm
          onForgotPassword={() => setActiveForm("forgot-password")}
          onSignUp={() => setActiveForm("signup")}
          onSubmit={handleSignIn}
        />
      )}
      
      {activeForm === "signup" && (
        <SignUpForm
          onSignIn={() => setActiveForm("signin")}
          onSubmit={handleSignUp}
        />
      )}
      
      {activeForm === "forgot-password" && (
        <ForgotPasswordForm
          onSignIn={() => setActiveForm("signin")}
          onSubmit={handleForgotPassword}
        />
      )}
    </div>
  );
}
