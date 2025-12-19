"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { ONBOARDING_STEPS } from "@/lib/onboarding-config";
import { useSession } from "@/lib/auth";
import { Progress } from "./_components/Progress";

// Import step components
import { AccountStep } from "./_steps/Account";
import { BasicsStep } from "./_steps/Basics";
import { CommunitiesStep } from "./_steps/Communities";
import { DoneStep } from "./_steps/Done";

// Import community step components
import { XenStep as XENStep } from "./_steps/community/XEN";
import { XevfinStep as XEVFINStep } from "./_steps/community/XEVFIN";
import { XevtgStep as XEVTGStep } from "./_steps/community/XEVTG";
import { XddStep as XDDStep } from "./_steps/community/XDD";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    state,
    goToStep,
    goToNextStep,
    goToPrevStep,
    getCurrentStepInfo,
    isStepComplete,
    canProceedToStep,
    completeOnboarding,
    isLoading,
    error,
    clearError,
  } = useOnboardingState();

  const [currentCommunityStep, setCurrentCommunityStep] = useState(null);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    // If user is authenticated, check onboarding status
    if (status === "authenticated" && session?.user) {
      const onboardingCompleted = session?.user?.profile?.onboarded || false;

      // If onboarding is complete, redirect to dashboard
      if (onboardingCompleted) {
        console.log(
          "Onboarding already completed, redirecting to dashboard..."
        );
        router.push("/dashboard");
        return;
      }
    }
  }, [status, session, router]);

  // Handle onboarding completion
  useEffect(() => {
    if (state.isComplete) {
      router.push("/dashboard");
    }
  }, [state.isComplete, router]);

  const currentStepInfo = getCurrentStepInfo();

  // Handle community step navigation
  const handleCommunityStepSelect = (community) => {
    setCurrentCommunityStep(community);
  };

  const handleCommunityStepBack = () => {
    setCurrentCommunityStep(null);
  };

  // Render current step component
  const renderCurrentStep = () => {
    const stepId = currentStepInfo?.id;

    // If we're in submissions step and have a community selected, show community form
    if (stepId === "submissions" && currentCommunityStep) {
      const communityProps = {
        onBack: handleCommunityStepBack,
        onNext: () => {
          setCurrentCommunityStep(null);
          // Check if all selected communities have submissions
          const allSubmitted = state.selectedCommunities.every(
            (community) => state.submissions[community]
          );
          if (allSubmitted) {
            goToNextStep();
          }
        },
        initialData: state.submissions[currentCommunityStep] || {},
        community: currentCommunityStep,
      };

      switch (currentCommunityStep) {
        case "XEN":
          return <XENStep {...communityProps} />;
        case "XEVFIN":
          return <XEVFINStep {...communityProps} />;
        case "XEVTG":
          return <XEVTGStep {...communityProps} />;
        case "XDD":
          return <XDDStep {...communityProps} />;
        default:
          return null;
      }
    }

    // Regular step components
    switch (stepId) {
      case "account":
        return (
          <AccountStep onNext={goToNextStep} initialData={state.account} />
        );

      case "basics":
        return (
          <BasicsStep
            onNext={goToNextStep}
            onBack={goToPrevStep}
            initialData={state.basics}
          />
        );

      case "communities":
        return (
          <CommunitiesStep
            onNext={goToNextStep}
            onBack={goToPrevStep}
            initialData={{ selectedCommunities: state.selectedCommunities }}
          />
        );

      case "submissions":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Community Applications
              </h2>
              <p className="text-gray-600">
                Fill out applications for your selected communities
              </p>
            </div>

            <div className="grid gap-4">
              {state.selectedCommunities.map((community) => (
                <div
                  key={community}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    state.submissions[community]
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => handleCommunityStepSelect(community)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{community}</h3>
                      <p className="text-sm text-gray-600">
                        {state.submissions[community]
                          ? "Completed"
                          : "Click to fill out application"}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {state.submissions[community] ? "✅" : "📝"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <button
                onClick={goToPrevStep}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={goToNextStep}
                disabled={
                  !state.selectedCommunities.every(
                    (community) => state.submissions[community]
                  )
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case "done":
        return (
          <DoneStep
            onComplete={async () => {
              await completeOnboarding();
              router.push("/dashboard");
            }}
            initialData={state}
          />
        );

      default:
        return (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Step not found
            </h2>
            <p className="text-gray-600">
              The requested onboarding step could not be found.
            </p>
          </div>
        );
    }
  };

  // Show loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <Progress
          currentStep={state.currentStep}
          totalSteps={state.totalSteps}
          steps={ONBOARDING_STEPS}
        />
      </div>

      {/* Current step content */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        {renderCurrentStep()}
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
          <details>
            <summary className="cursor-pointer font-semibold">
              Debug Info
            </summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(
                {
                  currentStep: state.currentStep,
                  currentStepInfo,
                  selectedCommunities: state.selectedCommunities,
                  submissions: Object.keys(state.submissions),
                  isComplete: state.isComplete,
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
