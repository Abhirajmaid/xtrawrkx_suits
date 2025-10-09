"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { xevtgSubmissionSchema } from "@/lib/onboarding-schemas";
import { XEVTG_FUNCTION_OPTIONS } from "@/lib/onboarding-config";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Button, Input, Label } from "@/components/ui";
import { Briefcase, Linkedin, FileText, X, Plus } from "lucide-react";

export function XevtgStep({
  onNext,
  onBack,
  onSkip,
  onSave,
  isLoading,
  initialData,
}) {
  const { submitCommunityApplication, loadingStates } = useOnboardingState();
  const isSubmitting = loadingStates.submission;
  const [selectedFunctions, setSelectedFunctions] = useState(
    initialData?.functions || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(xevtgSubmissionSchema),
    defaultValues: initialData || {
      experienceYears: 0,
      functions: [],
      linkedin: "",
      resumeUrl: "",
    },
    mode: "onChange",
  });

  const experienceYears = watch("experienceYears");

  const handleFunctionToggle = (functionName) => {
    const updated = selectedFunctions.includes(functionName)
      ? selectedFunctions.filter((f) => f !== functionName)
      : [...selectedFunctions, functionName];

    setSelectedFunctions(updated);
    setValue("functions", updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const formData = { ...data, functions: selectedFunctions };
    const result = await submitCommunityApplication("XEVTG", formData);

    if (result.success) {
      onNext(formData);
    }
  };

  const handleSaveAndExit = async () => {
    const formData = {
      experienceYears: watch("experienceYears") || 0,
      functions: selectedFunctions,
      linkedin: watch("linkedin") || "",
      resumeUrl: watch("resumeUrl") || "",
    };

    if (formData.experienceYears >= 0 && formData.functions.length > 0) {
      await submitCommunityApplication("XEVTG", formData);
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
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💼</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Join XEVTG</h1>
        <p className="text-gray-600">
          Connect with tech opportunities and showcase your skills. Join our
          talent marketplace to find your next role or project.
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
        {/* Experience Years */}
        <div className="space-y-2">
          <Label htmlFor="experienceYears">
            Years of Professional Experience
          </Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="experienceYears"
              type="number"
              min="0"
              max="50"
              {...register("experienceYears", { valueAsNumber: true })}
              placeholder="e.g. 5"
              className={`pl-10 ${errors.experienceYears ? "border-red-500" : ""}`}
              aria-describedby={
                errors.experienceYears
                  ? "experienceYears-error"
                  : "experienceYears-help"
              }
            />
          </div>
          {experienceYears > 0 && (
            <p className="text-sm text-gray-600">
              Experience level:{" "}
              <span className="font-medium">
                {experienceYears === 0
                  ? "Entry level"
                  : experienceYears <= 2
                    ? "Junior"
                    : experienceYears <= 5
                      ? "Mid-level"
                      : experienceYears <= 10
                        ? "Senior"
                        : "Expert"}
              </span>
            </p>
          )}
          {errors.experienceYears && (
            <p id="experienceYears-error" className="text-sm text-red-600">
              {errors.experienceYears.message}
            </p>
          )}
          <p id="experienceYears-help" className="text-sm text-gray-500">
            Include internships, freelance work, and full-time positions
          </p>
        </div>

        {/* Functions */}
        <div className="space-y-3">
          <Label>
            What functions do you specialize in? (Select all that apply)
          </Label>

          {/* Selected functions */}
          {selectedFunctions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedFunctions.map((func) => (
                <button
                  key={func}
                  type="button"
                  onClick={() => handleFunctionToggle(func)}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  {func}
                  <X className="w-3 h-3 ml-1" />
                </button>
              ))}
            </div>
          )}

          {/* Available functions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {XEVTG_FUNCTION_OPTIONS.filter(
              (func) => !selectedFunctions.includes(func)
            ).map((func) => (
              <button
                key={func}
                type="button"
                onClick={() => handleFunctionToggle(func)}
                className="flex items-center justify-start px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:border-purple-500 hover:text-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <Plus className="w-3 h-3 mr-2 flex-shrink-0" />
                {func}
              </button>
            ))}
          </div>

          {errors.functions && (
            <p className="text-sm text-red-600">{errors.functions.message}</p>
          )}
        </div>

        {/* LinkedIn (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="linkedin"
              type="url"
              {...register("linkedin")}
              placeholder="https://linkedin.com/in/yourprofile"
              className={`pl-10 ${errors.linkedin ? "border-red-500" : ""}`}
              aria-describedby={
                errors.linkedin ? "linkedin-error" : "linkedin-help"
              }
            />
          </div>
          {errors.linkedin && (
            <p id="linkedin-error" className="text-sm text-red-600">
              {errors.linkedin.message}
            </p>
          )}
          <p id="linkedin-help" className="text-sm text-gray-500">
            Help employers and collaborators learn more about your background
          </p>
        </div>

        {/* Resume URL (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="resumeUrl">Resume/CV URL (Optional)</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="resumeUrl"
              type="url"
              {...register("resumeUrl")}
              placeholder="https://example.com/your-resume.pdf"
              className={`pl-10 ${errors.resumeUrl ? "border-red-500" : ""}`}
              aria-describedby={
                errors.resumeUrl ? "resumeUrl-error" : "resumeUrl-help"
              }
            />
          </div>
          {errors.resumeUrl && (
            <p id="resumeUrl-error" className="text-sm text-red-600">
              {errors.resumeUrl.message}
            </p>
          )}
          <p id="resumeUrl-help" className="text-sm text-gray-500">
            Share a link to your resume (Google Drive, Dropbox, personal
            website, etc.)
          </p>
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
