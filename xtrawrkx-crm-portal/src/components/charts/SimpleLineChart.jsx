"use client";

import { useMemo } from "react";

export default function SimpleLineChart({ 
  data = [], 
  width = 300, 
  height = 200, 
  color = "#3B82F6",
  strokeWidth = 2,
  showDots = true,
  showGrid = true,
  className = ""
}) {
  const chartData = useMemo(() => {
    if (!data.length) return { points: "", dots: [], max: 0, min: 0 };

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + ((max - item.value) / range) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    const dots = data.map((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + ((max - item.value) / range) * chartHeight;
      return { x, y, value: item.value, label: item.label };
    });

    return { points, dots, max, min };
  }, [data, width, height]);

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-sm">No data available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`grid-${i}`}
                x1={20}
                y1={20 + ratio * (height - 40)}
                x2={width - 20}
                y2={20 + ratio * (height - 40)}
                stroke="#6B7280"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
          </g>
        )}
        
        {/* Line */}
        <polyline
          points={chartData.points}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Area fill */}
        <path
          d={`M ${chartData.points.split(' ')[0]} L ${chartData.points} L ${chartData.dots[chartData.dots.length - 1]?.x},${height - 20} L ${chartData.dots[0]?.x},${height - 20} Z`}
          fill={color}
          fillOpacity="0.1"
        />
        
        {/* Dots */}
        {showDots && chartData.dots.map((dot, index) => (
          <g key={index}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="hover:r-6 transition-all cursor-pointer"
            />
            <title>{`${dot.label}: ${dot.value}`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}
