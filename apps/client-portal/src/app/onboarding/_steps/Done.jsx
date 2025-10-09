"use client";

import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/hooks/useOnboardingState";
// Custom button components available for future use
// import { BlueButton, PurpleButton, WhiteButton } from "@xtrawrkx/ui";
import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  MessageCircle,
  Calendar,
  ArrowRight,
  Clock,
  Star,
} from "lucide-react";

export function DoneStep() {
  const router = useRouter();
  const { state, completeOnboarding } = useOnboardingState();

  // Trigger confetti animation on mount
  useEffect(() => {
    const triggerConfetti = () => {
      // First burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"],
      });

      // Second burst with delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#8B5CF6", "#10B981", "#F59E0B"],
        });
      }, 200);

      // Third burst with delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#EF4444", "#3B82F6", "#10B981"],
        });
      }, 400);
    };

    // Trigger confetti after a small delay for better UX
    const confettiTimeout = setTimeout(triggerConfetti, 500);

    return () => clearTimeout(confettiTimeout);
  }, []);

  const handleGoToDashboard = async () => {
    const success = await completeOnboarding();
    if (success) {
      router.push("/dashboard");
    }
  };

  const nextSteps = [
    {
      icon: MessageCircle,
      title: "Join Community Channels",
      description:
        "Connect with members in WhatsApp groups and Discord servers",
      action: "Join Now",
      color: "bg-green-500",
      iconBg: "bg-green-100",
      recommended: true,
    },
    {
      icon: Calendar,
      title: "Book an Advisor Session",
      description: "Schedule a 1-on-1 session with an industry mentor",
      action: "Schedule",
      color: "bg-blue-500",
      iconBg: "bg-blue-100",
      recommended: false,
    },
    {
      icon: ArrowRight,
      title: "Explore Your Dashboard",
      description: "Browse available resources, connections, and opportunities",
      action: "Go to Dashboard",
      color: "bg-purple-500",
      iconBg: "bg-purple-100",
      recommended: true,
      onClick: handleGoToDashboard,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Under Review
          </span>
        );
      case "joined":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Not Approved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Success Header */}
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-lg relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        >
          <CheckCircle className="w-14 h-14 text-green-600" />
          {/* Celebration sparkles */}
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Star className="w-3 h-3 text-white" />
          </motion.div>
          <motion.div
            className="absolute -top-1 -left-3 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Star className="w-2 h-2 text-white" />
          </motion.div>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            🎉 Congratulations! 🎉
          </motion.h1>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <p className="text-lg text-gray-700">
              Your application has been submitted successfully!
            </p>
            <p className="text-gray-600">
              Welcome to the{" "}
              <span className="text-purple-600 font-semibold">Xtrawrkx</span>{" "}
              ecosystem.
            </p>
          </motion.div>

          {/* Profile Under Review Card */}
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  Profile Under Review
                </h3>
                <p className="text-sm text-blue-700">
                  Processing your application
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Our team is reviewing your application for community access.
              You&apos;ll receive an email notification within 1-2 business days
              with the status update.
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <span className="text-xs text-blue-600 font-medium">
                Processing...
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Community Applications */}
      {state.memberships.length > 0 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Your Community Applications
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {state.memberships.map((membership, index) => (
              <motion.div
                key={index}
                className="relative p-6 border-2 rounded-2xl bg-white shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                {/* Success indicator */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>

                <div className="flex items-start space-x-4">
                  {/* Community Icon */}
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {membership.community.charAt(0)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {membership.community}
                      </h3>
                      {getStatusBadge(membership.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Application submitted successfully
                    </p>
                    {membership.submissionId && (
                      <p className="text-xs text-gray-500">
                        Submission ID: {membership.submissionId.slice(-8)}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                        ✓ Applied
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                        Under Review
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>📧 Review Process:</strong> You&apos;ll receive email
              notifications when your applications are reviewed. This typically
              takes 1-2 business days.
            </p>
          </div>
        </motion.div>
      )}

      {/* Next Steps */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-900">
          Recommended Next Steps
        </h2>
        <div className="space-y-4">
          {nextSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                className={`relative p-6 border-2 rounded-2xl transition-all duration-300 cursor-pointer group ${
                  step.recommended
                    ? "border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                {step.recommended && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Recommended
                    </span>
                  </div>
                )}

                <div className="flex items-start space-x-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.iconBg} flex-shrink-0`}
                  >
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <button
                      onClick={step.onClick || (() => {})}
                      className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors group-hover:translate-x-1 duration-200"
                    >
                      {step.action}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Footer note */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p className="text-sm text-gray-500">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@xtrawrkx.com"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            support@xtrawrkx.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}
