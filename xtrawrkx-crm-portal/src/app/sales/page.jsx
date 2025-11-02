"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SalesRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.replace("/");
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p className="text-brand-text-light">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
