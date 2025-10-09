"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { isOnboardingEnabled } from "@/lib/onboarding-config";

// Step components
import { BasicsStep } from "./_steps/BasicsClean";
import { CommunitiesStep } from "./_steps/CommunitiesClean";
import { XenStep } from "./_steps/community/XEN";
import { XevfinStep } from "./_steps/community/XEVFIN";
import { XevtgStep } from "./_steps/community/XEVTG";
import { XddStep } from "./_steps/community/XDD";
import { DoneStep } from "./_steps/Done";
import { X } from "lucide-react";

import { useSession } from "@/lib/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    state,
    isLoading,
    error,
    nextStep,
    prevStep,
    goToStep,
    getNextCommunityToFill,
    loadAccountData,
    clearError,
  } = useOnboardingState();

  const [isInitialized, setIsInitialized] = useState(false);
  const accountDataLoadedRef = useRef(false);

  // Route guards
  useEffect(() => {
    // Check if onboarding is enabled
    if (!isOnboardingEnabled()) {
      router.replace("/404");
      return;
    }

    // Check authentication
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.user) {
      router.replace("/auth");
      return;
    }

    // Check if user needs onboarding
    if (
      session.user.profile?.onboarded &&
      !session.user.profile?.needsOnboarding
    ) {
      router.replace("/dashboard");
      return;
    }

    // Load initial data only once
    if (!accountDataLoadedRef.current) {
      loadAccountData();
      accountDataLoadedRef.current = true;
    }
    setIsInitialized(true);
  }, [session, status, router, loadAccountData]);

  // Handle step navigation
  const handleNext = async () => {
    if (state.currentStep === 1) {
      // Communities step - wait for state to update, then navigate
      setTimeout(() => {
        if (state.selectedCommunities.length > 0) {
          nextStep();
        } else {
          goToStep(3); // Skip to done step if no communities selected
        }
      }, 100); // Small delay to allow state update
    } else if (state.currentStep === 2) {
      // Community submissions
      // Check if there are more communities to fill
      const nextCommunity = getNextCommunityToFill();
      if (nextCommunity) {
        // Stay on current step but render next community
        return;
      } else {
        nextStep(); // Move to done step
      }
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (state.currentStep === 2 && state.selectedCommunities.length > 1) {
      // Handle back navigation within community submissions
      const filledCommunities = state.selectedCommunities.filter(
        (c) => state.submissions[c]
      );
      if (filledCommunities.length > 1) {
        // Stay on step but go to previous community
        return;
      }
    }
    prevStep();
  };

  const handleSkip = () => {
    if (state.currentStep === 2) {
      // Skip remaining community submissions
      goToStep(3);
    } else {
      nextStep();
    }
  };

  const handleSaveAndExit = () => {
    router.push("/dashboard");
  };

  // Don't render until initialization is complete
  if (!isInitialized || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Render current step
  const renderCurrentStep = () => {
    const stepProps = {
      onNext: handleNext,
      onBack: handleBack,
      onSkip: handleSkip,
      onSave: handleSaveAndExit,
      isLoading,
    };

    switch (state.currentStep) {
      case 0:
        return <BasicsStep {...stepProps} initialData={state.basics} />;
      case 1:
        return (
          <CommunitiesStep
            {...stepProps}
            initialData={state.selectedCommunities}
          />
        );
      case 2:
        // Render community-specific step
        const nextCommunity = getNextCommunityToFill();
        if (!nextCommunity) {
          // All communities filled, move to done
          goToStep(3);
          return null;
        }

        const communityStepProps = {
          ...stepProps,
          initialData: state.submissions[nextCommunity],
        };

        switch (nextCommunity) {
          case "XEN":
            return <XenStep {...communityStepProps} />;
          case "XEVFIN":
            return <XevfinStep {...communityStepProps} />;
          case "XEVTG":
            return <XevtgStep {...communityStepProps} />;
          case "XDD":
            return <XddStep {...communityStepProps} />;
          default:
            return null;
        }
      case 3:
        return <DoneStep {...stepProps} />;
      default:
        return <BasicsStep {...stepProps} />;
    }
  };

  return (
    <div className="w-full">
      {/* Error display */}
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between">
            <p className="text-red-800 text-sm pr-8">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 transition-colors p-1"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step content with enhanced animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          className="w-full"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
