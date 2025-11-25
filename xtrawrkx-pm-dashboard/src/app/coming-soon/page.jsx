"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Wrench, Home, Clock, Sparkles } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import { Card } from "../../components/ui";

function ComingSoonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const featureName = searchParams.get("feature") || "This Feature";

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <PageHeader
          title="Coming Soon"
          subtitle={`${featureName} is currently under development`}
          breadcrumb={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Coming Soon", href: "/coming-soon" },
          ]}
          showSearch={false}
          showActions={false}
        />

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card glass={true} className="max-w-2xl w-full">
            <div className="p-8 text-center">
              {/* Icon */}
              <div className="relative w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="relative flex items-center justify-center">
                  <Wrench className="w-12 h-12 text-white" />
                  <Sparkles className="w-6 h-6 text-white absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                Coming Soon
              </h2>

              {/* Subtitle */}
              <p className="text-gray-600 mb-4 text-lg">
                {featureName} is on its way!
              </p>

              {/* Description */}
              <p className="text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                <strong>{featureName}</strong> is currently under development and will be available
                soon. We're working hard to bring you the best experience possible.
              </p>

              {/* Status indicator */}
              <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-orange-50 rounded-xl border border-orange-200 max-w-md mx-auto">
                <Clock className="w-5 h-5 text-orange-600 animate-pulse" />
                <span className="text-sm font-medium text-orange-700">
                  Development in progress
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.back()}
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  Go Back
                </button>

                <Link
                  href="/dashboard"
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  Dashboard
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white min-h-screen">
          <div className="p-4 space-y-4">
            <PageHeader
              title="Coming Soon"
              subtitle="Loading..."
              breadcrumb={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Coming Soon", href: "/coming-soon" },
              ]}
              showSearch={false}
              showActions={false}
            />
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      }
    >
      <ComingSoonContent />
    </Suspense>
  );
}

