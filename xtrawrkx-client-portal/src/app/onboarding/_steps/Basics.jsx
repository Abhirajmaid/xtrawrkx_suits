"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { userBasicsSchema } from "@/lib/onboarding-schemas";
import { ROLE_OPTIONS, INTEREST_OPTIONS } from "@/lib/onboarding-config";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Input, Label } from "@/components/ui";
import { BlueButton, PurpleButton, WhiteButton } from "@/components/ui";
import { X, Plus, User, MapPin, Heart } from "lucide-react";

export function BasicsStep({
  onNext,
  onBack,
  onSkip,
  onSave,
  isLoading,
  initialData,
}) {
  const { saveBasics, loadingStates } = useOnboardingState();
  const isSaving = loadingStates.basics;
  const [selectedInterests, setSelectedInterests] = useState(
    initialData?.interests || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(userBasicsSchema),
    defaultValues: initialData || {},
    mode: "onChange",
  });

  const selectedRole = watch("role");

  const handleInterestToggle = (interest) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];

    if (updated.length <= 6) {
      setSelectedInterests(updated);
      setValue("interests", updated, { shouldValidate: true });
    }
  };

  const handleRoleSelect = (role) => {
    setValue("role", role, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const formData = { ...data, interests: selectedInterests };
    const success = await saveBasics(formData, true); // immediate save
    if (success) {
      onNext(formData);
    }
  };

  const handleSaveAndExit = async () => {
    const formData = {
      name: watch("name"),
      role: watch("role"),
      location: watch("location"),
      interests: selectedInterests,
    };
    await saveBasics(formData, true); // immediate save
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Tell us about yourself
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help us personalize your experience and connect you with the right
            opportunities in our community.
          </p>
        </motion.div>
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

      <div className="space-y-8">
        {/* Name */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-indigo-600" />
            <Label htmlFor="name" className="text-lg font-medium text-gray-900">
              Full Name
            </Label>
          </div>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter your full name"
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`h-12 text-lg ${
              errors.name
                ? "border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            }`}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </motion.div>

        {/* Role */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
            <Label className="text-lg font-medium text-gray-900">
              What best describes you?
            </Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLE_OPTIONS.map((role, index) => (
              <motion.button
                key={role.value}
                type="button"
                onClick={() => handleRoleSelect(role.value)}
                className={`
                  p-6 text-left border-2 rounded-2xl transition-all duration-300 relative overflow-hidden
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  ${
                    selectedRole === role.value
                      ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900 shadow-lg transform scale-105"
                      : "border-gray-200 bg-white hover:border-indigo-300 text-gray-700 hover:shadow-md"
                  }
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: selectedRole === role.value ? 1.05 : 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-semibold text-lg">{role.label}</span>
                {selectedRole === role.value && (
                  <motion.div
                    className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          {errors.role && (
            <p className="text-sm text-red-600">{errors.role.message}</p>
          )}
        </motion.div>

        {/* Location */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <Label
              htmlFor="location"
              className="text-lg font-medium text-gray-900"
            >
              Location (Optional)
            </Label>
          </div>
          <Input
            id="location"
            {...register("location")}
            placeholder="e.g. San Francisco, CA"
            aria-describedby={errors.location ? "location-error" : undefined}
            className={`h-12 text-lg ${
              errors.location
                ? "border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            }`}
          />
          {errors.location && (
            <p id="location-error" className="text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </motion.div>

        {/* Interests */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="w-5 h-5 text-indigo-600" />
            <Label className="text-lg font-medium text-gray-900">
              Interests (Optional)
            </Label>
            <span className="ml-auto text-sm font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              {selectedInterests.length}/6 selected
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Select up to 6 areas that interest you. This helps us recommend
            relevant opportunities and connect you with like-minded people.
          </p>

          {/* Selected interests */}
          {selectedInterests.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {selectedInterests.map((interest, index) => (
                <motion.button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-medium hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 border border-indigo-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {interest}
                  <X className="w-4 h-4 ml-2" />
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Available interests */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.filter(
                (interest) => !selectedInterests.includes(interest)
              ).map((interest, index) => (
                <motion.button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  disabled={selectedInterests.length >= 6}
                  className={`
                    flex items-center justify-center px-4 py-3 text-sm border-2 rounded-xl transition-all duration-200 relative
                    ${
                      selectedInterests.length >= 6
                        ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100"
                        : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:shadow-md"
                    }
                  `}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.02, duration: 0.3 }}
                  whileHover={
                    selectedInterests.length < 6 ? { scale: 1.02, y: -2 } : {}
                  }
                  whileTap={selectedInterests.length < 6 ? { scale: 0.98 } : {}}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {interest}
                </motion.button>
              ))}
            </div>
          </div>

          {errors.interests && (
            <p className="text-sm text-red-600">{errors.interests.message}</p>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        className="flex items-center justify-between pt-8 border-t border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <div className="flex space-x-4">
          <WhiteButton
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Back
          </WhiteButton>
          <WhiteButton
            type="button"
            onClick={onSkip}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            Skip for now
          </WhiteButton>
        </div>

        <div className="flex space-x-4">
          <WhiteButton
            type="button"
            onClick={handleSaveAndExit}
            disabled={isSaving}
            className="px-6 py-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          >
            {isSaving ? "Saving..." : "Save & Exit"}
          </WhiteButton>
          <PurpleButton
            type="submit"
            disabled={isSaving}
            className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSaving ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : (
              "Continue"
            )}
          </PurpleButton>
        </div>
      </motion.div>
    </form>
  );
}
