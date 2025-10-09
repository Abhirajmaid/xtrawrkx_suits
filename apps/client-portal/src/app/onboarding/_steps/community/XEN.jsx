"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { xenSubmissionSchema } from "@/lib/onboarding-schemas";
import {
  XEN_STAGE_OPTIONS,
  XEN_DOMAIN_OPTIONS,
  XEN_NEEDS_OPTIONS,
} from "@/lib/onboarding-config";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Button, Input, Label } from "@/components/ui";
import { Check, X, Plus } from "lucide-react";

export function XenStep({
  onNext,
  onBack,
  onSkip,
  onSave,
  isLoading,
  initialData,
}) {
  const { submitCommunityApplication, loadingStates } = useOnboardingState();
  const isSubmitting = loadingStates.submission;
  const [selectedDomains, setSelectedDomains] = useState(
    initialData?.domain || []
  );
  const [selectedNeeds, setSelectedNeeds] = useState(initialData?.needs || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(xenSubmissionSchema),
    defaultValues: initialData || {},
    mode: "onChange",
  });

  const selectedStage = watch("stage");
  const oneLiner = watch("oneLiner") || "";

  const handleDomainToggle = (domain) => {
    const updated = selectedDomains.includes(domain)
      ? selectedDomains.filter((d) => d !== domain)
      : [...selectedDomains, domain];

    setSelectedDomains(updated);
    setValue("domain", updated, { shouldValidate: true });
  };

  const handleNeedToggle = (need) => {
    const updated = selectedNeeds.includes(need)
      ? selectedNeeds.filter((n) => n !== need)
      : [...selectedNeeds, need];

    setSelectedNeeds(updated);
    setValue("needs", updated, { shouldValidate: true });
  };

  const handleStageSelect = (stage) => {
    setValue("stage", stage, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const formData = { ...data, domain: selectedDomains, needs: selectedNeeds };
    const result = await submitCommunityApplication("XEN", formData);

    if (result.success) {
      onNext(formData);
    }
  };

  const handleSaveAndExit = async () => {
    const formData = {
      stage: watch("stage"),
      domain: selectedDomains,
      oneLiner: watch("oneLiner") || "",
      needs: selectedNeeds,
    };

    if (formData.stage && formData.domain.length > 0 && formData.oneLiner) {
      await submitCommunityApplication("XEN", formData);
    }
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚀</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Join XEN</h1>
        <p className="text-gray-600">
          Tell us about your entrepreneurial journey and get connected with
          fellow founders.
        </p>
      </div>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          role="alert"
        >
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Stage */}
        <div className="space-y-3">
          <Label>What stage is your startup at?</Label>
          <div className="space-y-3">
            {XEN_STAGE_OPTIONS.map((stage) => (
              <button
                key={stage.value}
                type="button"
                onClick={() => handleStageSelect(stage.value)}
                className={`
                  w-full p-4 text-left border-2 rounded-xl transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${
                    selectedStage === stage.value
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">
                      {stage.label}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {stage.description}
                    </p>
                  </div>
                  {selectedStage === stage.value && (
                    <Check className="w-5 h-5 text-primary-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.stage && (
            <p className="text-sm text-red-600">{errors.stage.message}</p>
          )}
        </div>

        {/* Domain */}
        <div className="space-y-3">
          <Label>
            Which domains are you working in? (Select all that apply)
          </Label>

          {/* Selected domains */}
          {selectedDomains.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedDomains.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => handleDomainToggle(domain)}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-medium hover:bg-primary-200 transition-colors"
                >
                  {domain}
                  <X className="w-3 h-3 ml-1" />
                </button>
              ))}
            </div>
          )}

          {/* Available domains */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {XEN_DOMAIN_OPTIONS.filter(
              (domain) => !selectedDomains.includes(domain)
            ).map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => handleDomainToggle(domain)}
                className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:border-primary-500 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <Plus className="w-3 h-3 mr-1" />
                {domain}
              </button>
            ))}
          </div>

          {errors.domain && (
            <p className="text-sm text-red-600">{errors.domain.message}</p>
          )}
        </div>

        {/* One-liner */}
        <div className="space-y-2">
          <Label htmlFor="oneLiner">
            Describe your startup in one line
            <span className="text-xs text-gray-500 ml-2">
              ({oneLiner.length}/140)
            </span>
          </Label>
          <Input
            id="oneLiner"
            {...register("oneLiner")}
            placeholder="e.g. We're building AI-powered tools for small businesses to automate customer support"
            maxLength={140}
            aria-describedby={errors.oneLiner ? "oneLiner-error" : undefined}
            className={errors.oneLiner ? "border-red-500" : ""}
          />
          {errors.oneLiner && (
            <p id="oneLiner-error" className="text-sm text-red-600">
              {errors.oneLiner.message}
            </p>
          )}
        </div>

        {/* Needs */}
        <div className="space-y-3">
          <Label>
            What do you need most right now? (Select all that apply)
          </Label>

          {/* Selected needs */}
          {selectedNeeds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedNeeds.map((need) => (
                <button
                  key={need}
                  type="button"
                  onClick={() => handleNeedToggle(need)}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  {need}
                  <X className="w-3 h-3 ml-1" />
                </button>
              ))}
            </div>
          )}

          {/* Available needs */}
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {XEN_NEEDS_OPTIONS.filter(
              (need) => !selectedNeeds.includes(need)
            ).map((need) => (
              <button
                key={need}
                type="button"
                onClick={() => handleNeedToggle(need)}
                className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <Plus className="w-3 h-3 mr-1" />
                {need}
              </button>
            ))}
          </div>

          {errors.needs && (
            <p className="text-sm text-red-600">{errors.needs.message}</p>
          )}
        </div>
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
          <Button type="button" variant="outline" onClick={handleSaveAndExit}>
            Save & Exit
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-8">
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </form>
  );
}
