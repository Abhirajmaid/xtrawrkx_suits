"use client";

import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="mx-auto h-20 w-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <Shield className="h-10 w-10 text-white" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-lg text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

