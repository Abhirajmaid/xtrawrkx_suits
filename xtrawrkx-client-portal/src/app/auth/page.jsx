"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/auth";
import { isOnboardingEnabled } from "@/lib/onboarding-config";
import { SignInForm, SignUpForm, ForgotPasswordForm } from "@/components/auth";
import { clientSignup, verifyOTP } from "@/lib/api";

// OTP Verification Component
function OTPVerificationForm({ tempOTP, onVerify, onBack, email }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await onVerify(otp);
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError(error.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setOtp(value);
    if (error) setError(""); // Clear error when user starts typing
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Verify Account
          </h2>
          <p className="text-gray-600 text-lg">
            Enter the verification code to complete your registration and start
            the onboarding process
          </p>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            {tempOTP ? (
              <>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Development Mode:</strong> Use the code below to proceed
                </p>
                <p className="text-lg font-mono font-bold text-blue-900 bg-blue-100 px-3 py-2 rounded-lg inline-block">
                  {tempOTP}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Email service not configured. Code shown for testing.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Verification Code:</strong> Check your email for the verification code
                </p>
                <p className="text-xs text-blue-700">
                  The code was sent to <strong>{email || 'your email'}</strong>
                </p>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Enter Verification Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              className={`w-full px-4 py-3 border rounded-xl shadow-sm outline-none transition-all text-lg font-mono text-center tracking-widest ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : otp.length === 4
                    ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-green-50"
                    : "border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              }`}
              placeholder="1234"
              maxLength="4"
              required
            />
            {otp.length === 4 && !error && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Code ready! Click to verify.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Starting Onboarding...
                </div>
              ) : (
                "Start Onboarding"
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              Back to Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState("signin");
  const [otpStep, setOtpStep] = useState(false);
  const [otpData, setOtpData] = useState({
    email: "",
    phone: "",
    name: "",
    tempOTP: "",
  });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const router = useRouter();
  const { signIn, checkAuth } = useAuth();

  const testimonials = [
    {
      name: "Jeremy Winson",
      role: "Founder",
      company: "Elite",
      companyCode: "ELI",
      avatar: "JW",
      quote:
        "Authentication made simple. The OTP system works flawlessly and keeps our accounts secure.",
      bgColor: "from-purple-400 to-indigo-500",
    },
    {
      name: "Sarah Chen",
      role: "CEO",
      company: "TechFlow",
      companyCode: "TF",
      avatar: "SC",
      quote:
        "Quick and secure login process. Love the seamless experience from signup to dashboard.",
      bgColor: "from-blue-400 to-cyan-500",
    },
    {
      name: "Alex Rodriguez",
      role: "CTO",
      company: "InnovateLab",
      companyCode: "IL",
      avatar: "AR",
      quote:
        "The security features give us confidence in managing our business data.",
      bgColor: "from-emerald-400 to-teal-500",
    },
    {
      name: "Maya Patel",
      role: "Director",
      company: "GreenTech",
      companyCode: "GT",
      avatar: "MP",
      quote:
        "Smooth onboarding process that gets us started quickly with all the tools we need.",
      bgColor: "from-rose-400 to-pink-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSignIn = async (formData) => {
    try {
      const response = await signIn(formData.email, formData.password);

      // Check if onboarding is enabled and user needs onboarding
      const onboardingEnabled = isOnboardingEnabled();
      const userNeedsOnboarding = response.user.needsOnboarding;

      if (onboardingEnabled && userNeedsOnboarding) {
        // Redirect to onboarding for users who need it
        console.log("Redirecting existing user to onboarding...");
        router.push("/onboarding");
      } else {
        // Redirect to dashboard for existing users
        console.log("Redirecting to dashboard...");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleSignUp = async (formData) => {
    try {
      // Call backend signup endpoint
      const response = await clientSignup(
        formData.name,
        formData.email,
        formData.phone,
        formData.password
      );

      if (response.success) {
        // Show OTP verification step
        // If OTP is returned in response (dev mode or email failed), use it
        const otpCode = response.otp || "";
        setOtpData({
          email: formData.email,
          phone: formData.phone,
          name: formData.name || "",
          tempOTP: otpCode, // OTP from email or dev mode
        });
        setOtpStep(true);
      } else {
        throw new Error(response.message || "Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert(error.message || "Sign up failed. Please try again.");
    }
  };

  const handleOTPVerification = async (otp) => {
    try {
      // Call backend OTP verification endpoint
      const response = await verifyOTP(otpData.email, otp);

      if (response.success && response.token) {
        console.log("OTP verification successful");

        // Trigger auth context to re-check authentication
        console.log("Updating auth context...");
        await checkAuth();
        console.log("Auth context updated, proceeding with redirect...");

        // For new users after signup, always redirect to onboarding if enabled
        const onboardingEnabled = isOnboardingEnabled();
        console.log("Onboarding enabled:", onboardingEnabled);

        if (onboardingEnabled) {
          // Use window.location to force a complete navigation and auth check
          console.log("Redirecting to onboarding...");
          window.location.href = "/onboarding";
        } else {
          // Redirect to dashboard if onboarding is disabled
          console.log("Redirecting to dashboard...");
          window.location.href = "/dashboard";
        }
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error; // Re-throw so the form can handle it
    }
  };

  const handleBackToSignUp = () => {
    setOtpStep(false);
    setOtpData({ email: "", phone: "", name: "", tempOTP: "" });
  };

  const handleForgotPassword = async (formData) => {
    console.log("Forgot password:", formData);
    // TODO: Implement forgot password logic with backend
  };

  // If in OTP step, show OTP verification form with split layout
  if (otpStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="min-h-screen flex">
          {/* Left side - Welcome Section - Fixed */}
          <motion.div
            className="w-2/5 p-16 flex flex-col justify-center overflow-hidden fixed left-0 top-0 h-screen"
            style={{
              backgroundImage: "url('/images/download (10).png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative z-10">
              {/* Logo/Icon */}
              <div className="mb-12">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                  <span className="text-white font-bold text-2xl">X</span>
                </div>
              </div>

              {/* Main heading */}
              <div className="mb-16">
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  Almost there!
                </h1>
                <p className="text-white/90 text-xl leading-relaxed max-w-md drop-shadow-md">
                  Just one more step to complete your registration and get
                  started.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - OTP Form - Scrollable */}
          <motion.div
            className="w-3/5 bg-gradient-to-bl from-white via-slate-50 to-gray-50 p-16 flex flex-col justify-center ml-[40%] min-h-screen overflow-y-auto"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <OTPVerificationForm
              tempOTP={otpData.tempOTP}
              onVerify={handleOTPVerification}
              onBack={handleBackToSignUp}
              email={otpData.email}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Split Layout */}
      <div className="min-h-screen flex">
        {/* Left side - Welcome Section - Fixed */}
        <motion.div
          className="w-2/5 p-16 flex flex-col justify-center overflow-hidden fixed left-0 top-0 h-screen"
          style={{
            backgroundImage: "url('/images/download (10).png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="relative z-10">
            {/* Logo/Icon */}
            <div className="mb-12">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <span className="text-white font-bold text-2xl">X</span>
              </div>
            </div>

            {/* Main heading */}
            <div className="mb-16">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Xtrawrkx
                </span>
                .
              </h1>
              <p className="text-white/90 text-xl leading-relaxed max-w-md drop-shadow-md">
                Sign in to access your projects and collaborate with your team.
              </p>
            </div>

            {/* Notification-style Testimonial Slider */}
            <div className="relative max-w-lg">
              <div className="h-48 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ y: 150, opacity: 0 }}
                    animate={{
                      y:
                        index === currentTestimonial
                          ? 0
                          : index > currentTestimonial
                            ? 150
                            : -150,
                      opacity: index === currentTestimonial ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Glass Notification Card */}
                    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/40 ring-1 ring-white/20">
                      <div className="flex items-start space-x-5">
                        {/* App Icon */}
                        <div className="w-16 h-16 bg-white/65 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/50">
                          <span className="text-primary-600 font-bold text-2xl">
                            X
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white text-lg drop-shadow-md">
                              Xtrawrkx
                            </h4>
                            <span className="text-sm text-white/70">
                              1 min ago
                            </span>
                          </div>
                          <p className="text-sm text-white/80 font-medium mb-3">
                            Success Alert
                          </p>
                          <p className="text-sm text-white/90 leading-relaxed">
                            {testimonial.quote}
                          </p>
                        </div>

                        {/* Heart Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-300/30">
                            <span className="text-white text-sm">
                              <Icon icon="mdi:heart" className="text-red-500" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Glass dot indicators */}
              <div className="flex justify-center space-x-3 mt-12">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 ${
                      index === currentTestimonial
                        ? "bg-white w-8 shadow-lg"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Forms - Scrollable */}
        <motion.div
          className="w-3/5 bg-gradient-to-bl from-white via-slate-50 to-gray-50 p-16 flex flex-col justify-center ml-[40%] min-h-screen overflow-y-auto"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="max-w-lg mx-auto w-full">
            {/* Back to Home Button */}
            <button
              onClick={() => router.push("/")}
              className="absolute top-8 right-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-white/20"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeForm}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
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
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
