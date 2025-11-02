"use client";

import { useMemo } from "react";

export default function SimpleBarChart({ 
  data = [], 
  width = 300, 
  height = 200, 
  color = "#3B82F6",
  showValues = true,
  showGrid = true,
  className = ""
}) {
  const chartData = useMemo(() => {
    if (!data.length) return { bars: [], max: 0 };

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    const bars = data.map((item, index) => {
      const barHeight = (item.value / max) * chartHeight;
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = height - padding - barHeight;
      
      return {
        x,
        y,
        width: barWidth,
        height: barHeight,
        value: item.value,
        label: item.label,
        color: item.color || color
      };
    });

    return { bars, max };
  }, [data, width, height, color]);

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
        
        {/* Bars */}
        {chartData.bars.map((bar, index) => (
          <g key={index}>
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={bar.color}
              rx="4"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
            
            {/* Value labels */}
            {showValues && (
              <text
                x={bar.x + bar.width / 2}
                y={bar.y - 5}
                textAnchor="middle"
                className="text-xs fill-gray-600 font-medium"
              >
                {bar.value}
              </text>
            )}
            
            {/* X-axis labels */}
            <text
              x={bar.x + bar.width / 2}
              y={height - 5}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {bar.label}
            </text>
            
            <title>{`${bar.label}: ${bar.value}`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}
