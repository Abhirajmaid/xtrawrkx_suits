"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { xevfinSubmissionSchema } from "@/lib/onboarding-schemas";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Button, Input, Label } from "@/components/ui";
import { DollarSign, Upload, Shield } from "lucide-react";

export function XevfinStep({
  onNext,
  onBack,
  onSkip,
  onSave,
  isLoading,
  initialData,
}) {
  const { submitCommunityApplication, loadingStates } = useOnboardingState();
  const isSubmitting = loadingStates.submission;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(xevfinSubmissionSchema),
    defaultValues: initialData || {
      raiseAmount: 0,
      deckUrl: "",
      consent: false,
    },
    mode: "onChange",
  });

  const raiseAmount = watch("raiseAmount");
  const consent = watch("consent");

  const onSubmit = async (data) => {
    const result = await submitCommunityApplication("XEVFIN", data);

    if (result.success) {
      onNext(data);
    }
  };

  const handleSaveAndExit = async () => {
    const formData = {
      raiseAmount: watch("raiseAmount") || 0,
      deckUrl: watch("deckUrl") || "",
      consent: watch("consent") || false,
    };

    if (formData.raiseAmount > 0 && formData.deckUrl && formData.consent) {
      await submitCommunityApplication("XEVFIN", formData);
    }
    onSave(formData);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💰</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Join XEV.FiN</h1>
        <p className="text-gray-600">
          Connect with investors and raise capital for your startup. Share your
          fundraising details to get matched with the right investors.
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
        {/* Raise Amount */}
        <div className="space-y-2">
          <Label htmlFor="raiseAmount">
            How much are you looking to raise?
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="raiseAmount"
              type="number"
              min="0"
              step="1000"
              {...register("raiseAmount", { valueAsNumber: true })}
              placeholder="e.g. 500000"
              className={`pl-10 ${raiseAmount ? "border-red-500" : ""}`}
              aria-describedby={
                errors.raiseAmount ? "raiseAmount-error" : "raiseAmount-help"
              }
            />
          </div>
          {raiseAmount > 0 && (
            <p className="text-sm text-gray-600">
              Target raise:{" "}
              <span className="font-medium">{formatCurrency(raiseAmount)}</span>
            </p>
          )}
          {errors.raiseAmount && (
            <p id="raiseAmount-error" className="text-sm text-red-600">
              {errors.raiseAmount.message}
            </p>
          )}
          <p id="raiseAmount-help" className="text-sm text-gray-500">
            Enter the total amount you're looking to raise in USD
          </p>
        </div>

        {/* Deck URL */}
        <div className="space-y-2">
          <Label htmlFor="deckUrl">Pitch Deck URL</Label>
          <div className="relative">
            <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="deckUrl"
              type="url"
              {...register("deckUrl")}
              placeholder="https://example.com/your-pitch-deck.pdf"
              className={`pl-10 ${errors.deckUrl ? "border-red-500" : ""}`}
              aria-describedby={
                errors.deckUrl ? "deckUrl-error" : "deckUrl-help"
              }
            />
          </div>
          {errors.deckUrl && (
            <p id="deckUrl-error" className="text-sm text-red-600">
              {errors.deckUrl.message}
            </p>
          )}
          <p id="deckUrl-help" className="text-sm text-gray-500">
            Share a link to your pitch deck (Google Drive, Dropbox, etc.)
          </p>
        </div>

        {/* Consent */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <input
              id="consent"
              type="checkbox"
              {...register("consent")}
              className={`mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                errors.consent ? "border-red-500" : ""
              }`}
              aria-describedby={
                errors.consent ? "consent-error" : "consent-help"
              }
            />
            <div className="flex-1">
              <Label
                htmlFor="consent"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                I consent to sharing my information with potential investors
              </Label>
              <p id="consent-help" className="text-sm text-gray-600 mt-1">
                By checking this box, you agree to share your pitch deck and
                fundraising details with vetted investors in our network. You
                can revoke this consent at any time.
              </p>
            </div>
          </div>
          {errors.consent && (
            <p id="consent-error" className="text-sm text-red-600">
              {errors.consent.message}
            </p>
          )}
        </div>

        {/* Privacy notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Your data is secure
              </h3>
              <p className="text-sm text-gray-700">
                We only share your information with verified, accredited
                investors who have signed NDAs. You'll receive notifications
                before any information is shared and can control who has access
                to your materials.
              </p>
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
          <Button
            type="submit"
            disabled={isSubmitting || !consent}
            className="px-8"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </form>
  );
}
