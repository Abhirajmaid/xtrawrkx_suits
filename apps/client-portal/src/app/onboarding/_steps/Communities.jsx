"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { communitySelectionSchema } from "@/lib/onboarding-schemas";
import { COMMUNITIES } from "@/lib/onboarding-config";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Button } from "@/components/ui";
import { CommunityCard } from "../_components/CommunityCard";
import { Users, ArrowRight } from "lucide-react";

export function CommunitiesStep({
  onNext,
  onBack,
  onSkip,
  onSave,
  isLoading,
  initialData,
}) {
  const { saveCommunities, loadingStates } = useOnboardingState();
  const isSaving = loadingStates.communities;
  const [selectedCommunities, setSelectedCommunities] = useState(
    initialData || []
  );

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(communitySelectionSchema),
    defaultValues: {
      selectedCommunities: initialData || [],
    },
    mode: "onChange",
  });

  const handleCommunityToggle = (communityKey) => {
    const community = communityKey;
    const updated = selectedCommunities.includes(community)
      ? selectedCommunities.filter((c) => c !== community)
      : [...selectedCommunities, community];

    setSelectedCommunities(updated);
    setValue("selectedCommunities", updated);
    trigger("selectedCommunities");
  };

  const onSubmit = async (data) => {
    // Use the actual selectedCommunities state instead of form data
    const communities =
      selectedCommunities.length > 0
        ? selectedCommunities
        : data.selectedCommunities;

    const success = await saveCommunities(communities, true); // immediate save

    if (success) {
      onNext({ selectedCommunities: communities });
    }
  };

  const handleSaveAndExit = async () => {
    if (selectedCommunities.length > 0) {
      await saveCommunities(selectedCommunities, true); // immediate save
    }
    onSave({ selectedCommunities });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Choose Your Communities
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the communities you'd like to join. Each community offers
          unique opportunities and resources tailored to different aspects of
          your journey.
        </p>
      </div>

      {/* Error summary */}
      {errors.selectedCommunities && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          role="alert"
        >
          <p className="text-sm text-red-800">
            {errors.selectedCommunities.message}
          </p>
        </div>
      )}

      {/* Community selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Communities
          </h2>
          <span className="text-sm text-gray-500">
            {selectedCommunities.length} selected
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.values(COMMUNITIES).map((community) => (
            <CommunityCard
              key={community.key}
              community={community}
              isSelected={selectedCommunities.includes(community.key)}
              onToggle={handleCommunityToggle}
            />
          ))}
        </div>
      </div>

      {/* Selection summary */}
      {selectedCommunities.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            What's next?
          </h3>
          <p className="text-sm text-blue-800">
            After clicking Continue, you'll complete a brief application for
            each selected community. This typically takes 2-3 minutes per
            community.
          </p>
        </div>
      )}

      {/* Help text */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Not sure which to choose?
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• You can join multiple communities to maximize opportunities</li>
          <li>• Each community has its own application process</li>
          <li>• You can always apply to additional communities later</li>
          <li>• Some communities offer free tiers to get started</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAndExit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save & Exit"}
          </Button>
          <Button
            type="submit"
            disabled={isSaving || selectedCommunities.length === 0}
            className="px-8"
          >
            {isSaving ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
}
