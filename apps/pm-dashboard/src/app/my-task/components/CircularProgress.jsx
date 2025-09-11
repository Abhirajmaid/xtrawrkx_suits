"use client";

import React from "react";

const CircularProgress = ({ percentage, size = 32, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage
  const getColor = (percent) => {
    if (percent === 100) return "#22c55e"; // green for completed
    return "#3b82f6"; // blue for all others
  };

  const color = getColor(percentage);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {/* Percentage text */}
      <span
        className="absolute text-xs font-semibold text-gray-700"
        style={{ fontSize: size > 32 ? '10px' : '8px' }}
      >
        {percentage}%
      </span>
    </div>
  );
};

export default CircularProgress;
