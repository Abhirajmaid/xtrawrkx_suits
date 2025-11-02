"use client";

import { useMemo } from "react";

export default function SimplePieChart({ 
  data = [], 
  size = 200, 
  innerRadius = 0,
  showLabels = true,
  showLegend = true,
  className = ""
}) {
  const chartData = useMemo(() => {
    if (!data.length) return { segments: [], total: 0 };

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top

    const segments = data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const radius = size / 2 - 10;
      const centerX = size / 2;
      const centerY = size / 2;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      let pathData;
      if (innerRadius > 0) {
        // Donut chart
        const innerR = innerRadius;
        const ix1 = centerX + innerR * Math.cos(startAngleRad);
        const iy1 = centerY + innerR * Math.sin(startAngleRad);
        const ix2 = centerX + innerR * Math.cos(endAngleRad);
        const iy2 = centerY + innerR * Math.sin(endAngleRad);
        
        pathData = [
          `M ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `L ${ix2} ${iy2}`,
          `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`,
          'Z'
        ].join(' ');
      } else {
        // Pie chart
        pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');
      }
      
      // Label position
      const labelAngle = (startAngle + endAngle) / 2;
      const labelRadius = radius * 0.7;
      const labelAngleRad = (labelAngle * Math.PI) / 180;
      const labelX = centerX + labelRadius * Math.cos(labelAngleRad);
      const labelY = centerY + labelRadius * Math.sin(labelAngleRad);
      
      currentAngle = endAngle;
      
      return {
        path: pathData,
        color: item.color || `hsl(${index * 360 / data.length}, 70%, 50%)`,
        label: item.label,
        value: item.value,
        percentage: percentage.toFixed(1),
        labelX,
        labelY,
        showLabel: percentage > 5 // Only show label if segment is large enough
      };
    });

    return { segments, total };
  }, [data, size, innerRadius]);

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-400 text-sm">No data</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Segments */}
          {chartData.segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.path}
                fill={segment.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              
              {/* Labels */}
              {showLabels && segment.showLabel && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-white font-medium pointer-events-none"
                >
                  {segment.percentage}%
                </text>
              )}
              
              <title>{`${segment.label}: ${segment.value} (${segment.percentage}%)`}</title>
            </g>
          ))}
        </svg>
        
        {/* Center label for donut chart */}
        {innerRadius > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{chartData.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="space-y-2">
          {chartData.segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-700">{segment.label}</span>
              <span className="text-sm text-gray-500">({segment.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
