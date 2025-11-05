"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Mail, Phone } from "lucide-react";
import { useSession } from "@/lib/auth";

export function AccountStep({ onNext, initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  
  // Get account data from session or initial data
  const accountData = {
    email: session?.user?.email || initialData?.email || '',
    phone: session?.user?.phone || initialData?.phone || '',
    verified: true, // Since they're already logged in
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Since user is already authenticated, just proceed to next step
      await onNext();
    } catch (error) {
      console.error('Error proceeding to next step:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        className="space-y-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Account Verified
        </h2>
        <p className="text-gray-600">
          Your account is ready for onboarding. Let's get started!
        </p>
      </motion.div>

      {/* Account Information */}
      <motion.div
        className="bg-gray-50 rounded-lg p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Email Address</p>
            <p className="text-sm text-gray-600">{accountData.email}</p>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
        </div>

        {accountData.phone && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Phone Number</p>
              <p className="text-sm text-gray-600">{accountData.phone}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
          </div>
        )}
      </motion.div>

      {/* Continue Button */}
      <motion.div
        className="flex justify-end pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading...</span>
            </div>
          ) : (
            'Continue to Basics'
          )}
        </button>
      </motion.div>
    </div>
  );
}