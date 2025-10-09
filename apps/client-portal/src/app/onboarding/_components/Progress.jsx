"use client";

import { motion } from "framer-motion";

export function Progress({ currentStep, totalSteps }) {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex items-center space-x-4">
      {/* Animated step circles */}
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              index < currentStep
                ? "bg-green-400 shadow-lg shadow-green-400/50"
                : index === currentStep - 1
                  ? "bg-white shadow-lg shadow-white/50"
                  : "bg-white/30"
            }`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: index === currentStep - 1 ? 1.2 : 1,
              opacity: 1,
            }}
            transition={{
              delay: index * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 200,
            }}
          />
        ))}
      </div>

      {/* Progress bar with animation */}
      <div className="w-40 bg-white/20 rounded-full h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-white via-green-200 to-green-400 h-3 rounded-full shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 50,
          }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-valuenow={currentStep}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
        />
      </div>

      {/* Animated step counter */}
      <motion.div
        className="text-white text-sm font-medium whitespace-nowrap bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.span
          key={currentStep}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep} / {totalSteps}
        </motion.span>
      </motion.div>
    </div>
  );
}
