"use client";

import { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated (like CRM)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    setLoginError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Force immediate redirect after successful login
        console.log("Login successful, redirecting to dashboard");
        // Small delay to ensure localStorage is saved
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        setLoginError(result.error || "Login failed. Please try again.");
        setIsSubmitting(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (
        error.message?.includes("CORS") ||
        error.message?.includes("Failed to fetch")
      ) {
        errorMessage =
          "Cannot connect to the server. Please ensure the backend API is running and CORS is configured correctly.";
      }

      setLoginError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Login"
        description="Secure login to Xtrawrkx PM Dashboard. Access your project management system to manage tasks, projects, and team operations."
      />
      <div className="min-h-screen relative overflow-hidden">
        {/* Full Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-pink-600 to-pink-800">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/30 via-pink-300/20 to-pink-500/30"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-orange-400/20 via-pink-400/15 to-pink-600/25"></div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-48 h-48 bg-orange-200/20 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-pink-300/15 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Branding Content */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 py-20">
            {/* Logo */}
            <div className="flex items-center mb-12">
              <div className="w-20 h-20 mr-4">
                <Image
                  src="/logo_full.webp"
                  alt="Xtrawrkx Logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-lg">
              <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
                Hey, Hello!
              </h1>
              <h2 className="text-2xl text-white/90 mb-8 font-medium">
                Welcome to Xtrawrkx PM Dashboard
              </h2>
              <p className="text-white/80 text-xl leading-relaxed">
                We provide all the advantages that can simplify all your project
                management operations and team collaboration without any further
                requirements.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form Island */}
          <div className="w-full lg:w-1/2 flex flex-col justify-end py-0 px-0">
            <div className="w-full h-full flex flex-col justify-end">
              {/* Login Form */}
              <div
                className="bg-white shadow-2xl rounded-t-3xl border border-gray-100 overflow-hidden flex flex-col mt-16 mr-16 max-w-xl"
                style={{ height: "calc(100vh - 10rem)" }}
              >
                {/* Header */}
                <div className="text-center py-6 px-6">
                  <h2 className="text-4xl font-semibold text-gray-900">
                    Welcome Back!!
                  </h2>
                </div>

                {/* Form Content */}
                <div className="flex-1 py-8 px-6 flex flex-col justify-between">
                  <div className="flex-1 flex flex-col justify-start">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      {/* Error Message */}
                      {loginError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-red-800">
                              Login Failed
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                              {loginError}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Username Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Username
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-3 text-base border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4A74] focus:border-[#FF4A74] transition-all duration-200 text-gray-900 ${
                            errors.email
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="Enter your username"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`block w-full px-4 py-3 text-base border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4A74] focus:border-[#FF4A74] transition-all duration-200 text-gray-900 ${
                              errors.password
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Forgot Password */}
                      <div className="flex justify-end">
                        <a
                          href="#"
                          className="text-sm text-[#FF4A74] hover:text-[#FF4A74] transition-colors"
                        >
                          Forgot Password?
                        </a>
                      </div>

                      {/* Submit Button */}
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-[#FF4A74] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Signing in...</span>
                            </div>
                          ) : (
                            "Login"
                          )}
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            OR
                          </span>
                        </div>
                      </div>

                      {/* Social Login Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Google
                        </button>
                        <button
                          type="button"
                          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="#1877F2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Footer */}
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">
                      Don&apos;t have an account? Contact your administrator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
