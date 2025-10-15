"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wrench, Home } from "lucide-react";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Wrench className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h1>

        <p className="text-gray-600 mb-8">
          This feature is currently under development and will be available
          soon.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 glass-button rounded-xl font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
