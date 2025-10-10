"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { xddSubmissionSchema } from "@/lib/onboarding-schemas";
import { XDD_TOOL_OPTIONS } from "@/lib/onboarding-config";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Button, Input, Label } from "@/components/ui";
import { Palette, ExternalLink, Zap, X, Plus } from "lucide-react";

export function XddStep({
  onNext,
  onBack,
  onSkip,
  onSave,
  isLoading,
  initialData,
}) {
  const { submitCommunityApplication, loadingStates } = useOnboardingState();
  const isSubmitting = loadingStates.submission;
  const [selectedTools, setSelectedTools] = useState(initialData?.tools || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(xddSubmissionSchema),
    defaultValues: initialData || {
      portfolioUrl: "",
      tools: [],
      challengeOptIn: false,
    },
    mode: "onChange",
  });

  const challengeOptIn = watch("challengeOptIn");

  const handleToolToggle = (tool) => {
    const updated = selectedTools.includes(tool)
      ? selectedTools.filter((t) => t !== tool)
      : [...selectedTools, tool];

    setSelectedTools(updated);
    setValue("tools", updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const formData = { ...data, tools: selectedTools };
    const result = await submitCommunityApplication("XDD", formData);

    if (result.success) {
      onNext(formData);
    }
  };

  const handleSaveAndExit = async () => {
    const formData = {
      portfolioUrl: watch("portfolioUrl") || "",
      tools: selectedTools,
      challengeOptIn: watch("challengeOptIn") || false,
    };

    if (formData.portfolioUrl && formData.tools.length > 0) {
      await submitCommunityApplication("XDD", formData);
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
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎨</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Join xD&D</h1>
        <p className="text-gray-600">
          Showcase your creative work and connect with other designers and
          developers. Join our community of makers and creators.
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
        {/* Portfolio URL */}
        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="portfolioUrl"
              type="url"
              {...register("portfolioUrl")}
              placeholder="https://yourportfolio.com"
              className={`pl-10 ${errors.portfolioUrl ? "border-red-500" : ""}`}
              aria-describedby={
                errors.portfolioUrl ? "portfolioUrl-error" : "portfolioUrl-help"
              }
            />
          </div>
          {errors.portfolioUrl && (
            <p id="portfolioUrl-error" className="text-sm text-red-600">
              {errors.portfolioUrl.message}
            </p>
          )}
          <p id="portfolioUrl-help" className="text-sm text-gray-500">
            Share a link to your portfolio, Behance, Dribbble, GitHub, or
            personal website
          </p>
        </div>

        {/* Tools */}
        <div className="space-y-3">
          <Label>What tools do you use? (Select all that apply)</Label>

          {/* Selected tools */}
          {selectedTools.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTools.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => handleToolToggle(tool)}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-sm font-medium hover:bg-pink-200 transition-colors"
                >
                  {tool}
                  <X className="w-3 h-3 ml-1" />
                </button>
              ))}
            </div>
          )}

          {/* Available tools */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {XDD_TOOL_OPTIONS.filter(
              (tool) => !selectedTools.includes(tool)
            ).map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => handleToolToggle(tool)}
                className="flex items-center justify-start px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:border-pink-500 hover:text-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <Plus className="w-3 h-3 mr-2 flex-shrink-0" />
                {tool}
              </button>
            ))}
          </div>

          {errors.tools && (
            <p className="text-sm text-red-600">{errors.tools.message}</p>
          )}
        </div>

        {/* Challenge Opt-in */}
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-pink-900 mb-2">
                  Creative Challenges
                </h3>
                <p className="text-sm text-pink-800 mb-3">
                  Join our monthly design and development challenges! Compete
                  with other creators, win prizes, and showcase your skills to
                  potential clients and employers.
                </p>

                <div className="flex items-start space-x-3">
                  <input
                    id="challengeOptIn"
                    type="checkbox"
                    {...register("challengeOptIn")}
                    className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <Label
                    htmlFor="challengeOptIn"
                    className="text-sm font-medium text-pink-900 cursor-pointer"
                  >
                    Yes, I want to participate in creative challenges
                  </Label>
                </div>
              </div>
            </div>
          </div>
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
