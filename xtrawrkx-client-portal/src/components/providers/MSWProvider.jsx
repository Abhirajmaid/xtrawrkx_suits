"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }) {
  const [mswReady, setMswReady] = useState(false);
  const [mswError, setMswError] = useState(null);
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const initMocks = async () => {
      if (
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_USE_MOCKS === "true"
      ) {
        try {
          // Add timeout to prevent infinite loading
          const timeoutId = setTimeout(() => {
            setShowTimeout(true);
            console.warn(
              "MSW initialization taking too long, proceeding without mocks"
            );
            setMswReady(true);
          }, 5000); // 5 second timeout

          const { startMocking } = await import("@/lib/msw/browser");
          await startMocking();
          clearTimeout(timeoutId);
          console.log("MSW started successfully");
        } catch (error) {
          console.error("Failed to start MSW:", error);
          setMswError(error.message);
        }
      }
      setMswReady(true);
    };

    initMocks();
  }, []);

  // Show loading screen only if MSW is enabled and not ready yet
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true" && !mswReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse text-sm text-gray-500 mb-2">
            Initializing mock services...
          </div>
          {showTimeout && (
            <div className="text-xs text-orange-600">
              Taking longer than expected, proceeding...
            </div>
          )}
          {mswError && (
            <div className="text-xs text-red-600 mt-2">
              MSW Error: {mswError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return children;
}
