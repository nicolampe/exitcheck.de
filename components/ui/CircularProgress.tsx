import React from "react";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function CircularProgress({
  percentage,
  size = 100,
  strokeWidth = 4,
}: CircularProgressProps) {
  // Calculate sizes
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--neutral-light))"
        strokeWidth={strokeWidth}
      />
      
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      
      {/* Text (right-side up) */}
      <text
        x={size / 2}
        y={size / 2 + 6} // Slight adjustment for centering
        textAnchor="middle"
        className="transform rotate-90 font-bold text-2xl fill-primary"
        dominantBaseline="middle"
      >
        {percentage}%
      </text>
    </svg>
  );
}
