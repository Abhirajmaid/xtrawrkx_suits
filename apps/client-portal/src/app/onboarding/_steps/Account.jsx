"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Label } from "@/components/ui";
import { BlueButton, PurpleButton, WhiteButton } from "@xtrawrkx/ui";
import { CheckCircle, Mail, Phone, Shield, Clock, Check } from "lucide-react";

export function AccountStep({ onNext, initialData }) {
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);

  // Dummy OTP for demonstration
  const DUMMY_OTP = "1234";

  const handleSendEmailOtp = () => {
    setEmailOtpSent(true);
    setEmailTimer(60);
    const interval = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendPhoneOtp = () => {
    setPhoneOtpSent(true);
    setPhoneTimer(60);
    const interval = setInterval(() => {
      setPhoneTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtp === DUMMY_OTP) {
      setEmailVerified(true);
    } else {
      alert("Invalid OTP! Please use: 1234");
    }
  };

  const handleVerifyPhoneOtp = () => {
    if (phoneOtp === DUMMY_OTP) {
      setPhoneVerified(true);
    } else {
      alert("Invalid OTP! Please use: 1234");
    }
  };

  const handleContinue = () => {
    if (emailVerified && phoneVerified) {
      onNext();
    }
  };

  const canContinue = emailVerified && phoneVerified;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Verify Your Account
        </h1>
        <p className="text-gray-600 text-base">
          To ensure the security of your account, please verify your email
          address and phone number.
        </p>
      </motion.div>

      {/* Verification Cards */}
      <div className="space-y-6">
        {/* Email Verification */}
        <motion.div
          className="border border-gray-200 rounded-xl p-6 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">Email</h3>
                <p className="text-sm text-gray-500">
                  {initialData?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!emailVerified ? (
                <motion.div
                  key="email-verification"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {!emailOtpSent ? (
                    <PurpleButton onClick={handleSendEmailOtp} size="sm">
                      Send Code
                    </PurpleButton>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter 4-digit code"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          maxLength={4}
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        />
                        <PurpleButton
                          onClick={handleVerifyEmailOtp}
                          disabled={emailOtp.length !== 4}
                          className="w-full py-3"
                        >
                          Verify Code
                        </PurpleButton>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Dummy OTP:{" "}
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            1234
                          </span>
                        </span>
                        {emailTimer > 0 ? (
                          <span className="text-purple-600 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {emailTimer}s
                          </span>
                        ) : (
                          <WhiteButton
                            size="sm"
                            onClick={handleSendEmailOtp}
                            className="text-purple-600"
                          >
                            Resend Code
                          </WhiteButton>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="email-verified"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 text-green-600"
                >
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Email Verified!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Phone Verification */}
        <motion.div
          className="border border-gray-200 rounded-xl p-6 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Phone Number
                </h3>
                <p className="text-sm text-gray-500">
                  {initialData?.phone || "+1 (555) 123-4567"}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!phoneVerified ? (
                <motion.div
                  key="phone-verification"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {!phoneOtpSent ? (
                    <PurpleButton onClick={handleSendPhoneOtp} size="sm">
                      Send SMS Code
                    </PurpleButton>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter 4-digit code"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          maxLength={4}
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        />
                        <PurpleButton
                          onClick={handleVerifyPhoneOtp}
                          disabled={phoneOtp.length !== 4}
                          className="w-full py-3"
                        >
                          Verify Code
                        </PurpleButton>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Dummy OTP:{" "}
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            1234
                          </span>
                        </span>
                        {phoneTimer > 0 ? (
                          <span className="text-purple-600 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {phoneTimer}s
                          </span>
                        ) : (
                          <WhiteButton
                            size="sm"
                            onClick={handleSendPhoneOtp}
                            className="text-purple-600"
                          >
                            Resend Code
                          </WhiteButton>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="phone-verified"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 text-green-600"
                >
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Phone Verified!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Info note */}
      <motion.div
        className="bg-amber-50 border border-amber-200 rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <p className="text-sm text-amber-800">
          <strong>🔒 Security Note:</strong> We verify your contact information
          to protect your account and ensure you can recover it if needed.
        </p>
      </motion.div>

      {/* Continue button */}
      <motion.div
        className="pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <PurpleButton
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 text-base font-medium rounded-lg transition-all duration-300 ${
            canContinue ? "" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {canContinue ? (
            <span className="flex items-center justify-center">
              Continue <CheckCircle className="w-5 h-5 ml-2" />
            </span>
          ) : (
            "Verify Both to Continue"
          )}
        </PurpleButton>
      </motion.div>
    </div>
  );
}
